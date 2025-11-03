#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function fileExists(p) {
  try {
    fs.accessSync(p, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function assert(cond, msg) {
  if (!cond) {
    console.error('❌', msg);
    process.exitCode = 1;
  }
}

const root = process.cwd();
const terms = path.join(root, 'app/terms-of-service/page.tsx');
const privacy = path.join(root, 'app/privacy-policy/page.tsx');
assert(fileExists(terms), 'Missing Terms of Service page');
assert(fileExists(privacy), 'Missing Privacy Policy page');

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const engines = (pkg.engines && pkg.engines.node) || '';
assert(
  /22\./.test(engines) || engines.includes('>=22'),
  'package.json engines.node should target Node 22',
);

const nvmrc = path.join(root, '.nvmrc');
if (fileExists(nvmrc)) {
  const nvm = fs.readFileSync(nvmrc, 'utf8').trim();
  assert(nvm.startsWith('22'), '.nvmrc should pin Node 22');
}

if (process.exitCode) {
  console.error('Health checks failed.');
  process.exit(process.exitCode);
} else {
  console.log('✅ Legal pages and Node version checks passed.');
}
