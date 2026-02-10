import fs from 'fs';
import path from 'path';

const configPath = path.join(process.cwd(), 'next.config.ts');

if (!fs.existsSync(configPath)) {
  console.error('❌ next.config.ts not found');
  process.exit(1);
}

const content = fs.readFileSync(configPath, 'utf-8');

// Check for serverExternalPackages
const requiredPackages = ['puppeteer-core', '@sparticuz/chromium'];
const missingPackages = [];

// Simple regex check - in a real scenario we might want to import the config,
// but ts-node compilation of next.config.ts can be tricky in scripts.
// This text-based check is sufficient for a regression guard.

if (!content.includes('serverExternalPackages')) {
  console.error('❌ serverExternalPackages not defined in next.config.ts');
  process.exit(1);
}

for (const pkg of requiredPackages) {
  if (!content.includes(`'${pkg}'`) && !content.includes(`"${pkg}"`)) {
    missingPackages.push(pkg);
  }
}

if (missingPackages.length > 0) {
  console.error(
    `❌ Missing critical serverExternalPackages in next.config.ts: ${missingPackages.join(', ')}`,
  );
  console.error('   These are required for PDF generation in serverless environments.');
  process.exit(1);
}

console.log('✅ next.config.ts contains required serverExternalPackages for PDF generation.');
