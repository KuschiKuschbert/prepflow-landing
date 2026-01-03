#!/usr/bin/env node

/**
 * Quick script to stop the recipe scraper
 * Usage: node scripts/stop-scraper.js
 */

const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/recipe-scraper/stop',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

console.log('Stopping scraper...');

const req = http.request(options, res => {
  let data = '';

  res.on('data', chunk => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      if (result.success) {
        console.log('✅ Scraper stopped successfully!');
        console.log('Status:', JSON.stringify(result.data, null, 2));
      } else {
        console.error('❌ Failed to stop scraper:', result.message);
        process.exit(1);
      }
    } catch (err) {
      console.error('❌ Error parsing response:', err.message);
      console.log('Raw response:', data);
      process.exit(1);
    }
  });
});

req.on('error', error => {
  console.error('❌ Error stopping scraper:', error.message);
  console.error('Make sure the server is running on http://localhost:3000');
  process.exit(1);
});

req.end();
