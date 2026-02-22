import nextConfig from 'eslint-config-next/core-web-vitals';
import playwright from 'eslint-plugin-playwright';
import unusedImports from 'eslint-plugin-unused-imports';
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
      '**/public/~partytown/**', // Exclude generated partytown files
      '**/.agent/**', // Exclude agent skills (CLI scripts with console)
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
    // Specific block for TypeScript files to handle 'any' rule and unused imports
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      // Warn on any - fix systematically; many legacy API helpers use any
      '@typescript-eslint/no-explicit-any': 'warn',
      // Disable base no-unused-vars in favor of unused-imports plugin
      '@typescript-eslint/no-unused-vars': 'off',
      // Auto-fixable unused imports and vars
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
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
    // Allow dynamic require in lib core files (api-error-handler uses require for source maps)
    files: ['lib/api-error-handler.ts', 'lib/*.ts'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    // Allow console and require in specific app/api and lib areas
    files: [
      'lib/error-learning/**/*.ts',
      'lib/square/**/*.ts',
      'lib/personality/**/*.ts',
      'app/webapp/ingredients/**/*.ts',
      'app/api/recipe-share/**/*.ts',
      'app/api/emails/**/*.ts',
      'app/api/customers/**/*.ts', // New API - migrate to logger when stable
      'app/webapp/recipes/hooks/useRecipeRefreshEffects.ts',
    ],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    // Allow legacy patterns in analytics components
    files: ['components/GoogleAnalytics.tsx', 'components/GoogleTagManager.tsx'],
    rules: {
      'prefer-rest-params': 'off',
    },
  },
  {
    // Allow console and require in scripts, tests, and CLI tools
    files: [
      'scripts/**/*.js',
      'scripts/**/*.ts',
      '__tests__/**/*.ts',
      '**/tests/**/*.ts',
      'lib/recipes/cli.ts',
    ],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    // Allow console and require in RSI library (CLI-based system with dynamic imports)
    files: ['lib/rsi/**/*.ts'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-require-imports': 'off',
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
    // Allow require in next.config.ts (bundle-analyzer uses dynamic require)
    files: ['next.config.ts'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    // Playwright recommended configuration
    ...playwright.configs['flat/recommended'],
    files: ['e2e/**/*.ts', 'e2e/**/*.js'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'no-console': 'off',
      'react-hooks/rules-of-hooks': 'off', // Playwright fixtures use 'use' which conflicts with React hooks rule
      'playwright/no-skipped-test': 'warn', // Warn instead of error for skipped tests
      'playwright/no-focused-test': 'error', // Error on focused tests (only)
      'playwright/no-networkidle': 'warn', // networkidle sometimes needed for flaky tests
    },
  },
]);
