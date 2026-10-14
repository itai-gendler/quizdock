/**
 * Points this worker at its own database and Redis database, prepared by
 * `test/jest.global-setup.ts`: `<database>_test_<worker>` and Redis database
 * `<worker>`. Runs before each test file, so before anything reads the variables.
 */
const worker = Number(process.env.JEST_WORKER_ID ?? '1');

const database = process.env.QUIZDOCK_TEST_DATABASE_URL;
if (database) {
  const url = new URL(database);
  url.pathname = `${url.pathname}_${worker}`;
  process.env.DATABASE_URL = url.toString();
}

const redis = process.env.QUIZDOCK_TEST_REDIS_URL;
if (redis) {
  const url = new URL(redis);
  url.pathname = `/${worker}`;
  process.env.REDIS_URL = url.toString();
}

export {};
