#!/usr/bin/env node

/**
 * Fix Auth0 Configuration
 * Helps configure Auth0 Management API and fix callback/logout URLs
 */

const https = require('https');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

async function checkEndpoint(url, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function main() {
  console.log('🔧 Auth0 Configuration Fix Tool\n');
  console.log('This tool will help you fix Auth0 configuration issues.\n');

  // Step 1: Check current status
  console.log('1️⃣ Checking current configuration...\n');
  const comprehensive = await checkEndpoint(
    'https://www.prepflow.org/api/test/auth0-comprehensive',
  );

  if (comprehensive.status !== 200) {
    console.error('❌ Failed to fetch configuration status');
    process.exit(1);
  }

  const results = comprehensive.data;
  const logoutTest = results.tests.find(t => t.name.includes('Logout'));
  const flowTest = await checkEndpoint(
    'https://www.prepflow.org/api/test/auth0-flow?callbackUrl=/webapp',
  );

  console.log('Current Status:');
  console.log(`  - Total Tests: ${results.summary.total}`);
  console.log(`  - Passed: ${results.summary.passed}`);
  console.log(`  - Failed: ${results.summary.failed}`);
  console.log(`  - Warnings: ${results.summary.warnings}\n`);

  if (logoutTest && logoutTest.status === 'warning') {
    console.log('⚠️  ISSUE FOUND: Logout URLs not configured\n');
    console.log('To fix this, you have two options:\n');
    console.log('OPTION A: Manual Fix (Recommended - 2 minutes)');
    console.log('1. Go to: https://manage.auth0.com');
    console.log('2. Navigate to: Applications → Prepflow → Settings');
    console.log('3. Find: "Allowed Logout URLs"');
    console.log('4. Add these URLs (one per line):');
    console.log('   https://www.prepflow.org');
    console.log('   https://www.prepflow.org/');
    console.log('   https://prepflow.org');
    console.log('   https://prepflow.org/');
    console.log('5. Click "Save Changes"\n');

    console.log('OPTION B: Automated Fix (Requires Management API Setup)');
    console.log('To use the automated fix endpoint, you need to:');
    console.log('1. Create an M2M (Machine-to-Machine) application in Auth0');
    console.log('2. Grant it "update:clients" scope for Auth0 Management API');
    console.log('3. Set AUTH0_M2M_CLIENT_ID and AUTH0_M2M_CLIENT_SECRET in Vercel');
    console.log('4. Then run: curl -X POST https://www.prepflow.org/api/fix/auth0-callback-urls\n');
  }

  if (flowTest.status === 200 && !flowTest.data.success) {
    console.log('🔴 CRITICAL ISSUE: Authorization flow is failing\n');
    console.log('NextAuth is returning error=auth0 before redirecting to Auth0.\n');
    console.log('To fix this:\n');
    console.log('1. Verify NEXTAUTH_URL in Vercel:');
    console.log('   - Go to: Vercel Dashboard → Project → Settings → Environment Variables');
    console.log('   - Verify NEXTAUTH_URL is: https://www.prepflow.org (no trailing slash)');
    console.log("   - Ensure it's set for Production environment");
    console.log('   - Redeploy after verifying\n');
    console.log('2. Check Vercel deployment logs for [Auth0 Config] entries\n');
    console.log('3. Test after changes:');
    console.log(
      '   curl -s "https://www.prepflow.org/api/test/auth0-flow?callbackUrl=/webapp" | jq \'.success\'\n',
    );
  }

  // Check if auto-fix is available
  console.log('2️⃣ Checking if auto-fix endpoint is available...\n');
  const autoFix = await checkEndpoint(
    'https://www.prepflow.org/api/fix/auth0-callback-urls',
    'POST',
  );

  if (autoFix.status === 200 && autoFix.data.success) {
    console.log('✅ Auto-fix endpoint is available and working!');
    console.log('Changes made:', JSON.stringify(autoFix.data.changes, null, 2));
  } else if (autoFix.data && autoFix.data.error) {
    console.log('⚠️  Auto-fix endpoint requires Management API permissions');
    console.log(`   Error: ${autoFix.data.error}\n`);
    console.log('To enable auto-fix, configure Management API access (see OPTION B above)\n');
  }

  // Summary
  console.log('📋 Summary:');
  console.log('   - See docs/PRODUCTION_LOGIN_FIX_GUIDE.md for detailed steps');
  console.log('   - Run: node scripts/verify-production-auth0-env.js to verify after fixes\n');

  rl.close();
}

main().catch(error => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
});
