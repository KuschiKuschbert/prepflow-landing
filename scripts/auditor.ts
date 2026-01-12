import fs from 'fs';
import { glob } from 'glob';

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const NC = '\x1b[0m';

console.log(`${YELLOW}👮 The Auditor: Starting Security & Performance Audit...${NC}`);

// Configuration
const CONFIG = {
  // Secret Patterns
  secretPatterns: [
    { name: 'Stripe Secret Key', regex: /sk_live_[0-9a-zA-Z]{24}/ },
    { name: 'GitHub Token', regex: /ghp_[0-9a-zA-Z]{36}/ },
    { name: 'Google API Key', regex: /AIza[0-9A-Za-z-_]{35}/ },
    { name: 'Generic API Key', regex: /(api_key|apiKey|secret|token)\s*[:=]\s*['"`][a-zA-Z0-9_\-]{20,}['"`]/i },
    { name: 'Private Key Block', regex: /-----BEGIN PRIVATE KEY-----/ }
  ],
  // Asset Limits (Bytes)
  assetWarning: 500 * 1024, // 500KB
  assetError: 2 * 1024 * 1024, // 2MB
  ignorePatterns: [
    '**/*.test.*',
    '**/*.spec.*',
    '**/dist/**',
    '**/node_modules/**',
    '**/.next/**',
    'scripts/auditor.ts', // Don't flag myself
    '**/package-lock.json',
    '**/yarn.lock'
  ]
};

function scanSecrets(): boolean {
  console.log(`\n${YELLOW}🕵️  Scanning for Secrets...${NC}`);

  const files = glob.sync('{app,components,lib,utils,hooks,pages,scripts}/**/*.{ts,tsx,js,jsx,json,env,env.local}', {
    ignore: CONFIG.ignorePatterns
  });

  let issuesFound = 0;

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');

    for (const pattern of CONFIG.secretPatterns) {
      if (pattern.regex.test(content)) {
        console.error(`${RED}❌ Security Risk in ${file}:${NC}`);
        console.error(`   Found potential ${pattern.name}`);
        issuesFound++;
      }
    }
  }

  if (issuesFound > 0) {
    console.error(`${RED}💥 ${issuesFound} potential secrets found. Build blocked.${NC}`);
    return false;
  }

  console.log(`${GREEN}✅ No secrets detected.${NC}`);
  return true;
}

function scanAssets(): boolean {
  console.log(`\n${YELLOW}⚖️  Weighing Assets (public/)...${NC}`);

  // Find all files in public
  const publicDir = 'public';
  if (!fs.existsSync(publicDir)) {
      console.log(`${YELLOW}Skipping asset check (no public/ dir found).${NC}`);
      return true;
  }

  const files = glob.sync('public/**/*.*');
  let hasErrors = false;

  for (const file of files) {
    const stats = fs.statSync(file);
    const sizeKB = Math.round(stats.size / 1024);

    if (stats.size > CONFIG.assetError) {
      console.error(`${RED}❌ Asset too large: ${file} (${sizeKB}KB)${NC}`);
      console.error(`   Limit is 2MB. Please compress or host externally.`);
      hasErrors = true;
    } else if (stats.size > CONFIG.assetWarning) {
      console.warn(`${YELLOW}⚠️  Asset Warning: ${file} (${sizeKB}KB)${NC}`);
      console.warn(`   Consider optimizing (Limit: 500KB)`);
    }
  }

  if (hasErrors) {
      console.error(`${RED}💥 Asset weight limit exceeded. Build blocked.${NC}`);
      return false;
  }

  console.log(`${GREEN}✅ Assets within limits.${NC}`);
  return true;
}

async function main() {
  let success = true;

  if (!scanSecrets()) success = false;
  if (!scanAssets()) success = false;

  if (!success) {
    process.exit(1);
  } else {
    console.log(`\n${GREEN}✅ The Auditor approves this code.${NC}`);
  }
}

main().catch(console.error);
