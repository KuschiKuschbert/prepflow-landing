#!/usr/bin/env node

/**
 * Verify cleaning tasks migration status
 *
 * Checks if the migration has been applied successfully.
 *
 * Usage:
 *   node scripts/verify-cleaning-migration.js
 */

const http = require('http');

const API_URL = 'http://localhost:3000/api/setup-cleaning-tasks';

function checkStatus() {
  return new Promise((resolve, reject) => {
    const req = http.request(`${API_URL}?t=${Date.now()}`, { method: 'POST' }, res => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(new Error(`Failed to parse response: ${err.message}`));
        }
      });
    });

    req.on('error', err => {
      reject(new Error(`Request failed: ${err.message}. Make sure dev server is running.`));
    });

    req.end();
  });
}

async function main() {
  console.log('🔍 Checking cleaning tasks migration status...\n');

  try {
    const status = await checkStatus();

    if (status.success && status.tablesExist) {
      console.log('✅ Migration successful!');
      console.log('   All tables and columns are set up correctly.\n');
      console.log('✅ Next steps:');
      console.log('   - Test the cleaning page: http://localhost:3000/webapp/cleaning');
      console.log('   - Try creating a cleaning task\n');
      process.exit(0);
    } else {
      console.log('❌ Migration not yet applied');
      console.log(`   Status: ${status.message}\n`);

      if (status.missingColumn) {
        console.log(`   Missing column: ${status.missingColumn}`);
      }
      if (status.missingTable) {
        console.log(`   Missing table: ${status.missingTable}`);
      }
      if (status.missingForeignKey) {
        console.log('   Missing foreign key relationship');
      }

      console.log('\n📋 To fix:');
      console.log('   1. Visit: http://localhost:3000/api/setup-cleaning-tasks');
      console.log('   2. Copy the SQL');
      console.log('   3. Run it in Supabase SQL Editor');
      console.log('   4. Run this script again to verify\n');
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Error checking status:', err.message);
    console.error('\n   Make sure your dev server is running: npm run dev\n');
    process.exit(1);
  }
}

main();
