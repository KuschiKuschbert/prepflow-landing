/**
 * Check Skills Script
 *
 * Verifies that the codebase adheres to the installed skills and standards.
 * Checks for presence of critical configuration files and directories.
 */

import fs from 'fs';
import path from 'path';

const REQUIRED_FILES = [
  '.husky/commit-msg',
  'commitlint.config.js',
  'lighthouse.config.js',
  '.agent/skills',
  'package.json',
  'tsconfig.json',
];

const REQUIRED_SCRIPTS = [
  'audit:deps',
  'prepare', // husky
  'lint',
  'type-check',
];

console.log('🕵️  Verifying Skills & Standards...');

let failed = false;

// 1. Check Files
REQUIRED_FILES.forEach(file => {
  if (!fs.existsSync(path.join(process.cwd(), file))) {
    console.error(`   ❌ Missing required file/directory: ${file}`);
    failed = true;
  } else {
    console.log(`   ✅ Found ${file}`);
  }
});

// 2. Check Package Scripts
try {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'),
  );
  REQUIRED_SCRIPTS.forEach(script => {
    if (!packageJson.scripts || !packageJson.scripts[script]) {
      console.error(`   ❌ Missing npm script: ${script}`);
      failed = true;
    } else {
      console.log(`   ✅ Found script: ${script}`);
    }
  });
} catch (_e) {
  console.error('   ❌ Failed to read package.json');
  failed = true;
}

if (failed) {
  console.error('\n❌ Skills verification FAILED. Please ensure all standards are applied.');
  process.exit(1);
} else {
  console.log('\n✅ All skills and standards verified successfully.');
}
