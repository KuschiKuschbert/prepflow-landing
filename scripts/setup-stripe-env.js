#!/usr/bin/env node

/**
 * Setup Stripe environment variables in .env.local
 * This script checks for existing Stripe variables and adds missing ones
 */

const fs = require('fs');
const path = require('path');

const ENV_LOCAL_PATH = path.join(process.cwd(), '.env.local');
const ENV_EXAMPLE_PATH = path.join(process.cwd(), 'env.example');

// Required Stripe environment variables
const REQUIRED_STRIPE_VARS = [
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_PRICE_STARTER_MONTHLY',
  'STRIPE_PRICE_PRO_MONTHLY',
  'STRIPE_PRICE_BUSINESS_MONTHLY',
];

// Optional Stripe environment variables
const OPTIONAL_STRIPE_VARS = ['STRIPE_PUBLISHABLE_KEY'];

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

function writeEnvFile(filePath, vars) {
  const lines = [];
  const existingContent = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';

  // Parse existing content to preserve structure
  const sections = {};
  let currentSection = 'other';
  const sectionOrder = [];

  existingContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('#') && trimmed.includes('Configuration')) {
      const sectionName = trimmed.replace('#', '').trim().toLowerCase();
      currentSection = sectionName;
      if (!sections[currentSection]) {
        sections[currentSection] = [];
        sectionOrder.push(currentSection);
      }
      sections[currentSection].push(line);
    } else if (trimmed && !trimmed.startsWith('#')) {
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        if (!key.startsWith('STRIPE_')) {
          if (!sections[currentSection]) {
            sections[currentSection] = [];
            if (!sectionOrder.includes(currentSection)) {
              sectionOrder.push(currentSection);
            }
          }
          sections[currentSection].push(line);
        }
      } else {
        if (!sections[currentSection]) {
          sections[currentSection] = [];
          if (!sectionOrder.includes(currentSection)) {
            sectionOrder.push(currentSection);
          }
        }
        sections[currentSection].push(line);
      }
    } else {
      if (!sections[currentSection]) {
        sections[currentSection] = [];
        if (!sectionOrder.includes(currentSection)) {
          sectionOrder.push(currentSection);
        }
      }
      sections[currentSection].push(line);
    }
  });

  // Add Stripe section if it doesn't exist
  if (!sections['stripe configuration']) {
    sections['stripe configuration'] = [];
    sectionOrder.push('stripe configuration');
  }

  // Build Stripe section
  const stripeSection = ['# Stripe Configuration'];
  REQUIRED_STRIPE_VARS.forEach(key => {
    const value = vars[key] || '';
    if (value) {
      stripeSection.push(`${key}=${value}`);
    } else {
      // Get placeholder from env.example if available
      const exampleVars = readEnvFile(ENV_EXAMPLE_PATH);
      const placeholder = exampleVars[key] || '';
      stripeSection.push(`${key}=${placeholder}`);
    }
  });

  OPTIONAL_STRIPE_VARS.forEach(key => {
    const value = vars[key];
    if (value) {
      stripeSection.push(`${key}=${value}`);
    }
  });

  sections['stripe configuration'] = stripeSection;

  // Write all sections
  sectionOrder.forEach(sectionName => {
    if (sections[sectionName] && sections[sectionName].length > 0) {
      lines.push(...sections[sectionName]);
      lines.push(''); // Add blank line between sections
    }
  });

  // Remove trailing blank lines
  while (lines[lines.length - 1] === '') {
    lines.pop();
  }

  fs.writeFileSync(filePath, lines.join('\n') + '\n', 'utf-8');
}

function main() {
  console.log('🔍 Checking Stripe environment variables...\n');

  // Read existing .env.local
  const existingVars = readEnvFile(ENV_LOCAL_PATH);
  const exampleVars = readEnvFile(ENV_EXAMPLE_PATH);

  // Check which variables are missing or have placeholder values
  const missing = [];
  const placeholders = [];

  REQUIRED_STRIPE_VARS.forEach(key => {
    const value = existingVars[key];
    if (
      !value ||
      value === '' ||
      value.includes('your_') ||
      value.includes('sk_test_your') ||
      value.includes('whsec_your')
    ) {
      if (!value || value === '') {
        missing.push(key);
      } else {
        placeholders.push(key);
      }
    }
  });

  // Report status
  console.log('📊 Status:');
  REQUIRED_STRIPE_VARS.forEach(key => {
    const value = existingVars[key];
    if (
      value &&
      !value.includes('your_') &&
      !value.includes('sk_test_your') &&
      !value.includes('whsec_your') &&
      value !== ''
    ) {
      console.log(`  ✅ ${key}: Set`);
    } else {
      console.log(`  ⚠️  ${key}: Missing or placeholder`);
    }
  });

  OPTIONAL_STRIPE_VARS.forEach(key => {
    const value = existingVars[key];
    if (value && !value.includes('your_') && !value.includes('pk_test_your')) {
      console.log(`  ✅ ${key}: Set (optional)`);
    } else {
      console.log(`  ⚠️  ${key}: Not set (optional)`);
    }
  });

  if (missing.length === 0 && placeholders.length === 0) {
    console.log('\n✅ All required Stripe environment variables are set!');
    return;
  }

  console.log('\n📝 Instructions:');
  console.log('\nTo set up Stripe environment variables:');
  console.log('\n1. Get your Stripe API keys:');
  console.log('   - Go to: https://dashboard.stripe.com/apikeys');
  console.log('   - Copy your Secret key (sk_test_... or sk_live_...)');
  console.log('   - Copy your Publishable key (pk_test_... or pk_live_...) - Optional');
  console.log('\n2. Get your Webhook secret:');
  console.log('   - Go to: https://dashboard.stripe.com/webhooks');
  console.log('   - Create endpoint: https://yourdomain.com/api/webhook/stripe');
  console.log(
    '   - Select events: checkout.session.completed, customer.subscription.*, invoice.payment_*',
  );
  console.log('   - Copy the Signing secret (whsec_...)');
  console.log('\n3. Create Products and Prices:');
  console.log('   - Go to: https://dashboard.stripe.com/products');
  console.log('   - Create 3 products: Starter, Pro, Business');
  console.log('   - For each product, create a monthly recurring price');
  console.log('   - Copy the Price IDs (price_...)');
  console.log('\n4. Add to .env.local:');
  console.log('   STRIPE_SECRET_KEY=sk_test_...');
  console.log('   STRIPE_WEBHOOK_SECRET=whsec_...');
  console.log('   STRIPE_PRICE_STARTER_MONTHLY=price_...');
  console.log('   STRIPE_PRICE_PRO_MONTHLY=price_...');
  console.log('   STRIPE_PRICE_BUSINESS_MONTHLY=price_...');
  console.log('   STRIPE_PUBLISHABLE_KEY=pk_test_... (optional)');

  // Update .env.local with placeholders from env.example if missing
  if (missing.length > 0) {
    console.log('\n💡 Adding placeholder entries to .env.local...');
    const updatedVars = { ...existingVars };
    missing.forEach(key => {
      updatedVars[key] = exampleVars[key] || '';
    });
    writeEnvFile(ENV_LOCAL_PATH, updatedVars);
    console.log('✅ Updated .env.local with placeholder entries');
    console.log('   Please replace placeholders with your actual Stripe values');
  }
}

if (require.main === module) {
  main();
}

module.exports = { readEnvFile, writeEnvFile };




