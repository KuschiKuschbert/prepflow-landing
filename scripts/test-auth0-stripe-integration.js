#!/usr/bin/env node

/**
 * Comprehensive Auth0 & Stripe Integration Test Script
 * Tests all integration points and logs detailed results
 */

const https = require('https');
const http = require('http');

// Prefer AUTH0_BASE_URL, fall back to NEXTAUTH_URL for backward compatibility
const BASE_URL = process.env.AUTH0_BASE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const AUTH0_ISSUER_BASE_URL = process.env.AUTH0_ISSUER_BASE_URL;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;

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

async function checkEndpoint(url, expectedStatus = 200) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, res => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        const expectedStatuses = Array.isArray(expectedStatus) ? expectedStatus : [expectedStatus];
        if (expectedStatuses.includes(res.statusCode)) {
          resolve({ status: res.statusCode, data });
        } else {
          reject(
            new Error(`Expected one of ${expectedStatuses.join(', ')}, got ${res.statusCode}`),
          );
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function testEnvironmentVariables() {
  log('Testing Environment Variables...', 'info');
  console.log('');

  const requiredVars = {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    STRIPE_WEBHOOK_SECRET_DEV: process.env.STRIPE_WEBHOOK_SECRET_DEV,
    STRIPE_WEBHOOK_SECRET_PROD: process.env.STRIPE_WEBHOOK_SECRET_PROD,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_PRICE_STARTER_MONTHLY: process.env.STRIPE_PRICE_STARTER_MONTHLY,
    STRIPE_PRICE_PRO_MONTHLY: process.env.STRIPE_PRICE_PRO_MONTHLY,
    STRIPE_PRICE_BUSINESS_MONTHLY: process.env.STRIPE_PRICE_BUSINESS_MONTHLY,
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
      const masked =
        key.includes('SECRET') || key.includes('KEY') ? `${value.substring(0, 8)}...` : value;
      const deprecated = key.startsWith('NEXTAUTH_') ? ' (deprecated)' : '';
      log(`${key}: ${masked}${deprecated}`, deprecated ? 'warning' : 'success');
    } else if (key.startsWith('NEXTAUTH_')) {
      // NEXTAUTH_* vars are optional (deprecated)
      log(`${key}: Not set (using AUTH0_* equivalent)`, 'info');
    } else {
      log(`${key}: MISSING`, 'error');
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

  console.log('');
  return allPresent;
}

async function testServerRunning() {
  log('Testing Server Availability...', 'info');
  console.log('');

  // Try multiple endpoints to check if server is running
  const endpoints = ['/', '/api/auth/providers', '/api/auth/session'];
  let serverRunning = false;

  for (const endpoint of endpoints) {
    try {
      await checkEndpoint(`${BASE_URL}${endpoint}`, [200, 401, 302]); // Accept various status codes
      log(`Server is running at ${BASE_URL}`, 'success');
      serverRunning = true;
      break;
    } catch (error) {
      // Continue to next endpoint
    }
  }

  if (!serverRunning) {
    log(`Server not responding at ${BASE_URL}`, 'error');
    log('Please start the dev server: npm run dev', 'warning');
  }

  return serverRunning;
}

async function testAuth0Endpoints() {
  log('Testing Auth0 Endpoints...', 'info');
  console.log('');

  const endpoints = [
    { path: '/api/auth/signin', description: 'Auth0 Sign In Page' },
    { path: '/api/auth/providers', description: 'Auth0 Providers' },
    { path: '/api/auth/session', description: 'Auth0 Session' },
  ];

  for (const endpoint of endpoints) {
    try {
      await checkEndpoint(`${BASE_URL}${endpoint.path}`, 200);
      log(`${endpoint.description}: OK`, 'success');
    } catch (error) {
      log(`${endpoint.description}: ${error.message}`, 'error');
    }
  }
}

async function testStripeEndpoints() {
  log('Testing Stripe Endpoints (Authentication Required)...', 'info');
  console.log('');

  const endpoints = [
    { path: '/api/billing/create-checkout-session', method: 'POST', requiresAuth: true },
    { path: '/api/billing/create-portal-session', method: 'POST', requiresAuth: true },
  ];

  for (const endpoint of endpoints) {
    try {
      // Test without auth (should return 401)
      const response = await fetch(`${BASE_URL}${endpoint.path}`, {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 401) {
        log(`${endpoint.path}: Correctly requires authentication`, 'success');
      } else if (response.status === 501) {
        log(`${endpoint.path}: Stripe not configured`, 'warning');
      } else {
        log(`${endpoint.path}: Unexpected status ${response.status}`, 'warning');
      }
    } catch (error) {
      log(`${endpoint.path}: ${error.message}`, 'error');
    }
  }
}

async function testWebhookEndpoint() {
  log('Testing Webhook Endpoint...', 'info');
  console.log('');

  try {
    // Webhook should return 400 without signature
    const response = await fetch(`${BASE_URL}/api/webhook/stripe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'test' }),
    });

    if (response.status === 400) {
      log('Webhook endpoint: Correctly requires signature', 'success');
    } else if (response.status === 501) {
      log('Webhook endpoint: Stripe not configured', 'warning');
    } else {
      log(`Webhook endpoint: Unexpected status ${response.status}`, 'warning');
    }
  } catch (error) {
    log(`Webhook endpoint: ${error.message}`, 'error');
  }
}

async function testDatabaseTables() {
  log('Testing Database Tables...', 'info');
  console.log('');

  // This would require database access, so we'll just check if the migrations exist
  const fs = require('fs');
  const path = require('path');

  const requiredMigrations = [
    'add-stripe-subscription-fields.sql',
    'enhance-billing-customers.sql',
    'add-webhook-events-table.sql',
    'add-user-notifications-table.sql',
    'add-subscription-tier.sql',
  ];

  const migrationsPath = path.join(process.cwd(), 'migrations');
  let allPresent = true;

  for (const migration of requiredMigrations) {
    const filePath = path.join(migrationsPath, migration);
    if (fs.existsSync(filePath)) {
      log(`Migration ${migration}: Found`, 'success');
    } else {
      log(`Migration ${migration}: MISSING`, 'error');
      allPresent = false;
    }
  }

  return allPresent;
}

async function testStripeAPI() {
  log('Testing Stripe API Connection...', 'info');
  console.log('');

  const stripeKey = process.env.STRIPE_SECRET_KEY || STRIPE_SECRET_KEY;
  if (!stripeKey) {
    log('Stripe secret key not found, skipping API test', 'warning');
    return false;
  }

  try {
    const Stripe = require('stripe');
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2025-11-17.clover',
    });

    // Test API connection
    const account = await stripe.accounts.retrieve();
    log(`Stripe API: Connected (Account: ${account.id})`, 'success');

    // Test price IDs
    const priceIds = {
      starter: process.env.STRIPE_PRICE_STARTER_MONTHLY,
      pro: process.env.STRIPE_PRICE_PRO_MONTHLY,
      business: process.env.STRIPE_PRICE_BUSINESS_MONTHLY,
    };

    for (const [tier, priceId] of Object.entries(priceIds)) {
      if (priceId) {
        try {
          const price = await stripe.prices.retrieve(priceId);
          log(`Price ID ${tier}: Valid (${price.unit_amount / 100} ${price.currency})`, 'success');
        } catch (error) {
          log(`Price ID ${tier}: Invalid - ${error.message}`, 'error');
        }
      } else {
        log(`Price ID ${tier}: Not configured`, 'warning');
      }
    }

    return true;
  } catch (error) {
    log(`Stripe API: ${error.message}`, 'error');
    return false;
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

async function runAllTests() {
  console.log('='.repeat(80));
  console.log('Auth0 & Stripe Integration Test Suite');
  console.log('='.repeat(80));
  console.log('');

  // Load environment variables from .env.local
  loadEnvFile();

  // Run tests
  await testEnvironmentVariables();
  console.log('');

  const serverRunning = await testServerRunning();
  console.log('');

  if (serverRunning) {
    await testAuth0Endpoints();
    console.log('');

    await testStripeEndpoints();
    console.log('');

    await testWebhookEndpoint();
    console.log('');
  }

  await testDatabaseTables();
  console.log('');

  await testStripeAPI();
  console.log('');

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

  const exitCode = testResults.failed.length > 0 ? 1 : 0;
  process.exit(exitCode);
}

// Run tests
runAllTests().catch(error => {
  console.error('Test suite failed:', error);
  process.exit(1);
});
