#!/usr/bin/env node

/**
 * Verify if scraper has stopped by checking stop flag and status
 * Usage: node scripts/verify-scraper-stopped.js
 */

const fs = require('fs');
const path = require('path');

const STORAGE_PATH = path.resolve('data/recipe-database');
const STOP_FLAG_PATH = path.join(STORAGE_PATH, '.stop-flag');
const PROGRESS_DIR = path.join(STORAGE_PATH, '.progress');

console.log('🔍 Checking scraper status...\n');

// Check stop flag
if (fs.existsSync(STOP_FLAG_PATH)) {
  const stopData = JSON.parse(fs.readFileSync(STOP_FLAG_PATH, 'utf-8'));
  console.log('✅ Stop flag file EXISTS');
  console.log(`   Created at: ${stopData.stoppedAt}`);
  console.log(`   Created by: ${stopData.stoppedBy || 'unknown'}`);
  console.log(`   Path: ${STOP_FLAG_PATH}\n`);
} else {
  console.log('❌ Stop flag file does NOT exist');
  console.log(`   Expected path: ${STOP_FLAG_PATH}\n`);
}

// Check progress files for recent updates
if (fs.existsSync(PROGRESS_DIR)) {
  const progressFiles = fs.readdirSync(PROGRESS_DIR).filter(f => f.endsWith('.json'));

  if (progressFiles.length > 0) {
    console.log('📊 Progress files found:');
    let recentActivity = false;

    for (const file of progressFiles) {
      const filePath = path.join(PROGRESS_DIR, file);
      const stats = fs.statSync(filePath);
      const progress = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const lastUpdated = new Date(progress.lastUpdated || stats.mtime);
      const now = new Date();
      const minutesAgo = Math.floor((now - lastUpdated) / 1000 / 60);

      const isRecent = minutesAgo < 2; // Updated in last 2 minutes
      if (isRecent) recentActivity = true;

      console.log(`   ${file}:`);
      console.log(`      Last updated: ${minutesAgo} minutes ago`);
      console.log(`      Scraped: ${progress.scraped?.length || 0}/${progress.discovered?.length || 0}`);
      console.log(`      Status: ${isRecent ? '🟢 ACTIVE (recent updates)' : '🔴 INACTIVE (no recent updates)'}`);
    }

    console.log('');
    if (recentActivity) {
      console.log('⚠️  WARNING: Recent activity detected! Scraper may still be running.');
      console.log('   The stop flag should stop it at the next checkpoint.');
    } else {
      console.log('✅ No recent activity. Scraper appears to be stopped.');
    }
  } else {
    console.log('📊 No progress files found (scraper may not have started yet)');
  }
} else {
  console.log('📊 Progress directory does not exist');
}

console.log('\n💡 To remove the stop flag and allow scraping again:');
console.log(`   rm ${STOP_FLAG_PATH}`);
