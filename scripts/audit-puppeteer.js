const puppeteer = require('puppeteer');
// const chromium = require('@sparticuz/chromium'); // Not needed for local full puppeteer
const fs = require('fs');
const path = require('path');
// const { execSync } = require('child_process');

// Configuration
const BASE_URL = 'http://localhost:3000';
const TARGETS = [
  { url: `${BASE_URL}/webapp/recipes`, name: 'Recipes Page' },
  { url: `${BASE_URL}/webapp/recipes#ingredients`, name: 'Recipes - Ingredients' },
  { url: `${BASE_URL}/webapp/recipes#dishes`, name: 'Dishes Page' },
  { url: `${BASE_URL}/webapp/recipes#menu-builder`, name: 'Menu Builder' },
];

const BYPASS_TOKEN = process.env.PERFORMANCE_TEST_TOKEN || 'perf-test-secret';

async function runAudit() {
  console.log('🚀 Starting Authenticated Performance Audit (Log Capture Mode)...');
  console.log(`🔑 Using Bypass Token: ${BYPASS_TOKEN}`);

  // Create reports directory
  const reportsDir = path.join(process.cwd(), 'performance-reports', 'puppeteer');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const results = [];

  for (const target of TARGETS) {
    console.log(`\n🔍 Auditing: ${target.name} (${target.url})`);

    try {
      console.log(`   🐛 capturing browser logs for diagnosis...`);
      // Use standard puppeteer launch
      const browser = await puppeteer.launch({
        headless: true, // "new" or true
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();

      // forward console logs to stdout
      page.on('console', msg => console.log('   [BROWSER]', msg.text()));

      // set bypass header AND cookie
      await page.setExtraHTTPHeaders({
        'x-prepflow-perf-bypass': BYPASS_TOKEN,
      });
      await page.setCookie({
        name: 'prepflow-perf-bypass',
        value: BYPASS_TOKEN,
        domain: 'localhost',
        path: '/',
        httpOnly: true,
      });

      // Inject LCP observer
      await page.evaluateOnNewDocument(() => {
        new PerformanceObserver(entryList => {
          for (const entry of entryList.getEntries()) {
            console.log(`[LCP] ${entry.startTime.toFixed(2)}ms`);
          }
        }).observe({ type: 'largest-contentful-paint', buffered: true });
      });

      await page.goto(target.url, { waitUntil: 'networkidle0', timeout: 60000 });
      await new Promise(r => setTimeout(r, 10000)); // wait for LCP timeout/logs
      await browser.close();

      console.log(`   ✅ Log capture complete for ${target.name}`);
      results.push({ name: target.name, score: 0, path: 'n/a' });
    } catch (error) {
      console.error(`   ❌ Failed to audit ${target.name}:`, error.message);
    }
  }

  // Summary
  console.log('\n📈 Audit Summary:');
  results.forEach(r => {
    console.log(`  - ${r.name}: ${r.score.toFixed(0)}`);
  });
}

// Check if server is running (simple check)
try {
  fetch(BASE_URL)
    .then(() => {
      runAudit();
    })
    .catch(() => {
      console.error(
        '❌ Server is not running at http://localhost:3000. Please run "npm run start" or "npm run dev" first.',
      );
      process.exit(1);
    });
} catch (e) {
  // If fetch isn't available (old node), just try running
  runAudit();
}
