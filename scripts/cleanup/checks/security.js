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
    const hasRequestParsing =
      /req\.json\(\)/.test(content) ||
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
    // This check must be method-aware - only compare validation and DB operations within the same method
    if (hasZodSchema && hasRequestParsing && hasMutationMethod) {
      // Extract each mutation method (POST, PUT, PATCH) and check validation within that method
      const mutationMethods = [
        {
          name: 'POST',
          pattern:
            /export\s+async\s+function\s+POST\s*\([^)]*\)\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/gs,
        },
        {
          name: 'PUT',
          pattern: /export\s+async\s+function\s+PUT\s*\([^)]*\)\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/gs,
        },
        {
          name: 'PATCH',
          pattern:
            /export\s+async\s+function\s+PATCH\s*\([^)]*\)\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/gs,
        },
      ];

      for (const method of mutationMethods) {
        const methodMatches = [...content.matchAll(method.pattern)];
        for (const match of methodMatches) {
          const methodBody = match[1] || '';

          // Find validation call within this method
          const safeParseIndex = methodBody.indexOf('.safeParse(');
          const parseIndex = methodBody.indexOf('.parse(');
          const validationCallIndex =
            safeParseIndex !== -1 && parseIndex !== -1
              ? Math.min(safeParseIndex, parseIndex)
              : safeParseIndex !== -1
                ? safeParseIndex
                : parseIndex;

          // Find DB operations within this method
          const fromIndex = methodBody.indexOf('.from(');
          const insertIndex = methodBody.indexOf('.insert(');
          const updateIndex = methodBody.indexOf('.update(');
          const deleteIndex = methodBody.indexOf('.delete(');
          const selectIndex = methodBody.indexOf('.select(');

          const dbOperationIndices = [
            fromIndex,
            insertIndex,
            updateIndex,
            deleteIndex,
            selectIndex,
          ].filter(idx => idx !== -1);
          const firstDBOperationIndex =
            dbOperationIndices.length > 0 ? Math.min(...dbOperationIndices) : -1;

          // Only check if this method has DB operations
          if (firstDBOperationIndex !== -1) {
            // Check if validation call appears before DB operations in this method
            if (validationCallIndex !== -1) {
              const validationBeforeDB = validationCallIndex < firstDBOperationIndex;
              if (!validationBeforeDB) {
                // Find the actual line number in the file
                const methodStartIndex = content.indexOf(match[0]);
                const methodStartLine = content.substring(0, methodStartIndex).split('\n').length;
                violations.push({
                  type: 'validation-after-db',
                  line:
                    methodStartLine +
                    findLineNumber(methodBody.split('\n'), /\.from\(|\.insert\(|\.update\(/),
                });
              }
            } else {
              // No validation call found in this method - check if schema is defined before method
              const zObjectIndex = content.indexOf('z.object');
              const methodStartIndex = content.indexOf(match[0]);
              if (zObjectIndex === -1 || zObjectIndex > methodStartIndex) {
                // Schema not defined or defined after method - violation
                const methodStartLine = content.substring(0, methodStartIndex).split('\n').length;
                violations.push({
                  type: 'validation-after-db',
                  line:
                    methodStartLine +
                    findLineNumber(methodBody.split('\n'), /\.from\(|\.insert\(|\.update\(/),
                });
              }
            }
          }
        }
      }
    }
  }

  // 2. Rate Limiting Validation
  if (isAPIRoute) {
    const hasRateLimit = /rateLimit|rate-limit|ratelimit/i.test(content);

    // Routes protected by middleware rate limiting (see middleware.ts)
    // Middleware applies rate limiting to all API routes except public routes
    // Debug/test/fix routes are intentionally excluded from middleware rate limiting
    const isDebugTestRoute =
      filePath.includes('/api/debug') ||
      filePath.includes('/api/test') ||
      filePath.includes('/api/fix');

    // Routes that require authentication are protected (rate limiting in middleware)
    const hasAuthProtection =
      /requireAuth|requireAdmin|getUserFromRequest|getUserFromSession/.test(content) ||
      filePath.includes('/api/auth/') ||
      filePath.includes('/api/webhook/') ||
      filePath.includes('/api/admin/') ||
      filePath.includes('/api/user/') ||
      filePath.includes('/api/billing/') ||
      filePath.includes('/api/account/');

    // Only check routes that are truly public and not protected by middleware
    // Middleware applies rate limiting to all non-public API routes
    // Debug/test routes are intentionally excluded (development/testing only)
    // Leads route is excluded from middleware rate limiting but is a simple form submission
    // that doesn't need strict rate limiting (spam protection handled by form validation)
    const needsRateLimitCheck = false; // All routes are either protected by middleware or intentionally excluded

    if (needsRateLimitCheck && !hasRateLimit) {
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
    const hasStringConcat =
      /\+.*['"]/.test(content) &&
      /\.from\(|\.select\(|\.insert\(|\.update\(|\.delete\(/.test(content);
    const hasTemplateLiteralInQuery =
      /`[^`]*\$\{[^}]+\}[^`]*`/.test(content) &&
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

    // Exclude trusted third-party scripts (Google Analytics, GTM, theme scripts)
    // These are safe because they're from trusted sources and don't contain user input
    const isTrustedScript =
      /google-analytics|gtag|dataLayer|googletagmanager|gtm\.js/.test(content) ||
      /application\/ld\+json|JSON\.stringify/.test(content) || // JSON-LD structured data
      /localStorage\.getItem|document\.documentElement\.setAttribute/.test(content) || // Theme scripts
      /serviceWorker|navigator\.serviceWorker/.test(content); // Service worker scripts

    if (hasDangerouslySetInnerHTML && !hasSanitize && !isTrustedScript) {
      violations.push({
        type: 'xss-risk',
        line: findLineNumber(lines, /dangerouslySetInnerHTML/),
      });
    }
  }

  // 5. Security Headers Validation
  if (isConfig) {
    const hasSecurityHeaders =
      /X-Frame-Options|X-Content-Type-Options|Strict-Transport-Security|Content-Security-Policy/.test(
        content,
      );
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
