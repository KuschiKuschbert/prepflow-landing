#!/usr/bin/env node

/**
 * Verify prerequisites for persona simulation tests.
 * Run before: npm run test:simulation or npm run test:simulation:headed
 *
 * Server must be running first (playwright.simulation.config uses reuseExistingServer: true):
 *   Terminal 1: npm run dev
 *   Terminal 2: npm run verify:simulation && npm run test:simulation:headed -- e2e/workflows/persona-cafe.spec.ts
 */
const fs = require('fs');
const path = require('path');

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

const checks = [];
let allOk = true;

// 1. SIM_AUTH_EMAIL
const hasEmail = !!process.env.SIM_AUTH_EMAIL;
checks.push({ name: 'SIM_AUTH_EMAIL', ok: hasEmail });
if (!hasEmail) allOk = false;

// 2. SIM_AUTH_PASSWORD
const hasPassword = !!process.env.SIM_AUTH_PASSWORD;
checks.push({ name: 'SIM_AUTH_PASSWORD', ok: hasPassword });
if (!hasPassword) allOk = false;

// 3. Auth0 vars
const hasAuth0 = !!(
  process.env.AUTH0_CLIENT_ID &&
  process.env.AUTH0_CLIENT_SECRET &&
  (process.env.AUTH0_ISSUER_BASE_URL || process.env.AUTH0_DOMAIN)
);
checks.push({ name: 'AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_ISSUER_BASE_URL', ok: hasAuth0 });
if (!hasAuth0) allOk = false;

// 4. AUTH0_SECRET (needed for session)
const hasSecret = !!process.env.AUTH0_SECRET;
checks.push({ name: 'AUTH0_SECRET', ok: hasSecret });
if (!hasSecret) allOk = false;

console.log('\n📋 Persona simulation prerequisites:\n');
checks.forEach(({ name, ok }) => {
  console.log(`  ${ok ? '✅' : '❌'} ${name}`);
});
console.log('\n');

if (!allOk) {
  console.log('⚠️  Add missing vars to .env.local (see env.example)\n');
  process.exit(1);
}

console.log('📌 Auth0 Dashboard – ensure these are configured:\n');
console.log('  Allowed Callback URLs:  http://localhost:3000/api/auth/callback');
console.log('  Allowed Logout URLs:    http://localhost:3000, http://localhost:3000/');
console.log('  Allowed Web Origins:    http://localhost:3000\n');
console.log('  Simulation user: simulation@prepflow.org (or your SIM_AUTH_EMAIL)\n');
console.log('Optional env vars:');
console.log('  SIM_DAYS=2      – Run only 2 days (quick validation)');
console.log('  SIM_RESILIENT=true – Continue on step failure, report all issues (discovery run)\n');
console.log('✅ All prerequisites OK. Run: npm run test:simulation:headed\n');
process.exit(0);
