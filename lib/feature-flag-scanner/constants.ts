/**
 * Patterns to match feature flag usage
 */
export const FEATURE_FLAG_PATTERNS = [
  /useFeatureFlag\(['"]([^'"]+)['"]\)/g,
  /isFeatureEnabled\(['"]([^'"]+)['"]/g,
  /useFeatureFlag\(["']([^"']+)["']\)/g,
];

/**
 * Source directories to scan
 */
export const SOURCE_DIRECTORIES = ['app', 'components', 'hooks', 'lib'];

/**
 * Directories to skip during scanning
 */
export const SKIP_DIRECTORIES = ['.next', 'dist', 'build', 'node_modules'];

