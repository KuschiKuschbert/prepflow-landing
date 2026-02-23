/**
 * Constants for the console-error crawl spec.
 */

/** Routes to skip (intentional error page, external, etc.) */
export const SKIP_PATTERNS = ['/webapp/test-error', '/curbos'];

/** Post-load settle time in ms (configurable via CRAWL_SETTLE_MS env) */
export const SETTLE_MS = parseInt(process.env.CRAWL_SETTLE_MS || '800', 10);

/** Hash-based sections to seed (button nav, not discoverable via links) */
export const HASH_SEED_URLS = [
  '/webapp/recipes#dishes',
  '/webapp/recipes#ingredients',
  '/webapp/recipes#menu-builder',
  '/webapp/settings#profile',
  '/webapp/settings#billing',
  '/webapp/settings#preferences',
  '/webapp/settings#exports',
  '/webapp/settings#security',
  '/webapp/settings#privacy',
  '/webapp/settings#help',
  '/webapp/settings#backup',
  '/webapp/settings#qr-codes',
  '/webapp/settings#advanced',
  '/webapp/settings#feature-flags',
  '/webapp/square#overview',
  '/webapp/square#configuration',
  '/webapp/square#sync',
  '/webapp/square#mappings',
  '/webapp/square#history',
  '/webapp/square#webhooks',
];

/** Recipe tab button selectors (RecipeManagementTabs) */
export const RECIPE_TAB_SELECTORS = [
  { selector: 'button[aria-label="View ingredients"]', name: 'Ingredients' },
  { selector: 'button[aria-label="View dishes and recipes"]', name: 'Dishes & Recipes' },
  { selector: 'button[aria-label="View menu builder"]', name: 'Menu Builder' },
];

/** Settings section hashes to navigate (sidebar uses buttons, navigate by hash) */
export const SETTINGS_SECTION_HASHES = [
  '#profile',
  '#billing',
  '#preferences',
  '#exports',
  '#security',
  '#privacy',
  '#help',
  '#backup',
  '#qr-codes',
  '#advanced',
  '#feature-flags',
];

/** Square section button selectors (SquareNavigation) */
export const SQUARE_SECTION_SELECTORS = [
  { selector: 'button:has-text("Overview")', name: 'Overview' },
  { selector: 'button:has-text("Configuration")', name: 'Configuration' },
  { selector: 'button:has-text("Sync")', name: 'Sync' },
  { selector: 'button:has-text("Mappings")', name: 'Mappings' },
  { selector: 'button:has-text("History")', name: 'History' },
  { selector: 'button:has-text("Webhooks")', name: 'Webhooks' },
];
