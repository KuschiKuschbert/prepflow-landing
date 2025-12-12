#!/usr/bin/env node

/**
 * Validate Stripe setup by checking environment variables and testing Stripe API connection
 */

const fs = require('fs');
const path = require('path');

// Try to load Stripe (will fail if not installed, but that's okay)
let Stripe;
try {
  Stripe = require('stripe');
} catch (e) {
  console.error('❌ Stripe package not found. Run: npm install stripe');
  process.exit(1);
}

const ENV_LOCAL_PATH = path.join(process.cwd(), '.env.local');

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const vars = {};

  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        vars[key] = value;
      }
    }
  });

  return vars;
}

function validateKeyFormat(key, prefix, name) {
  if (
    !key ||
    key === '' ||
    key.includes('your_') ||
    key.includes('sk_test_your') ||
    key.includes('whsec_your')
  ) {
    return { valid: false, error: 'Missing or placeholder value' };
  }
  if (!key.startsWith(prefix)) {
    return { valid: false, error: `Must start with ${prefix}` };
  }
  return { valid: true };
}

function validatePriceId(priceId, name) {
  if (!priceId || priceId === '' || priceId.includes('your_')) {
    return { valid: false, error: 'Missing or placeholder value' };
  }
  if (!priceId.startsWith('price_')) {
    return { valid: false, error: 'Must start with price_' };
  }
  return { valid: true };
}

async function testStripeConnection(secretKey) {
  try {
    const stripe = new Stripe(secretKey, { apiVersion: '2025-11-17.clover' });
    // Test connection by retrieving account info
    const account = await stripe.accounts.retrieve();
    return {
      success: true,
      accountId: account.id,
      livemode: account.livemode,
      country: account.country,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

async function validatePriceIds(stripe, priceIds) {
  const results = {};

  for (const [tier, priceId] of Object.entries(priceIds)) {
    if (!priceId || priceId === '') {
      results[tier] = { valid: false, error: 'Missing price ID' };
      continue;
    }

    try {
      const price = await stripe.prices.retrieve(priceId);
      const product = await stripe.products.retrieve(price.product);

      // Check if it's recurring
      if (price.type !== 'recurring') {
        results[tier] = {
          valid: false,
          error: 'Price is not a recurring subscription',
          details: { type: price.type },
        };
        continue;
      }

      // Check if it's monthly
      if (price.recurring?.interval !== 'month') {
        results[tier] = {
          valid: false,
          error: `Price interval is ${price.recurring?.interval}, expected 'month'`,
          details: { interval: price.recurring?.interval },
        };
        continue;
      }

      results[tier] = {
        valid: true,
        productName: product.name,
        amount: price.unit_amount ? (price.unit_amount / 100).toFixed(2) : 'N/A',
        currency: price.currency.toUpperCase(),
        interval: price.recurring.interval,
      };
    } catch (error) {
      if (error.code === 'resource_missing') {
        results[tier] = { valid: false, error: 'Price ID not found in Stripe' };
      } else {
        results[tier] = { valid: false, error: error.message };
      }
    }
  }

  return results;
}

async function main() {
  console.log('🔍 Validating Stripe Setup...\n');

  // Read environment variables
  const env = readEnvFile(ENV_LOCAL_PATH);

  // Check required variables
  const requiredVars = {
    STRIPE_SECRET_KEY: env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: env.STRIPE_WEBHOOK_SECRET,
    STRIPE_PRICE_STARTER_MONTHLY: env.STRIPE_PRICE_STARTER_MONTHLY,
    STRIPE_PRICE_PRO_MONTHLY: env.STRIPE_PRICE_PRO_MONTHLY,
    STRIPE_PRICE_BUSINESS_MONTHLY: env.STRIPE_PRICE_BUSINESS_MONTHLY,
  };

  console.log('📋 Environment Variables Check:\n');

  let allValid = true;

  // Validate STRIPE_SECRET_KEY
  const secretKeyValidation = validateKeyFormat(
    requiredVars.STRIPE_SECRET_KEY,
    'sk_',
    'STRIPE_SECRET_KEY',
  );
  if (secretKeyValidation.valid) {
    console.log('  ✅ STRIPE_SECRET_KEY: Valid format');
  } else {
    console.log(`  ❌ STRIPE_SECRET_KEY: ${secretKeyValidation.error}`);
    allValid = false;
  }

  // Validate STRIPE_WEBHOOK_SECRET
  const webhookValidation = validateKeyFormat(
    requiredVars.STRIPE_WEBHOOK_SECRET,
    'whsec_',
    'STRIPE_WEBHOOK_SECRET',
  );
  if (webhookValidation.valid) {
    console.log('  ✅ STRIPE_WEBHOOK_SECRET: Valid format');
  } else {
    console.log(`  ❌ STRIPE_WEBHOOK_SECRET: ${webhookValidation.error}`);
    allValid = false;
  }

  // Validate Price IDs format
  const priceIds = {
    Starter: requiredVars.STRIPE_PRICE_STARTER_MONTHLY,
    Pro: requiredVars.STRIPE_PRICE_PRO_MONTHLY,
    Business: requiredVars.STRIPE_PRICE_BUSINESS_MONTHLY,
  };

  console.log('\n📦 Price IDs Format Check:\n');
  for (const [tier, priceId] of Object.entries(priceIds)) {
    const validation = validatePriceId(priceId, tier);
    if (validation.valid) {
      console.log(`  ✅ ${tier}: Valid format (${priceId.substring(0, 20)}...)`);
    } else {
      console.log(`  ❌ ${tier}: ${validation.error}`);
      allValid = false;
    }
  }

  if (!allValid) {
    console.log('\n⚠️  Some environment variables are missing or invalid.');
    console.log('   Please complete the setup before testing Stripe connection.\n');
    console.log('   Run: npm run stripe:setup');
    console.log('   See: docs/STRIPE_SETUP_CHECKLIST.md\n');
    process.exit(1);
  }

  // Test Stripe API connection
  console.log('\n🔌 Testing Stripe API Connection...\n');
  const connectionTest = await testStripeConnection(requiredVars.STRIPE_SECRET_KEY);

  if (!connectionTest.success) {
    console.log(`  ❌ Connection failed: ${connectionTest.error}\n`);
    console.log('   Please check your STRIPE_SECRET_KEY.\n');
    process.exit(1);
  }

  console.log('  ✅ Stripe API connection successful!');
  console.log(`     Account ID: ${connectionTest.accountId}`);
  console.log(`     Mode: ${connectionTest.livemode ? 'LIVE' : 'TEST'}`);
  console.log(`     Country: ${connectionTest.country}\n`);

  // Validate Price IDs with Stripe API
  console.log('🔍 Validating Price IDs with Stripe API...\n');
  const stripe = new Stripe(requiredVars.STRIPE_SECRET_KEY, {
    apiVersion: '2025-11-17.clover',
  });

  const priceValidation = await validatePriceIds(stripe, priceIds);

  let allPricesValid = true;
  for (const [tier, result] of Object.entries(priceValidation)) {
    if (result.valid) {
      console.log(`  ✅ ${tier}:`);
      console.log(`     Product: ${result.productName}`);
      console.log(`     Amount: ${result.currency} $${result.amount}`);
      console.log(`     Interval: ${result.interval}\n`);
    } else {
      console.log(`  ❌ ${tier}: ${result.error}`);
      if (result.details) {
        console.log(`     Details:`, result.details);
      }
      console.log('');
      allPricesValid = false;
    }
  }

  if (!allPricesValid) {
    console.log('⚠️  Some price IDs are invalid. Please check your Stripe products.\n');
    process.exit(1);
  }

  // Summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Stripe Setup Validation Complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('All environment variables are set correctly.');
  console.log('All price IDs are valid and configured as monthly recurring subscriptions.');
  console.log('Stripe API connection is working.\n');
  console.log('Next steps:');
  console.log('  1. Test checkout session creation');
  console.log('  2. Set up webhook endpoint (if not done)');
  console.log('  3. Test webhook processing\n');
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Validation error:', error.message);
    process.exit(1);
  });
}

module.exports = { validateKeyFormat, validatePriceId, testStripeConnection, validatePriceIds };




