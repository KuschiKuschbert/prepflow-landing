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
    AUTH0_SECRET: process.env.AUTH0_SECRET,
    AUTH0_BASE_URL: process.env.AUTH0_BASE_URL,
    // Deprecated - kept for backward compatibility
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_SESSION_MAX_AGE: process.env.NEXTAUTH_SESSION_MAX_AGE,
  };

  // Check required variables (prefer AUTH0_* over NEXTAUTH_*)
  const required = [
    'AUTH0_ISSUER_BASE_URL',
    'AUTH0_CLIENT_ID',
    'AUTH0_CLIENT_SECRET',
    // AUTH0_SECRET or NEXTAUTH_SECRET (at least one)
    // AUTH0_BASE_URL or NEXTAUTH_URL (at least one)
  ];

  // Check if at least one base URL is set
  if (!config.AUTH0_BASE_URL && !config.NEXTAUTH_URL) {
    required.push('AUTH0_BASE_URL or NEXTAUTH_URL');
  }

  // Check if at least one secret is set
  if (!config.AUTH0_SECRET && !config.NEXTAUTH_SECRET) {
    required.push('AUTH0_SECRET or NEXTAUTH_SECRET');
  }
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

  // Validate AUTH0_BASE_URL (preferred)
  const baseUrl = config.AUTH0_BASE_URL || config.NEXTAUTH_URL;
  const baseUrlVar = config.AUTH0_BASE_URL ? 'AUTH0_BASE_URL' : 'NEXTAUTH_URL';

  if (config.NEXTAUTH_URL && !config.AUTH0_BASE_URL) {
    log('\n⚠️  NEXTAUTH_URL is deprecated - use AUTH0_BASE_URL instead', 'warning');
    issues.warnings.push('NEXTAUTH_URL is deprecated, use AUTH0_BASE_URL');
  }

  if (baseUrl) {
    log(`\n📋 Validating ${baseUrlVar}...`, 'info');

    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      log('  ❌ Missing protocol (should start with http:// or https://)', 'error');
      issues.errors.push(`${baseUrlVar} missing protocol`);
    } else {
      log('  ✅ Has protocol', 'success');
    }

    if (baseUrl.endsWith('/')) {
      log('  ⚠️  Has trailing slash (should not)', 'warning');
      issues.warnings.push(`${baseUrlVar} should not have trailing slash`);
    } else {
      log('  ✅ No trailing slash', 'success');
    }

    if (!isValidUrl(baseUrl)) {
      log('  ❌ Invalid URL format', 'error');
      issues.errors.push(`${baseUrlVar} is not a valid URL`);
    } else {
      log('  ✅ Valid URL format', 'success');
    }

    // Check for placeholder values
    if (baseUrl.includes('yourdomain') || baseUrl.includes('example')) {
      log('  ❌ Contains placeholder value', 'error');
      issues.errors.push(`${baseUrlVar} contains placeholder value`);
    }

    // Check if production URL matches expected format
    if (baseUrl.startsWith('https://')) {
      const url = new URL(baseUrl);
      if (!url.hostname.includes('prepflow.org') && !url.hostname.includes('localhost')) {
        log('  ⚠️  Production URL does not match expected domain (prepflow.org)', 'warning');
        issues.warnings.push(`${baseUrlVar} does not match expected production domain`);
      }
    }
  }

  // Validate AUTH0_SECRET (preferred) or NEXTAUTH_SECRET (deprecated)
  const secret = config.AUTH0_SECRET || config.NEXTAUTH_SECRET;
  const secretVar = config.AUTH0_SECRET ? 'AUTH0_SECRET' : 'NEXTAUTH_SECRET';

  if (config.NEXTAUTH_SECRET && !config.AUTH0_SECRET) {
    log('\n⚠️  NEXTAUTH_SECRET is deprecated - use AUTH0_SECRET instead', 'warning');
    issues.warnings.push('NEXTAUTH_SECRET is deprecated, use AUTH0_SECRET');
  }

  if (secret) {
    log(`\n📋 Validating ${secretVar}...`, 'info');

    if (secret.length < 32) {
      log(`  ❌ Too short (${secret.length} chars, minimum 32)`, 'error');
      issues.errors.push(`${secretVar} is too short (minimum 32 characters)`);
    } else {
      log(`  ✅ Length OK (${secret.length} chars)`, 'success');
    }

    if (
      secret === 'dev-secret-change-me' ||
      secret === 'your-secret-here' ||
      secret === 'build-time-placeholder-secret-that-will-be-validated-at-runtime'
    ) {
      log('  ❌ Using default/placeholder secret', 'error');
      issues.errors.push(`${secretVar} is using default/placeholder value`);
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

  // Validate NEXTAUTH_SESSION_MAX_AGE (deprecated - Auth0 SDK handles sessions internally)
  if (config.NEXTAUTH_SESSION_MAX_AGE) {
    log(
      '\n⚠️  NEXTAUTH_SESSION_MAX_AGE is deprecated - Auth0 SDK manages sessions internally',
      'warning',
    );
    issues.warnings.push('NEXTAUTH_SESSION_MAX_AGE is deprecated, Auth0 SDK manages sessions');
  }

  // Check callback URL consistency
  if (baseUrl && config.AUTH0_ISSUER_BASE_URL) {
    log('\n📋 Checking callback URL consistency...', 'info');

    try {
      const baseUrlObj = new URL(baseUrl);
      // Auth0 SDK uses /api/auth/callback (not /api/auth/callback/auth0)
      const expectedCallback = `${baseUrlObj.origin}/api/auth/callback`;
      log(`  ℹ️  Expected callback URL: ${expectedCallback}`, 'info');
      log(
        '  ℹ️  Verify this URL is in Auth0 Dashboard → Applications → Settings → Allowed Callback URLs',
        'info',
      );

      // Check if production and suggest both www and non-www
      if (baseUrlObj.hostname.includes('prepflow.org')) {
        const hasWww = baseUrlObj.hostname.startsWith('www.');
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
      log(`  ⚠️  Could not parse ${baseUrlVar}: ${error.message}`, 'warning');
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
