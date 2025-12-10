#!/usr/bin/env node

/**
 * Update Auth0 Application Configuration via Management API
 *
 * This script updates Auth0 application settings programmatically,
 * ensuring consistent configuration across environments.
 *
 * Usage:
 *   node scripts/update-auth0-config.js
 *
 * Requirements:
 *   - M2M application with update:clients scope (recommended)
 *   - OR regular application with update:clients scope
 *
 * Environment Variables:
 *   AUTH0_ISSUER_BASE_URL - Auth0 domain
 *   AUTH0_CLIENT_ID - Application Client ID
 *   AUTH0_CLIENT_SECRET - Application Client Secret (if not using M2M)
 *   AUTH0_M2M_CLIENT_ID - M2M Client ID (optional, preferred)
 *   AUTH0_M2M_CLIENT_SECRET - M2M Client Secret (optional, preferred)
 *
 * See: docs/AUTH0_MANAGEMENT_API_SETUP.md for setup instructions
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Expected configuration (matches docs/AUTH0_PRODUCTION_SETUP.md)
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
  'http://localhost:3000',
  'http://localhost:3000/',
  'http://localhost:3001',
  'http://localhost:3001/',
  'https://prepflow.org',
  'https://prepflow.org/',
  'https://www.prepflow.org',
  'https://www.prepflow.org/',
];

// Application Login URI (optional but recommended)
const APPLICATION_LOGIN_URI = 'https://www.prepflow.org/api/auth/signin';

function log(message, level = 'info') {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    error: '\x1b[31m',
    warn: '\x1b[33m',
    reset: '\x1b[0m',
  };
  const icon = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warn: '⚠️',
  };
  console.log(`${colors[level]}${icon[level]} ${message}${colors.reset}`);
}

function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
}

function httpsRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ data: parsed, statusCode: res.statusCode });
          } else {
            reject(
              new Error(
                `HTTP ${res.statusCode}: ${JSON.stringify(parsed)}`,
              ),
            );
          }
        } catch (e) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ data: data, statusCode: res.statusCode });
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        }
      });
    });

    req.on('error', reject);

    if (postData) {
      req.write(postData);
    }

    req.end();
  });
}

async function getAccessToken() {
  const auth0Domain = process.env.AUTH0_ISSUER_BASE_URL?.replace(/^https?:\/\//, '').replace(/\/$/, '');

  if (!auth0Domain) {
    throw new Error('AUTH0_ISSUER_BASE_URL is required');
  }

  // Try M2M credentials first (more secure)
  const m2mClientId = process.env.AUTH0_M2M_CLIENT_ID;
  const m2mClientSecret = process.env.AUTH0_M2M_CLIENT_SECRET;

  if (m2mClientId && m2mClientSecret) {
    log('Using M2M credentials for Management API access', 'info');
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
  }

  // Fallback to application credentials
  const appClientId = process.env.AUTH0_CLIENT_ID;
  const appClientSecret = process.env.AUTH0_CLIENT_SECRET;

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

async function fetchApplicationSettings(accessToken) {
  const auth0Domain = process.env.AUTH0_ISSUER_BASE_URL?.replace(/^https?:\/\//, '').replace(/\/$/, '');
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

async function updateApplicationSettings(accessToken, updates) {
  const auth0Domain = process.env.AUTH0_ISSUER_BASE_URL?.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const clientId = process.env.AUTH0_CLIENT_ID;

  if (!auth0Domain || !clientId) {
    throw new Error('AUTH0_ISSUER_BASE_URL and AUTH0_CLIENT_ID are required');
  }

  const postData = JSON.stringify(updates);

  const options = {
    hostname: auth0Domain,
    path: `/api/v2/clients/${clientId}`,
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  const result = await httpsRequest(options, postData);
  return result.data;
}

function isValidUrl(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function isPlaceholder(url) {
  if (!url || typeof url !== 'string') {
    return true;
  }
  const placeholderPatterns = [
    /yourdomain/i,
    /example\.com/i,
    /\{tenant\}/i,
    /placeholder/i,
    /^https?:\/\/$/,
    /^https?:\/\/\s*$/,
  ];
  return placeholderPatterns.some(pattern => pattern.test(url));
}

async function main() {
  try {
    loadEnvFile();

    log('🔧 Updating Auth0 Application Configuration...\n', 'info');
    log(`Application Client ID: ${process.env.AUTH0_CLIENT_ID}`, 'info');
    log(`Auth0 Domain: ${process.env.AUTH0_ISSUER_BASE_URL}`, 'info');
    log('');

    // Get access token
    log('🔐 Authenticating with Auth0 Management API...', 'info');
    let accessToken;
    try {
      accessToken = await getAccessToken();
      log('✅ Successfully authenticated', 'success');
    } catch (error) {
      log(`❌ Authentication failed: ${error.message}`, 'error');
      log('\n💡 Make sure you have:', 'info');
      log('   - M2M credentials with update:clients scope (recommended)', 'info');
      log('   - OR application credentials with update:clients scope', 'info');
      log('\n📚 See: docs/AUTH0_MANAGEMENT_API_SETUP.md for setup instructions', 'info');
      process.exit(1);
    }

    // Fetch current settings
    log('\n📥 Fetching current application settings...', 'info');
    let currentSettings;
    try {
      currentSettings = await fetchApplicationSettings(accessToken);
      log(`✅ Retrieved settings for: ${currentSettings.name || currentSettings.client_id}`, 'success');
    } catch (error) {
      if (error.message.includes('insufficient_scope') || error.message.includes('403')) {
        log('\n❌ Management API Access Denied', 'error');
        log('The credentials used do not have the required scopes.', 'error');
        log('\n💡 Required scopes:', 'info');
        log('   - read:clients (to read current settings)', 'info');
        log('   - update:clients (to update settings)', 'info');
        log('\n📚 See: docs/AUTH0_MANAGEMENT_API_SETUP.md for setup instructions', 'info');
        process.exit(1);
      }
      throw error;
    }

    // Prepare updates
    log('\n📋 Preparing configuration updates...', 'info');

    // Filter out placeholder URLs from current settings
    const validWebOrigins = (currentSettings.web_origins || []).filter(
      url => isValidUrl(url) && !isPlaceholder(url),
    );
    const validCallbacks = (currentSettings.callbacks || []).filter(
      url => isValidUrl(url) && !isPlaceholder(url),
    );
    const validLogoutUrls = (currentSettings.allowed_logout_urls || []).filter(
      url => isValidUrl(url) && !isPlaceholder(url),
    );

    // Merge with expected URLs (remove duplicates, keep order)
    const finalWebOrigins = [
      ...new Set([...EXPECTED_WEB_ORIGINS, ...validWebOrigins]),
    ].filter(url => isValidUrl(url) && !isPlaceholder(url));

    const finalCallbacks = [
      ...new Set([...EXPECTED_CALLBACK_URLS, ...validCallbacks]),
    ].filter(url => isValidUrl(url) && !isPlaceholder(url));

    const finalLogoutUrls = [
      ...new Set([...EXPECTED_LOGOUT_URLS, ...validLogoutUrls]),
    ].filter(url => isValidUrl(url) && !isPlaceholder(url));

    // Show what will be updated
    log('\n📊 Configuration Summary:', 'info');
    log(`\n🌐 Web Origins: ${finalWebOrigins.length} URLs`, 'info');
    finalWebOrigins.forEach((url, i) => {
      log(`   [${i}] ${url}`, 'info');
    });

    log(`\n🔗 Callback URLs: ${finalCallbacks.length} URLs`, 'info');
    finalCallbacks.forEach((url, i) => {
      log(`   [${i}] ${url}`, 'info');
    });

    log(`\n🚪 Logout URLs: ${finalLogoutUrls.length} URLs`, 'info');
    finalLogoutUrls.forEach((url, i) => {
      log(`   [${i}] ${url}`, 'info');
    });

    log(`\n🔐 Application Login URI: ${APPLICATION_LOGIN_URI}`, 'info');

    // Check for changes
    const webOriginsChanged =
      JSON.stringify(finalWebOrigins.sort()) !== JSON.stringify((currentSettings.web_origins || []).sort());
    const callbacksChanged =
      JSON.stringify(finalCallbacks.sort()) !== JSON.stringify((currentSettings.callbacks || []).sort());
    const logoutUrlsChanged =
      JSON.stringify(finalLogoutUrls.sort()) !==
      JSON.stringify((currentSettings.allowed_logout_urls || []).sort());
    const loginUriChanged = currentSettings.initiate_login_uri !== APPLICATION_LOGIN_URI;

    if (!webOriginsChanged && !callbacksChanged && !logoutUrlsChanged && !loginUriChanged) {
      log('\n✅ Configuration is already up to date!', 'success');
      process.exit(0);
    }

    // Show what will change
    log('\n📝 Changes to apply:', 'info');
    if (webOriginsChanged) {
      log('   - Web Origins will be updated', 'warn');
    }
    if (callbacksChanged) {
      log('   - Callback URLs will be updated', 'warn');
    }
    if (logoutUrlsChanged) {
      log('   - Logout URLs will be updated', 'warn');
    }
    if (loginUriChanged) {
      log('   - Application Login URI will be updated', 'warn');
    }

    // Update settings
    log('\n💾 Updating Auth0 application settings...', 'info');
    const updates = {
      web_origins: finalWebOrigins,
      callbacks: finalCallbacks,
      allowed_logout_urls: finalLogoutUrls,
      initiate_login_uri: APPLICATION_LOGIN_URI,
    };

    try {
      await updateApplicationSettings(accessToken, updates);
      log('✅ Successfully updated Auth0 application settings!', 'success');
      log('\n⏳ Please wait 1-2 minutes for changes to propagate...', 'info');
      log('\n🧪 Test sign-in:', 'info');
      log('   Production: https://www.prepflow.org', 'info');
      log('   Localhost: http://localhost:3000', 'info');
    } catch (error) {
      if (error.message.includes('insufficient_scope') || error.message.includes('403')) {
        log('\n❌ Update Failed: Insufficient Permissions', 'error');
        log('The credentials used do not have the "update:clients" scope.', 'error');
        log('\n💡 Solution:', 'info');
        log('   1. Go to Auth0 Dashboard → APIs → Auth0 Management API', 'info');
        log('   2. Find your M2M application (or authorize your regular app)', 'info');
        log('   3. Grant "update:clients" scope', 'info');
        log('   4. Wait 1-2 minutes for changes to propagate', 'info');
        log('   5. Run this script again', 'info');
        log('\n📚 See: docs/AUTH0_MANAGEMENT_API_SETUP.md for detailed instructions', 'info');
        process.exit(1);
      }
      throw error;
    }
  } catch (error) {
    log(`\n❌ Error: ${error.message}`, 'error');
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();

