/**
 * Generate a static PNG of the PrepFlow landing page background
 *
 * This script recreates the dynamic background effects and exports as PNG
 *
 * Usage:
 *   node scripts/generate-background-png.js
 *
 * Output:
 *   public/images/_hidden/background.png (1920x1080 by default)
 */

const fs = require('fs');
const path = require('path');
const { generateBackgroundHTML } = require('./generate-background-html');

// Note: Scripts are allowed to use console.log per ESLint config

// Check if we're in a browser environment (for browser-based execution)
const isBrowser = typeof window !== 'undefined';

if (isBrowser) {
  // Browser-based execution
  generateBackgroundInBrowser();
} else {
  // Node.js execution - use Puppeteer
  generateBackgroundWithPuppeteer();
}

/**
 * Generate background using Playwright (Node.js)
 */
async function generateBackgroundWithPuppeteer() {
  try {
    // Try Playwright first (already installed)
    let playwright;
    try {
      playwright = require('@playwright/test');
    } catch (e) {
      // Fallback to puppeteer
      const puppeteer = require('puppeteer');
      return generateWithPuppeteer(puppeteer);
    }

    console.log('🎨 Generating background PNG using Playwright...');

    const { chromium } = playwright;
    const browser = await chromium.launch({
      headless: true,
    });

    const page = await browser.newPage();

    // Set viewport size (1920x1080 is standard)
    await page.setViewportSize({
      width: 1920,
      height: 1080,
    });

    // Create HTML with background
    const html = generateBackgroundHTML();

    await page.setContent(html, { waitUntil: 'networkidle' });

    // Wait a bit for any animations to settle
    await page.waitForTimeout(500);

    // Capture screenshot
    const outputPath = path.join(process.cwd(), 'public', 'images', '_hidden', 'background.png');
    const outputDir = path.dirname(outputPath);

    // Ensure directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    await page.screenshot({
      path: outputPath,
      type: 'png',
    });

    await browser.close();

    console.log(`✅ Background saved to: ${outputPath}`);
    console.log(`📐 Size: 1920x1080px`);
    console.log(`💡 You can now use this as a static background image!`);
  } catch (error) {
    if (error.message.includes('Cannot find module')) {
      console.error('❌ Playwright not found. Installing...');
      console.error('   Run: npm install @playwright/test --save-dev');
      console.error('   Then: npx playwright install chromium');
      console.error('\n   Or use the browser-based method:');
      console.error('   1. Start your dev server: npm run dev');
      console.error('   2. Open: http://localhost:3000/scripts/generate-background-browser.html');
    } else {
      console.error('❌ Error generating background:', error.message);
      console.error(error.stack);
    }
    process.exit(1);
  }
}

/**
 * Fallback: Generate with Puppeteer
 */
async function generateWithPuppeteer(puppeteer) {
  console.log('🎨 Generating background PNG using Puppeteer...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 2,
  });

  const html = generateBackgroundHTML();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.waitForTimeout(500);

  const outputPath = path.join(process.cwd(), 'public', 'images', '_hidden', 'background.png');
  const outputDir = path.dirname(outputPath);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  await page.screenshot({
    path: outputPath,
    fullPage: false,
    type: 'png',
  });

  await browser.close();

  console.log(`✅ Background saved to: ${outputPath}`);
}

// HTML generation moved to generate-background-html.js to reduce file size

/**
 * Browser-based execution (for manual use in browser console)
 */
function generateBackgroundInBrowser() {
  console.log('🎨 Generating background in browser...');

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');

  // Draw base gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 1080);
  gradient.addColorStop(0, 'rgba(10,10,10,1)');
  gradient.addColorStop(1, 'rgba(8,8,10,1)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1920, 1080);

  // Draw grid
  ctx.strokeStyle = 'rgba(41,231,205,0.08)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 1920; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1080);
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(59,130,246,0.06)';
  for (let y = 0; y < 1080; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1920, y);
    ctx.stroke();
  }

  // Draw corner glows
  const cyanGradient = ctx.createRadialGradient(0, 0, 0, 420, 420, 420);
  cyanGradient.addColorStop(0, 'rgba(41,231,205,0.18)');
  cyanGradient.addColorStop(0.7, 'transparent');
  ctx.fillStyle = cyanGradient;
  ctx.fillRect(0, 0, 420, 420);

  const magentaGradient = ctx.createRadialGradient(1920, 120, 0, 1920, 120, 400);
  magentaGradient.addColorStop(0, 'rgba(217,37,199,0.16)');
  magentaGradient.addColorStop(0.7, 'transparent');
  ctx.fillStyle = magentaGradient;
  ctx.fillRect(1520, 120, 400, 400);

  // Draw spotlight
  const spotlightGradient = ctx.createRadialGradient(960, 540, 0, 960, 540, 600);
  spotlightGradient.addColorStop(0, 'rgba(41, 231, 205, 0.06)');
  spotlightGradient.addColorStop(0.4, 'transparent');
  ctx.fillStyle = spotlightGradient;
  ctx.fillRect(0, 0, 1920, 1080);

  // Convert to image and download
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'background.png';
    a.click();
    URL.revokeObjectURL(url);
    console.log('✅ Background downloaded!');
  }, 'image/png');
}
