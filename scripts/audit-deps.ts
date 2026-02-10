/**
 * Unified Dependency Audit Script
 *
 * Runs npm audit to detect vulnerabilities and checks for heavy/unused dependencies.
 * Usage: npx tsx scripts/audit-deps.ts
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Thresholds
const VULNERABILITY_THRESHOLD = 'high'; // low, moderate, high, critical
const LEVELS = ['low', 'moderate', 'high', 'critical'];

interface AuditReport {
  vulnerabilities: Record<string, any>;
  metadata: {
    vulnerabilities: {
      info: number;
      low: number;
      moderate: number;
      high: number;
      critical: number;
      total: number;
    };
    dependencies: number;
    devDependencies: number;
    optionalDependencies: number;
    totalDependencies: number;
  };
}

console.log('🔍 Starting Unified Dependency Audit...');

try {
  // 1. Run npm audit
  console.log('\n🛡️  Running Security Audit (npm audit)...');
  let auditJson: AuditReport;
  try {
    const output = execSync('npm audit --json', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    auditJson = JSON.parse(output);
  } catch (e: any) {
    // npm audit returns non-zero exit code if vulnerabilities found
    if (e.stdout) {
      auditJson = JSON.parse(e.stdout);
    } else {
      throw e;
    }
  }

  const v = auditJson.metadata.vulnerabilities;
  console.log(
    `   Total Vulnerabilities: ${v.total} (Critical: ${v.critical}, High: ${v.high}, Moderate: ${v.moderate}, Low: ${v.low})`,
  );

  // Check threshold
  const thresholdIndex = LEVELS.indexOf(VULNERABILITY_THRESHOLD);
  let failed = false;

  LEVELS.forEach((level, index) => {
    if (index >= thresholdIndex && (v as any)[level] > 0) {
      console.error(`   ❌ FAILURE: Found ${level} vulnerabilities!`);
      failed = true;
    }
  });

  if (!failed) {
    console.log('   ✅ Security checks passed (within threshold).');
  }

  // 2. Check Heavy Dependencies (Legacy logic from audit-dependencies.js)
  console.log('\n📦 Checking Dependency Weights...');
  const heavyDeps = [
    'recharts',
    'chart.js',
    'lodash',
    'moment',
    'date-fns',
    'axios',
    'framer-motion',
    'react-query',
    'zustand',
  ];

  const packageJson = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'),
  );
  const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };

  const foundHeavy = heavyDeps.filter(d => allDeps[d]);
  if (foundHeavy.length > 0) {
    console.warn(`   ⚠️  Heavy dependencies detected: ${foundHeavy.join(', ')}`);
    console.warn('      Consider analyzing bundle size with `npm run analyze`.');
  } else {
    console.log('   ✅ No common heavy dependencies found.');
  }

  if (failed && process.env.CI) {
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Audit failed with unexpected error:', error);
  process.exit(1);
}
