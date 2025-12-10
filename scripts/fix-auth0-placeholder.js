#!/usr/bin/env node

/**
 * Fix Auth0 Placeholder URL Issue
 *
 * This script removes placeholder URLs from Auth0 application settings
 * and ensures only valid URLs are configured.
 *
 * Usage: node scripts/fix-auth0-placeholder.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

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

async function main() {
  try {
    loadEnvFile();

    log('🔧 Fixing Auth0 Placeholder URL Issue...\n', 'info');
    log('Application Client ID: ' + process.env.AUTH0_CLIENT_ID, 'info');
    log('Auth0 Domain: ' + process.env.AUTH0_ISSUER_BASE_URL, 'info');
    log('');

    const accessToken = await getAccessToken();
    const currentSettings = await fetchApplicationSettings(accessToken);

    log('📋 Current Configuration:\n', 'info');

    // Filter out placeholder URLs
    const validWebOrigins = (currentSettings.web_origins || []).filter(
      url => isValidUrl(url) && !isPlaceholder(url),
    );
    const validCallbacks = (currentSettings.callbacks || []).filter(
      url => isValidUrl(url) && !isPlaceholder(url),
    );
    const validLogoutUrls = (currentSettings.allowed_logout_urls || []).filter(
      url => isValidUrl(url) && !isPlaceholder(url),
    );

    // Expected URLs
    const expectedWebOrigins = [
      'https://prepflow.org',
      'https://www.prepflow.org',
      'http://localhost:3000',
      'http://localhost:3001',
    ];

    const expectedCallbacks = [
      'https://prepflow.org/api/auth/callback/auth0',
      'https://www.prepflow.org/api/auth/callback/auth0',
      'http://localhost:3000/api/auth/callback/auth0',
      'http://localhost:3001/api/auth/callback/auth0',
    ];

    const expectedLogoutUrls = [
      'http://localhost:3000',
      'http://localhost:3000/',
      'http://localhost:3001',
      'http://localhost:3001/',
      'https://prepflow.org',
      'https://prepflow.org/',
      'https://www.prepflow.org',
      'https://www.prepflow.org/',
    ];

    // Merge valid existing URLs with expected URLs (remove duplicates)
    const finalWebOrigins = [
      ...new Set([...validWebOrigins, ...expectedWebOrigins]),
    ].filter(url => isValidUrl(url) && !isPlaceholder(url));

    const finalCallbacks = [
      ...new Set([...validCallbacks, ...expectedCallbacks]),
    ].filter(url => isValidUrl(url) && !isPlaceholder(url));

    const finalLogoutUrls = [
      ...new Set([...validLogoutUrls, ...expectedLogoutUrls]),
    ].filter(url => isValidUrl(url) && !isPlaceholder(url));

    log('🌐 Web Origins:', 'info');
    log(`  Current: ${currentSettings.web_origins?.length || 0} entries`, 'info');
    log(`  Valid: ${validWebOrigins.length} entries`, 'info');
    log(`  Placeholders removed: ${(currentSettings.web_origins?.length || 0) - validWebOrigins.length}`, 'warn');
    log(`  Final: ${finalWebOrigins.length} entries`, 'success');
    finalWebOrigins.forEach((url, i) => {
      log(`    [${i}] ${url}`, 'info');
    });
    log('');

    log('🔗 Callback URLs:', 'info');
    log(`  Current: ${currentSettings.callbacks?.length || 0} entries`, 'info');
    log(`  Valid: ${validCallbacks.length} entries`, 'info');
    log(`  Placeholders removed: ${(currentSettings.callbacks?.length || 0) - validCallbacks.length}`, 'warn');
    log(`  Final: ${finalCallbacks.length} entries`, 'success');
    finalCallbacks.forEach((url, i) => {
      log(`    [${i}] ${url}`, 'info');
    });
    log('');

    log('🚪 Logout URLs:', 'info');
    log(`  Current: ${currentSettings.allowed_logout_urls?.length || 0} entries`, 'info');
    log(`  Valid: ${validLogoutUrls.length} entries`, 'info');
    log(`  Placeholders removed: ${(currentSettings.allowed_logout_urls?.length || 0) - validLogoutUrls.length}`, 'warn');
    log(`  Final: ${finalLogoutUrls.length} entries`, 'success');
    finalLogoutUrls.forEach((url, i) => {
      log(`    [${i}] ${url}`, 'info');
    });
    log('');

    // Update Auth0 application settings
    log('💾 Updating Auth0 application settings...', 'info');
    const updates = {
      web_origins: finalWebOrigins,
      callbacks: finalCallbacks,
      allowed_logout_urls: finalLogoutUrls,
    };

    await updateApplicationSettings(accessToken, updates);

    log('✅ Successfully updated Auth0 application settings!', 'success');
    log('⏳ Please wait 1-2 minutes for changes to propagate...', 'info');
    log('');
    log('🧪 Test sign-in:', 'info');
    log('  Production: https://www.prepflow.org', 'info');
    log('  Localhost: http://localhost:3000', 'info');
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'error');
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();

