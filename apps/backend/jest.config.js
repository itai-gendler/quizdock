/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // jose ships ES modules only (from v6): ts-jest turns them into CommonJS for the tests.
  // The built server needs nothing: Node loads them through require(esm).
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '/jose/.+\\.js$': ['ts-jest', { tsconfig: { allowJs: true }, diagnostics: false }],
  },
  transformIgnorePatterns: ['/node_modules/(?!(\\.pnpm/jose@[^/]+/node_modules/)?jose/)'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  moduleNameMapper: {
    '^@quiz-dock/contracts$': '<rootDir>/../../../packages/contracts/src/index.ts',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  // Les tests d'intégration ouvrent des sockets/Redis ; on force la sortie après
  // la fin des tests (le teardown best-effort peut laisser des handles ouverts).
  forceExit: true,
  testTimeout: 20000,
  // A database of their own for the integration tests (never the development one).
  globalSetup: '<rootDir>/../test/jest.global-setup.ts',
};
