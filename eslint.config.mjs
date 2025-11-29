import { defineConfig } from 'eslint/config';
import nextConfig from 'eslint-config-next/core-web-vitals';

export default defineConfig([
  {
    ignores: ['**/node_modules', '**/.next', '**/out', '**/build', '**/dist'],
  },
  ...nextConfig,
  {
    rules: {
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      // Prevent console usage - use logger instead
      'no-console': 'error',
      // next/font/google automatically handles preconnect, so this is a false positive
      '@next/next/google-font-preconnect': 'off',
    },
  },
  {
    // Allow console in logger.ts (it's the logger implementation)
    files: ['lib/logger.ts', 'lib/logger/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    // Allow console in scripts (scripts are CLI tools)
    files: ['scripts/**/*.js', 'scripts/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    // Allow console in e2e tests (test debugging)
    files: ['e2e/**/*.ts', 'e2e/**/*.js'],
    rules: {
      'no-console': 'off',
      'react-hooks/rules-of-hooks': 'off', // Playwright fixtures use 'use' which conflicts with React hooks rule
    },
  },
]);
