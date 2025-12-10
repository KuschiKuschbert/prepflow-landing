#!/usr/bin/env node

/**
 * Auth0 Environment Variables Validation Script
 * Validates Auth0 environment variables for common configuration issues
 *
 * Usage:
 *   node scripts/validate-auth0-env.js
 */

const fs = require('fs');
const path = require('path');

const issues = {
  errors: [],
  warnings: [],
};

/**
 * Load environment variables from .env.local
 */
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

/**
 * Log message with color
 */
function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    error: '\x1b[31m',
    warning: '\x1b[33m',
    reset: '\x1b[0m',
  };

  const prefix =
    {
      info: 'ℹ️',
      success: '✅',
      error: '❌',
      warning: '⚠️',
    }[type] || 'ℹ️';

  console.log(`${colors[type]}${prefix} ${message}${colors.reset}`);
}

/**
 * Validate URL format
 */
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

/**
 * Validate Auth0 configuration
 */
function validateAuth0Config() {
  log('\n🔍 Validating Auth0 Environment Variables...', 'info');
  log('='.repeat(60), 'info');

  const config = {
    AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_SESSION_MAX_AGE: process.env.NEXTAUTH_SESSION_MAX_AGE,
  };

  // Check required variables
  const required = [
    'AUTH0_ISSUER_BASE_URL',
    'AUTH0_CLIENT_ID',
    'AUTH0_CLIENT_SECRET',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
  ];
  const missing = required.filter(key => !config[key]);

  if (missing.length > 0) {
    log(`\n❌ Missing required environment variables: ${missing.join(', ')}`, 'error');
    issues.errors.push(`Missing required variables: ${missing.join(', ')}`);
  } else {
    log('\n✅ All required environment variables are present', 'success');
  }

  // Validate AUTH0_ISSUER_BASE_URL
  if (config.AUTH0_ISSUER_BASE_URL) {
    log('\n📋 Validating AUTH0_ISSUER_BASE_URL...', 'info');

    if (!config.AUTH0_ISSUER_BASE_URL.startsWith('https://')) {
      log('  ⚠️  Should start with https:// (not http://)', 'warning');
      issues.warnings.push('AUTH0_ISSUER_BASE_URL should use HTTPS');
    } else {
      log('  ✅ Uses HTTPS', 'success');
    }

    if (config.AUTH0_ISSUER_BASE_URL.endsWith('/')) {
      log('  ⚠️  Has trailing slash (should not)', 'warning');
      issues.warnings.push('AUTH0_ISSUER_BASE_URL should not have trailing slash');
    } else {
      log('  ✅ No trailing slash', 'success');
    }

    if (!isValidUrl(config.AUTH0_ISSUER_BASE_URL)) {
      log('  ❌ Invalid URL format', 'error');
      issues.errors.push('AUTH0_ISSUER_BASE_URL is not a valid URL');
    } else {
      log('  ✅ Valid URL format', 'success');
    }

    // Check for placeholder values
    if (
      config.AUTH0_ISSUER_BASE_URL.includes('yourdomain') ||
      config.AUTH0_ISSUER_BASE_URL.includes('example')
    ) {
      log('  ❌ Contains placeholder value', 'error');
      issues.errors.push('AUTH0_ISSUER_BASE_URL contains placeholder value');
    }
  }

  // Validate NEXTAUTH_URL
  if (config.NEXTAUTH_URL) {
    log('\n📋 Validating NEXTAUTH_URL...', 'info');

    if (!config.NEXTAUTH_URL.startsWith('http://') && !config.NEXTAUTH_URL.startsWith('https://')) {
      log('  ❌ Missing protocol (should start with http:// or https://)', 'error');
      issues.errors.push('NEXTAUTH_URL missing protocol');
    } else {
      log('  ✅ Has protocol', 'success');
    }

    if (config.NEXTAUTH_URL.endsWith('/')) {
      log('  ⚠️  Has trailing slash (should not)', 'warning');
      issues.warnings.push('NEXTAUTH_URL should not have trailing slash');
    } else {
      log('  ✅ No trailing slash', 'success');
    }

    if (!isValidUrl(config.NEXTAUTH_URL)) {
      log('  ❌ Invalid URL format', 'error');
      issues.errors.push('NEXTAUTH_URL is not a valid URL');
    } else {
      log('  ✅ Valid URL format', 'success');
    }

    // Check for placeholder values
    if (config.NEXTAUTH_URL.includes('yourdomain') || config.NEXTAUTH_URL.includes('example')) {
      log('  ❌ Contains placeholder value', 'error');
      issues.errors.push('NEXTAUTH_URL contains placeholder value');
    }

    // Check if production URL matches expected format
    if (config.NEXTAUTH_URL.startsWith('https://')) {
      const url = new URL(config.NEXTAUTH_URL);
      if (!url.hostname.includes('prepflow.org') && !url.hostname.includes('localhost')) {
        log('  ⚠️  Production URL does not match expected domain (prepflow.org)', 'warning');
        issues.warnings.push('NEXTAUTH_URL does not match expected production domain');
      }
    }
  }

  // Validate NEXTAUTH_SECRET
  if (config.NEXTAUTH_SECRET) {
    log('\n📋 Validating NEXTAUTH_SECRET...', 'info');

    if (config.NEXTAUTH_SECRET.length < 32) {
      log(`  ❌ Too short (${config.NEXTAUTH_SECRET.length} chars, minimum 32)`, 'error');
      issues.errors.push('NEXTAUTH_SECRET is too short (minimum 32 characters)');
    } else {
      log(`  ✅ Length OK (${config.NEXTAUTH_SECRET.length} chars)`, 'success');
    }

    if (
      config.NEXTAUTH_SECRET === 'dev-secret-change-me' ||
      config.NEXTAUTH_SECRET === 'your-secret-here'
    ) {
      log('  ❌ Using default/placeholder secret', 'error');
      issues.errors.push('NEXTAUTH_SECRET is using default/placeholder value');
    } else {
      log('  ✅ Not using default secret', 'success');
    }
  }

  // Validate AUTH0_CLIENT_SECRET
  if (config.AUTH0_CLIENT_SECRET) {
    log('\n📋 Validating AUTH0_CLIENT_SECRET...', 'info');

    if (config.AUTH0_CLIENT_SECRET.length < 20) {
      log(`  ⚠️  Very short (${config.AUTH0_CLIENT_SECRET.length} chars)`, 'warning');
      issues.warnings.push('AUTH0_CLIENT_SECRET is very short');
    } else {
      log(`  ✅ Length OK (${config.AUTH0_CLIENT_SECRET.length} chars)`, 'success');
    }
  }

  // Validate NEXTAUTH_SESSION_MAX_AGE
  if (config.NEXTAUTH_SESSION_MAX_AGE) {
    log('\n📋 Validating NEXTAUTH_SESSION_MAX_AGE...', 'info');

    const maxAge = Number(config.NEXTAUTH_SESSION_MAX_AGE);
    if (isNaN(maxAge)) {
      log('  ❌ Not a valid number', 'error');
      issues.errors.push('NEXTAUTH_SESSION_MAX_AGE is not a valid number');
    } else {
      const hours = maxAge / 3600;
      log(`  ✅ Valid (${hours} hours)`, 'success');

      if (maxAge < 3600) {
        log('  ⚠️  Very short session (less than 1 hour)', 'warning');
        issues.warnings.push('NEXTAUTH_SESSION_MAX_AGE is very short');
      }
      if (maxAge > 86400) {
        log('  ⚠️  Very long session (more than 24 hours)', 'warning');
        issues.warnings.push('NEXTAUTH_SESSION_MAX_AGE is very long');
      }
    }
  } else {
    log('\n📋 NEXTAUTH_SESSION_MAX_AGE not set (using default: 4 hours)', 'info');
  }

  // Check callback URL consistency
  if (config.NEXTAUTH_URL && config.AUTH0_ISSUER_BASE_URL) {
    log('\n📋 Checking callback URL consistency...', 'info');

    try {
      const nextAuthUrl = new URL(config.NEXTAUTH_URL);
      const expectedCallback = `${nextAuthUrl.origin}/api/auth/callback/auth0`;
      log(`  ℹ️  Expected callback URL: ${expectedCallback}`, 'info');
      log(
        '  ℹ️  Verify this URL is in Auth0 Dashboard → Applications → Settings → Allowed Callback URLs',
        'info',
      );

      // Check if production and suggest both www and non-www
      if (nextAuthUrl.hostname.includes('prepflow.org')) {
        const hasWww = nextAuthUrl.hostname.startsWith('www.');
        if (hasWww) {
          log(
            '  ⚠️  Using www domain - ensure BOTH www and non-www are in Auth0 callback URLs',
            'warning',
          );
          issues.warnings.push('Ensure both www and non-www callback URLs are configured in Auth0');
        } else {
          log(
            '  ⚠️  Using non-www domain - ensure BOTH www and non-www are in Auth0 callback URLs',
            'warning',
          );
          issues.warnings.push('Ensure both www and non-www callback URLs are configured in Auth0');
        }
      }
    } catch (error) {
      log(`  ⚠️  Could not parse NEXTAUTH_URL: ${error.message}`, 'warning');
    }
  }

  // Summary
  log('\n' + '='.repeat(60), 'info');
  log('📊 Validation Summary', 'info');
  log('='.repeat(60), 'info');

  if (issues.errors.length === 0 && issues.warnings.length === 0) {
    log('\n🎉 All Auth0 environment variables are valid!', 'success');
  } else {
    if (issues.errors.length > 0) {
      log(`\n❌ Errors: ${issues.errors.length}`, 'error');
      issues.errors.forEach(error => log(`  - ${error}`, 'error'));
    }
    if (issues.warnings.length > 0) {
      log(`\n⚠️  Warnings: ${issues.warnings.length}`, 'warning');
      issues.warnings.forEach(warning => log(`  - ${warning}`, 'warning'));
    }
  }

  log('\n💡 Next Steps:', 'info');
  log('1. Run: node scripts/check-auth0-config.js (requires Management API access)', 'info');
  log('2. Verify URLs in Auth0 Dashboard → Applications → Settings', 'info');
  log('3. See docs/AUTH0_PRODUCTION_SETUP.md for complete configuration guide', 'info');

  return issues.errors.length === 0;
}

// Main execution
if (require.main === module) {
  loadEnvFile();
  const isValid = validateAuth0Config();
  process.exit(isValid ? 0 : 1);
}

module.exports = { validateAuth0Config };
