#!/usr/bin/env node

/**
 * Security Check Module
 * Validates security patterns (input validation, rate limiting)
 * Source: security.mdc (Security Standards)
 */

const fs = require('fs');
const path = require('path');
const { createViolation } = require('../utils/violations');
const { getStandardConfig } = require('../utils/config');

function findAPIFiles() {
  const files = [];
  const apiDir = 'app/api';

  function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (/route\.(ts|js)$/.test(entry.name)) {
        files.push(fullPath);
      }
    }
  }

  if (fs.existsSync(apiDir)) {
    walkDir(apiDir);
  }
  return files;
}

function findComponentFiles() {
  const files = [];
  const searchDirs = ['app', 'components'];

  function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (/\.(tsx|jsx)$/.test(entry.name)) {
        files.push(fullPath);
      }
    }
  }

  searchDirs.forEach(dir => walkDir(dir));
  return files;
}

function checkSecurityPatterns(content, filePath) {
  const violations = [];
  const lines = content.split(/\r?\n/);
  const isAPIRoute = filePath.includes('/api/') && filePath.includes('route.');
  const isComponent = /\.(tsx|jsx)$/.test(filePath);
  const isConfig = filePath.includes('next.config.');

  // 1. Input Validation Enhancement
  if (isAPIRoute) {
    const hasZodImport = /import.*z.*from.*['"]zod['"]/.test(content);
    const hasZodSchema = /z\.object\(/.test(content) || /z\.string\(/.test(content);
    const hasRequestParsing = /req\.json\(\)/.test(content) ||
      /request\.json\(\)/.test(content) ||
      /await.*json\(\)/.test(content);
    const hasPOST = /export.*function.*POST/.test(content);
    const hasPUT = /export.*function.*PUT/.test(content);
    const hasPATCH = /export.*function.*PATCH/.test(content);
    const hasMutationMethod = hasPOST || hasPUT || hasPATCH;

    if (hasMutationMethod && hasRequestParsing && !hasZodImport && !hasZodSchema) {
      violations.push({
        type: 'missing-input-validation',
        line: findLineNumber(lines, /export.*function.*(POST|PUT|PATCH)/),
      });
    }

    // Check for validation before database operations
    if (hasZodSchema && hasRequestParsing) {
      const validationBeforeDB = content.indexOf('z.object') < content.indexOf('supabase') ||
        content.indexOf('z.object') < content.indexOf('from(');
      if (!validationBeforeDB && hasMutationMethod) {
        violations.push({
          type: 'validation-after-db',
          line: findLineNumber(lines, /supabase|from\(/),
        });
      }
    }
  }

  // 2. Rate Limiting Validation
  if (isAPIRoute) {
    const hasRateLimit = /rateLimit|rate-limit|ratelimit/i.test(content);
    const isPublicRoute = !filePath.includes('/api/auth/') && !filePath.includes('/api/webhook/');
    // Note: Rate limiting might be in middleware, so this is a warning
    if (isPublicRoute && !hasRateLimit) {
      violations.push({
        type: 'missing-rate-limiting',
        line: findLineNumber(lines, /export.*function/),
        severity: 'warning',
      });
    }
  }

  // 3. SQL Injection Prevention
  const hasSupabase = /supabase/.test(content) || /from\(['"]/.test(content);
  if (hasSupabase) {
    // Check for string concatenation in queries
    const hasStringConcat = /\+.*['"]/.test(content) && /\.from\(|\.select\(|\.insert\(|\.update\(|\.delete\(/.test(content);
    const hasTemplateLiteralInQuery = /`[^`]*\$\{[^}]+\}[^`]*`/.test(content) &&
      /\.from\(|\.select\(|\.insert\(|\.update\(|\.delete\(/.test(content);

    if (hasStringConcat && !hasTemplateLiteralInQuery) {
      violations.push({
        type: 'sql-injection-risk',
        line: findLineNumber(lines, /\+.*['"]/),
      });
    }

    // Check for raw SQL queries with user input
    const hasRawSQL = /\.rpc\(|\.query\(/.test(content);
    const hasUserInput = /req\.|request\.|body\.|params\./.test(content);
    if (hasRawSQL && hasUserInput) {
      violations.push({
        type: 'raw-sql-with-input',
        line: findLineNumber(lines, /\.rpc\(|\.query\(/),
      });
    }
  }

  // 4. XSS Prevention
  if (isComponent) {
    const hasDangerouslySetInnerHTML = /dangerouslySetInnerHTML/.test(content);
    const hasSanitize = /sanitize|DOMPurify/.test(content);
    if (hasDangerouslySetInnerHTML && !hasSanitize) {
      violations.push({
        type: 'xss-risk',
        line: findLineNumber(lines, /dangerouslySetInnerHTML/),
      });
    }
  }

  // 5. Security Headers Validation
  if (isConfig) {
    const hasSecurityHeaders = /X-Frame-Options|X-Content-Type-Options|Strict-Transport-Security|Content-Security-Policy/.test(content);
    if (!hasSecurityHeaders) {
      violations.push({
        type: 'missing-security-headers',
        line: findLineNumber(lines, /headers|nextConfig/),
      });
    }
  }

  return violations;
}

function findLineNumber(lines, pattern) {
  for (let i = 0; i < lines.length; i++) {
    if (pattern.test(lines[i])) {
      return i + 1;
    }
  }
  return undefined;
}

/**
 * Check security patterns
 */
async function checkSecurity(files = null) {
  const apiFiles = findAPIFiles();
  const componentFiles = findComponentFiles();
  const configFiles = ['next.config.ts', 'next.config.js'].filter(f => fs.existsSync(f));
  const filesToCheck = files || [...apiFiles, ...componentFiles, ...configFiles];
  const violations = [];
  const standardConfig = getStandardConfig('security');

  for (const file of filesToCheck) {
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, 'utf8');
    const found = checkSecurityPatterns(content, file);

    for (const violation of found) {
      let message;
      let reference = 'See cleanup.mdc (Security Standards) and security.mdc (Security Standards)';

      switch (violation.type) {
        case 'missing-input-validation':
          message = 'POST/PUT/PATCH routes should use Zod schemas for input validation';
          reference = 'See security.mdc (Input Validation)';
          break;
        case 'validation-after-db':
          message = 'Input validation should occur before database operations';
          reference = 'See security.mdc (Input Validation)';
          break;
        case 'missing-rate-limiting':
          message = 'Public API routes should implement rate limiting';
          reference = 'See security.mdc (Rate Limiting)';
          break;
        case 'sql-injection-risk':
          message = 'Database queries should use parameterized queries, not string concatenation';
          reference = 'See security.mdc (SQL Injection Prevention)';
          break;
        case 'raw-sql-with-input':
          message = 'Raw SQL queries with user input should be parameterized';
          reference = 'See security.mdc (SQL Injection Prevention)';
          break;
        case 'xss-risk':
          message = 'dangerouslySetInnerHTML should be sanitized with DOMPurify or similar';
          reference = 'See security.mdc (XSS Prevention)';
          break;
        case 'missing-security-headers':
          message = 'next.config.ts should include security headers (X-Frame-Options, CSP, etc.)';
          reference = 'See security.mdc (Security Headers)';
          break;
        default:
          message = 'Security pattern violation detected';
      }

      violations.push(
        createViolation({
          file: path.relative(process.cwd(), file),
          line: violation.line,
          message,
          severity: violation.severity || standardConfig.severity,
          fixable: standardConfig.fixable,
          standard: standardConfig.source,
          reference,
        }),
      );
    }
  }

  return {
    passed: violations.length === 0,
    violations,
    summary:
      violations.length === 0
        ? '✅ Security patterns check passed'
        : `❌ ${violations.length} security issue(s) found`,
  };
}

module.exports = {
  name: 'security',
  check: checkSecurity,
};
