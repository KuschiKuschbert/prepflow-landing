const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@\/lib\/auth-options$': '<rootDir>/lib/auth-options.mock.ts',
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: ['**/?(*.)+(test|spec).[tj]s?(x)'],
  modulePathIgnorePatterns: [
    '<rootDir>/e2e/',
    '<rootDir>/lib/performance-monitor.test.ts',
    '<rootDir>/lib/qr-codes/QRCodeDisplay.test.tsx',
    '<rootDir>/app/webapp/temperature/components/utils.test.ts',
    '<rootDir>/__tests__/exports/template-generation.test.ts',
    '<rootDir>/__tests__/reset-self.api.test.ts',
  ],
  transformIgnorePatterns: ['/node_modules/(?!(@auth0/nextjs-auth0|auth0|uuid)/)'],
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    'utils/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/*.test.{ts,tsx}',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'json-summary'],
};

module.exports = createJestConfig(customJestConfig);
