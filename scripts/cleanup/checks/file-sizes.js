#!/usr/bin/env node

/**
 * File Size Check Module
 * Validates file size limits per category
 * Source: development.mdc (File Refactoring Standards)
 */

const fs = require('fs');
const path = require('path');
const { createViolation } = require('../utils/violations');
const { getStandardConfig } = require('../utils/config');

const LIMITS = {
  page: 500,
  component: 300,
  api: 200,
  util: 150,
  hook: 100,
  data: 2000,
};

const exts = new Set(['.ts', '.tsx', '.js', '.jsx']);

function detectCategory(filePath) {
  const p = filePath.replace(/\\/g, '/');
  if (p.includes('/app/api/')) return 'api';
  if (p.match(/\/hooks\//) || /\/hooks\/[^/]+\.(t|j)sx?$/.test(p)) return 'hook';
  if ((p.startsWith('app/') || p.includes('/app/')) && /\/page\.(t|j)sx$/.test(p)) return 'page';
  if (p.match(/\/(components|ui)\//)) return 'component';
  if (p.includes('-data.ts') || p.includes('sample-') || p.includes('translations/')) return 'data';
  if (p.match(/\/(lib|utils?)\//) || /\/utils?\.(t|j)s$/.test(p)) return 'util';
  return 'component';
}

function countLines(content) {
  return content.split(/\r?\n/).length;
}

function listFiles(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  const result = [];
  for (const item of items) {
    if (item.name.startsWith('.next') || item.name === 'node_modules' || item.name === '.git')
      continue;
    const full = path.join(dir, item.name);
    if (item.isDirectory()) result.push(...listFiles(full));
    else if (exts.has(path.extname(item.name))) result.push(full);
  }
  return result;
}

/**
 * Check file sizes
 */
async function checkFileSizes(files = null) {
  const root = process.cwd();
  const filesToCheck = files || listFiles(root);
  const violations = [];
  const standardConfig = getStandardConfig('file-sizes');

  for (const file of filesToCheck) {
    if (!fs.existsSync(file)) continue;
    const ext = path.extname(file);
    if (!exts.has(ext)) continue;

    const content = fs.readFileSync(file, 'utf8');
    const lines = countLines(content);
    const category = detectCategory(file);
    const limit = LIMITS[category];

    if (limit && lines > limit) {
      violations.push(
        createViolation({
          file: path.relative(root, file),
          message: `File exceeds ${category} limit: ${lines} lines (limit ${limit})`,
          severity: standardConfig.severity,
          fixable: standardConfig.fixable,
          standard: standardConfig.source,
          reference: 'See cleanup.mdc (File Size Limits) for refactoring guidelines',
        }),
      );
    }
  }

  return {
    passed: violations.length === 0,
    violations,
    summary:
      violations.length === 0
        ? '✅ All files within size limits'
        : `❌ ${violations.length} file(s) exceed size limits`,
  };
}

module.exports = {
  name: 'file-sizes',
  check: checkFileSizes,
};

