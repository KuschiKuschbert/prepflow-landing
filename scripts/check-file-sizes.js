#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Limits per spec
const LIMITS = {
  page: 500,
  component: 300,
  api: 200,
  util: 150,
  hook: 100,
};

const exts = new Set(['.ts', '.tsx', '.js', '.jsx']);

function detectCategory(filePath) {
  const p = filePath.replace(/\\/g, '/');
  if (p.includes('/app/api/')) return 'api';
  if (p.match(/\/hooks\//) || /\/hooks\/[^/]+\.(t|j)sx?$/.test(p)) return 'hook';
  if (p.includes('/app/') && /\/page\.(t|j)sx$/.test(p)) return 'page';
  if (p.match(/\/(components|ui)\//)) return 'component';
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

function main() {
  const root = process.cwd();
  const filesArg = process.argv.slice(2);
  const files = filesArg.length > 0 ? filesArg : listFiles(root);

  const violations = [];

  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const ext = path.extname(file);
    if (!exts.has(ext)) continue;

    const content = fs.readFileSync(file, 'utf8');
    const lines = countLines(content);
    const category = detectCategory(file);
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
    process.exit(1);
  } else {
    console.log('✅ File size limits check passed.');
  }
}

main();
