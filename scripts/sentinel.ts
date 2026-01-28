import { execSync } from 'child_process';
import fs from 'fs';
import { glob } from 'glob';

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const NC = '\x1b[0m';

// Configuration
const CONFIG = {
  maxTodos: 50,
  maxLines: 500,
  maxFunctionLines: 60, // 60 lines is a good threshold for refactoring
  maxIndentDepth: 6, // 6 levels of indentation suggests complexity
  ignorePatterns: ['**/*.test.*', '**/*.spec.*', '**/dist/**', '**/node_modules/**', '**/.next/**'],
};

console.log(`${YELLOW}🛡️  The Sentinel: Starting Health Scan...${NC}`);

interface FileStats {
  path: string;
  lines: number;
  todos: number;
  maxIndent: number;
  longFunctions: { name: string; lines: number; start: number }[];
  exports: string[];
}

function scanFile(filePath: string): FileStats {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  // Count TODOs
  const todos = (content.match(/\/\/\s*(TODO|FIXME)/gi) || []).length;

  // Track Function Length (Heuristic)
  const longFunctions: { name: string; lines: number; start: number }[] = [];
  let currentIndent = 0;
  let maxIndent = 0;

  // Basic stack for tracking potential function starts
  const stack: { name: string; start: number; level: number }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.length === 0) continue;

    // Count leading spaces (Max Indent check)
    const spaces = line.search(/\S/);
    if (spaces > -1) {
      const depth = Math.floor(spaces / 2);
      if (depth > maxIndent) maxIndent = depth;
    }

    // Heuristic for function starts:
    // "function name() {" or "name = (...) => {"
    const funcMatch = trimmed.match(/(?:function\s+([a-zA-Z0-9_]+)|([a-zA-Z0-9_]+)\s*=\s*(?:async\s*)?\(.*?\)\s*=>)\s*{/);

    // Track nesting with simple brace counting
    const openBraces = (trimmed.match(/{/g) || []).length;
    const closeBraces = (trimmed.match(/}/g) || []).length;

    if (funcMatch) {
      const name = funcMatch[1] || funcMatch[2] || 'anonymous';
      stack.push({ name, start: i + 1, level: currentIndent });
    }

    currentIndent += openBraces;
    currentIndent -= closeBraces;

    // If currentIndent drops below or equal to stack level, function ended
    while (stack.length > 0 && currentIndent <= stack[stack.length - 1].level) {
      const finished = stack.pop();
      if (finished) {
        const length = (i + 1) - finished.start;
        if (length > CONFIG.maxFunctionLines) {
          longFunctions.push({ name: finished.name, lines: length, start: finished.start });
        }
      }
    }
  }

  // Detect Exports
  const exportRegex = /export\s+(?:const|function|interface|type|class|default)\s+([a-zA-Z0-9_]+)/g;
  const exports: string[] = [];
  let exportMatch;
  while ((exportMatch = exportRegex.exec(content)) !== null) {
    if (exportMatch[1]) exports.push(exportMatch[1]);
  }

  return {
    path: filePath,
    lines: lines.length,
    todos,
    maxIndent,
    longFunctions,
    exports,
  };
}

function checkDeadCode(files: string[], stats: FileStats[]) {
  console.log(`\n${YELLOW}💀 Dead Code Detection (Experimental)...${NC}`);

  const allExports = new Map<string, string>(); // name -> path
  stats.forEach(s => {
    s.exports.forEach(e => {
      if (e !== 'default') {
        allExports.set(e, s.path);
      }
    });
  });

  const exportUsage = new Map<string, number>();
  allExports.forEach((path, name) => exportUsage.set(name, 0));

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    allExports.forEach((path, name) => {
      // Don't count the definition file
      if (file !== path) {
        // Simple search for the export name. This has false positives with common names.
        // We look for word boundaries to be safer.
        const regex = new RegExp(`\\b${name}\\b`, 'g');
        if (regex.test(content)) {
          exportUsage.set(name, (exportUsage.get(name) || 0) + 1);
        }
      }
    });
  });

  const deadExports: { name: string; path: string }[] = [];
  exportUsage.forEach((count, name) => {
    if (count === 0) {
      deadExports.push({ name, path: allExports.get(name)! });
    }
  });

  if (deadExports.length > 0) {
    const sorted = deadExports.sort((a, b) => a.path.localeCompare(b.path));
    console.warn(`${YELLOW}⚠️  Found ${deadExports.length} potentially unused exports:${NC}`);
    // Show top 15
    sorted.slice(0, 15).forEach(e => {
      console.warn(`   - ${e.name} (${e.path})`);
    });
    if (deadExports.length > 15) console.warn(`   ... and ${deadExports.length - 15} more.`);
    console.warn(`\n${BLUE}💡 Note: This check includes false positives for entry points or common names.${NC}`);
  } else {
    console.log(`${GREEN}✅ No obvious dead code detected.${NC}`);
  }
}

async function main() {
  const files = glob.sync('{app,components,lib,utils,hooks}/**/*.{ts,tsx,js,jsx}', {
    ignore: CONFIG.ignorePatterns,
  });

  console.log(`Scanning ${files.length} files...`);

  let totalTodos = 0;
  let hasErrors = false;
  const allStats: FileStats[] = [];

  for (const file of files) {
    const stats = scanFile(file);
    allStats.push(stats);
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

    // Report Long Functions
    if (stats.longFunctions.length > 0) {
      stats.longFunctions.forEach(f => {
        console.warn(
          `${YELLOW}⚠️  Function Size Warning:${NC} ${file}:${f.start} - "${f.name}" is ${f.lines} lines (Limit: ${CONFIG.maxFunctionLines})`,
        );
      });
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
    execSync('npm run audit:any', { stdio: 'inherit' });
    console.log(`${GREEN}✅ No unjustified 'any' types found.${NC}`);
  } catch (_error) {
    console.warn(`${YELLOW}⚠️  Unjustified 'any' types detected!${NC}`);
    console.warn(`   Run 'npm run audit:any' to see details.`);
  }

  // Check Scripts Health
  console.log(`\n${YELLOW}📜 Scripts Hygiene Audit...${NC}`);
  try {
    execSync('npm run audit:scripts', { stdio: 'inherit' });
    console.log(`${GREEN}✅ Scripts directory is clean.${NC}`);
  } catch (_error) {
    console.warn(`${YELLOW}⚠️  Script linting warnings/errors detected!${NC}`);
    console.warn(`   Run 'npm run audit:scripts' to see details.`);
    // We don't block build for scripts yet, but we warn heavily
  }

  // Dead Code Detection (Phase 6: The Janitor)
  checkDeadCode(files, allStats);

  if (hasErrors) {
    console.error(`\n${RED}💥 Health checks failed.${NC}`);
    process.exit(1);
  } else {
    console.log(`\n${GREEN}✅ The Sentinel passes this code.${NC}`);
  }
}

main().catch(console.error);
