#!/usr/bin/env node

/**
 * Comprehensive Auth0 Issues Checker
 * Checks for common Auth0 configuration and code issues
 *
 * Usage:
 *   node scripts/check-auth0-issues.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const issues = {
  errors: [],
  warnings: [],
  info: [],
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
      reset: '\x1b[0m',
    }[type] || 'ℹ️';

  console.log(`${colors[type]}${prefix} ${message}${colors.reset}`);
}

/**
 * Check for hardcoded URLs in code
 */
function checkHardcodedUrls() {
  log('\n📋 Checking for hardcoded URLs in code...', 'info');

  const filesToCheck = [
    'lib/auth-options.ts',
    'lib/middleware-auth.ts',
    'lib/admin-utils.ts',
    'lib/admin-auth.ts',
    'app/api/auth/logout/route.ts',
    'app/api/auth/signin/page.tsx',
  ];

  const hardcodedPatterns = [
    { pattern: /https:\/\/[^/]+\.auth0\.com/, description: 'Hardcoded Auth0 domain' },
    { pattern: /https:\/\/prepflow\.org/, description: 'Hardcoded production domain' },
    { pattern: /localhost:300[01]/, description: 'Hardcoded localhost port' },
  ];

  filesToCheck.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      hardcodedPatterns.forEach(({ pattern, description }) => {
        if (pattern.test(content)) {
          // Check if it's a comment or documentation (acceptable)
          const lines = content.split('\n');
          lines.forEach((line, index) => {
            if (
              pattern.test(line) &&
              !line.trim().startsWith('//') &&
              !line.trim().startsWith('*')
            ) {
              // Check if it's a custom claim namespace (acceptable)
              if (
                line.includes('https://prepflow.org/roles') ||
                line.includes('https://prepflow.org/custom')
              ) {
                // This is a custom claim namespace - acceptable
                return;
              }
              // Check if it's in a URL() constructor or env var usage (acceptable)
              if (
                line.includes('process.env') ||
                line.includes('new URL') ||
                line.includes('NEXTAUTH_URL')
              ) {
                return;
              }
              log(`  ⚠️  ${file}:${index + 1} - ${description}`, 'warning');
              issues.warnings.push(`${file}:${index + 1} - ${description}`);
            }
          });
        }
      });
    }
  });

  if (issues.warnings.length === 0) {
    log('  ✅ No problematic hardcoded URLs found', 'success');
  }
}

/**
 * Check callback URL construction
 */
function checkCallbackUrlConstruction() {
  log('\n📋 Checking callback URL construction...', 'info');

  const files = ['app/api/auth/signin/page.tsx', 'middleware.ts'];

  let foundIssues = false;

  files.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');

      // Check if callback URLs are constructed properly
      if (content.includes('callbackUrl') || content.includes('callback')) {
        // NextAuth's signIn() function handles callback URLs internally, so this is OK
        if (content.includes('signIn(') || content.includes("from 'next-auth")) {
          // This is using NextAuth's built-in callback handling - OK
          return;
        }
        // Check if it uses environment variables
        if (!content.includes('NEXTAUTH_URL') && !content.includes('process.env')) {
          log(`  ⚠️  ${file} - Callback URL may not use environment variables`, 'warning');
          issues.warnings.push(`${file} - Callback URL construction may not use env vars`);
          foundIssues = true;
        }
      }
    }
  });

  if (!foundIssues) {
    log('  ✅ Callback URLs are constructed correctly', 'success');
  }
}

/**
 * Check logout URL validation
 */
function checkLogoutUrlValidation() {
  log('\n📋 Checking logout URL validation...', 'info');

  const filePath = path.join(process.cwd(), 'app/api/auth/logout/route.ts');
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Check if returnTo URL is validated
    if (content.includes('returnTo')) {
      // Check if it validates the URL format
      if (
        content.includes('startsWith') ||
        content.includes('isValidUrl') ||
        content.includes('new URL')
      ) {
        log('  ✅ Logout returnTo URL is validated', 'success');
      } else {
        log('  ⚠️  Logout returnTo URL may not be validated', 'warning');
        issues.warnings.push('Logout returnTo URL validation may be missing');
      }

      // Check if it mentions Allowed Logout URLs
      if (content.includes('Allowed Logout URLs') || content.includes('whitelisted')) {
        log('  ✅ Code documents Allowed Logout URLs requirement', 'success');
      } else {
        log('  ⚠️  Code may not document Allowed Logout URLs requirement', 'warning');
        issues.warnings.push('Logout route may not document Allowed Logout URLs requirement');
      }
    }
  }
}

/**
 * Check environment variable usage
 */
function checkEnvVarUsage() {
  log('\n📋 Checking environment variable usage...', 'info');

  // Prefer AUTH0_* variables, but check NEXTAUTH_* as fallback
  const requiredVars = [
    'AUTH0_ISSUER_BASE_URL',
    'AUTH0_CLIENT_ID',
    'AUTH0_CLIENT_SECRET',
    // At least one base URL must be set
    process.env.AUTH0_BASE_URL ? 'AUTH0_BASE_URL' : 'NEXTAUTH_URL',
    // At least one secret must be set
    process.env.AUTH0_SECRET ? 'AUTH0_SECRET' : 'NEXTAUTH_SECRET',
  ].filter(Boolean);

  const missing = requiredVars.filter(key => !process.env[key]);

  if (missing.length > 0) {
    log(`  ❌ Missing environment variables: ${missing.join(', ')}`, 'error');
    issues.errors.push(`Missing env vars: ${missing.join(', ')}`);
  } else {
    log('  ✅ All required environment variables are set', 'success');
  }

  // Warn if using deprecated NEXTAUTH_* variables
  if (process.env.NEXTAUTH_URL && !process.env.AUTH0_BASE_URL) {
    log('  ⚠️  NEXTAUTH_URL is deprecated - use AUTH0_BASE_URL instead', 'warning');
    issues.warnings.push('NEXTAUTH_URL is deprecated, use AUTH0_BASE_URL');
  }

  if (process.env.NEXTAUTH_SECRET && !process.env.AUTH0_SECRET) {
    log('  ⚠️  NEXTAUTH_SECRET is deprecated - use AUTH0_SECRET instead', 'warning');
    issues.warnings.push('NEXTAUTH_SECRET is deprecated, use AUTH0_SECRET');
  }

  // Check for placeholder values
  const secret = process.env.AUTH0_SECRET || process.env.NEXTAUTH_SECRET;
  if (
    secret === 'dev-secret-change-me' ||
    secret === 'your-secret-here' ||
    secret === 'build-time-placeholder-secret-that-will-be-validated-at-runtime'
  ) {
    log('  ❌ Auth secret is using default/placeholder value', 'error');
    issues.errors.push('Auth secret is using default value');
  }

  if (
    process.env.AUTH0_ISSUER_BASE_URL?.includes('yourdomain') ||
    process.env.AUTH0_ISSUER_BASE_URL?.includes('example')
  ) {
    log('  ❌ AUTH0_ISSUER_BASE_URL contains placeholder value', 'error');
    issues.errors.push('AUTH0_ISSUER_BASE_URL contains placeholder');
  }
}

/**
 * Check error handling
 */
function checkErrorHandling() {
  log('\n📋 Checking error handling...', 'info');

  const files = ['lib/auth0.ts', 'app/api/auth/logout/route.ts', 'app/api/auth/error/page.tsx'];

  let foundIssues = false;

  files.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');

      // Check for try-catch blocks
      if (content.includes('throw') && !content.includes('try') && !content.includes('catch')) {
        log(`  ⚠️  ${file} - May have unhandled errors`, 'warning');
        issues.warnings.push(`${file} - Potential unhandled errors`);
        foundIssues = true;
      }

      // Check for error logging (skip client components and error pages - they display errors to users)
      if (file.includes('page.tsx') && (file.includes('signin') || file.includes('error'))) {
        // These pages display errors to users, which is appropriate
        return;
      }
      if (
        content.includes('logger.error') ||
        content.includes('logger.warn') ||
        content.includes('logger.info')
      ) {
        // Good - has error logging
      } else if (content.includes('error') || content.includes('Error')) {
        // Only warn if it's a server-side file
        if (file.includes('/api/') || file.includes('/lib/')) {
          log(`  ⚠️  ${file} - May not log errors properly`, 'warning');
          issues.warnings.push(`${file} - Error logging may be missing`);
          foundIssues = true;
        }
      }
    }
  });

  if (!foundIssues) {
    log('  ✅ Error handling looks good', 'success');
  }
}

/**
 * Check for common Auth0 issues
 */
function checkCommonIssues() {
  log('\n📋 Checking for common Auth0 issues...', 'info');

  // Check if base URL matches expected format
  const baseUrl = process.env.AUTH0_BASE_URL || process.env.NEXTAUTH_URL;
  if (baseUrl) {
    try {
      const url = new URL(baseUrl);
      if (url.hostname.includes('prepflow.org') && !url.hostname.startsWith('www.')) {
        log(
          '  ⚠️  Base URL uses non-www domain - ensure both www and non-www are in Auth0',
          'warning',
        );
        issues.warnings.push('Base URL uses non-www - ensure both domains configured in Auth0');
      }
    } catch (error) {
      log(`  ⚠️  Could not parse base URL: ${error.message}`, 'warning');
    }
  }

  // Check if AUTH0_ISSUER_BASE_URL has trailing slash
  if (process.env.AUTH0_ISSUER_BASE_URL?.endsWith('/')) {
    log('  ⚠️  AUTH0_ISSUER_BASE_URL has trailing slash (should not)', 'warning');
    issues.warnings.push('AUTH0_ISSUER_BASE_URL has trailing slash');
  }

  // Check session max age
  const maxAge = Number(process.env.NEXTAUTH_SESSION_MAX_AGE) || 14400;
  if (maxAge !== 14400) {
    log(`  ℹ️  NEXTAUTH_SESSION_MAX_AGE is ${maxAge} seconds (default is 14400)`, 'info');
    issues.info.push(`Session max age: ${maxAge} seconds`);
  }
}

/**
 * Generate summary report
 */
function generateReport() {
  log('\n' + '='.repeat(60), 'info');
  log('📊 Auth0 Issues Summary', 'info');
  log('='.repeat(60), 'info');

  if (issues.errors.length === 0 && issues.warnings.length === 0) {
    log('\n🎉 No critical issues found!', 'success');
    if (issues.info.length > 0) {
      log('\nℹ️  Information:', 'info');
      issues.info.forEach(info => log(`  - ${info}`, 'info'));
    }
  } else {
    if (issues.errors.length > 0) {
      log(`\n❌ Errors: ${issues.errors.length}`, 'error');
      issues.errors.forEach(error => log(`  - ${error}`, 'error'));
    }
    if (issues.warnings.length > 0) {
      log(`\n⚠️  Warnings: ${issues.warnings.length}`, 'warning');
      issues.warnings.forEach(warning => log(`  - ${warning}`, 'warning'));
    }
    if (issues.info.length > 0) {
      log('\nℹ️  Information:', 'info');
      issues.info.forEach(info => log(`  - ${info}`, 'info'));
    }
  }

  log('\n💡 Recommended Actions:', 'info');
  log('1. Run: node scripts/validate-auth0-env.js (validates environment variables)', 'info');
  log('2. Run: node scripts/check-auth0-config.js (validates Auth0 dashboard settings)', 'info');
  log('3. Review: docs/AUTH0_PRODUCTION_SETUP.md (complete setup guide)', 'info');
}

/**
 * Main execution
 */
function main() {
  loadEnvFile();

  log('🔍 Comprehensive Auth0 Issues Check', 'info');
  log('='.repeat(60), 'info');

  checkEnvVarUsage();
  checkHardcodedUrls();
  checkCallbackUrlConstruction();
  checkLogoutUrlValidation();
  checkErrorHandling();
  checkCommonIssues();
  generateReport();

  const hasErrors = issues.errors.length > 0;
  process.exit(hasErrors ? 1 : 0);
}

if (require.main === module) {
  main();
}

module.exports = { checkAuth0Issues: main };
