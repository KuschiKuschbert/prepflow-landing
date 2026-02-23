#!/usr/bin/env node

/**
 * Crop Guide Screenshots (Margin-Based)
 *
 * Trims header and footer chrome from guide screenshots using fixed pixel margins.
 * Per-image overrides in guide-crop-config.js. Annotation-driven cropping is disabled
 * because it invalidates annotation positions (annotations use % of image).
 *
 * Usage:
 *   npm run crop:guide-screenshots
 *
 * Processes: public/images/guides/*.png and parent images used by guides.
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const GUIDES_DIR = path.join(__dirname, '../public/images/guides');
const IMAGES_DIR = path.join(__dirname, '../public/images');
const CONFIG_PATH = path.join(__dirname, 'guide-crop-config.js');

// Parent images used by guides (in public/images/)
const PARENT_IMAGES = [
  'temperature-monitoring-screenshot.png',
  'cleaning-roster-screenshot.png',
  'functions-events-screenshot.png',
];

function loadConfig() {
  try {
    return require(CONFIG_PATH);
  } catch {
    return { defaults: { paddingPercent: 12 }, overrides: {} };
  }
}

/**
 * Compute crop region from margin config.
 */
function marginCropRegion(imgWidth, imgHeight, margins) {
  const { marginTop = 0, marginBottom = 0, marginLeft = 0, marginRight = 0 } = margins;

  const left = marginLeft;
  const top = marginTop;
  const width = Math.max(200, imgWidth - marginLeft - marginRight);
  const height = Math.max(150, imgHeight - marginTop - marginBottom);

  if (
    width >= imgWidth &&
    height >= imgHeight &&
    !(marginTop || marginBottom || marginLeft || marginRight)
  ) {
    return null;
  }
  return { left, top, width, height };
}

async function cropImage(filePath, config) {
  const basename = path.basename(filePath);
  const override = config.overrides?.[basename];

  try {
    const inputBuffer = fs.readFileSync(filePath);
    const meta = await sharp(inputBuffer).metadata();
    const { width, height } = meta;

    let region = null;

    // Prefer margin-based cropping: annotation-driven cropping breaks annotation positions
    // (annotations use % of image; after crop the same % points to wrong content).
    if (
      override &&
      (override.marginTop || override.marginBottom || override.marginLeft || override.marginRight)
    ) {
      region = marginCropRegion(width, height, override);
    } else if (config.defaults?.marginTop || config.defaults?.marginBottom) {
      region = marginCropRegion(width, height, config.defaults);
    }
    // Skip annotation-driven crop—it invalidates annotation coordinates

    if (
      !region ||
      (region.left === 0 && region.top === 0 && region.width >= width && region.height >= height)
    ) {
      console.log(`  Skip ${basename}: no crop needed`);
      return { skipped: true };
    }

    const cropped = await sharp(inputBuffer).extract(region).png().toBuffer();

    fs.writeFileSync(filePath, cropped);
    console.log(`  Cropped ${basename}: ${width}x${height} -> ${region.width}x${region.height}`);
    return { skipped: false };
  } catch (err) {
    console.error(`  Error ${basename}: ${err.message}`);
    return { error: true };
  }
}

async function main() {
  const config = loadConfig();

  const toProcess = [];

  if (fs.existsSync(GUIDES_DIR)) {
    const files = fs.readdirSync(GUIDES_DIR).filter(f => f.endsWith('.png'));
    for (const f of files) {
      toProcess.push(path.join(GUIDES_DIR, f));
    }
  }

  for (const name of PARENT_IMAGES) {
    const p = path.join(IMAGES_DIR, name);
    if (fs.existsSync(p)) toProcess.push(p);
  }

  if (toProcess.length === 0) {
    console.log('No guide images found.');
    return;
  }

  console.log(`Cropping ${toProcess.length} guide screenshots (margin-based)...\n`);

  let cropped = 0;
  let skipped = 0;
  for (const filePath of toProcess) {
    const result = await cropImage(filePath, config);
    if (result.skipped) skipped++;
    else if (!result.error) cropped++;
  }

  console.log(`\nDone: ${cropped} cropped, ${skipped} skipped.`);
}

main().catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
