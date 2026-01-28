import fs from 'fs';
import { glob } from 'glob';
import path from 'path';

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const NC = '\x1b[0m';

const PACKAGE_JSON_PATH = path.join(process.cwd(), 'package.json');
const SRC_DIRS = ['app', 'components', 'lib', 'hooks', 'utils', 'scripts'];

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

function main() {
  console.log(`${BLUE}🧹 The Janitor: Auditing dependencies for dead weight...${NC}\n`);

  if (!fs.existsSync(PACKAGE_JSON_PATH)) {
    console.error(`${RED}❌ Error: package.json not found.${NC}`);
    process.exit(1);
  }

  const packageJson: PackageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf-8'));
  const allDeps = Object.keys({ ...packageJson.dependencies, ...packageJson.devDependencies });

  // These are usually false positives or used indirectly
  const ignoreList = [
    'typescript', '@types/node', '@types/react', '@types/react-dom', 'ts-node', 'tsx',
    'eslint', 'prettier', 'husky', 'lint-staged', 'jest', 'ts-jest', '@testing-library/react',
    'madge', 'glob', 'autoprefixer', 'postcss', 'tailwindcss', 'encoding',
    'next', 'react', 'react-dom' // Core Next.js
  ];

  const dependencies = Object.keys(packageJson.dependencies || {}).filter(d => !ignoreList.includes(d));
  const devDependencies = Object.keys(packageJson.devDependencies || {}).filter(d => !ignoreList.includes(d));

  console.log(`Scanning ${SRC_DIRS.join(', ')}...`);

  const pattern = `{${SRC_DIRS.join(',')}}/**/*.{ts,tsx,js,jsx}`;
  const files = glob.sync(pattern);

  const importedPackages = new Set<string>();

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');

    // Improved regex to catch more variations and avoid false positives
    // Matches: from 'pkg', import 'pkg', require('pkg'), from "pkg/sub"
    const importRegex = /(?:from|import|require)\s*\(?\s*['"](@?[a-zA-Z0-9._-]+)(?:\/[a-zA-Z0-9._-]+)*['"]\s*\)?/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const pkg = match[1];
      if (!pkg.startsWith('.') && !pkg.startsWith('@/')) {
        importedPackages.add(pkg);
      }
    }
  });

  // Special check for tailwind/postcss which might be in config files
  ['tailwind.config.js', 'postcss.config.js', 'next.config.js', 'next.config.mjs'].forEach(cfg => {
    if (fs.existsSync(path.join(process.cwd(), cfg))) {
      const content = fs.readFileSync(path.join(process.cwd(), cfg), 'utf-8');
      allDeps.forEach(d => {
        if (content.includes(d)) importedPackages.add(d);
      });
    }
  });

  const unusedDeps = dependencies.filter(d => !importedPackages.has(d));
  const unusedDevDeps = devDependencies.filter(d => !importedPackages.has(d));

  if (unusedDeps.length === 0 && unusedDevDeps.length === 0) {
    console.log(`${GREEN}✅ No unused dependencies found. Codebase is lean!${NC}`);
  } else {
    if (unusedDeps.length > 0) {
      console.log(`${YELLOW}⚠️  Potentially Unused Dependencies:${NC}`);
      unusedDeps.forEach(d => console.log(`   - ${d}`));
    }

    if (unusedDevDeps.length > 0) {
      console.log(`\n${YELLOW}⚠️  Potentially Unused DevDependencies:${NC}`);
      unusedDevDeps.forEach(d => console.log(`   - ${d}`));
    }

    console.log(`\n${BLUE}💡 Note: Some packages might be used in config files (e.g. tailwind.config.js) or indirectly.${NC}`);
    console.log(`${BLUE}   Double check before removing.${NC}`);
  }
}

main();
