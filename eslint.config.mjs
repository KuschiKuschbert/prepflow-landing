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
    },
  },
]);
