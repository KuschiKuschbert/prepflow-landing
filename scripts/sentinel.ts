import fs from 'fs';
import { glob } from 'glob';

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const NC = '\x1b[0m';

// Configuration
const CONFIG = {
  maxTodos: 50,
  maxLines: 500,
  maxIndentDepth: 6, // 6 levels of indentation suggests complexity
  ignorePatterns: ['**/*.test.*', '**/*.spec.*', '**/dist/**', '**/node_modules/**', '**/.next/**'],
};

console.log(`${YELLOW}🛡️  The Sentinel: Starting Health Scan...${NC}`);

interface FileStats {
  path: string;
  lines: number;
  todos: number;
  maxIndent: number;
}

function scanFile(filePath: string): FileStats {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  // Count TODOs
  // Case insensitive todo/fixme match
  const todos = (content.match(/\/\/\s*(TODO|FIXME)/gi) || []).length;

  // Complexity check (indentation)
  let maxIndent = 0;
  for (const line of lines) {
    if (line.trim().length === 0) continue;

    // Count leading spaces
    const spaces = line.search(/\S/);
    if (spaces > -1) {
      // Assuming 2 space indentation, depth = spaces / 2
      const depth = Math.floor(spaces / 2);
      if (depth > maxIndent) maxIndent = depth;
    }
  }

  return {
    path: filePath,
    lines: lines.length,
    todos,
    maxIndent,
  };
}

async function main() {
  const files = glob.sync('{app,components,lib,utils,hooks}/**/*.{ts,tsx,js,jsx}', {
    ignore: CONFIG.ignorePatterns,
  });

  console.log(`Scanning ${files.length} files...`);

  let totalTodos = 0;
  let hasErrors = false;

  for (const file of files) {
    const stats = scanFile(file);
    totalTodos += stats.todos;

    // Check Big Files
    if (stats.lines > CONFIG.maxLines) {
      console.warn(`${YELLOW}⚠️  File Size Warning:${NC} ${file} (${stats.lines} lines)`);
    }

    // Check Complexity
    if (stats.maxIndent > CONFIG.maxIndentDepth) {
      console.warn(
        `${YELLOW}⚠️  Complexity Warning:${NC} ${file} (Indent depth: ${stats.maxIndent})`,
      );
    }
  }

  console.log(`\n${YELLOW}📊 Health Report:${NC}`);
  console.log(`   Total TODO/FIXME count: ${totalTodos} (Limit: ${CONFIG.maxTodos})`);

  if (totalTodos > CONFIG.maxTodos) {
    console.error(`${RED}❌ Debt Ceiling Breached! Too many TODOs.${NC}`);
    console.error(`   Please resolve ${totalTodos - CONFIG.maxTodos} TODOs before merging.`);
    hasErrors = true;
  } else if (totalTodos > CONFIG.maxTodos * 0.8) {
    console.warn(`${YELLOW}⚠️  Approaching Debt Ceiling!${NC}`);
  } else {
    console.log(`${GREEN}✅ Tech Debt within acceptable limits.${NC}`);
  }

  // Check for 'any' types (Eradicate Any Mission)
  console.log(`\n${YELLOW}🔍 Eradicate Any Audit...${NC}`);
  try {
    const { execSync } = require('child_process');
    execSync('npm run audit:any', { stdio: 'inherit' });
    console.log(`${GREEN}✅ No unjustified 'any' types found.${NC}`);
  } catch (error) {
    console.warn(`${YELLOW}⚠️  Unjustified 'any' types detected!${NC}`);
    console.warn(`   Run 'npm run audit:any' to see details.`);
  }

  if (hasErrors) {
    console.error(`\n${RED}💥 Health checks failed.${NC}`);
    process.exit(1);
  } else {
    console.log(`\n${GREEN}✅ The Sentinel passes this code.${NC}`);
  }
}

main().catch(console.error);
