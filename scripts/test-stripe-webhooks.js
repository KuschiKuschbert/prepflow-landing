#!/usr/bin/env node

/**
 * Test script for Stripe webhook handlers.
 * Uses Stripe CLI or mock events to test webhook processing.
 *
 * Usage:
 *   node scripts/test-stripe-webhooks.js
 *
 * Requires:
 *   - Stripe CLI installed and logged in
 *   - Local server running on localhost:3000
 *   - Environment variables configured
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const WEBHOOK_ENDPOINT = 'http://localhost:3000/api/webhook/stripe';

/**
 * Test webhook event using Stripe CLI
 */
function testWebhookEvent(eventType) {
  console.log(`\n🧪 Testing ${eventType}...`);

  try {
    const output = execSync(`stripe trigger ${eventType}`, {
      encoding: 'utf-8',
      stdio: 'pipe',
    });

    console.log(`✅ ${eventType} triggered successfully`);
    console.log(output);

    // Wait a moment for webhook to process
    setTimeout(() => {
      console.log(`⏳ Webhook should have been processed. Check logs for results.`);
    }, 2000);
  } catch (error) {
    console.error(`❌ Failed to trigger ${eventType}:`, error.message);
  }
}

/**
 * Validate webhook endpoint is accessible
 */
function validateEndpoint() {
  console.log('🔍 Validating webhook endpoint...');

  try {
    const response = execSync(`curl -s -o /dev/null -w "%{http_code}" ${WEBHOOK_ENDPOINT}`, {
      encoding: 'utf-8',
    });

    if (response.trim() === '400') {
      console.log('✅ Webhook endpoint is accessible (400 expected for GET request)');
      return true;
    } else {
      console.log(`⚠️  Unexpected response: ${response}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Webhook endpoint not accessible:`, error.message);
    console.log(`   Make sure your local server is running on ${WEBHOOK_ENDPOINT}`);
    return false;
  }
}

/**
 * Check if Stripe CLI is installed
 */
function checkStripeCLI() {
  try {
    execSync('stripe --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Main test function
 */
function main() {
  console.log('🚀 Stripe Webhook Testing Script\n');

  // Check prerequisites
  if (!checkStripeCLI()) {
    console.error('❌ Stripe CLI not found. Install it with:');
    console.error('   brew install stripe/stripe-cli/stripe');
    console.error('   or visit: https://stripe.com/docs/stripe-cli');
    process.exit(1);
  }

  // Validate endpoint
  if (!validateEndpoint()) {
    console.error('\n❌ Webhook endpoint validation failed. Please fix and try again.');
    process.exit(1);
  }

  console.log('\n📋 Testing webhook events...\n');

  // Test events in order
  const events = [
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'invoice.payment_succeeded',
    'invoice.payment_failed',
    'customer.subscription.deleted',
  ];

  events.forEach((eventType, index) => {
    if (index > 0) {
      // Wait between events
      setTimeout(() => {
        testWebhookEvent(eventType);
      }, index * 3000);
    } else {
      testWebhookEvent(eventType);
    }
  });

  console.log('\n✅ Webhook testing complete!');
  console.log('\n📝 Next steps:');
  console.log('   1. Check webhook_events table for processing status');
  console.log('   2. Verify users table was updated correctly');
  console.log('   3. Check notifications were created');
  console.log('   4. Review logs for any errors');
}

if (require.main === module) {
  main();
}

module.exports = { testWebhookEvent, validateEndpoint };




