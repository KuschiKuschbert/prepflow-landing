#!/usr/bin/env node

/**
 * Update Auth0 Application Callback URLs for Auth0 SDK
 * Uses Auth0 SDK callback format: /api/auth/callback (not /api/auth/callback/auth0)
 *
 * Usage:
 *   node scripts/update-auth0-sdk-callbacks.js
 *
 * Environment Variables Required:
 *   AUTH0_ISSUER_BASE_URL - Auth0 domain
 *   AUTH0_CLIENT_ID - Application Client ID
 *   AUTH0_CLIENT_SECRET - Application Client Secret
 *   AUTH0_BASE_URL - Base URL (e.g., https://www.prepflow.org)
 */

const https = require('https');

// Required callback URLs for Auth0 SDK
const REQUIRED_CALLBACKS = [
  'https://www.prepflow.org/api/auth/callback',
  'https://prepflow.org/api/auth/callback',
  'http://localhost:3000/api/auth/callback',
  'http://localhost:3001/api/auth/callback',
];

const REQUIRED_LOGOUT_URLS = [
  'https://www.prepflow.org',
  'https://www.prepflow.org/',
  'https://prepflow.org',
  'https://prepflow.org/',
  'http://localhost:3000',
  'http://localhost:3000/',
  'http://localhost:3001',
  'http://localhost:3001/',
];

const REQUIRED_WEB_ORIGINS = [
  'https://www.prepflow.org',
  'https://prepflow.org',
  'http://localhost:3000',
  'http://localhost:3001',
];

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
            reject(new Error(`HTTP ${res.statusCode}: ${parsed.error || parsed.message || data}`));
          }
        } catch (e) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ data, statusCode: res.statusCode });
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        }
      });
    });

    req.on('error', error => {
      reject(error);
    });

    if (postData) {
      req.write(postData);
    }

    req.end();
  });
}

async function getAccessToken(domain, clientId, clientSecret) {
  const postData = JSON.stringify({
    client_id: clientId,
    client_secret: clientSecret,
    audience: `https://${domain}/api/v2/`,
    grant_type: 'client_credentials',
  });

  const options = {
    hostname: domain,
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

async function getApplication(accessToken, domain, clientId) {
  const options = {
    hostname: domain,
    path: `/api/v2/clients/${clientId}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const result = await httpsRequest(options);
  return result.data;
}

async function updateApplication(accessToken, domain, clientId, updates) {
  const postData = JSON.stringify(updates);

  const options = {
    hostname: domain,
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
    console.log('🔐 Updating Auth0 Callback URLs for Auth0 SDK...\n');

    const issuerBaseUrl = process.env.AUTH0_ISSUER_BASE_URL;
    const clientId = process.env.AUTH0_CLIENT_ID;
    const clientSecret = process.env.AUTH0_CLIENT_SECRET;

    if (!issuerBaseUrl || !clientId || !clientSecret) {
      console.error('❌ Missing required environment variables:');
      if (!issuerBaseUrl) console.error('   - AUTH0_ISSUER_BASE_URL');
      if (!clientId) console.error('   - AUTH0_CLIENT_ID');
      if (!clientSecret) console.error('   - AUTH0_CLIENT_SECRET');
      process.exit(1);
    }

    const domain = issuerBaseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

    console.log(`📋 Domain: ${domain}`);
    console.log(`📋 Client ID: ${clientId}\n`);

    // Get access token
    console.log('🔑 Getting Management API access token...');
    const accessToken = await getAccessToken(domain, clientId, clientSecret);
    console.log('✅ Access token obtained\n');

    // Get current application configuration
    console.log('📥 Fetching current application configuration...');
    const app = await getApplication(accessToken, domain, clientId);
    console.log('✅ Application configuration fetched\n');

    const currentCallbacks = app.callbacks || [];
    const currentLogoutUrls = app.allowed_logout_urls || [];
    const currentWebOrigins = app.web_origins || [];

    console.log('📋 Current Configuration:');
    console.log(`   Callbacks: ${currentCallbacks.length} URLs`);
    console.log(`   Logout URLs: ${currentLogoutUrls.length} URLs`);
    console.log(`   Web Origins: ${currentWebOrigins.length} URLs\n`);

    // Merge with existing URLs (avoid duplicates)
    const updatedCallbacks = [...new Set([...currentCallbacks, ...REQUIRED_CALLBACKS])];
    const updatedLogoutUrls = [...new Set([...currentLogoutUrls, ...REQUIRED_LOGOUT_URLS])];
    const updatedWebOrigins = [...new Set([...currentWebOrigins, ...REQUIRED_WEB_ORIGINS])];

    // Check if updates are needed
    const callbacksChanged =
      JSON.stringify(updatedCallbacks.sort()) !== JSON.stringify(currentCallbacks.sort());
    const logoutUrlsChanged =
      JSON.stringify(updatedLogoutUrls.sort()) !== JSON.stringify(currentLogoutUrls.sort());
    const webOriginsChanged =
      JSON.stringify(updatedWebOrigins.sort()) !== JSON.stringify(currentWebOrigins.sort());

    if (!callbacksChanged && !logoutUrlsChanged && !webOriginsChanged) {
      console.log('✅ Configuration is already up to date!');
      console.log('\n📋 Current URLs:');
      console.log('   Callbacks:', updatedCallbacks.join(', '));
      console.log('   Logout URLs:', updatedLogoutUrls.join(', '));
      console.log('   Web Origins:', updatedWebOrigins.join(', '));
      process.exit(0);
    }

    // Show what will change
    console.log('📝 Changes to apply:');
    if (callbacksChanged) {
      const added = REQUIRED_CALLBACKS.filter(url => !currentCallbacks.includes(url));
      console.log(`   ✅ Callbacks: Adding ${added.length} new URL(s)`);
      added.forEach(url => console.log(`      + ${url}`));
    }
    if (logoutUrlsChanged) {
      const added = REQUIRED_LOGOUT_URLS.filter(url => !currentLogoutUrls.includes(url));
      console.log(`   ✅ Logout URLs: Adding ${added.length} new URL(s)`);
      added.forEach(url => console.log(`      + ${url}`));
    }
    if (webOriginsChanged) {
      const added = REQUIRED_WEB_ORIGINS.filter(url => !currentWebOrigins.includes(url));
      console.log(`   ✅ Web Origins: Adding ${added.length} new URL(s)`);
      added.forEach(url => console.log(`      + ${url}`));
    }
    console.log();

    // Update application
    console.log('💾 Updating Auth0 application configuration...');
    await updateApplication(accessToken, domain, clientId, {
      callbacks: updatedCallbacks,
      allowed_logout_urls: updatedLogoutUrls,
      web_origins: updatedWebOrigins,
    });

    console.log('✅ Auth0 configuration updated successfully!\n');

    console.log('📋 Updated Configuration:');
    console.log(`   Callbacks: ${updatedCallbacks.length} URLs`);
    updatedCallbacks.forEach(url => console.log(`      - ${url}`));
    console.log(`   Logout URLs: ${updatedLogoutUrls.length} URLs`);
    updatedLogoutUrls.forEach(url => console.log(`      - ${url}`));
    console.log(`   Web Origins: ${updatedWebOrigins.length} URLs`);
    updatedWebOrigins.forEach(url => console.log(`      - ${url}`));
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.message.includes('401') || error.message.includes('403')) {
      console.error('   Authentication failed. Check your AUTH0_CLIENT_ID and AUTH0_CLIENT_SECRET');
    } else if (error.message.includes('404')) {
      console.error('   Application not found. Check your AUTH0_CLIENT_ID');
    }
    process.exit(1);
  }
}

main();
