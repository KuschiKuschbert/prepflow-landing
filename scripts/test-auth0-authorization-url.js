#!/usr/bin/env node

/**
 * Test script to check what authorization URL Auth0 SDK generates
 * This helps diagnose if the callback URL is being forced correctly
 */

const https = require('https');

const BASE_URL = 'https://www.prepflow.org';

async function testAuthorizationUrl() {
  console.log('🔍 Testing Auth0 Authorization URL Generation\n');
  console.log(`Testing: ${BASE_URL}\n`);

  try {
    // Test 1: Check diagnostic endpoint
    console.log('1️⃣ Checking diagnostic endpoint...');
    const diagnosticResponse = await fetch(`${BASE_URL}/api/debug/auth`);
    const diagnostic = await diagnosticResponse.json();

    console.log('   ✅ Diagnostic Results:');
    console.log(`      - Base URL: ${diagnostic.baseUrl || diagnostic.nextAuthUrl || 'NOT SET'}`);
    console.log(`      - Expected Callback: ${diagnostic.expectedCallbackUrl}`);
    console.log(`      - Actual Redirect URI: ${diagnostic.actualRedirectUri || 'NOT SET'}`);
    console.log(`      - Provider Callback URL: ${diagnostic.providerCallbackURL || 'NOT SET'}`);
    console.log(
      `      - Issues: ${diagnostic.issues.length === 0 ? 'None' : diagnostic.issues.join(', ')}\n`,
    );

    // Test 2: Try to get the login endpoint and see what happens
    console.log('2️⃣ Testing login endpoint...');
    const signinResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'GET',
      redirect: 'manual', // Don't follow redirects
    });

    console.log(`   Status: ${signinResponse.status}`);
    console.log(`   Headers:`, Object.fromEntries(signinResponse.headers.entries()));

    if (signinResponse.status === 200) {
      console.log('   ✅ Signin page loads correctly\n');
    } else if (signinResponse.status >= 300 && signinResponse.status < 400) {
      const location = signinResponse.headers.get('location');
      console.log(`   ⚠️  Redirects to: ${location}\n`);

      if (location && location.includes('auth0.com')) {
        // Parse the authorization URL to check redirect_uri parameter
        const url = new URL(location);
        const redirectUri = url.searchParams.get('redirect_uri');
        console.log('3️⃣ Authorization URL Analysis:');
        console.log(`   - Auth0 Domain: ${url.origin}`);
        console.log(`   - Redirect URI Parameter: ${redirectUri || 'NOT FOUND'}`);

        if (redirectUri) {
          // Auth0 SDK uses /api/auth/callback (not /api/auth/callback/auth0)
          const expectedCallback = 'https://www.prepflow.org/api/auth/callback';
          if (redirectUri === expectedCallback) {
            console.log(`   ✅ Redirect URI matches expected: ${expectedCallback}`);
          } else {
            console.log(`   ❌ Redirect URI MISMATCH!`);
            console.log(`      Expected: ${expectedCallback}`);
            console.log(`      Actual:   ${redirectUri}`);
          }
        } else {
          console.log('   ⚠️  No redirect_uri parameter found in authorization URL');
        }
      }
    } else {
      console.log(`   ❌ Error: ${signinResponse.status} ${signinResponse.statusText}\n`);
    }

    // Test 3: Check if we can access the callback endpoint
    console.log('\n4️⃣ Testing callback endpoint...');
    // Auth0 SDK uses /api/auth/callback (not /api/auth/callback/auth0)
    const callbackResponse = await fetch(`${BASE_URL}/api/auth/callback?error=auth0`, {
      method: 'GET',
      redirect: 'manual',
    });

    console.log(`   Status: ${callbackResponse.status}`);
    if (callbackResponse.status >= 300 && callbackResponse.status < 400) {
      const location = callbackResponse.headers.get('location');
      console.log(`   Redirects to: ${location}`);
      if (location && location.includes('error=auth0')) {
        console.log('   ⚠️  Callback endpoint returns error=auth0');
      }
    }

    console.log('\n✅ Tests completed\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run tests
testAuthorizationUrl().catch(console.error);
