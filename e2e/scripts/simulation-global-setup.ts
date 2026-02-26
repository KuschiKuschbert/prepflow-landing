/**
 * Global setup for persona simulation tests.
 *
 * Since the simulation uses AUTH0_BYPASS_DEV=true on the server, no real Auth0
 * session is needed. This setup simply creates a minimal empty storageState file
 * so Playwright can load it without errors. All pages are accessible because the
 * server's proxy bypasses auth checks when AUTH0_BYPASS_DEV=true.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';

const STORAGE_PATH = path.join(process.cwd(), 'e2e', 'simulation-auth.json');

// Pages that are slow to compile - pre-warm them so the simulation doesn't timeout
const SLOW_PAGES = [
  '/webapp',
  '/webapp/performance',
  '/webapp/temperature',
  '/webapp/settings/backup',
  '/webapp/settings',
  '/webapp/settings/billing',
  '/webapp/prep-lists',
  '/webapp/order-lists',
  '/webapp/functions',
  '/webapp/customers',
  '/webapp/calendar',
  '/webapp/suppliers',
  '/webapp/compliance',
  '/webapp/cleaning',
  '/webapp/recipes',
  '/webapp/ingredients',
  '/webapp/par-levels',
  '/webapp/cogs',
  '/webapp/roster',
  '/webapp/staff',
  '/webapp/time-attendance',
  '/webapp/menu-builder',
  '/webapp/specials',
  '/webapp/recipe-sharing',
  '/webapp/square',
];

function fetchPage(path: string): Promise<void> {
  return new Promise(resolve => {
    const req = http.get(`http://localhost:3000${path}`, res => {
      res.resume(); // consume response to free socket
      resolve();
    });
    req.setTimeout(40000, () => {
      req.destroy();
      resolve();
    });
    req.on('error', () => resolve());
  });
}

export default async function globalSetup(): Promise<void> {
  // Create a minimal valid storageState file for Playwright to load.
  // No cookies needed because the server uses AUTH0_BYPASS_DEV=true.
  fs.mkdirSync(path.dirname(STORAGE_PATH), { recursive: true });
  fs.writeFileSync(STORAGE_PATH, JSON.stringify({ cookies: [], origins: [] }, null, 2));

  // Pre-warm the dev server by visiting slow-to-compile pages.
  // This prevents navigation timeouts during the actual simulation tests.
  console.log('[globalSetup] Pre-warming dev server pages...');
  for (const pagePath of SLOW_PAGES) {
    console.log(`[globalSetup] Warming: ${pagePath}`);
    await fetchPage(pagePath);
  }
  console.log('[globalSetup] Pre-warming complete.');
}
