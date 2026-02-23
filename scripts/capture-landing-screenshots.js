#!/usr/bin/env node

/**
 * Capture Landing Page Screenshots
 *
 * Captures current webapp screens for the landing page.
 * Requires: dev server running (npm run dev), and authenticated session.
 *
 * Usage:
 *   node scripts/capture-landing-screenshots.js
 *   node scripts/capture-landing-screenshots.js --base-url=http://localhost:3000
 *   node scripts/capture-landing-screenshots.js --headed  # Show browser for manual login
 *
 * First run: Use --headed to log in manually. Session is persisted for subsequent runs.
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const ROUTE_TO_FILE = [
  { route: '/webapp', filename: 'dashboard-screenshot.png' },
  { route: '/webapp/ingredients', filename: 'ingredients-management-screenshot.png' },
  { route: '/webapp/cogs', filename: 'cogs-calculator-screenshot.png' },
  { route: '/webapp/recipes', filename: 'recipe-book-screenshot.png' },
  { route: '/webapp/performance', filename: 'performance-analysis-screenshot.png' },
  { route: '/webapp/temperature', filename: 'temperature-monitoring-screenshot.png' },
  { route: '/webapp/functions', filename: 'functions-events-screenshot.png' },
  { route: '/webapp/cleaning', filename: 'cleaning-roster-screenshot.png' },
  { route: '/webapp/settings', filename: 'settings-screenshot.png' },
];

const VIEWPORT = { width: 1280, height: 800 };
const OUTPUT_DIR = path.join(__dirname, '../public/images');

function parseArgs() {
  const args = process.argv.slice(2);
  const baseUrl =
    args.find(a => a.startsWith('--base-url='))?.split('=')[1] || 'http://localhost:3000';
  const headed = args.includes('--headed');
  return { baseUrl, headed };
}

async function captureScreenshots() {
  const { baseUrl, headed } = parseArgs();
  const userDataDir = path.join(__dirname, '../.screenshot-session');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: !headed,
    defaultViewport: VIEWPORT,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    userDataDir,
  });

  try {
    const page = await browser.newPage();

    // First, verify we can access webapp (auth check)
    console.log('Checking auth...');
    const loginUrl = `${baseUrl}/api/auth/login`;
    const webappUrl = `${baseUrl}/webapp`;

    await page.goto(webappUrl, { waitUntil: 'networkidle0', timeout: 15000 }).catch(() => null);

    const currentUrl = page.url();
    const isLoggedIn = currentUrl.includes('/webapp') && !currentUrl.includes('/api/auth');

    if (!isLoggedIn) {
      if (headed) {
        console.log('Not logged in. Browser is open - please log in, then press Enter here...');
        await new Promise(resolve => {
          process.stdin.once('data', resolve);
        });
        await page.goto(webappUrl, { waitUntil: 'networkidle0', timeout: 15000 });
      } else {
        console.error('Not authenticated. Run with --headed to log in manually first.');
        console.error('  node scripts/capture-landing-screenshots.js --headed');
        process.exit(1);
      }
    }

    for (const { route, filename } of ROUTE_TO_FILE) {
      const url = `${baseUrl}${route}`;
      const outputPath = path.join(OUTPUT_DIR, filename);

      try {
        console.log(`Capturing ${route} -> ${filename}`);
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

        // Wait for main content to be visible
        await page.waitForSelector('main, [role="main"]', { timeout: 5000 }).catch(() => {
          // Fallback: just wait for body
        });

        // Functions/performance need extra time for data to load
        const extraWait = route.includes('functions') || route.includes('performance') ? 1500 : 500;
        await new Promise(r => setTimeout(r, extraWait));

        await page.screenshot({
          path: outputPath,
          type: 'png',
          fullPage: true,
        });

        console.log(`  Saved: ${outputPath}`);
      } catch (err) {
        console.error(`  Failed ${route}: ${err.message}`);
      }
    }

    const cacheDir = path.join(__dirname, '../.next/cache/images');
    if (fs.existsSync(cacheDir)) {
      fs.rmSync(cacheDir, { recursive: true });
      console.log('Cleared Next.js image cache. Restart dev server to see new screenshots.');
    }

    console.log('Done.');
  } catch (error) {
    console.error('Failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

captureScreenshots();
