import fs from 'fs';
import path from 'path';

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const NC = '\x1b[0m';

const BASELINE_PATH = path.join(process.cwd(), '.bundle-baseline.json');
const NEXT_STATIC_DIR = path.join(process.cwd(), '.next/static');
const BUDGET_KB = 10; // 10KB budget for increases

interface Baseline {
  totalSize: number;
  timestamp: string;
}

function getBundleSize(): number {
  if (!fs.existsSync(NEXT_STATIC_DIR)) {
    return 0;
  }

  let totalSize = 0;

  function walk(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (file.endsWith('.js') || file.endsWith('.css')) {
        totalSize += stat.size;
      }
    }
  }

  walk(NEXT_STATIC_DIR);
  return totalSize;
}

function main() {
  const isSave = process.argv.includes('--save');
  const currentSize = getBundleSize();

  if (currentSize === 0) {
    console.error(`${RED}❌ Error: No bundle found at ${NEXT_STATIC_DIR}${NC}`);
    console.error(`${YELLOW}   Run 'npm run build' first.${NC}`);
    process.exit(1);
  }

  const currentSizeKB = Math.round(currentSize / 1024);

  if (isSave) {
    const baseline: Baseline = {
      totalSize: currentSize,
      timestamp: new Date().toISOString(),
    };
    fs.writeFileSync(BASELINE_PATH, JSON.stringify(baseline, null, 2));
    console.log(`${GREEN}✅ Baseline saved: ${currentSizeKB}KB${NC}`);
    return;
  }

  if (!fs.existsSync(BASELINE_PATH)) {
    console.warn(`${YELLOW}⚠️  No baseline found at ${BASELINE_PATH}${NC}`);
    console.log(`${BLUE}💡 Run 'tsx scripts/bundle-budget.ts --save' to set current size as baseline.${NC}`);
    return;
  }

  const baseline: Baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf-8'));
  const diff = currentSize - baseline.totalSize;
  const diffKB = Math.round(diff / 1024);

  console.log(`${BLUE}📦 Bundle Budget Check:${NC}`);
  console.log(`   Baseline: ${Math.round(baseline.totalSize / 1024)}KB`);
  console.log(`   Current:  ${currentSizeKB}KB`);
  console.log(`   Change:   ${diffKB > 0 ? RED : GREEN}${diffKB > 0 ? '+' : ''}${diffKB}KB${NC}`);

  if (diffKB > BUDGET_KB) {
    console.error(`${RED}❌ Budget Exceeded! Bundle increased by ${diffKB}KB (Limit: ${BUDGET_KB}KB)${NC}`);
    console.error(`   Please optimize your changes or update the baseline if this increase is expected.`);
    process.exit(1);
  } else {
    console.log(`${GREEN}✅ Bundle stays within budget.${NC}`);
  }
}

main();
