#!/usr/bin/env node

/**
 * Vercel Environment Variables Verification Script
 *
 * This script checks which environment variables are required for Vercel production
 * and compares them with your local .env.local file to generate a checklist.
 *
 * Usage:
 *   node scripts/check-vercel-env.js
 *
 * Output:
 *   - Lists all required environment variables
 *   - Shows which ones are set locally (for reference)
 *   - Generates a checklist for Vercel Dashboard
 *   - Provides copy-paste ready values (where safe)
 */

const fs = require('fs');
const path = require('path');

// Required Vercel Environment Variables (Production)
const REQUIRED_VARS = {
  // Auth0 Configuration (CRITICAL)
  AUTH0_ISSUER_BASE_URL: {
    required: true,
    description: 'Auth0 tenant URL',
    example: 'https://dev-7myakdl4itf644km.us.auth0.com',
    critical: true,
  },
  AUTH0_CLIENT_ID: {
    required: true,
    description: 'Auth0 application Client ID',
    example: 'CO3Vl37SuZ4e9wke1PitgWvAUyMR2HfL',
    critical: true,
  },
  AUTH0_CLIENT_SECRET: {
    required: true,
    description: 'Auth0 application Client Secret',
    example: 'your-production-secret-here',
    critical: true,
    secret: true,
  },

  // Auth0 SDK Configuration (CRITICAL)
  AUTH0_SECRET: {
    required: true,
    description: 'Auth0 SDK secret (minimum 32 characters)',
    example: 'your-production-secret-min-32-chars',
    critical: true,
    secret: true,
    validation: value => {
      if (!value) return 'Missing';
      if (value.length < 32) return '⚠️ Must be at least 32 characters';
      return '✅ Valid';
    },
  },
  AUTH0_BASE_URL: {
    required: true,
    description: 'Application URL (MUST be www.prepflow.org for production)',
    example: 'https://www.prepflow.org',
    critical: true,
    validation: value => {
      if (!value) return 'Missing';
      if (!value.startsWith('https://www.prepflow.org')) {
        return '⚠️ MUST be https://www.prepflow.org (with www)';
      }
      return '✅ Correct';
    },
  },
  // Deprecated NextAuth Configuration (backward compatibility)
  NEXTAUTH_URL: {
    required: false,
    description: 'DEPRECATED: Use AUTH0_BASE_URL instead',
    example: 'https://www.prepflow.org',
    critical: false,
    deprecated: true,
    validation: value => {
      if (value) return '⚠️ Deprecated - use AUTH0_BASE_URL instead';
      return '✅ Not set (using AUTH0_BASE_URL)';
    },
  },
  NEXTAUTH_SECRET: {
    required: false,
    description: 'DEPRECATED: Use AUTH0_SECRET instead',
    example: 'your-production-secret-min-32-chars',
    critical: false,
    secret: true,
    deprecated: true,
    validation: value => {
      if (value) return '⚠️ Deprecated - use AUTH0_SECRET instead';
      return '✅ Not set (using AUTH0_SECRET)';
    },
  },
  NEXTAUTH_SESSION_MAX_AGE: {
    required: false,
    description: 'DEPRECATED: Auth0 SDK manages sessions internally',
    example: '14400',
    deprecated: true,
    validation: value => {
      if (value) return '⚠️ Deprecated - Auth0 SDK manages sessions';
      return '✅ Not set (Auth0 SDK default)';
    },
  },

  // Supabase Configuration (CRITICAL)
  NEXT_PUBLIC_SUPABASE_URL: {
    required: true,
    description: 'Supabase project URL',
    example: 'https://your-project-id.supabase.co',
    critical: true,
  },
  NEXT_PUBLIC_SUPABASE_ANON_KEY: {
    required: true,
    description: 'Supabase anonymous key (public)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    critical: true,
  },
  SUPABASE_SERVICE_ROLE_KEY: {
    required: true,
    description: 'Supabase service role key (server-only, full access)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    critical: true,
    secret: true,
  },

  // Stripe Configuration (if using billing)
  STRIPE_SECRET_KEY: {
    required: false,
    description: 'Stripe secret key (sk_live_... for production)',
    example: 'sk_live_your_stripe_secret_key',
    secret: true,
  },
  STRIPE_WEBHOOK_SECRET: {
    required: false,
    description: 'Stripe webhook signing secret (whsec_...)',
    example: 'whsec_your_webhook_secret',
    secret: true,
  },
  STRIPE_WEBHOOK_SECRET_PROD: {
    required: false,
    description: 'Production-specific webhook secret (recommended)',
    example: 'whsec_your_prod_webhook_secret',
    secret: true,
  },
  STRIPE_PRICE_STARTER_MONTHLY: {
    required: false,
    description: 'Stripe price ID for Starter tier',
    example: 'price_...',
  },
  STRIPE_PRICE_PRO_MONTHLY: {
    required: false,
    description: 'Stripe price ID for Pro tier',
    example: 'price_...',
  },
  STRIPE_PRICE_BUSINESS_MONTHLY: {
    required: false,
    description: 'Stripe price ID for Business tier',
    example: 'price_...',
  },

  // Access Control
  ALLOWED_EMAILS: {
    required: false,
    description: 'Comma-separated list of allowed emails (production allowlist)',
    example: 'email1@example.com,email2@example.com',
  },
  DISABLE_ALLOWLIST: {
    required: false,
    description: 'Set to "true" to disable allowlist (testing/friend access)',
    example: 'true',
    default: 'false',
  },

  // Email Configuration (Resend)
  RESEND_API_KEY: {
    required: false,
    description: 'Resend API key for email sending',
    example: 're_your_resend_api_key',
    secret: true,
  },
  FROM_EMAIL: {
    required: false,
    description: 'From email address for emails',
    example: 'hello@prepflow.org',
  },
  FROM_NAME: {
    required: false,
    description: 'From name for emails',
    example: 'PrepFlow Team',
  },

  // Node Environment
  NODE_ENV: {
    required: false,
    description: 'Node environment (should be "production" in Vercel)',
    example: 'production',
    default: 'production',
  },
};

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
  const envVars = {};

  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const match = trimmed.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim().replace(/^["']|["']$/g, '');
          envVars[key] = value;
        }
      }
    });
  }

  return envVars;
}

function maskSecret(value) {
  if (!value || value.length < 8) {
    return '***';
  }
  return `${value.substring(0, 4)}...${value.substring(value.length - 4)}`;
}

function generateChecklist() {
  const localEnv = loadEnvFile();
  const critical = [];
  const required = [];
  const optional = [];

  log('\n🔍 Vercel Environment Variables Checklist', 'info');
  log('='.repeat(70), 'info');
  log('\n📋 Go to: Vercel Dashboard → Your Project → Settings → Environment Variables', 'info');
  log('   Make sure to select "Production" environment for all variables\n', 'info');

  // Categorize variables
  Object.entries(REQUIRED_VARS).forEach(([key, config]) => {
    const localValue = localEnv[key];
    const status = localValue ? '✅ Set locally' : '❌ Not set locally';
    const validation = config.validation && localValue ? config.validation(localValue) : null;

    const item = {
      key,
      config,
      localValue,
      status,
      validation,
    };

    if (config.critical) {
      critical.push(item);
    } else if (config.required) {
      required.push(item);
    } else {
      optional.push(item);
    }
  });

  // Display Critical Variables
  log('\n🚨 CRITICAL Variables (Must be set in Production):', 'error');
  log('─'.repeat(70), 'info');
  critical.forEach(({ key, config, localValue, validation }) => {
    const displayValue =
      config.secret && localValue ? maskSecret(localValue) : localValue || 'NOT SET';
    log(`\n${key}`, 'info');
    log(`   Description: ${config.description}`, 'info');
    log(
      `   Status: ${localValue ? '✅ Set locally' : '❌ Not set locally'}`,
      localValue ? 'success' : 'error',
    );
    if (validation) {
      log(`   Validation: ${validation}`, validation.includes('✅') ? 'success' : 'warn');
    }
    if (localValue && !config.secret) {
      log(`   Current value: ${localValue}`, 'info');
    } else if (localValue && config.secret) {
      log(`   Current value: ${maskSecret(localValue)}`, 'info');
    }
    log(`   Example: ${config.example}`, 'info');
  });

  // Display Required Variables
  if (required.length > 0) {
    log('\n📋 Required Variables:', 'warn');
    log('─'.repeat(70), 'info');
    required.forEach(({ key, config, localValue }) => {
      const displayValue =
        config.secret && localValue ? maskSecret(localValue) : localValue || 'NOT SET';
      log(`\n${key}`, 'info');
      log(`   Description: ${config.description}`, 'info');
      log(
        `   Status: ${localValue ? '✅ Set locally' : '❌ Not set locally'}`,
        localValue ? 'success' : 'warn',
      );
      if (localValue && !config.secret) {
        log(`   Current value: ${localValue}`, 'info');
      } else if (localValue && config.secret) {
        log(`   Current value: ${maskSecret(localValue)}`, 'info');
      }
      log(`   Example: ${config.example}`, 'info');
    });
  }

  // Display Optional Variables
  if (optional.length > 0) {
    log('\n📝 Optional Variables (Set if needed):', 'info');
    log('─'.repeat(70), 'info');
    optional.forEach(({ key, config, localValue }) => {
      log(`\n${key}`, 'info');
      log(`   Description: ${config.description}`, 'info');
      if (config.default) {
        log(`   Default: ${config.default}`, 'info');
      }
      log(
        `   Status: ${localValue ? '✅ Set locally' : '⚪ Not set (optional)'}`,
        localValue ? 'success' : 'info',
      );
      if (localValue && !config.secret) {
        log(`   Current value: ${localValue}`, 'info');
      } else if (localValue && config.secret) {
        log(`   Current value: ${maskSecret(localValue)}`, 'info');
      }
      log(`   Example: ${config.example}`, 'info');
    });
  }

  // Generate Copy-Paste Ready Section
  log('\n\n📋 Copy-Paste Ready Values (for Vercel Dashboard):', 'info');
  log('='.repeat(70), 'info');
  log('\n⚠️  IMPORTANT: Replace placeholder values with your actual production secrets!\n', 'warn');

  critical.forEach(({ key, config, localValue }) => {
    if (localValue && !config.secret) {
      log(`${key}=${localValue}`, 'success');
    } else if (localValue && config.secret) {
      log(`${key}=${maskSecret(localValue)} (use your production secret)`, 'warn');
    } else {
      log(`${key}=${config.example}`, 'error');
    }
  });

  // Summary
  log('\n\n📊 Summary:', 'info');
  log('='.repeat(70), 'info');
  const criticalSet = critical.filter(({ localValue }) => localValue).length;
  const criticalTotal = critical.length;
  const requiredSet = required.filter(({ localValue }) => localValue).length;
  const requiredTotal = required.length;
  const optionalSet = optional.filter(({ localValue }) => localValue).length;
  const optionalTotal = optional.length;

  log(
    `\n🚨 Critical: ${criticalSet}/${criticalTotal} set locally`,
    criticalSet === criticalTotal ? 'success' : 'error',
  );
  log(
    `📋 Required: ${requiredSet}/${requiredTotal} set locally`,
    requiredSet === requiredTotal ? 'success' : 'warn',
  );
  log(`📝 Optional: ${optionalSet}/${optionalTotal} set locally`, 'info');

  // Special Notes
  log('\n\n⚠️  Important Notes:', 'warn');
  log('─'.repeat(70), 'info');
  log('1. AUTH0_BASE_URL MUST be https://www.prepflow.org (with www) in production', 'error');
  log('   (NEXTAUTH_URL is deprecated - use AUTH0_BASE_URL instead)', 'warn');
  log('2. All secrets should be different between development and production', 'warn');
  log('3. After setting variables in Vercel, redeploy your application', 'info');
  log('4. Wait 1-2 minutes after deployment for changes to take effect', 'info');
  log('5. Test sign-in after deployment: https://www.prepflow.org', 'info');

  // Next Steps
  log('\n\n📚 Next Steps:', 'info');
  log('─'.repeat(70), 'info');
  log('1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables', 'info');
  log('2. For each variable above:', 'info');
  log('   - Click "Add New"', 'info');
  log('   - Enter the variable name', 'info');
  log('   - Enter the value (use production secrets, not development values)', 'info');
  log('   - Select "Production" environment', 'info');
  log('   - Click "Save"', 'info');
  log('3. After setting all variables, trigger a new deployment', 'info');
  log('4. Test sign-in: https://www.prepflow.org', 'info');
  log('5. Run: npm run auth0:check-config (to verify Auth0 configuration)', 'info');

  // Exit with appropriate code
  const missingCritical = critical.filter(({ localValue }) => !localValue).length;
  process.exit(missingCritical > 0 ? 1 : 0);
}

generateChecklist();
