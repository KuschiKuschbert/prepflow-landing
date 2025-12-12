#!/usr/bin/env node

/**
 * Verify Production Auth0 Environment Variables
 * Checks if all required environment variables are set correctly for production
 */

const https = require('https');

const PRODUCTION_URL = 'https://www.prepflow.org';

async function checkEndpoint(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { timeout: 10000 }, res => {
        let data = '';
        res.on('data', chunk => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve(data);
          }
        });
      })
      .on('error', reject)
      .on('timeout', () => {
        reject(new Error('Request timeout'));
      });
  });
}

async function verifyProductionAuth0() {
  console.log('🔍 Verifying Production Auth0 Configuration\n');
  console.log(`Production URL: ${PRODUCTION_URL}\n`);

  try {
    // Check basic diagnostic endpoint
    console.log('1️⃣ Checking basic diagnostic endpoint...');
    const basic = await checkEndpoint(`${PRODUCTION_URL}/api/debug/auth`);
    console.log('   ✅ Basic Diagnostic Results:');
    console.log(`      - NEXTAUTH_URL: ${basic.nextAuthUrl}`);
    console.log(`      - Is Correct Production URL: ${basic.isCorrectProductionUrl}`);
    console.log(`      - Auth0 Configured: ${basic.auth0Configured}`);
    console.log(`      - NextAuth Secret Set: ${basic.nextAuthSecretSet}`);
    console.log(
      `      - Issues: ${basic.issues.length === 0 ? 'None' : basic.issues.join(', ')}\n`,
    );

    // Check comprehensive test endpoint
    console.log('2️⃣ Checking comprehensive test endpoint...');
    const comprehensive = await checkEndpoint(`${PRODUCTION_URL}/api/test/auth0-comprehensive`);
    console.log('   ✅ Comprehensive Test Results:');
    console.log(`      - Total Tests: ${comprehensive.summary.total}`);
    console.log(`      - Passed: ${comprehensive.summary.passed}`);
    console.log(`      - Failed: ${comprehensive.summary.failed}`);
    console.log(`      - Warnings: ${comprehensive.summary.warnings}\n`);

    // Check for critical failures
    const failures = comprehensive.tests.filter(t => t.status === 'fail');
    if (failures.length > 0) {
      console.log('   ❌ Critical Failures:');
      failures.forEach(test => {
        console.log(`      - ${test.name}: ${test.message}`);
      });
      console.log('');
    }

    // Check for important warnings
    const warnings = comprehensive.tests.filter(t => t.status === 'warning');
    if (warnings.length > 0) {
      console.log('   ⚠️  Warnings:');
      warnings.forEach(test => {
        console.log(`      - ${test.name}: ${test.message}`);
      });
      console.log('');
    }

    // Check authorization flow
    console.log('3️⃣ Testing authorization flow...');
    const flow = await checkEndpoint(`${PRODUCTION_URL}/api/test/auth0-flow?callbackUrl=/webapp`);
    console.log('   ✅ Authorization Flow Results:');
    console.log(`      - Success: ${flow.success}`);
    console.log(`      - Has Error: ${flow.test.hasError}`);
    console.log(`      - Redirects to Auth0: ${flow.test.redirectsToAuth0}`);
    console.log(`      - Diagnosis: ${flow.test.diagnosis}\n`);

    // Summary
    console.log('📊 Summary:');
    if (basic.isCorrectProductionUrl && basic.auth0Configured && flow.success) {
      console.log('   ✅ All checks passed - Production Auth0 is configured correctly');
      return 0;
    } else {
      console.log('   ⚠️  Some checks failed - Review the output above');
      if (!flow.success) {
        console.log('\n   🔴 CRITICAL: Authorization flow is failing');
        console.log('      This means login will not work in production');
        console.log('      See docs/PRODUCTION_LOGIN_DIAGNOSTIC_RESULTS.md for details');
      }
      return 1;
    }
  } catch (error) {
    console.error('❌ Error verifying production Auth0:', error.message);
    return 1;
  }
}

verifyProductionAuth0()
  .then(code => {
    process.exit(code);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
