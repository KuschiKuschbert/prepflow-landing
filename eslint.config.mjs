import { defineConfig } from 'eslint/config';
import nextConfig from 'eslint-config-next/core-web-vitals';

export default defineConfig([
  {
    ignores: ['**/node_modules', '**/.next', '**/out', '**/build', '**/dist'],
  },
  ...nextConfig,
]);
