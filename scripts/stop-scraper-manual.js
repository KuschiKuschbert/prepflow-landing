#!/usr/bin/env node

/**
 * Manual script to stop the recipe scraper by creating a stop flag file
 * This works even if the API isn't responding or there are multiple instances
 * Usage: node scripts/stop-scraper-manual.js
 */

const fs = require('fs');
const path = require('path');

const STORAGE_PATH = path.resolve('data/recipe-database');
const STOP_FLAG_PATH = path.join(STORAGE_PATH, '.stop-flag');

console.log('Creating stop flag file...');
console.log(`Path: ${STOP_FLAG_PATH}`);

try {
  // Ensure directory exists
  if (!fs.existsSync(STORAGE_PATH)) {
    fs.mkdirSync(STORAGE_PATH, { recursive: true });
  }

  // Create stop flag file
  const stopData = {
    stoppedAt: new Date().toISOString(),
    stoppedBy: 'manual-script',
  };

  fs.writeFileSync(STOP_FLAG_PATH, JSON.stringify(stopData, null, 2), 'utf-8');
  console.log('✅ Stop flag file created successfully!');
  console.log('The scraper will stop at the next check point (within the current batch).');
  console.log(`\nTo remove the stop flag and allow scraping again, delete: ${STOP_FLAG_PATH}`);
} catch (error) {
  console.error('❌ Failed to create stop flag file:', error.message);
  process.exit(1);
}
