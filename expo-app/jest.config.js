/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/**/__tests__/**'],
  moduleNameMapper: {
    '\\.(json)$': '<rootDir>/jest.json.mock.js',
  },
  transformIgnorePatterns: ['node_modules/(?!expo)'],
};
