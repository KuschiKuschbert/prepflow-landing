const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: ['**/?(*.)+(test|spec).[tj]s?(x)'],
  testPathIgnorePatterns: ['<rootDir>/e2e/'],
  transformIgnorePatterns: ['/node_modules/(?!(@auth0/nextjs-auth0)/)'],
};

module.exports = createJestConfig(customJestConfig);
