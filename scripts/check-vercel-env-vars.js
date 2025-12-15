#!/usr/bin/env node

/**
 * Vercel Environment Variables Checker
 *
 * Checks if all required environment variables are documented and provides
 * a checklist for verifying they're set in Vercel Production environment.
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Required environment variables
const requiredVars = {
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: {
    description: 'Supabase project URL',
    required: true,
    client: true,
  },
  NEXT_PUBLIC_SUPABASE_ANON_KEY: {
    description: 'Supabase anonymous key (public)',
    required: true,
    client: true,
  },
  SUPABASE_SERVICE_ROLE_KEY: {
    description: 'Supabase service role key (server-only)',
    required: true,
    client: false,
  },
  // Auth0
  AUTH0_SECRET: {
    description: 'Auth0 secret (generate with: openssl rand -hex 32)',
    required: true,
    client: false,
  },
  AUTH0_BASE_URL: {
    description:
      'Application base URL (http://localhost:3000 for dev, https://www.prepflow.org for prod)',
    required: true,
    client: false,
  },
  AUTH0_ISSUER_BASE_URL: {
    description: 'Auth0 tenant URL (e.g., https://dev-xxx.us.auth0.com)',
    required: true,
    client: false,
  },
  AUTH0_CLIENT_ID: {
    description: 'Auth0 application client ID',
    required: true,
    client: false,
  },
  AUTH0_CLIENT_SECRET: {
    description: 'Auth0 application client secret',
    required: true,
    client: false,
  },
  // Stripe (optional - only if using billing)
  STRIPE_SECRET_KEY: {
    description: 'Stripe secret key (sk_test_... for dev, sk_live_... for prod)',
    required: false,
    client: false,
  },
  STRIPE_WEBHOOK_SECRET: {
    description: 'Stripe webhook signing secret (whsec_...)',
    required: false,
    client: false,
  },
  STRIPE_PRICE_STARTER_MONTHLY: {
    description: 'Stripe price ID for Starter tier (price_...)',
    required: false,
    client: false,
  },
  STRIPE_PRICE_PRO_MONTHLY: {
    description: 'Stripe price ID for Pro tier (price_...)',
    required: false,
    client: false,
  },
  STRIPE_PRICE_BUSINESS_MONTHLY: {
    description: 'Stripe price ID for Business tier (price_...)',
    required: false,
    client: false,
  },
};

log('\n🔍 Vercel Environment Variables Checker', 'cyan');
log('==========================================\n', 'cyan');

// Check env.example
log('📋 Checking env.example...', 'blue');
let envExample = {};
if (fs.existsSync('env.example')) {
  const content = fs.readFileSync('env.example', 'utf8');
  const lines = content.split('\n');
  for (const line of lines) {
    if (line.trim() && !line.trim().startsWith('#')) {
      const [key] = line.split('=');
      if (key) {
        envExample[key.trim()] = true;
      }
    }
  }
  log(`   Found ${Object.keys(envExample).length} variables in env.example`, 'green');
} else {
  log('   ⚠️  env.example not found', 'yellow');
}

// Check which variables are documented
log('\n📝 Required Environment Variables:', 'blue');
log('====================================\n', 'blue');

const missing = [];
const documented = [];

Object.entries(requiredVars).forEach(([varName, config]) => {
  const isDocumented = envExample[varName] || false;
  const prefix = config.client ? 'NEXT_PUBLIC_' : '';
  const hasPrefix = varName.startsWith('NEXT_PUBLIC_');

  if (config.required && !isDocumented) {
    missing.push(varName);
  }

  const status = config.required ? (isDocumented ? '✅' : '❌') : isDocumented ? '⚠️ ' : '  ';

  const required = config.required ? '(REQUIRED)' : '(OPTIONAL)';
  const client = config.client ? '[CLIENT]' : '[SERVER]';
  const prefixCheck = config.client && !hasPrefix ? ' ⚠️ Missing NEXT_PUBLIC_ prefix!' : '';

  log(
    `${status} ${varName} ${required} ${client}${prefixCheck}`,
    isDocumented ? 'green' : 'yellow',
  );
  log(`   ${config.description}`, 'reset');

  if (isDocumented) {
    documented.push(varName);
  }
});

// Summary
log('\n====================================', 'cyan');
log('📊 Summary', 'cyan');
log('====================================', 'cyan');
log(`✅ Documented: ${documented.length}`, 'green');
log(`❌ Missing from env.example: ${missing.length}`, missing.length > 0 ? 'red' : 'green');

if (missing.length > 0) {
  log('\n⚠️  Missing variables:', 'yellow');
  missing.forEach(varName => {
    log(`   - ${varName}`, 'yellow');
  });
}

// Vercel checklist
log('\n====================================', 'cyan');
log('🔧 Vercel Dashboard Checklist', 'cyan');
log('====================================', 'cyan');
log('\nGo to: Vercel Dashboard → Project → Settings → Environment Variables\n', 'blue');
log('For EACH variable above:', 'yellow');
log('  [ ] Variable is set for Production environment (not just Preview)', 'yellow');
log('  [ ] Value matches local .env.local (for production values)', 'yellow');
log('  [ ] No typos or extra spaces', 'yellow');
log('  [ ] NEXT_PUBLIC_ prefix present for client-side variables', 'yellow');
log('  [ ] Secrets are not exposed in code or logs', 'yellow');

log('\n💡 Critical Checks:', 'cyan');
log(
  '  [ ] AUTH0_BASE_URL = https://www.prepflow.org (exactly, with www, no trailing slash)',
  'yellow',
);
log('  [ ] AUTH0_BASE_URL is set for Production environment', 'yellow');
log('  [ ] All Auth0 variables are set for Production', 'yellow');
log('  [ ] All Supabase variables are set for Production', 'yellow');

log('\n📚 See Also:', 'cyan');
log('  - docs/AUTH0_STRIPE_REFERENCE.md - Complete Auth0/Stripe setup guide', 'blue');
log('  - docs/VERCEL_BUILD_DEBUGGING.md - Build debugging guide', 'blue');

if (missing.length > 0) {
  log('\n❌ Action Required:', 'red');
  log('Add missing variables to env.example', 'yellow');
  process.exit(1);
} else {
  log('\n✅ All required variables documented in env.example', 'green');
  log('Remember to verify they are set in Vercel Production environment!', 'yellow');
  process.exit(0);
}
