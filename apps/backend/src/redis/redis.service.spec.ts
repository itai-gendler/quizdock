import { RedisService } from './redis.service';
import { onTestRedis } from '../../test/test-targets';

/** Against the worker's test Redis (see the Jest global setup). */
describe('RedisService.scanKeys', () => {
  let redis: RedisService;
  const prefix = `scan-test-${Date.now()}`;

  beforeAll(async () => {
    if (!onTestRedis()) {
      throw new Error('REDIS_URL must point at the test database (see test/jest.global-setup.ts)');
    }
    redis = new RedisService();
    const pipe = redis.multi();
    for (let i = 0; i < 1_200; i++) pipe.set(`${prefix}:${i}`, '1', 'EX', 60);
    pipe.set(`other-${prefix}`, '1', 'EX', 60);
    await pipe.exec();
  });

  afterAll(async () => {
    await redis.del(...(await redis.scanKeys(`*${prefix}*`)));
    await redis.quit();
  });

  it('finds every matching key, each once, over several batches', async () => {
    const keys = await redis.scanKeys(`${prefix}:*`);
    expect(keys).toHaveLength(1_200);
    expect(new Set(keys).size).toBe(1_200);
  });
});
