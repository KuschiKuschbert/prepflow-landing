#!/usr/bin/env node

/**
 * Show Current Auth0 Configuration
 * Displays what URLs are actually configured in Auth0 (for debugging)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

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

function httpsRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ statusCode: res.statusCode, data: JSON.parse(data) });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
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
  const auth0Domain = process.env.AUTH0_ISSUER_BASE_URL?.replace(/^https?:\/\//, '').replace(
    /\/$/,
    '',
  );
  const appClientId = process.env.AUTH0_CLIENT_ID;
  const appClientSecret = process.env.AUTH0_CLIENT_SECRET;
  const m2mClientId = process.env.AUTH0_M2M_CLIENT_ID;
  const m2mClientSecret = process.env.AUTH0_M2M_CLIENT_SECRET;

  if (!auth0Domain) {
    throw new Error('AUTH0_ISSUER_BASE_URL is required');
  }

  // Try M2M credentials first
  if (m2mClientId && m2mClientSecret) {
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
      console.log('M2M credentials failed, trying application credentials...');
    }
  }

  // Fallback to application credentials
  if (appClientId && appClientSecret) {
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

  throw new Error('No valid credentials found');
}

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

async function main() {
  try {
    loadEnvFile();

    console.log('\n🔍 Fetching Current Auth0 Configuration...\n');
    console.log('Application Client ID:', process.env.AUTH0_CLIENT_ID);
    console.log('Auth0 Domain:', process.env.AUTH0_ISSUER_BASE_URL);
    console.log('');

    const accessToken = await getAccessToken();
    const appSettings = await fetchApplicationSettings(accessToken);

    console.log('📋 Current Configuration:\n');
    console.log('Application Name:', appSettings.name || 'N/A');
    console.log('Application Type:', appSettings.app_type || 'N/A');
    console.log('');

    console.log('🌐 Allowed Web Origins:');
    if (appSettings.web_origins && appSettings.web_origins.length > 0) {
      appSettings.web_origins.forEach((url, i) => {
        console.log(`  [${i}] ${url}`);
      });
    } else {
      console.log('  (none configured)');
    }
    console.log('');

    console.log('🔗 Allowed Callback URLs:');
    if (appSettings.callbacks && appSettings.callbacks.length > 0) {
      appSettings.callbacks.forEach((url, i) => {
        console.log(`  [${i}] ${url}`);
      });
    } else {
      console.log('  (none configured)');
    }
    console.log('');

    console.log('🚪 Allowed Logout URLs:');
    if (appSettings.allowed_logout_urls && appSettings.allowed_logout_urls.length > 0) {
      appSettings.allowed_logout_urls.forEach((url, i) => {
        console.log(`  [${i}] ${url}`);
      });
    } else {
      console.log('  (none configured)');
    }
    console.log('');

    console.log('💡 Expected URLs:\n');
    console.log('Web Origins (4 required):');
    console.log('  - https://prepflow.org');
    console.log('  - https://www.prepflow.org');
    console.log('  - http://localhost:3000');
    console.log('  - http://localhost:3001');
    console.log('');
    console.log('Callback URLs (4 required):');
    console.log('  - https://prepflow.org/api/auth/callback/auth0');
    console.log('  - https://www.prepflow.org/api/auth/callback/auth0');
    console.log('  - http://localhost:3000/api/auth/callback/auth0');
    console.log('  - http://localhost:3001/api/auth/callback/auth0');
    console.log('');
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('insufficient_scope')) {
      console.error('\n💡 You need Management API access. See docs/AUTH0_MANAGEMENT_API_SETUP.md');
    }
    process.exit(1);
  }
}

main();
