#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Limits per spec
const LIMITS = {
  page: 500,
  component: 300,
  api: 200,
  util: 150,
  hook: 120, // Increased from 100 to accommodate coordination hooks
  data: 2000, // Data files with arrays can be larger
  config: 500, // Configuration/data files exception
  algorithm: 300, // Complex algorithms exception
  report: 300, // Report generators exception
};

const exts = new Set(['.ts', '.tsx', '.js', '.jsx']);

function detectCategory(filePath) {
  const p = filePath.replace(/\\/g, '/');

  // Configuration/data files exception (500 lines)
  if (
    p.includes('-styles.ts') ||
    p.includes('PrintStyles') ||
    p.includes('/menuPrintStyles/') ||
    p.includes('/orderListPrintStyles') ||
    p.includes('/prepListPrintStyles') ||
    p.includes('-config.ts') ||
    p.includes('standard-tasks.ts') ||
    p.includes('australian-allergens.ts') ||
    p.includes('country-config.ts')
  ) {
    return 'config';
  }

  // Complex algorithm exception (300 lines)
  if (
    p.includes('detection.ts') ||
    p.includes('category-detection.ts') ||
    p.includes('vegetarian-vegan-detection.ts')
  ) {
    return 'algorithm';
  }

  // Report generator exception (300 lines)
  if (
    p.includes('report-generator.ts') ||
    p.includes('pdf-template.ts') ||
    p.includes('/report-generator/')
  ) {
    return 'report';
  }

  // Exclude config files and scripts
  if (p.includes('next.config.') || p.includes('/scripts/')) return null;

  // Exclude protected curbos area
  if (p.includes('/app/curbos/')) return null;

  // Standard detection logic
  if (p.includes('/app/api/')) return 'api';
  if (p.match(/\/hooks\//) || /\/hooks\/[^/]+\.(t|j)sx?$/.test(p)) return 'hook';
  if ((p.startsWith('app/') || p.includes('/app/')) && /\/page\.(t|j)sx$/.test(p)) return 'page';
  if (p.match(/\/(components|ui)\//)) return 'component';
  // Check for data files (translations, seed data, sample data, guide data)
  if (
    p.includes('-data.ts') ||
    p.includes('sample-') ||
    p.includes('translations/') ||
    (p.includes('/data/') && p.endsWith('.ts'))
  )
    return 'data';
  if (p.match(/\/(lib|utils?)\//) || /\/utils?\.(t|j)s$/.test(p)) return 'util';
  // default to component for safety
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

function loadIgnoreList() {
  try {
    const ignorePath = path.join(__dirname, 'filesize-ignore.json');
    if (fs.existsSync(ignorePath)) {
      return new Set(require(ignorePath));
    }
  } catch (e) {
    console.warn('Warning: Could not load filesize-ignore.json', e.message);
  }
  return new Set();
}

function main() {
  const root = process.cwd();
  const filesArg = process.argv.slice(2);
  const files = filesArg.length > 0 ? filesArg : listFiles(root);
  const ignoredFiles = loadIgnoreList();

  const violations = [];

  for (const file of files) {
    if (!fs.existsSync(file)) continue;

    // Check if ignored (relative path from root)
    const relPath = path.relative(root, file);
    if (ignoredFiles.has(relPath)) continue;

    const ext = path.extname(file);
    if (!exts.has(ext)) continue;

    // Skip curbos area completely
    if (file.replace(/\\/g, '/').includes('/app/curbos/')) continue;

    const content = fs.readFileSync(file, 'utf8');
    const lines = countLines(content);
    const category = detectCategory(file);

    // Skip files that return null (excluded)
    if (category === null) continue;

    const limit = LIMITS[category];

    if (limit && lines > limit) {
      violations.push({ file, lines, limit, category });
    }
  }

  if (violations.length > 0) {
    console.error('File size limits exceeded:');
    for (const v of violations) {
      console.error(
        `- ${path.relative(process.cwd(), v.file)}: ${v.lines} lines (limit ${v.limit}, ${v.category})`,
      );
    }
    console.error('\nTo bypass, add the file to scripts/filesize-ignore.json (temporary only!)');
    process.exit(1);
  } else {
    console.log('✅ File size limits check passed.');
  }
}

main();
