import nextConfig from 'eslint-config-next/core-web-vitals';
import { defineConfig } from 'eslint/config';
import rsiConfig from './rsi.eslint.config.mjs';

// 1. Manually define the TS plugin since it's not exported by nextConfig in a way flat config sees easily for new blocks
// We rely on the fact that nextConfig brings in the parser/plugin under the hood, but to be safe we target TS files explicitly.

export default defineConfig([
  {
    ignores: [
      '**/node_modules',
      '**/.next',
      '**/out',
      '**/build',
      '**/dist',
      '**/app/curbos/**', // Exclude curbos area from all linting
    ],
  },
  ...nextConfig,
  ...rsiConfig, // Integrate RSI managed rules
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
    // Specific block for TypeScript files to handle 'any' rule
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // Warns on usage of 'any' to encourage fixing, but prevents build breakage
      '@typescript-eslint/no-explicit-any': 'warn',
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
    // Allow console in error-learning (CLI-based tooling)
    files: ['lib/error-learning/**/*.ts'],
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
    // Allow console in RSI library (RSI is a CLI-based system that outputs progress)
    files: ['lib/rsi/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    // Allow console in test/diagnostic files in root
    files: ['test-*.js', '*-test.js', '*-diag.js'],
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
