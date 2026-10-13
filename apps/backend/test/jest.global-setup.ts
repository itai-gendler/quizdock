import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'dotenv';
import Redis from 'ioredis';
import { Client } from 'pg';

const BACKEND_DIR = join(__dirname, '..');

/** Redis has 16 databases; the development stack keeps database 0. */
export const REDIS_TEST_DATABASES = 15;

/**
 * The integration tests never touch the development data. `<database>_test` —
 * derived from `DATABASE_URL` when set (CI), else from the root `.env` like the
 * Prisma CLI does — is created empty and migrated here at every run, and never
 * written to: each Jest worker runs on its own copy of it,
 * `<database>_test_<worker>`, and on its own Redis database, `<worker>`, emptied
 * here (`test/jest.worker-env.ts` points the worker at them). The suites of one
 * worker run one after the other, so none sees another's rows or keys change
 * under it. The development stack keeps its host seat, its quizzes, its live
 * games and Redis database 0.
 *
 * Only where the databases are is read from `.env`: the rest (`AUTH_MODE`, open
 * access, demo mode…) is the development stack's choice, and each test sets what
 * it depends on — a stack switched to OIDC must not change what the tests see.
 */
function loadConnectionEnv(): void {
  const path = join(BACKEND_DIR, '../../.env');
  if (!existsSync(path)) return;
  for (const [key, value] of Object.entries(parse(readFileSync(path)))) {
    if (/^(DATABASE_URL|POSTGRES_|REDIS_)/.test(key)) process.env[key] ??= value;
  }
}

export default async function globalSetup(globalConfig: { maxWorkers: number }): Promise<void> {
  loadConnectionEnv();
  const workers = Math.max(globalConfig.maxWorkers, 1);
  if (workers > REDIS_TEST_DATABASES) {
    throw new Error(`[jest] at most ${REDIS_TEST_DATABASES} workers: one Redis database each`);
  }
  const base = new URL(
    process.env.DATABASE_URL ??
      `postgresql://${process.env.POSTGRES_USER ?? 'live'}:${process.env.POSTGRES_PASSWORD ?? 'live'}` +
        `@localhost:${process.env.POSTGRES_PORT ?? '15432'}/${process.env.POSTGRES_DB ?? 'quizdock'}?schema=public`,
  );
  const devName = base.pathname.slice(1);
  const testName = devName.endsWith('_test') ? devName : `${devName}_test`;
  const test = new URL(base);
  test.pathname = `/${testName}`;

  const redis = new URL(
    process.env.REDIS_URL ?? `redis://localhost:${process.env.REDIS_PORT ?? '16379'}`,
  );

  const admin = new URL(base);
  admin.pathname = '/postgres';
  admin.search = '';
  // Names taken from our own config, quoted as identifiers.
  const quoted = (name: string) => `"${name.replace(/"/g, '""')}"`;
  const client = new Client({ connectionString: admin.toString() });
  try {
    await client.connect();
  } catch (err) {
    // No Postgres: the unit tests still run, the integration ones say what is missing.
    console.warn(
      `[jest] no test database (${(err as Error).message}); integration tests will fail.`,
    );
    shareWithWorkers(test, redis);
    return;
  }
  try {
    // Empty and migrated at every run: what the copies start from, never written to.
    await client.query(`DROP DATABASE IF EXISTS ${quoted(testName)} WITH (FORCE)`);
    await client.query(`CREATE DATABASE ${quoted(testName)}`);

    execFileSync('pnpm', ['exec', 'prisma', 'migrate', 'deploy'], {
      cwd: BACKEND_DIR,
      env: { ...process.env, DATABASE_URL: test.toString() },
      stdio: 'ignore',
    });

    // A copy of the migrated database per worker, fresh at every run.
    for (let worker = 1; worker <= workers; worker++) {
      const name = quoted(`${testName}_${worker}`);
      await client.query(`DROP DATABASE IF EXISTS ${name} WITH (FORCE)`);
      await client.query(`CREATE DATABASE ${name} TEMPLATE ${quoted(testName)}`);
    }
  } finally {
    await client.end().catch(() => undefined);
  }

  await emptyRedis(redis, workers);
  shareWithWorkers(test, redis);
}

/** Read by `test/jest.worker-env.ts` in each worker, spawned after this. */
function shareWithWorkers(database: URL, redis: URL): void {
  process.env.QUIZDOCK_TEST_DATABASE_URL = database.toString();
  process.env.QUIZDOCK_TEST_REDIS_URL = redis.toString();
}

/** Empties the workers' Redis databases; without Redis, the tests that need it say so. */
async function emptyRedis(url: URL, workers: number): Promise<void> {
  const redis = new Redis(url.toString(), {
    lazyConnect: true,
    maxRetriesPerRequest: 0,
    connectTimeout: 2000,
  });
  try {
    await redis.connect();
    for (let db = 1; db <= workers; db++) {
      await redis.select(db);
      await redis.flushdb();
    }
  } catch (err) {
    console.warn(`[jest] no test Redis (${(err as Error).message}); integration tests will fail.`);
  } finally {
    redis.disconnect();
  }
}
