#!/usr/bin/env node

/**
 * Capture Guide Screenshots
 *
 * Captures webapp screens for the Guides page (/webapp/guide).
 * Saves to public/images/guides/ for use in guide steps.
 * Requires: dev server running (npm run dev), and authenticated session.
 *
 * Usage:
 *   node scripts/capture-guide-screenshots.js
 *   node scripts/capture-guide-screenshots.js --base-url=http://localhost:3000
 *   node scripts/capture-guide-screenshots.js --headed  # Show browser for manual login
 *   node scripts/capture-guide-screenshots.js --interactive  # Pause before each multi-view capture for manual modal/tab setup
 *
 * First run: Use --headed to log in manually. Session is persisted for subsequent runs.
 * Multi-view steps (recipe modal, dish-builder): Use --interactive if automation is flaky; open the correct view, then press Enter.
 *
 * Route-to-file mapping (see docs/GUIDE_SCREENSHOTS.md for full checklist):
 * - /webapp -> guides/dashboard-overview.png (or reuse dashboard-screenshot.png)
 * - /webapp/ingredients -> guides/ingredients-page.png
 * - /webapp/recipes -> guides/recipe-builder.png, recipe-form.png, add-ingredients.png, recipe-cost.png
 * - /webapp/cogs -> guides/cogs-calculator.png, cogs-breakdown.png, pricing-tool.png
 * - /webapp/performance -> guides/performance-analysis.png
 * - /webapp/temperature -> guides/temperature-equipment.png, temperature-logs.png
 * - /webapp/compliance -> guides/compliance-records.png
 * - /webapp/suppliers -> guides/suppliers.png
 * - /webapp/menu-builder -> guides/menu-builder.png
 * - /webapp/prep-lists -> guides/prep-lists.png
 * - /webapp/order-lists -> guides/order-lists.png
 * - /webapp/par-levels -> guides/par-levels.png
 * - /webapp/dish-builder -> guides/dish-builder.png
 * - /webapp/cleaning -> images/cleaning-roster-screenshot.png (parent)
 * - /webapp/functions -> images/functions-events-screenshot.png (parent)
 * - /webapp/customers -> guides/customers.png
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const ROUTE_TO_FILE = [
  { route: '/webapp', filename: 'guides/dashboard-overview.png' },
  { route: '/webapp/ingredients', filename: 'guides/ingredients-page.png' },
  { route: '/webapp/cogs', filename: 'guides/cogs-calculator.png' },
  { route: '/webapp/recipes', filename: 'guides/recipe-builder.png' },
  { route: '/webapp/performance', filename: 'guides/performance-analysis.png', timeout: 60000 },
  { route: '/webapp/temperature', filename: 'guides/temperature-equipment.png' },
  { route: '/webapp/compliance', filename: 'guides/compliance-records.png' },
  { route: '/webapp/suppliers', filename: 'guides/suppliers.png' },
  { route: '/webapp/menu-builder', filename: 'guides/menu-builder.png' },
  { route: '/webapp/prep-lists', filename: 'guides/prep-lists.png' },
  { route: '/webapp/order-lists', filename: 'guides/order-lists.png' },
  { route: '/webapp/par-levels', filename: 'guides/par-levels.png' },
  { route: '/webapp/dish-builder', filename: 'guides/dish-builder.png' },
  { route: '/webapp/sections', filename: 'guides/dish-sections.png' },
  { route: '/webapp/specials', filename: 'guides/specials.png' },
  { route: '/webapp/recipe-sharing', filename: 'guides/recipe-sharing.png' },
  { route: '/webapp/setup', filename: 'guides/setup.png' },
  { route: '/webapp/settings', filename: 'guides/settings.png' },
  { route: '/webapp/cleaning', filename: 'cleaning-roster-screenshot.png' },
  { route: '/webapp/functions', filename: 'functions-events-screenshot.png' },
  { route: '/webapp/customers', filename: 'guides/customers.png' },
];

/**
 * Multi-view capture steps: actions + clipTarget.
 * Requires populated test data (POST /api/populate-clean-test-data) for recipe/dish steps.
 * Use --interactive to manually open modals/tabs before each capture.
 */
const CAPTURE_STEPS = [
  {
    route: '/webapp/recipes#dishes',
    filename: 'guides/recipe-form.png',
    actions: [
      { type: 'wait', ms: 1500 },
      { type: 'click', selector: 'main table tbody tr, main [role="row"], .cursor-pointer' },
      { type: 'wait', ms: 600 },
    ],
    clipTarget: { type: 'modal', selector: '[data-guide-capture="recipe-modal"], [role="dialog"]' },
  },
  {
    route: '/webapp/recipes#dishes',
    filename: 'guides/add-ingredients.png',
    actions: [
      { type: 'wait', ms: 1500 },
      { type: 'click', selector: 'main table tbody tr, main [role="row"], .cursor-pointer' },
      { type: 'wait', ms: 400 },
      { type: 'click', selector: '[data-guide-tab="ingredients"]' },
      { type: 'wait', ms: 300 },
    ],
    clipTarget: { type: 'modal', selector: '[data-guide-capture="recipe-modal"], [role="dialog"]' },
  },
  {
    route: '/webapp/recipes#dishes',
    filename: 'guides/recipe-cost.png',
    actions: [
      { type: 'wait', ms: 1500 },
      { type: 'click', selector: 'main table tbody tr, main [role="row"], .cursor-pointer' },
      { type: 'wait', ms: 400 },
      { type: 'click', selector: '[data-guide-tab="cogs"]' },
      { type: 'wait', ms: 300 },
    ],
    clipTarget: { type: 'modal', selector: '[data-guide-capture="recipe-modal"], [role="dialog"]' },
  },
  {
    route: '/webapp/dish-builder',
    filename: 'guides/cogs-breakdown.png',
    actions: [
      { type: 'wait', ms: 1500 },
      { type: 'click', selector: 'div.rounded-xl button.rounded-lg' },
      { type: 'wait', ms: 500 },
      { type: 'press', key: 'Enter' },
      { type: 'wait', ms: 800 },
    ],
    clipTarget: {
      type: 'sub-element',
      selector:
        '[data-guide-capture="cost-analysis"], [data-guide-capture="dish-ingredient-table"]',
    },
  },
  {
    route: '/webapp/dish-builder',
    filename: 'guides/pricing-tool.png',
    actions: [
      { type: 'wait', ms: 1500 },
      { type: 'click', selector: 'div.rounded-xl button.rounded-lg' },
      { type: 'wait', ms: 500 },
      { type: 'press', key: 'Enter' },
      { type: 'wait', ms: 1200 },
    ],
    clipTarget: {
      type: 'sub-element',
      selector: '[data-guide-capture="pricing-tool"], [data-guide-capture="cost-analysis"]',
    },
  },
];

const VIEWPORT = { width: 1280, height: 800 };
const OUTPUT_DIR = path.join(__dirname, '../public/images');

async function runActions(page, actions) {
  for (const a of actions) {
    if (a.type === 'wait') {
      await new Promise(r => setTimeout(r, a.ms || 500));
    } else if (a.type === 'click') {
      const selectors = a.selector.split(',').map(s => s.trim());
      let clicked = false;
      for (const sel of selectors) {
        try {
          const el = await page.$(sel);
          if (el) {
            await el.click();
            clicked = true;
            break;
          }
        } catch (_) {}
      }
      if (!clicked && a.ms) await new Promise(r => setTimeout(r, a.ms));
    } else if (a.type === 'press') {
      await page.keyboard.press(a.key || 'Enter');
    }
  }
}

async function captureElement(page, clipTarget) {
  const selector = typeof clipTarget === 'string' ? clipTarget : clipTarget?.selector;
  if (!selector) return null;
  const selectors = selector.split(',').map(s => s.trim());
  for (const sel of selectors) {
    const el = await page.$(sel);
    if (el) {
      const box = await el.boundingBox();
      if (box && box.width > 0 && box.height > 0) return box;
    }
  }
  return null;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const baseUrl =
    args.find(a => a.startsWith('--base-url='))?.split('=')[1] || 'http://localhost:3000';
  const headed = args.includes('--headed');
  const interactive = args.includes('--interactive');
  return { baseUrl, headed, interactive };
}

async function captureScreenshots() {
  const { baseUrl, headed, interactive } = parseArgs();
  const userDataDir = path.join(__dirname, '../.screenshot-session');

  const guidesDir = path.join(OUTPUT_DIR, 'guides');
  if (!fs.existsSync(guidesDir)) {
    fs.mkdirSync(guidesDir, { recursive: true });
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

    console.log('Checking auth...');
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
        console.error('  node scripts/capture-guide-screenshots.js --headed');
        process.exit(1);
      }
    }

    for (const item of ROUTE_TO_FILE) {
      const { route, filename, timeout: routeTimeout = 30000 } = item;
      const url = `${baseUrl}${route}`;
      const outputPath = path.join(OUTPUT_DIR, filename);

      try {
        console.log(`Capturing ${route} -> ${filename}`);
        await page.goto(url, {
          waitUntil: route.includes('performance') ? 'domcontentloaded' : 'networkidle0',
          timeout: routeTimeout,
        });
        await page.waitForSelector('main, [role="main"]', { timeout: 5000 }).catch(() => {});

        const extraWait = route.includes('performance')
          ? 3000
          : route.includes('temperature') || route.includes('functions')
            ? 1500
            : 500;
        await new Promise(r => setTimeout(r, extraWait));

        // DOM-driven capture: scroll to top, then capture main content area
        await page.evaluate(() => window.scrollTo(0, 0));
        await new Promise(r => setTimeout(r, 200));

        const main = await page.$('main, [role="main"]');
        const box = main ? await main.boundingBox() : null;

        if (box && box.width > 0 && box.height > 0) {
          const clipHeight = Math.min(box.height, 720);
          await page.screenshot({
            path: outputPath,
            type: 'png',
            clip: {
              x: box.x,
              y: box.y,
              width: box.width,
              height: clipHeight,
            },
          });
        } else {
          await page.screenshot({
            path: outputPath,
            type: 'png',
          });
        }

        console.log(`  Saved: ${outputPath}`);
      } catch (err) {
        console.error(`  Failed ${route} -> ${filename}: ${err.message}`);
      }
    }

    // Multi-view capture steps (modals, sub-elements)
    for (const step of CAPTURE_STEPS) {
      const { route, filename, actions = [], clipTarget } = step;
      const url = `${baseUrl}${route}`;
      const outputPath = path.join(OUTPUT_DIR, filename);

      try {
        console.log(`Capturing step ${filename}...`);
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
        await page.waitForSelector('main, [role="main"]', { timeout: 5000 }).catch(() => {});

        if (interactive) {
          console.log(`  Open the correct view (modal/tab) for ${filename}, then press Enter...`);
          await new Promise(resolve => {
            process.stdin.once('data', resolve);
          });
        } else {
          await runActions(page, actions);
          await new Promise(r => setTimeout(r, 300));
        }

        await page.evaluate(() => window.scrollTo(0, 0));
        await new Promise(r => setTimeout(r, 200));

        const targetBox =
          clipTarget && (await captureElement(page, clipTarget.selector || clipTarget));
        const main = await page.$('main, [role="main"]');
        const mainBox = main ? await main.boundingBox() : null;

        if (targetBox && targetBox.width > 0 && targetBox.height > 0) {
          const clipHeight = Math.min(targetBox.height, 720);
          await page.screenshot({
            path: outputPath,
            type: 'png',
            clip: {
              x: targetBox.x,
              y: targetBox.y,
              width: targetBox.width,
              height: clipHeight,
            },
          });
        } else if (mainBox && mainBox.width > 0 && mainBox.height > 0) {
          const clipHeight = Math.min(mainBox.height, 720);
          await page.screenshot({
            path: outputPath,
            type: 'png',
            clip: {
              x: mainBox.x,
              y: mainBox.y,
              width: mainBox.width,
              height: clipHeight,
            },
          });
        } else {
          await page.screenshot({ path: outputPath, type: 'png' });
        }

        console.log(`  Saved: ${outputPath}`);
      } catch (err) {
        console.error(`  Failed ${filename}: ${err.message}`);
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
