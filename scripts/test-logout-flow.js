#!/usr/bin/env node

/**
 * Logout Flow Verification Test
 * Tests that logout properly clears both NextAuth and Auth0 sessions
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

const testResults = {
  passed: [],
  failed: [],
  warnings: [],
};

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix =
    {
      info: 'ℹ️',
      success: '✅',
      error: '❌',
      warning: '⚠️',
    }[type] || 'ℹ️';

  console.log(`[${timestamp}] ${prefix} ${message}`);

  if (type === 'success') {
    testResults.passed.push(message);
  } else if (type === 'error') {
    testResults.failed.push(message);
  } else if (type === 'warning') {
    testResults.warnings.push(message);
  }
}

async function checkEndpoint(url, expectedStatuses = [200], options = {}) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const method = options.method || 'GET';
    const headers = options.headers || {};
    const body = options.body;

    const req = client.request(url, { method, headers }, res => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        const expected = Array.isArray(expectedStatuses) ? expectedStatuses : [expectedStatuses];
        if (expected.includes(res.statusCode)) {
          resolve({ status: res.statusCode, data, headers: res.headers });
        } else {
          reject(new Error(`Expected one of ${expected.join(', ')}, got ${res.statusCode}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }

    req.end();
  });
}

async function testLogoutEndpoint() {
  log('Testing Logout Endpoint...', 'info');
  console.log('');

  try {
    // Test logout endpoint exists and redirects properly
    const result = await checkEndpoint(
      `${BASE_URL}/api/auth/logout?returnTo=${encodeURIComponent(BASE_URL)}`,
      [302, 307],
    );
    log('Logout endpoint: Accessible and redirects', 'success');

    // Check if redirects to Auth0 logout URL
    const location = result.headers.location;
    if (location && location.includes('/v2/logout')) {
      log('Logout endpoint: Redirects to Auth0 logout URL', 'success');
    } else {
      log('Logout endpoint: May not redirect to Auth0 (check location header)', 'warning');
    }
  } catch (error) {
    log(`Logout endpoint: ${error.message}`, 'error');
  }

  console.log('');
}

async function testLogoutButtonImplementation() {
  log('Testing Logout Button Implementation...', 'info');
  console.log('');

  const fs = require('fs');
  const path = require('path');
  const logoutButtonFile = path.join(process.cwd(), 'app/webapp/components/LogoutButton.tsx');

  if (fs.existsSync(logoutButtonFile)) {
    const content = fs.readFileSync(logoutButtonFile, 'utf8');

    // Check for signOut call
    if (content.includes('signOut({ redirect: false })')) {
      log('LogoutButton: Calls signOut({ redirect: false })', 'success');
    } else {
      log('LogoutButton: Does NOT call signOut() - logout may not clear session', 'error');
    }

    // Check for redirect to logout API
    if (content.includes('/api/auth/logout')) {
      log('LogoutButton: Redirects to /api/auth/logout', 'success');
    } else {
      log('LogoutButton: Does NOT redirect to logout API', 'error');
    }

    // Check for cleanup (drafts, stats)
    if (content.includes('clearAllDrafts') || content.includes('clearSessionStats')) {
      log('LogoutButton: Cleans up drafts/stats', 'success');
    } else {
      log('LogoutButton: May not clean up all session data', 'warning');
    }
  } else {
    log('LogoutButton: File not found', 'error');
  }

  console.log('');
}

async function testLogoutAPIImplementation() {
  log('Testing Logout API Implementation...', 'info');
  console.log('');

  const fs = require('fs');
  const path = require('path');
  const logoutAPIFile = path.join(process.cwd(), 'app/api/auth/logout/route.ts');

  if (fs.existsSync(logoutAPIFile)) {
    const content = fs.readFileSync(logoutAPIFile, 'utf8');

    // Check for Auth0 logout URL construction
    if (content.includes('/v2/logout')) {
      log('Logout API: Constructs Auth0 logout URL', 'success');
    } else {
      log('Logout API: Does NOT construct Auth0 logout URL', 'error');
    }

    // Check for returnTo URL handling
    if (content.includes('returnTo')) {
      log('Logout API: Handles returnTo URL parameter', 'success');
    } else {
      log('Logout API: Does NOT handle returnTo URL', 'warning');
    }

    // Check for error handling
    if (content.includes('catch') || content.includes('error')) {
      log('Logout API: Has error handling', 'success');
    } else {
      log('Logout API: May not have proper error handling', 'warning');
    }

    // Check for fallback redirect
    if (content.includes('NextResponse.redirect')) {
      log('Logout API: Has redirect fallback', 'success');
    } else {
      log('Logout API: May not have redirect fallback', 'warning');
    }
  } else {
    log('Logout API: File not found', 'error');
  }

  console.log('');
}

async function testSessionCleanup() {
  log('Testing Session Cleanup...', 'info');
  console.log('');

  // Check if session callback handles expired tokens
  const fs = require('fs');
  const path = require('path');
  const authOptionsFile = path.join(process.cwd(), 'lib/auth-options.ts');

  if (fs.existsSync(authOptionsFile)) {
    const content = fs.readFileSync(authOptionsFile, 'utf8');

    // Check for session maxAge
    if (content.includes('maxAge')) {
      log('Session config: Has maxAge configured', 'success');
    } else {
      log('Session config: Does NOT have maxAge - sessions may not expire', 'error');
    }

    // Check for token expiration checking
    if (
      content.includes('tokenExp') ||
      content.includes('token.exp') ||
      content.includes('RefreshAccessTokenError')
    ) {
      log('JWT callback: Checks token expiration', 'success');
    } else {
      log('JWT callback: Does NOT check token expiration', 'error');
    }

    // Check for session callback error handling
    if (content.includes('RefreshAccessTokenError') && content.includes('return null')) {
      log('Session callback: Handles expired tokens', 'success');
    } else {
      log('Session callback: May not handle expired tokens', 'warning');
    }
  } else {
    log('Auth options: File not found', 'error');
  }

  console.log('');
}

async function testAuth0Configuration() {
  log('Testing Auth0 Logout Configuration...', 'info');
  console.log('');

  const auth0Issuer = process.env.AUTH0_ISSUER_BASE_URL;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const nextAuthUrl = process.env.NEXTAUTH_URL || BASE_URL;

  if (auth0Issuer && clientId) {
    log('Auth0 configuration: Present', 'success');

    // Construct expected logout URL
    const expectedLogoutUrl = `${auth0Issuer}/v2/logout?client_id=${encodeURIComponent(clientId)}&returnTo=${encodeURIComponent(nextAuthUrl)}`;
    log(`Expected Auth0 logout URL: ${expectedLogoutUrl}`, 'info');
    log('Verify this URL pattern is whitelisted in Auth0 dashboard:', 'info');
    log('  - Go to: https://manage.auth0.com', 'info');
    log('  - Applications > Your App > Settings', 'info');
    log(`  - "Allowed Logout URLs" should include: ${nextAuthUrl}`, 'info');
  } else {
    log('Auth0 configuration: Missing (logout may not work)', 'error');
  }

  console.log('');
}

async function runAllTests() {
  console.log('='.repeat(80));
  console.log('Logout Flow Verification Test');
  console.log('='.repeat(80));
  console.log('');

  // Load environment variables
  const fs = require('fs');
  const path = require('path');
  const envPath = path.join(process.cwd(), '.env.local');

  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, '');
          process.env[key.trim()] = value.trim();
        }
      }
    });
  }

  // Run tests
  await testLogoutEndpoint();
  await testLogoutButtonImplementation();
  await testLogoutAPIImplementation();
  await testSessionCleanup();
  await testAuth0Configuration();

  // Summary
  console.log('='.repeat(80));
  console.log('Test Summary');
  console.log('='.repeat(80));
  console.log(`✅ Passed: ${testResults.passed.length}`);
  console.log(`❌ Failed: ${testResults.failed.length}`);
  console.log(`⚠️  Warnings: ${testResults.warnings.length}`);
  console.log('');

  if (testResults.failed.length > 0) {
    console.log('Failed Tests:');
    testResults.failed.forEach(msg => console.log(`  - ${msg}`));
    console.log('');
  }

  if (testResults.warnings.length > 0) {
    console.log('Warnings:');
    testResults.warnings.forEach(msg => console.log(`  - ${msg}`));
    console.log('');
  }

  // Final verdict
  if (testResults.failed.length > 0) {
    console.log('❌ STATUS: SOME ISSUES DETECTED');
    console.log('   Logout flow has issues that should be addressed.');
    process.exit(1);
  } else {
    console.log('✅ STATUS: ALL TESTS PASSING');
    console.log('   Logout flow is properly configured and should work correctly.');
    process.exit(0);
  }
}

// Run tests
runAllTests().catch(error => {
  console.error('Test suite failed:', error);
  process.exit(1);
});




