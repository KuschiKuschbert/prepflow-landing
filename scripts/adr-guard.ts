import { execSync } from 'child_process';
import path from 'path';

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const NC = '\x1b[0m';

const ADR_DIR = path.join(process.cwd(), 'docs/adr');

function getStagedFiles(): string[] {
  try {
    const output = execSync('git diff --cached --name-only', { encoding: 'utf-8' });
    return output.split('\n').filter(f => f.trim().length > 0);
  } catch (e) {
    return [];
  }
}

function main() {
  console.log(`${BLUE}📖 The Documenter: Scanning for architectural changes...${NC}`);

  const stagedFiles = getStagedFiles();
  if (stagedFiles.length === 0) {
    console.log('   No staged changes detected. Skipping ADR scan.');
    return;
  }

  // Heuristics for "Significant Architectural Changes"
  const significantChanges = stagedFiles.filter(f => {
    // 1. New top-level directories in app/ or lib/
    if (f.match(/^(app|lib|components)\/[a-zA-Z0-9_-]+\/$/)) return true;

    // 2. Changes to core config files
    const coreConfigs = [
      'package.json',
      'next.config.js',
      'tailwind.config.ts',
      'tsconfig.json',
      '.env.example'
    ];
    if (coreConfigs.includes(f)) return true;

    // 3. New migrations
    if (f.startsWith('migrations/')) return true;

    return false;
  });

  if (significantChanges.length > 0) {
    console.log(`${YELLOW}⚠️  Detected significant structural changes:${NC}`);
    significantChanges.forEach(f => console.log(`   - ${f}`));

    // Check if a new ADR has been added in the same commit
    const newADR = stagedFiles.find(f => f.startsWith('docs/adr/') && f.endsWith('.md') && f !== 'docs/adr/TEMPLATE.md');

    if (!newADR) {
      console.warn(`\n${RED}❗ Architectural Decision Alert:${NC}`);
      console.warn(`   You've made structural changes but haven't recorded an ADR.`);
      console.warn(`   Please consider adding a record in ${BLUE}docs/adr/${NC} to preserve context.`);
      console.warn(`   Template: ${BLUE}docs/adr/TEMPLATE.md${NC}`);

      // We don't block the commit yet (soft guard), but we warn heavily.
      console.log(`\n${YELLOW}💡 Tip: Use 'npm run adr:new' to create one quickly.${NC}`);
    } else {
      console.log(`${GREEN}✅ Architectural change detected and ADR provided: ${newADR}${NC}`);
    }
  } else {
    console.log(`${GREEN}✅ No major structural changes detected.${NC}`);
  }
}

main();
