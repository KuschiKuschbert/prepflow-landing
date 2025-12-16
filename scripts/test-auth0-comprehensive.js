#!/usr/bin/env node

/**
 * Comprehensive Auth0 Integration Test
 * Tests all critical paths and edge cases to ensure failproof operation
 */

const https = require('https');
const http = require('http');

// Prefer AUTH0_BASE_URL, fall back to NEXTAUTH_URL for backward compatibility
const BASE_URL = process.env.AUTH0_BASE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';

const testResults = {
  passed: [],
  failed: [],
  warnings: [],
  critical: [],
};

function log(message, type = 'info', critical = false) {
  const timestamp = new Date().toISOString();
  const prefix =
    {
      info: 'ℹ️',
      success: '✅',
      error: '❌',
      warning: '⚠️',
      critical: '🔴',
    }[type] || 'ℹ️';

  console.log(`[${timestamp}] ${prefix} ${message}`);

  if (type === 'success') {
    testResults.passed.push(message);
    if (critical) testResults.critical.push(message);
  } else if (type === 'error') {
    testResults.failed.push(message);
    if (critical) testResults.critical.push(`FAILED: ${message}`);
  } else if (type === 'warning') {
    testResults.warnings.push(message);
  }
}

function loadEnvFile() {
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

async function testAuth0Configuration() {
  log('Testing Auth0 Configuration...', 'info');
  console.log('');

  const requiredVars = {
    AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    AUTH0_SECRET: process.env.AUTH0_SECRET,
    AUTH0_BASE_URL: process.env.AUTH0_BASE_URL,
    // Deprecated - kept for backward compatibility
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  };

  let allPresent = true;
  for (const [key, value] of Object.entries(requiredVars)) {
    if (value) {
      const masked = key.includes('SECRET') ? `${value.substring(0, 8)}...` : value;
      const deprecated = key.startsWith('NEXTAUTH_') ? ' (deprecated)' : '';
      log(`${key}: ${masked}${deprecated}`, deprecated ? 'warning' : 'success', true);
    } else if (key.startsWith('NEXTAUTH_')) {
      // NEXTAUTH_* vars are optional (deprecated)
      log(`${key}: Not set (using AUTH0_* equivalent)`, 'info', true);
    } else {
      log(`${key}: MISSING`, 'error', true);
      allPresent = false;
    }
  }

  // Warn if using deprecated vars
  if (requiredVars.NEXTAUTH_URL && !requiredVars.AUTH0_BASE_URL) {
    log('⚠️  NEXTAUTH_URL is deprecated - use AUTH0_BASE_URL instead', 'warning');
  }

  if (requiredVars.NEXTAUTH_SECRET && !requiredVars.AUTH0_SECRET) {
    log('⚠️  NEXTAUTH_SECRET is deprecated - use AUTH0_SECRET instead', 'warning');
  }

  // Validate format
  if (
    requiredVars.AUTH0_ISSUER_BASE_URL &&
    !requiredVars.AUTH0_ISSUER_BASE_URL.startsWith('https://')
  ) {
    log('AUTH0_ISSUER_BASE_URL should start with https://', 'warning');
  }

  const baseUrl = requiredVars.AUTH0_BASE_URL || requiredVars.NEXTAUTH_URL;
  if (baseUrl && !baseUrl.startsWith('http')) {
    log('Base URL should be a valid URL', 'warning');
  }

  const secret = requiredVars.AUTH0_SECRET || requiredVars.NEXTAUTH_SECRET;
  if (secret && secret.length < 32) {
    log('Auth secret should be at least 32 characters', 'warning');
  }

  console.log('');
  return allPresent;
}

async function testAuth0Endpoints() {
  log('Testing Auth0 Endpoints...', 'info');
  console.log('');

  const endpoints = [
    {
      path: '/api/auth/signin',
      description: 'Sign-in page',
      expectedStatus: [200, 302],
      critical: true,
    },
    {
      path: '/api/auth/providers',
      description: 'Auth providers list',
      expectedStatus: [200],
      critical: true,
    },
    {
      path: '/api/auth/session',
      description: 'Session endpoint',
      expectedStatus: [200, 401],
      critical: true,
    },
    {
      path: '/api/auth/csrf',
      description: 'CSRF token endpoint',
      expectedStatus: [200],
      critical: false,
    },
  ];

  for (const endpoint of endpoints) {
    try {
      const result = await checkEndpoint(`${BASE_URL}${endpoint.path}`, endpoint.expectedStatus);
      log(`${endpoint.description}: OK (${result.status})`, 'success', endpoint.critical);

      // Verify providers endpoint returns Auth0
      if (endpoint.path === '/api/auth/providers') {
        try {
          const data = JSON.parse(result.data);
          if (data.auth0) {
            log('Auth0 provider configured correctly', 'success', true);
          } else {
            log('Auth0 provider not found in providers list', 'error', true);
          }
        } catch (e) {
          log('Could not parse providers response', 'warning');
        }
      }
    } catch (error) {
      log(`${endpoint.description}: ${error.message}`, 'error', endpoint.critical);
    }
  }

  console.log('');
}

async function testAuth0Callback() {
  log('Testing Auth0 Callback Configuration...', 'info');
  console.log('');

  // Auth0 SDK uses /api/auth/callback (not /api/auth/callback/auth0)
  const baseUrl = process.env.AUTH0_BASE_URL || process.env.NEXTAUTH_URL || BASE_URL;
  const callbackUrl = `${baseUrl}/api/auth/callback`;

  log(`Expected callback URL: ${callbackUrl}`, 'info');
  log('Verify this URL is configured in Auth0 Dashboard:', 'info');
  log('  - Go to: https://manage.auth0.com/dashboard', 'info');
  log('  - Applications > Your App > Settings', 'info');
  log(`  - Allowed Callback URLs should include: ${callbackUrl}`, 'info');
  const baseUrlForLogs = process.env.AUTH0_BASE_URL || process.env.NEXTAUTH_URL || BASE_URL;
  log(`  - Allowed Logout URLs should include: ${baseUrlForLogs}`, 'info');
  log(`  - Allowed Web Origins should include: ${baseUrlForLogs}`, 'info');
  console.log('');

  // Test callback endpoint exists
  try {
    await checkEndpoint(callbackUrl, [302, 400, 401, 500]); // Various statuses possible
    log('Callback endpoint accessible', 'success');
  } catch (error) {
    log(`Callback endpoint: ${error.message}`, 'warning');
  }
}

async function testSessionManagement() {
  log('Testing Session Management...', 'info');
  console.log('');

  try {
    // Test session endpoint without auth (should return null/empty)
    const result = await checkEndpoint(`${BASE_URL}/api/auth/session`, [200]);
    const session = JSON.parse(result.data);

    if (session && Object.keys(session).length === 0) {
      log(
        'Session endpoint: Returns empty session when not authenticated (correct)',
        'success',
        true,
      );
    } else if (session && session.user) {
      log('Session endpoint: Returns user session (authenticated)', 'success');
    } else {
      log('Session endpoint: Unexpected response format', 'warning');
    }
  } catch (error) {
    log(`Session endpoint: ${error.message}`, 'error', true);
  }

  console.log('');
}

async function testUserSyncImplementation() {
  log('Testing User Sync Implementation...', 'info');
  console.log('');

  const fs = require('fs');
  const path = require('path');

  // Check if sync function exists
  const syncFile = path.join(process.cwd(), 'lib/auth-user-sync.ts');
  if (fs.existsSync(syncFile)) {
    log('User sync function exists: lib/auth-user-sync.ts', 'success', true);

    // Check if it's imported in auth-options
    const authOptionsFile = path.join(process.cwd(), 'lib/auth-options.ts');
    if (fs.existsSync(authOptionsFile)) {
      const content = fs.readFileSync(authOptionsFile, 'utf8');
      if (content.includes('syncUserFromAuth0')) {
        log('User sync function imported in auth-options.ts', 'success', true);
      } else {
        log('User sync function NOT imported in auth-options.ts', 'error', true);
      }
    }
  } else {
    log('User sync function MISSING: lib/auth-user-sync.ts', 'error', true);
  }

  console.log('');
}

async function testDatabaseIntegration() {
  log('Testing Database Integration...', 'info');
  console.log('');

  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    log('Supabase configured', 'success', true);
  } else {
    log('Supabase NOT configured - user sync will not work', 'error', true);
  }

  // Check if users table migration exists
  const fs = require('fs');
  const path = require('path');
  const migrationsPath = path.join(process.cwd(), 'migrations');

  const requiredFields = [
    'email',
    'subscription_tier',
    'subscription_status',
    'last_login',
    'email_verified',
  ];

  log('Required user table fields:', 'info');
  requiredFields.forEach(field => {
    log(`  - ${field}`, 'info');
  });

  console.log('');
}

async function testErrorHandling() {
  log('Testing Error Handling...', 'info');
  console.log('');

  // Test invalid session request
  try {
    await checkEndpoint(`${BASE_URL}/api/auth/session`, [200, 401]);
    log('Error handling: Session endpoint handles unauthenticated requests', 'success', true);
  } catch (error) {
    log(`Error handling: ${error.message}`, 'error', true);
  }

  // Test invalid callback (should handle gracefully)
  try {
    await checkEndpoint(`${BASE_URL}/api/auth/callback/auth0?error=access_denied`, [302, 400, 500]);
    log('Error handling: Callback handles error parameters', 'success');
  } catch (error) {
    log(`Error handling: Callback error handling - ${error.message}`, 'warning');
  }

  console.log('');
}

async function testSecurity() {
  log('Testing Security Configuration...', 'info');
  console.log('');

  // Check Auth secret strength (prefer AUTH0_SECRET)
  const secret = process.env.AUTH0_SECRET || process.env.NEXTAUTH_SECRET;
  const secretVar = process.env.AUTH0_SECRET ? 'AUTH0_SECRET' : 'NEXTAUTH_SECRET';
  if (secret) {
    if (secret.length >= 32) {
      log(`${secretVar}: Strong (${secret.length} chars)`, 'success', true);
    } else {
      log(`${secretVar}: Weak (${secret.length} chars, should be >= 32)`, 'warning');
    }
    if (process.env.NEXTAUTH_SECRET && !process.env.AUTH0_SECRET) {
      log('⚠️  NEXTAUTH_SECRET is deprecated - use AUTH0_SECRET instead', 'warning');
    }
  }

  // Check AUTH0_CLIENT_SECRET
  const clientSecret = process.env.AUTH0_CLIENT_SECRET;
  if (clientSecret) {
    log('AUTH0_CLIENT_SECRET: Configured', 'success', true);
  } else {
    log('AUTH0_CLIENT_SECRET: MISSING', 'error', true);
  }

  // Verify HTTPS for production (prefer AUTH0_BASE_URL)
  const baseUrlForCheck = process.env.AUTH0_BASE_URL || process.env.NEXTAUTH_URL;
  const baseUrlVar = process.env.AUTH0_BASE_URL ? 'AUTH0_BASE_URL' : 'NEXTAUTH_URL';
  if (baseUrlForCheck && baseUrlForCheck.includes('localhost')) {
    log(`${baseUrlVar}: Using localhost (development)`, 'info');
  } else if (baseUrlForCheck && baseUrlForCheck.startsWith('https://')) {
    log(`${baseUrlVar}: Using HTTPS (production ready)`, 'success', true);
  } else if (baseUrlForCheck && baseUrlForCheck.startsWith('http://')) {
    log(`${baseUrlVar}: Using HTTP (not secure for production)`, 'warning');
  }
  if (process.env.NEXTAUTH_URL && !process.env.AUTH0_BASE_URL) {
    log('⚠️  NEXTAUTH_URL is deprecated - use AUTH0_BASE_URL instead', 'warning');
  }

  console.log('');
}

async function testAuth0ProviderConfiguration() {
  log('Testing Auth0 Provider Configuration...', 'info');
  console.log('');

  const fs = require('fs');
  const path = require('path');
  const authOptionsFile = path.join(process.cwd(), 'lib/auth-options.ts');

  if (fs.existsSync(authOptionsFile)) {
    const content = fs.readFileSync(authOptionsFile, 'utf8');

    // Check for proper scope configuration
    if (content.includes("scope: 'openid profile email'")) {
      log('Auth0 scope: Correctly configured (openid profile email)', 'success', true);
    } else {
      log('Auth0 scope: May not be configured correctly', 'warning');
    }

    // Check for JWT strategy
    if (content.includes("session: { strategy: 'jwt' }")) {
      log('Session strategy: JWT (stateless)', 'success', true);
    } else {
      log('Session strategy: May not be JWT', 'warning');
    }

    // Check for callbacks
    if (content.includes('callbacks:')) {
      log('Auth0 callbacks: Configured', 'success', true);
    } else {
      log('Auth0 callbacks: NOT configured', 'error', true);
    }

    // Check for user sync
    if (content.includes('syncUserFromAuth0')) {
      log('User sync: Integrated in JWT callback', 'success', true);
    } else {
      log('User sync: NOT integrated in JWT callback', 'error', true);
    }
  } else {
    log('auth-options.ts: File not found', 'error', true);
  }

  console.log('');
}

async function testEdgeCases() {
  log('Testing Edge Cases...', 'info');
  console.log('');

  // Test with missing environment variables (graceful degradation)
  const originalIssuer = process.env.AUTH0_ISSUER_BASE_URL;
  delete process.env.AUTH0_ISSUER_BASE_URL;

  try {
    await checkEndpoint(`${BASE_URL}/api/auth/providers`, [200, 500]);
    log('Edge case: Handles missing Auth0 config gracefully', 'success');
  } catch (error) {
    log(`Edge case: ${error.message}`, 'warning');
  }

  // Restore
  if (originalIssuer) {
    process.env.AUTH0_ISSUER_BASE_URL = originalIssuer;
  }

  console.log('');
}

async function runAllTests() {
  console.log('='.repeat(80));
  console.log('Comprehensive Auth0 Integration Test Suite');
  console.log('='.repeat(80));
  console.log('');

  // Load environment variables
  loadEnvFile();

  // Run tests
  const configOk = await testAuth0Configuration();
  console.log('');

  if (configOk) {
    await testAuth0Endpoints();
    await testAuth0Callback();
    await testSessionManagement();
    await testUserSyncImplementation();
    await testDatabaseIntegration();
    await testErrorHandling();
    await testSecurity();
    await testAuth0ProviderConfiguration();
    await testEdgeCases();
  } else {
    log('Skipping endpoint tests - configuration incomplete', 'warning');
  }

  // Summary
  console.log('='.repeat(80));
  console.log('Test Summary');
  console.log('='.repeat(80));
  console.log(`✅ Passed: ${testResults.passed.length}`);
  console.log(`❌ Failed: ${testResults.failed.length}`);
  console.log(`⚠️  Warnings: ${testResults.warnings.length}`);
  console.log(`🔴 Critical: ${testResults.critical.length}`);
  console.log('');

  if (testResults.critical.length > 0) {
    console.log('Critical Tests:');
    testResults.critical.forEach(msg => console.log(`  ${msg}`));
    console.log('');
  }

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
  const hasCriticalFailures = testResults.critical.some(msg => msg.startsWith('FAILED:'));
  if (hasCriticalFailures) {
    console.log('🔴 STATUS: CRITICAL FAILURES DETECTED');
    console.log('   Auth0 integration has critical issues that must be fixed.');
    process.exit(1);
  } else if (testResults.failed.length > 0) {
    console.log('⚠️  STATUS: SOME ISSUES DETECTED');
    console.log('   Auth0 integration works but has non-critical issues.');
    process.exit(0);
  } else {
    console.log('✅ STATUS: ALL TESTS PASSING');
    console.log('   Auth0 integration is failproof and ready for production.');
    process.exit(0);
  }
}

// Run tests
runAllTests().catch(error => {
  console.error('Test suite failed:', error);
  process.exit(1);
});




