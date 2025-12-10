#!/usr/bin/env node

/**
 * Auth0 Configuration Validation Script
 * Validates Auth0 application settings via Management API
 *
 * Usage:
 *   node scripts/check-auth0-config.js
 *
 * Environment Variables Required:
 *   AUTH0_ISSUER_BASE_URL - Your Auth0 domain (e.g., https://dev-xxx.us.auth0.com)
 *   AUTH0_CLIENT_ID - Your application's Client ID
 *   AUTH0_CLIENT_SECRET - Your application's Client Secret
 *
 *   Optional (for M2M access - recommended):
 *   AUTH0_M2M_CLIENT_ID - Machine-to-Machine application Client ID
 *   AUTH0_M2M_CLIENT_SECRET - Machine-to-Machine application Client Secret
 *
 * Management API Endpoint:
 *   Uses: https://{AUTH0_ISSUER_BASE_URL}/api/v2/
 *   Requires: read:clients scope
 *
 * Setup Guide:
 *   See docs/AUTH0_MANAGEMENT_API_SETUP.md for complete setup instructions
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Expected configuration (from docs/AUTH0_PRODUCTION_SETUP.md)
const EXPECTED_WEB_ORIGINS = [
  'https://prepflow.org',
  'https://www.prepflow.org',
  'http://localhost:3000',
  'http://localhost:3001',
];

const EXPECTED_CALLBACK_URLS = [
  'https://prepflow.org/api/auth/callback/auth0',
  'https://www.prepflow.org/api/auth/callback/auth0',
  'http://localhost:3000/api/auth/callback/auth0',
  'http://localhost:3001/api/auth/callback/auth0',
];

const EXPECTED_LOGOUT_URLS = [
  'https://prepflow.org',
  'https://prepflow.org/',
  'https://www.prepflow.org',
  'https://www.prepflow.org/',
  'http://localhost:3000',
  'http://localhost:3000/',
  'http://localhost:3001',
  'http://localhost:3001/',
];

const validationResults = {
  passed: [],
  failed: [],
  warnings: [],
  errors: [],
};

/**
 * Load environment variables from .env.local
 */
function loadEnvFile() {
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

/**
 * Log message with type and color coding
 */
function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m', // Cyan
    success: '\x1b[32m', // Green
    error: '\x1b[31m', // Red
    warning: '\x1b[33m', // Yellow
    reset: '\x1b[0m',
  };

  const prefix =
    {
      info: 'ℹ️',
      success: '✅',
      error: '❌',
      warning: '⚠️',
    }[type] || 'ℹ️';

  console.log(`${colors[type]}${prefix} ${message}${colors.reset}`);

  if (type === 'success') {
    validationResults.passed.push(message);
  } else if (type === 'error') {
    validationResults.failed.push(message);
    validationResults.errors.push(message);
  } else if (type === 'warning') {
    validationResults.warnings.push(message);
  }
}

/**
 * Make HTTPS request
 */
function httpsRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch {
            resolve({ status: res.statusCode, data });
          }
        } else {
          reject(
            new Error(
              `HTTP ${res.statusCode}: ${data.length > 200 ? data.substring(0, 200) + '...' : data}`,
            ),
          );
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }

    req.end();
  });
}

/**
 * Get Management API access token
 * Tries M2M credentials first, falls back to regular app credentials
 */
async function getAccessToken() {
  const auth0Domain = process.env.AUTH0_ISSUER_BASE_URL?.replace(/^https?:\/\//, '').replace(
    /\/$/,
    '',
  );
  const m2mClientId = process.env.AUTH0_M2M_CLIENT_ID;
  const m2mClientSecret = process.env.AUTH0_M2M_CLIENT_SECRET;
  const appClientId = process.env.AUTH0_CLIENT_ID;
  const appClientSecret = process.env.AUTH0_CLIENT_SECRET;

  if (!auth0Domain) {
    throw new Error('AUTH0_ISSUER_BASE_URL is required');
  }

  // Try M2M credentials first (recommended)
  if (m2mClientId && m2mClientSecret) {
    log('Using Machine-to-Machine (M2M) credentials for Management API access', 'info');
    try {
      const postData = JSON.stringify({
        client_id: m2mClientId,
        client_secret: m2mClientSecret,
        audience: `https://${auth0Domain}/api/v2/`,
        grant_type: 'client_credentials',
      });

      const options = {
        hostname: auth0Domain,
        path: '/oauth/token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      };

      const result = await httpsRequest(options, postData);
      return result.data.access_token;
    } catch (error) {
      log(`M2M credentials failed: ${error.message}`, 'warning');
      log('Falling back to application credentials...', 'info');
    }
  }

  // Fallback to application credentials
  if (appClientId && appClientSecret) {
    log('Using application credentials for Management API access', 'info');
    const postData = JSON.stringify({
      client_id: appClientId,
      client_secret: appClientSecret,
      audience: `https://${auth0Domain}/api/v2/`,
      grant_type: 'client_credentials',
    });

    const options = {
      hostname: auth0Domain,
      path: '/oauth/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const result = await httpsRequest(options, postData);
    return result.data.access_token;
  }

  throw new Error(
    'No valid credentials found. Set either AUTH0_M2M_CLIENT_ID/AUTH0_M2M_CLIENT_SECRET or AUTH0_CLIENT_ID/AUTH0_CLIENT_SECRET',
  );
}

/**
 * Fetch Auth0 application settings
 */
async function fetchApplicationSettings(accessToken) {
  const auth0Domain = process.env.AUTH0_ISSUER_BASE_URL?.replace(/^https?:\/\//, '').replace(
    /\/$/,
    '',
  );
  const clientId = process.env.AUTH0_CLIENT_ID;

  if (!auth0Domain || !clientId) {
    throw new Error('AUTH0_ISSUER_BASE_URL and AUTH0_CLIENT_ID are required');
  }

  const options = {
    hostname: auth0Domain,
    path: `/api/v2/clients/${clientId}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  };

  const result = await httpsRequest(options);
  return result.data;
}

/**
 * Validate URL format
 */
function isValidUrl(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }

  // Check for placeholders
  if (url.includes('yourdomain') || url.includes('{domain}') || url.includes('{id}')) {
    return false;
  }

  // Check for valid protocol
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return false;
  }

  // Basic URL format validation
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if URL is a placeholder
 */
function isPlaceholder(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }

  const placeholderPatterns = [
    /yourdomain/i,
    /example\.com/i,
    /\{domain\}/i,
    /\{id\}/i,
    /placeholder/i,
  ];

  return placeholderPatterns.some(pattern => pattern.test(url));
}

/**
 * Validate web origins
 */
function validateWebOrigins(webOrigins) {
  log('\n📋 Validating Web Origins...', 'info');
  const issues = [];
  const configured = Array.isArray(webOrigins) ? webOrigins : [];

  // Check for placeholders
  configured.forEach((url, index) => {
    if (isPlaceholder(url)) {
      issues.push({
        type: 'placeholder',
        message: `Web origin [${index}] contains placeholder: ${url}`,
        url,
        index,
      });
    } else if (!isValidUrl(url)) {
      issues.push({
        type: 'invalid',
        message: `Web origin [${index}] is invalid: ${url}`,
        url,
        index,
      });
    } else if (url.endsWith('/')) {
      issues.push({
        type: 'trailing_slash',
        message: `Web origin [${index}] has trailing slash (should not): ${url}`,
        url,
        index,
      });
    }
  });

  // Check for missing required URLs
  EXPECTED_WEB_ORIGINS.forEach(expected => {
    if (!configured.includes(expected)) {
      issues.push({
        type: 'missing',
        message: `Missing required web origin: ${expected}`,
        url: expected,
      });
    }
  });

  // Report results
  if (issues.length === 0) {
    log(
      `All ${EXPECTED_WEB_ORIGINS.length} required web origins are configured correctly`,
      'success',
    );
  } else {
    issues.forEach(issue => {
      if (issue.type === 'placeholder' || issue.type === 'invalid') {
        log(issue.message, 'error');
      } else if (issue.type === 'missing') {
        log(issue.message, 'error');
      } else {
        log(issue.message, 'warning');
      }
    });
  }

  log(`Configured: ${configured.length} | Expected: ${EXPECTED_WEB_ORIGINS.length}`, 'info');
  if (configured.length > 0) {
    log('Current web origins:', 'info');
    configured.forEach((url, i) => {
      const status = EXPECTED_WEB_ORIGINS.includes(url) ? '✅' : '⚠️';
      log(`  ${status} [${i}] ${url}`, 'info');
    });
  }

  return { issues, configured };
}

/**
 * Validate callback URLs
 */
function validateCallbackUrls(callbackUrls) {
  log('\n📋 Validating Callback URLs...', 'info');
  const issues = [];
  const configured = Array.isArray(callbackUrls) ? callbackUrls : [];

  // Check for placeholders
  configured.forEach((url, index) => {
    if (isPlaceholder(url)) {
      issues.push({
        type: 'placeholder',
        message: `Callback URL [${index}] contains placeholder: ${url}`,
        url,
        index,
      });
    } else if (!isValidUrl(url)) {
      issues.push({
        type: 'invalid',
        message: `Callback URL [${index}] is invalid: ${url}`,
        url,
        index,
      });
    }
  });

  // Check for missing required URLs
  EXPECTED_CALLBACK_URLS.forEach(expected => {
    if (!configured.includes(expected)) {
      issues.push({
        type: 'missing',
        message: `Missing required callback URL: ${expected}`,
        url: expected,
      });
    }
  });

  // Report results
  if (issues.length === 0) {
    log(
      `All ${EXPECTED_CALLBACK_URLS.length} required callback URLs are configured correctly`,
      'success',
    );
  } else {
    issues.forEach(issue => {
      if (issue.type === 'placeholder' || issue.type === 'invalid') {
        log(issue.message, 'error');
      } else if (issue.type === 'missing') {
        log(issue.message, 'error');
      }
    });
  }

  log(`Configured: ${configured.length} | Expected: ${EXPECTED_CALLBACK_URLS.length}`, 'info');
  if (configured.length > 0) {
    log('Current callback URLs:', 'info');
    configured.forEach((url, i) => {
      const status = EXPECTED_CALLBACK_URLS.includes(url) ? '✅' : '⚠️';
      log(`  ${status} [${i}] ${url}`, 'info');
    });
  }

  return { issues, configured };
}

/**
 * Validate logout URLs
 */
function validateLogoutUrls(logoutUrls) {
  log('\n📋 Validating Logout URLs...', 'info');
  const issues = [];
  const configured = Array.isArray(logoutUrls) ? logoutUrls : [];

  // Check for placeholders
  configured.forEach((url, index) => {
    if (isPlaceholder(url)) {
      issues.push({
        type: 'placeholder',
        message: `Logout URL [${index}] contains placeholder: ${url}`,
        url,
        index,
      });
    } else if (!isValidUrl(url)) {
      issues.push({
        type: 'invalid',
        message: `Logout URL [${index}] is invalid: ${url}`,
        url,
        index,
      });
    }
  });

  // Check for missing required URLs
  EXPECTED_LOGOUT_URLS.forEach(expected => {
    if (!configured.includes(expected)) {
      issues.push({
        type: 'missing',
        message: `Missing required logout URL: ${expected}`,
        url: expected,
      });
    }
  });

  // Report results
  if (issues.length === 0) {
    log(
      `All ${EXPECTED_LOGOUT_URLS.length} required logout URLs are configured correctly`,
      'success',
    );
  } else {
    issues.forEach(issue => {
      if (issue.type === 'placeholder' || issue.type === 'invalid') {
        log(issue.message, 'error');
      } else if (issue.type === 'missing') {
        log(issue.message, 'error');
      }
    });
  }

  log(`Configured: ${configured.length} | Expected: ${EXPECTED_LOGOUT_URLS.length}`, 'info');
  if (configured.length > 0) {
    log('Current logout URLs:', 'info');
    configured.forEach((url, i) => {
      const status = EXPECTED_LOGOUT_URLS.includes(url) ? '✅' : '⚠️';
      log(`  ${status} [${i}] ${url}`, 'info');
    });
  }

  return { issues, configured };
}

/**
 * Generate summary report
 */
function generateReport(webOriginsResult, callbackUrlsResult, logoutUrlsResult) {
  const totalIssues =
    webOriginsResult.issues.length +
    callbackUrlsResult.issues.length +
    logoutUrlsResult.issues.length;

  log('\n' + '='.repeat(60), 'info');
  log('📊 Validation Summary', 'info');
  log('='.repeat(60), 'info');

  log(`\n✅ Passed: ${validationResults.passed.length}`, 'success');
  log(`⚠️  Warnings: ${validationResults.warnings.length}`, 'warning');
  log(`❌ Errors: ${validationResults.errors.length}`, 'error');

  if (totalIssues === 0) {
    log('\n🎉 All Auth0 configuration checks passed!', 'success');
  } else {
    log(`\n⚠️  Found ${totalIssues} configuration issue(s)`, 'warning');

    // Check for specific error types
    const placeholderErrors = [
      ...webOriginsResult.issues,
      ...callbackUrlsResult.issues,
      ...logoutUrlsResult.issues,
    ].filter(issue => issue.type === 'placeholder');

    if (placeholderErrors.length > 0) {
      log('\n🔴 CRITICAL: Placeholder URLs detected!', 'error');
      log('These URLs contain placeholders and will cause validation errors:', 'error');
      placeholderErrors.forEach(issue => {
        log(`  - ${issue.url}`, 'error');
      });
      log(
        '\nThis is likely the cause of the "url-with-placeholders" error you encountered.',
        'error',
      );
    }

    // Recommendations
    log('\n💡 Recommendations:', 'info');
    log('1. Remove any placeholder URLs (e.g., https://yourdomain.com)', 'info');
    log('2. Ensure all required URLs are configured (see docs/AUTH0_PRODUCTION_SETUP.md)', 'info');
    log('3. Verify URLs match exactly (no typos, correct protocol)', 'info');
    log('4. Web origins should NOT have trailing slashes', 'info');
    log('5. Logout URLs should include both with and without trailing slash', 'info');
  }

  log('\n' + '='.repeat(60), 'info');
}

/**
 * Main execution
 */
async function main() {
  try {
    // Load environment variables
    loadEnvFile();

    log('🔍 Auth0 Configuration Validation', 'info');
    log('='.repeat(60), 'info');

    // Check required environment variables
    const requiredVars = {
      AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
      AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    };

    const missingVars = Object.entries(requiredVars)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      log(`Missing required environment variables: ${missingVars.join(', ')}`, 'error');
      process.exit(1);
    }

    // Get access token
    log('\n🔐 Authenticating with Auth0 Management API...', 'info');
    const accessToken = await getAccessToken();
    log('✅ Successfully authenticated', 'success');

    // Fetch application settings
    log('\n📥 Fetching application settings...', 'info');
    let appSettings;
    try {
      appSettings = await fetchApplicationSettings(accessToken);
      log(
        `✅ Retrieved settings for application: ${appSettings.name || appSettings.client_id}`,
        'success',
      );
    } catch (error) {
      if (error.message.includes('insufficient_scope') || error.message.includes('403')) {
        log('\n❌ Management API Access Denied', 'error');
        log('The credentials used do not have the required scopes.', 'error');
        log('\n💡 Solution Options:', 'info');
        log(
          '1. Use Machine-to-Machine (M2M) credentials with read:clients scope (recommended)',
          'info',
        );
        log('   - Create M2M application in Auth0 Dashboard', 'info');
        log('   - Grant it "read:clients" scope', 'info');
        log('   - Set AUTH0_M2M_CLIENT_ID and AUTH0_M2M_CLIENT_SECRET', 'info');
        log('\n2. Grant your application the required scopes:', 'info');
        log('   - Go to Auth0 Dashboard → Applications → APIs → Auth0 Management API', 'info');
        log('   - Authorize your application', 'info');
        log('   - Grant "read:clients" scope', 'info');
        log('\n3. Manual validation:', 'info');
        log('   - Go to Auth0 Dashboard → Applications → Your App → Settings', 'info');
        log('   - Manually verify web origins, callback URLs, and logout URLs', 'info');
        log('   - See docs/AUTH0_PRODUCTION_SETUP.md for required URLs', 'info');
        process.exit(1);
      }
      throw error;
    }

    // Validate configuration
    // Note: Auth0 API returns 'web_origins' and 'callbacks', not 'allowed_web_origins' and 'allowed_callback_urls'
    const webOriginsResult = validateWebOrigins(appSettings.web_origins);
    const callbackUrlsResult = validateCallbackUrls(appSettings.callbacks);
    const logoutUrlsResult = validateLogoutUrls(appSettings.allowed_logout_urls);

    // Generate report
    generateReport(webOriginsResult, callbackUrlsResult, logoutUrlsResult);

    // Exit with appropriate code
    const hasErrors = validationResults.errors.length > 0;
    process.exit(hasErrors ? 1 : 0);
  } catch (error) {
    log(`\n❌ Fatal error: ${error.message}`, 'error');
    if (error.stack) {
      log(`\nStack trace:\n${error.stack}`, 'error');
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  validateWebOrigins,
  validateCallbackUrls,
  validateLogoutUrls,
  isValidUrl,
  isPlaceholder,
};
