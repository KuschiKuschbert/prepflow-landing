import fs from 'fs';
import { glob } from 'glob';
import madge from 'madge';
import path from 'path';

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const NC = '\x1b[0m'; // No Color

console.log(`${YELLOW}🏗️  The Architect: Starting Architectural Scan...${NC}`);

async function checkCircularDependencies() {
  console.log(`\n${YELLOW}🔄 Checking for Circular Dependencies...${NC}`);
  try {
    const res = await madge(path.join(process.cwd(), 'app'), {
      fileExtensions: ['ts', 'tsx', 'js', 'jsx'],
      excludeRegExp: [/\.test\./, /\.spec\./]
    });

    const circular = res.circular();
    if (circular.length > 0) {
      console.warn(`${YELLOW}⚠️  Warning: ${circular.length} Circular dependencies detected (Non-blocking for now):${NC}`);
      // Only show top 5 to avoid spam
      console.warn(circular.slice(0, 5));
      console.warn(`${YELLOW}... and ${circular.length - 5} more.${NC}`);
      // return false; // TODO: Enforce this once cleanup is done
      return true;
    }
    console.log(`${GREEN}✅ No circular dependencies found.${NC}`);
    return true;
  } catch (error) {
    console.error(`${RED}❌ Error checking circular dependencies: ${error}${NC}`);
    return false;
  }
}

function checkClientServerBoundaries(): boolean {
  console.log(`\n${YELLOW}🛡️  Checking Client/Server Boundaries...${NC}`);
  let hasErrors = false;

  // Define forbidden imports for Client Components
  const FORBIDDEN_CLIENT_IMPORTS = [
    'lib/server', // Example: server-only utils
    'lib/db',     // Example: direct db access
    'scripts/',   // Scripts shouldn't be imported in app code generally, especially client
    'cheerio',    // Node-only libs usually
    'puppeteer'
  ];

  // Find all files in app/ and components/
  const files = glob.sync('{app,components}/**/*.{ts,tsx}', { ignore: ['**/*.test.*', '**/*.spec.*'] });
  console.log(`Scanning ${files.length} files for boundaries...`);

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');

    // Check if it's a Client Component
    if (content.includes("'use client'") || content.includes('"use client"')) {

      for (const forbidden of FORBIDDEN_CLIENT_IMPORTS) {
        // Simple regex check for imports
        // Looks for: import ... from '...forbidden...'
        // or: require('...forbidden...')
        const importRegex = new RegExp(`(import\\s+.*from\\s+['"].*${forbidden}.*['"]|require\\(['"].*${forbidden}.*['"])`, 'g');

        if (importRegex.test(content)) {
          console.error(`${RED}❌ Violation in ${file}:${NC}`);
          console.error(`   Client Component imports forbidden server module: matching '${forbidden}'`);
          hasErrors = true;
        }
      }
    }
  }

  if (hasErrors) {
    return false;
  }
  console.log(`${GREEN}✅ Client/Server boundaries respected.${NC}`);
  return true;
}

async function main() {
  let success = true;

  if (!await checkCircularDependencies()) {
    success = false;
  }

  if (!checkClientServerBoundaries()) {
    success = false;
  }

  if (!success) {
    console.error(`\n${RED}💥 Architectural violations found. Build aborted.${NC}`);
    process.exit(1);
  } else {
    console.log(`\n${GREEN}✅ The Architect approves this code.${NC}`);
  }
}

main().catch(console.error);
