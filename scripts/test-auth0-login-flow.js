#!/usr/bin/env node
/**
 * Comprehensive Auth0 Login Flow Testing Script
 * Tests the complete authentication flow and logs everything
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.TEST_URL || 'https://www.prepflow.org';
const isProduction = BASE_URL.includes('prepflow.org');

console.log('🔍 Auth0 Login Flow Comprehensive Test');
console.log('=====================================\n');
console.log(`Testing URL: ${BASE_URL}\n`);

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log(`\n${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  log(`  ${title}`, 'cyan');
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

/**
 * Make HTTP/HTTPS request
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;

    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'PrepFlow-Auth0-Test-Script/1.0',
        ...options.headers,
      },
      timeout: 10000,
    };

    const req = client.request(requestOptions, res => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          url: url,
        });
      });
    });

    req.on('error', error => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

/**
 * Test endpoint and log results
 */
async function testEndpoint(name, url, expectedStatus = 200, options = {}) {
  try {
    logInfo(`Testing: ${name}`);
    log(`   URL: ${url}`, 'blue');

    const response = await makeRequest(url, options);

    // Check status code
    if (response.statusCode === expectedStatus) {
      logSuccess(`Status: ${response.statusCode} (expected ${expectedStatus})`);
    } else {
      logError(`Status: ${response.statusCode} (expected ${expectedStatus})`);
    }

    // Log redirects
    if (response.statusCode >= 300 && response.statusCode < 400) {
      const location = response.headers.location;
      if (location) {
        logInfo(`Redirects to: ${location}`);
      }
    }

    // Log cookies
    const cookies = response.headers['set-cookie'];
    if (cookies && cookies.length > 0) {
      logInfo(`Cookies set: ${cookies.length}`);
      cookies.forEach((cookie, index) => {
        const cookieName = cookie.split('=')[0];
        log(`   ${index + 1}. ${cookieName}`, 'blue');
      });
    } else {
      logWarning('No cookies set');
    }

    // Log content type
    const contentType = response.headers['content-type'];
    if (contentType) {
      logInfo(`Content-Type: ${contentType}`);
    }

    // Log response size
    logInfo(`Response size: ${response.body.length} bytes`);

    return {
      success: response.statusCode === expectedStatus,
      response,
    };
  } catch (error) {
    logError(`Error: ${error.message}`);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Main test function
 */
async function runTests() {
  const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
  };

  // Test 1: Landing page
  logSection('1. Landing Page');
  const landingResult = await testEndpoint('Landing Page', BASE_URL, 200);
  if (landingResult.success) results.passed++;
  else results.failed++;

  // Test 2: Login endpoint
  logSection('2. Login Endpoint');
  const loginUrl = `${BASE_URL}/api/auth/login?returnTo=/webapp`;
  const loginResult = await testEndpoint('Login Endpoint', loginUrl, [200, 302, 307, 308]);
  if (loginResult.success) results.passed++;
  else {
    results.failed++;
    // Check if it redirects to Auth0
    if (loginResult.response?.headers?.location) {
      const location = loginResult.response.headers.location;
      if (location.includes('auth0.com') || location.includes('auth0')) {
        logSuccess('Redirects to Auth0 (correct behavior)');
        results.passed++;
        results.failed--;
      } else {
        logError(`Unexpected redirect location: ${location}`);
      }
    }
  }

  // Test 3: Callback endpoint (should return 405 or redirect)
  logSection('3. Callback Endpoint');
  const callbackUrl = `${BASE_URL}/api/auth/callback`;
  const callbackResult = await testEndpoint('Callback Endpoint', callbackUrl, [200, 302, 405]);
  if (callbackResult.success) results.passed++;
  else {
    // 405 is acceptable for GET on callback
    if (callbackResult.response?.statusCode === 405) {
      logSuccess('Returns 405 Method Not Allowed (expected for GET)');
      results.passed++;
      results.failed--;
    } else {
      results.failed++;
    }
  }

  // Test 4: Logout endpoint
  logSection('4. Logout Endpoint');
  const logoutUrl = `${BASE_URL}/api/auth/logout?returnTo=${encodeURIComponent(BASE_URL)}`;
  const logoutResult = await testEndpoint('Logout Endpoint', logoutUrl, [200, 302, 307, 308]);
  if (logoutResult.success) results.passed++;
  else {
    results.failed++;
    // Check if it redirects
    if (logoutResult.response?.headers?.location) {
      logInfo(`Redirects to: ${logoutResult.response.headers.location}`);
    }
  }

  // Test 5: Protected route (should redirect to login)
  logSection('5. Protected Route (Webapp)');
  const webappUrl = `${BASE_URL}/webapp`;
  const webappResult = await testEndpoint('Webapp Route', webappUrl, [200, 302, 307, 308]);
  if (webappResult.success) {
    // Check if it redirects to login
    if (webappResult.response?.statusCode >= 300 && webappResult.response?.statusCode < 400) {
      const location = webappResult.response.headers.location;
      if (location && location.includes('/api/auth/login')) {
        logSuccess('Redirects to login (correct behavior)');
        results.passed++;
      } else {
        logWarning(`Unexpected redirect: ${location}`);
        results.warnings++;
      }
    } else if (webappResult.response?.statusCode === 200) {
      logWarning('Returns 200 (might be authenticated or bypass enabled)');
      results.warnings++;
    }
  } else {
    results.failed++;
  }

  // Test 6: User profile endpoint (should require auth)
  logSection('6. Protected API Route');
  const meUrl = `${BASE_URL}/api/me`;
  const meResult = await testEndpoint('User Profile API', meUrl, [401, 403]);
  if (meResult.success) {
    logSuccess('Returns 401/403 (correct - requires authentication)');
    results.passed++;
  } else {
    if (meResult.response?.statusCode === 200) {
      logWarning('Returns 200 (might be authenticated or bypass enabled)');
      results.warnings++;
    } else {
      results.failed++;
    }
  }

  // Test 7: Health check endpoint (should be public)
  logSection('7. Public API Route');
  const healthUrl = `${BASE_URL}/api/health`;
  const healthResult = await testEndpoint('Health Check API', healthUrl, [200, 404]);
  if (healthResult.success) results.passed++;
  else results.failed++;

  // Summary
  logSection('Test Summary');
  logSuccess(`Passed: ${results.passed}`);
  if (results.failed > 0) {
    logError(`Failed: ${results.failed}`);
  }
  if (results.warnings > 0) {
    logWarning(`Warnings: ${results.warnings}`);
  }

  console.log('\n');
  logSection('Next Steps');
  console.log('1. Open browser and navigate to:', colors.cyan);
  console.log(`   ${BASE_URL}/api/auth/login?returnTo=/webapp`);
  console.log(colors.reset);
  console.log('2. Complete Google login flow');
  console.log('3. Check browser console for errors');
  console.log('4. Check Network tab for failed requests');
  console.log('5. Verify redirect to /webapp after login');
  console.log('6. Test logout flow');
  console.log('7. Test protected routes');

  return results.failed === 0;
}

// Run tests
runTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    logError(`Fatal error: ${error.message}`);
    console.error(error);
    process.exit(1);
  });

