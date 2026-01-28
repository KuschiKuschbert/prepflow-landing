import fs from 'fs';
import path from 'path';

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const NC = '\x1b[0m';

const SUMMARY_PATH = path.join(process.cwd(), 'coverage/coverage-summary.json');

interface CoverageData {
  total: number;
  covered: number;
  skipped: number;
  pct: number;
}

interface FileCoverage {
  lines: CoverageData;
  functions: CoverageData;
  statements: CoverageData;
  branches: CoverageData;
}

interface Summary {
  [key: string]: FileCoverage;
}

function main() {
  console.log(`${BLUE}🔍 The Coverage Guardian: Scanning for Zero-Coverage files...${NC}\n`);

  if (!fs.existsSync(SUMMARY_PATH)) {
    console.error(`${RED}❌ Error: Coverage summary not found at ${SUMMARY_PATH}${NC}`);
    console.error(`${YELLOW}   Run 'npm run test:coverage' first.${NC}`);
    process.exit(1);
  }

  const summary: Summary = JSON.parse(fs.readFileSync(SUMMARY_PATH, 'utf-8'));
  const files = Object.keys(summary).filter(f => f !== 'total');

  const zeroCoverageFiles: string[] = [];
  const lowCoverageFiles: string[] = [];
  const CRITICAL_THRESHOLD = 20; // Percent

  files.forEach(file => {
    const data = summary[file];
    const relPath = path.relative(process.cwd(), file);

    if (data.lines.pct === 0) {
      zeroCoverageFiles.push(relPath);
    } else if (data.lines.pct < CRITICAL_THRESHOLD) {
      lowCoverageFiles.push(`${relPath} (${data.lines.pct}%)`);
    }
  });

  console.log(`${YELLOW}📊 Coverage Stats:${NC}`);
  console.log(`   Files Scanned: ${files.length}`);
  console.log(`   Zero-Coverage Files (The Wall of Shame): ${zeroCoverageFiles.length > 0 ? RED : GREEN}${zeroCoverageFiles.length}${NC}`);
  console.log(`   Low-Coverage Files (<${CRITICAL_THRESHOLD}%): ${lowCoverageFiles.length > 0 ? YELLOW : GREEN}${lowCoverageFiles.length}${NC}\n`);

  if (zeroCoverageFiles.length > 0) {
    console.log(`${RED}🟥 Wall of Shame (0% Coverage):${NC}`);
    // Show top 20 to avoid spam
    zeroCoverageFiles.slice(0, 20).forEach(f => console.log(`   - ${f}`));
    if (zeroCoverageFiles.length > 20) {
      console.log(`   ... and ${zeroCoverageFiles.length - 20} more.`);
    }
  }

  if (lowCoverageFiles.length > 0) {
    console.log(`\n${YELLOW}🟨 Critical Gaps (<${CRITICAL_THRESHOLD}%):${NC}`);
    lowCoverageFiles.slice(0, 20).forEach(f => console.log(`   - ${f}`));
  }

  console.log(`\n${BLUE}💡 Suggestion: Use 'npm run generate:tests' to create smoke tests for these files.${NC}`);
}

main();
