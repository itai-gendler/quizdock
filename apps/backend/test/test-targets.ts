/** Redis database 1 and up: a Jest worker's own (see test/jest.global-setup.ts), never the dev stack's 0. */
export function onTestRedis(): boolean {
  return /\/([1-9]|1[0-5])$/.test(process.env.REDIS_URL ?? '');
}
