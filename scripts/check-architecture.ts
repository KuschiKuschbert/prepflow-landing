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
      excludeRegExp: [/\.test\./, /\.spec\./],
    });

    const circular = res.circular();
    const MAX_ALLOWED_CIRCULAR = 0; // All cycles fixed (Iteration 10)

    if (circular.length > MAX_ALLOWED_CIRCULAR) {
      console.error(
        `${RED}❌ Error: ${circular.length} Circular dependencies detected (Limit: ${MAX_ALLOWED_CIRCULAR}).${NC}`,
      );
      console.error(`${RED}   New circular dependencies are not allowed.${NC}`);
      // Only show top 5 to avoid spam
      console.error(circular.slice(0, 5));
      console.error(`${RED}... and ${circular.length - 5} more.${NC}`);
      return false;
    } else if (circular.length > 0) {
      console.warn(
        `${YELLOW}⚠️  Warning: ${circular.length} Circular dependencies detected (Baseline: ${MAX_ALLOWED_CIRCULAR}):${NC}`,
      );
      // Only show top 5 to avoid spam
      console.warn(circular.slice(0, 5));
      console.warn(`${YELLOW}... and ${circular.length - 5} more.${NC}`);
      console.warn(`${YELLOW}   These are allowed as technical debt, but do not add more.${NC}`);
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
    'lib/db', // Example: direct db access
    'scripts/', // Scripts shouldn't be imported in app code generally, especially client
    'cheerio', // Node-only libs usually
    'puppeteer',
  ];

  // Find all files in app/ and components/
  const files = glob.sync('{app,components}/**/*.{ts,tsx}', {
    ignore: ['**/*.test.*', '**/*.spec.*'],
  });
  console.log(`Scanning ${files.length} files for boundaries...`);

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');

    // Check if it's a Client Component
    if (content.includes("'use client'") || content.includes('"use client"')) {
      for (const forbidden of FORBIDDEN_CLIENT_IMPORTS) {
        // Simple regex check for imports
        // Looks for: import ... from '...forbidden...'
        // or: require('...forbidden...')
        const importRegex = new RegExp(
          `(import\\s+.*from\\s+['"].*${forbidden}.*['"]|require\\(['"].*${forbidden}.*['"])`,
          'g',
        );

        if (importRegex.test(content)) {
          console.error(`${RED}❌ Violation in ${file}:${NC}`);
          console.error(
            `   Client Component imports forbidden server module: matching '${forbidden}'`,
          );
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

function checkLibBoundaries(): boolean {
  console.log(`\n${YELLOW}📚 Checking Lib vs Components Boundaries...${NC}`);

  // Rules: lib/ should not import from components/ or app/
  // Exception: lib/hooks might use context from components? (but ideally not UI components)
  // We'll enforce a strict "no components in lib" rule.

  const files = glob.sync('lib/**/*.{ts,tsx,js,jsx}', {
    ignore: ['**/*.test.*', '**/*.spec.*'],
  });

  let violationCount = 0;
  const violations: string[] = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');

    // Look for imports from @/components or ../components
    // Regex explanation:
    // Matches: 'import ... from "..."' or 'require("...")'
    // Pattern matches strings starting with: @/components, ../components, or contains /components/ inside app path
    const importRegex =
      /from\s+['"](@\/components.*|\.\.\/components.*|@\/app\/.*\/components.*)['"]/g;

    if (importRegex.test(content)) {
      violationCount++;
      violations.push(file);
    }
  }

  const MAX_LIB_VIOLATIONS = 17; // Baseline based on grep (Iteration 9)

  if (violationCount > MAX_LIB_VIOLATIONS) {
    console.error(
      `${RED}❌ Error: ${violationCount} Lib-to-Component violations detected (Limit: ${MAX_LIB_VIOLATIONS}).${NC}`,
    );
    console.error(
      `${RED}   'lib/' should not depend on 'components/'. Please move shared logic to 'lib/'.${NC}`,
    );
    // Show top 5
    violations.slice(0, 5).forEach(v => console.error(`   - ${v}`));
    if (violations.length > 5) console.error(`   ... and ${violations.length - 5} more.`);
    return false;
  } else if (violationCount > 0) {
    console.warn(
      `${YELLOW}⚠️  Warning: ${violationCount} Lib-to-Component violations detected (Baseline: ${MAX_LIB_VIOLATIONS}).${NC}`,
    );
    console.warn(`${YELLOW}   These are allowed as technical debt, but do not add more.${NC}`);
    return true;
  }

  console.log(`${GREEN}✅ Lib boundaries respected.${NC}`);
  return true;
}

function checkFeatureIsolation(): boolean {
  console.log(`\n${YELLOW}🧩 Checking Feature Isolation in webapp...${NC}`);

  const webappPath = path.join(process.cwd(), 'app/webapp');
  if (!fs.existsSync(webappPath)) return true;

  const features = fs.readdirSync(webappPath).filter(
    f =>
      fs.statSync(path.join(webappPath, f)).isDirectory() &&
      f !== 'components' && // Shared components are allowed
      f !== 'sections', // Shared sections are allowed
  );

  for (const feature of features) {
    const featureDir = path.join(webappPath, feature);
    const files = glob.sync('**/*.{ts,tsx}', { cwd: featureDir });

    for (const file of files) {
      const filePath = path.join(featureDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');

      // Look for imports from other features
      // Regex: matches @/app/webapp/[other_feature]
      // excluding @/app/webapp/[feature], @/app/webapp/components, etc.
      const crossImportRegex = /from\s+['"]@\/app\/webapp\/([a-zA-Z0-9_-]+).*?['"]/g;

      let match;
      while ((match = crossImportRegex.exec(content)) !== null) {
        const importedFeature = match[1];
        if (
          importedFeature !== feature &&
          importedFeature !== 'components' &&
          importedFeature !== 'sections' &&
          importedFeature !== 'types' // Assuming types might be shared via a common types folder if it existed
        ) {
          // It's a violation if it's not a type-only import?
          // For now we flag it but prioritize documentation.
          // Roadmap says: "Ensure features remain loosely coupled".
          console.warn(`${YELLOW}⚠️  Isolation Warning in ${feature}/${file}:${NC}`);
          console.warn(`   Directly imports from feature '${importedFeature}'.`);
          console.warn(`   Consider moving shared logic to @/lib or @/hooks.`);
          // We warn instead of error for now because existing violations are many.
        }
      }
    }
  }

  return true; // We don't block build yet, just warn.
}

function checkApiBoundaries(): boolean {
  console.log(`\n${YELLOW}📡 Checking API Boundaries...${NC}`);

  // Rule: app/api/ should not import from app/webapp/ (Frontend implementation details)
  // Shared logic should be in lib/
  const apiFiles = glob.sync('app/api/**/*.{ts,tsx}', {
    ignore: ['**/*.test.*', '**/*.spec.*'],
  });

  let violationCount = 0;
  const violations: string[] = [];

  for (const file of apiFiles) {
    const content = fs.readFileSync(file, 'utf-8');

    // Look for imports from @/app/webapp or ../webapp
    // excluding potentially safe 'types' if strictly type-only (but hard to distinguish here without AST)
    // We'll flag all for now.
    const importRegex = /from\s+['"](@\/app\/webapp.*|\.\.\/webapp.*|\.\.\/\.\.\/webapp.*)['"]/g;

    if (importRegex.test(content)) {
      violationCount++;
      violations.push(file);
    }
  }

  const MAX_API_VIOLATIONS = 0; // Strict! No debt allowed.

  if (violationCount > MAX_API_VIOLATIONS) {
    console.error(
      `${RED}❌ Error: ${violationCount} API-to-Webapp violations detected (Limit: ${MAX_API_VIOLATIONS}).${NC}`,
    );
    console.error(
      `${RED}   'app/api/' (Backend) must not depend on 'app/webapp/' (Frontend). Move shared logic to 'lib/'.${NC}`,
    );
    violations.slice(0, 5).forEach(v => console.error(`   - ${v}`));
    if (violations.length > 5) console.error(`   ... and ${violations.length - 5} more.`);
    return false;
  } else if (violationCount > 0) {
    console.warn(
      `${YELLOW}⚠️  Warning: ${violationCount} API-to-Webapp violations detected (Baseline: ${MAX_API_VIOLATIONS}).${NC}`,
    );
    console.warn(`${YELLOW}   These are allowed as technical debt, but do not add more.${NC}`);
    return true;
  }

  console.log(`${GREEN}✅ API boundaries respected.${NC}`);
  return true;
}

async function main() {
  let success = true;

  if (!(await checkCircularDependencies())) {
    success = false;
  }

  if (!checkClientServerBoundaries()) {
    success = false;
  }

  if (!checkLibBoundaries()) {
    success = false;
  }

  if (!checkApiBoundaries()) {
    success = false;
  }

  if (!checkFeatureIsolation()) {
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
