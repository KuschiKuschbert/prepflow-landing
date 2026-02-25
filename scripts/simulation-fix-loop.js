#!/usr/bin/env node

/**
 * Simulation fix-loop: run simulations, parse reports, output fix list, exit 1 if issues.
 * Use in a loop: fix issues from output → re-run until clean.
 *
 * Usage:
 *   npm run simulation:fix-loop          # Run all personas, output fix list
 *   npm run simulation:fix-loop -- --no-run   # Only parse existing reports
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SKIP_RUN = process.argv.includes('--no-run');
const REPORT_GLOB = 'SIMULATION_REPORT_*.json';

function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf8')
      .split('\n')
      .forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const idx = trimmed.indexOf('=');
          if (idx > 0) {
            const key = trimmed.slice(0, idx).trim();
            const value = trimmed
              .slice(idx + 1)
              .trim()
              .replace(/^["']|["']$/g, '');
            if (!process.env[key]) process.env[key] = value;
          }
        }
      });
  }
}

loadEnv();

function runSimulation() {
  if (SKIP_RUN) {
    console.log('⏭️  Skipping run (--no-run). Parsing existing reports.\n');
    return true;
  }
  console.log('🚀 Running simulations...\n');
  const result = spawnSync('npm', ['run', 'test:simulation'], {
    stdio: 'inherit',
    env: { ...process.env, CI: undefined, SIM_RESILIENT: 'true' },
    cwd: process.cwd(),
  });
  return result.status === 0;
}

const REPORTS_DIR = path.join(process.cwd(), 'e2e', 'simulation', 'reports');

function findReports() {
  if (!fs.existsSync(REPORTS_DIR)) return [];
  const names = fs
    .readdirSync(REPORTS_DIR)
    .filter(f => f.startsWith('SIMULATION_REPORT_') && f.endsWith('.json'));
  return names.map(name => path.join(REPORTS_DIR, name));
}

function parseReports(reportPaths) {
  const all = { faultyPaths: [], bottlenecks: [], errors: [], connectionRefused: 0 };
  for (const p of reportPaths) {
    try {
      const data = JSON.parse(fs.readFileSync(p, 'utf8'));
      (data.faultyPaths || []).forEach(f =>
        all.faultyPaths.push({ ...f, report: path.basename(p) }),
      );
      (data.bottlenecks || []).forEach(b =>
        all.bottlenecks.push({ ...b, report: path.basename(p) }),
      );
      (data.errors || []).forEach(e => {
        if (
          (e.message || '').includes('ERR_CONNECTION_REFUSED') ||
          (e.url || '').includes('chromewebdata')
        ) {
          all.connectionRefused++;
        } else {
          all.errors.push({ ...e, report: path.basename(p) });
        }
      });
    } catch (err) {
      console.warn('⚠️  Could not parse', p, err.message);
    }
  }
  return all;
}

function isConnectionRefused(f) {
  const msg = (f.errorMessage || '').toLowerCase();
  const url = (f.url || '').toLowerCase();
  return msg.includes('err_connection_refused') || url.includes('chromewebdata');
}

function dedupeFaultyPaths(paths) {
  const seen = new Set();
  return paths.filter(f => {
    const key = `${f.personaId}:${f.action}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function printFixList(data) {
  const connRefusedPaths = data.faultyPaths.filter(isConnectionRefused);
  const realFaulty = data.faultyPaths.filter(f => !isConnectionRefused(f));
  const faulty = dedupeFaultyPaths(realFaulty);
  const connRefused = connRefusedPaths.length;

  console.log('═'.repeat(60));
  console.log('SIMULATION FIX LIST');
  console.log('═'.repeat(60));
  console.log('');

  if (connRefused > 0) {
    console.log('❌ INFRASTRUCTURE: Server was not running for some personas');
    console.log(`   ${connRefused} faulty paths failed with ERR_CONNECTION_REFUSED`);
    console.log('   Fix: Ensure npm run dev is started, or use reuseExistingServer: false');
    console.log('');
  }

  if (faulty.length > 0) {
    console.log('📌 FAULTY PATHS (selector/timeout/navigation):');
    faulty.forEach((f, i) => {
      console.log(`   ${i + 1}. ${f.personaId} / ${f.action} @ ${f.url || 'unknown'}`);
      if (f.errorMessage) {
        const preview = f.errorMessage.split('\n')[0].slice(0, 100);
        console.log(`      ${preview}${preview.length >= 100 ? '...' : ''}`);
      }
    });
    console.log('');
  }

  if (data.bottlenecks.length > 0) {
    console.log('⏱️  BOTTLENECKS (>5s):');
    data.bottlenecks.forEach((b, i) => {
      console.log(
        `   ${i + 1}. ${b.personaId} / ${b.action}: ${b.durationMs}ms (threshold ${b.thresholdMs}ms) @ ${b.url}`,
      );
    });
    console.log('');
  }

  if (data.errors.length > 0) {
    const byType = {};
    data.errors.forEach(e => {
      const t = e.type || 'unknown';
      byType[t] = (byType[t] || 0) + 1;
    });
    console.log('🔴 ERRORS (excluding noise):');
    Object.entries(byType).forEach(([type, count]) => console.log(`   ${type}: ${count}`));
    const uncaught = data.errors.filter(e => e.type === 'uncaught');
    if (uncaught.length > 0) {
      console.log('   Sample uncaught:', uncaught[0].message?.slice(0, 120) || '');
    }
    console.log('');
  }

  const total =
    connRefused + faulty.length + data.bottlenecks.length + (data.errors.length > 0 ? 1 : 0);
  console.log('═'.repeat(60));
  if (total === 0) {
    console.log('✅ No issues. Simulations clean.');
    return 0;
  }
  console.log(`📋 ${total} issue group(s) to fix. Fix → re-run until clean.`);
  console.log('═'.repeat(60));
  return 1;
}

// Main
const reportPaths = findReports();

if (!SKIP_RUN) {
  const ok = runSimulation();
  if (!ok) {
    console.log('\n⚠️  Simulation run failed. Check output above.');
    process.exit(1);
  }
}

const updatedPaths = findReports();
if (updatedPaths.length === 0) {
  console.log(`No SIMULATION_REPORT_*.json found in ${REPORTS_DIR}. Run: npm run test:simulation`);
  process.exit(1);
}

const data = parseReports(updatedPaths);
const exitCode = printFixList(data);
process.exit(exitCode);
