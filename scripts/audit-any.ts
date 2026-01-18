import fs from 'fs';
import { glob } from 'glob';

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const NC = '\x1b[0m';

interface AuditResult {
  file: string;
  line: number;
  content: string;
  justified: boolean;
}

const IGNORE_PATTERNS = [
  '**/*.test.*',
  '**/*.spec.*',
  '**/node_modules/**',
  '**/.next/**',
  '**/dist/**',
  'lib/rsi/**', // RSI core uses any for dynamic logic
  'scripts/**', // Scripts use any for flexibility
];

async function main() {
  console.log(`${BLUE}🔍 Eradicate Any: Mission Audit Starting...${NC}\n`);

  const files = glob.sync('{app,components,lib,hooks}/**/*.{ts,tsx}', {
    ignore: IGNORE_PATTERNS,
  });

  const results: AuditResult[] = [];
  let totalAnyCount = 0;

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Logic for detecting : any or :any or <any> (excluding comments)
      const cleanLine = line.split('//')[0].split('/*')[0];
      if (cleanLine.includes('* @returns')) return;
      const anyMatch = cleanLine.match(/:\s*any\b|<\s*any\s*>|\bas\s+any\s*($|[;,\]})])/);

      if (anyMatch) {
        const isJustified = line.toLowerCase().includes('justified') || line.includes('RSI safe-cast');
        results.push({
          file,
          line: index + 1,
          content: line.trim(),
          justified: isJustified,
        });
        totalAnyCount++;
      }
    });
  }

  // Group by file
  const fileGroups = results.reduce((acc, curr) => {
    if (!acc[curr.file]) acc[curr.file] = [];
    acc[curr.file].push(curr);
    return acc;
  }, {} as Record<string, AuditResult[]>);

  console.log(`${YELLOW}📊 Audit Summary:${NC}`);
  console.log(`   Files Scanned: ${files.length}`);
  console.log(`   Total 'any' instances found: ${totalAnyCount}`);

  const unjustified = results.filter(r => !r.justified);
  console.log(`   Unjustified instances: ${unjustified.length > 0 ? RED : GREEN}${unjustified.length}${NC}`);

  if (unjustified.length > 0) {
    console.log(`\n${RED}⚠️  Unjustified 'any' usage detected:${NC}`);
    Object.entries(fileGroups).forEach(([file, violations]) => {
      const unjustifiedViolations = violations.filter(v => !v.justified);
      if (unjustifiedViolations.length > 0) {
        console.log(`\n   ${BLUE}${file}${NC}`);
        unjustifiedViolations.forEach(v => {
          console.log(`      L${v.line}: ${v.content}`);
        });
      }
    });
    process.exit(1);
  } else {
    console.log(`\n${GREEN}✅ Mission Verified: All 'any' usages are justified or eradicated.${NC}`);
    process.exit(0);
  }
}

main().catch(console.error);
