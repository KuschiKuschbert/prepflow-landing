#!/usr/bin/env node

/**
 * Vercel Build Diagnostic Script
 *
 * This script helps diagnose common Vercel build failures by checking:
 * - Environment variables
 * - Node version
 * - TypeScript configuration
 * - Route handler patterns
 * - Import paths
 * - Dependencies
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function check(title, checkFn) {
  log(`\n▶ ${title}...`, 'blue');
  try {
    const result = checkFn();
    if (result === true) {
      log(`✅ ${title} passed`, 'green');
      return true;
    } else if (result === false) {
      log(`❌ ${title} failed`, 'red');
      return false;
    } else {
      log(`⚠️  ${title}: ${result}`, 'yellow');
      return true;
    }
  } catch (error) {
    log(`❌ ${title} failed: ${error.message}`, 'red');
    return false;
  }
}

// 1. Check Node version
function checkNodeVersion() {
  const nodeVersion = process.version;
  const requiredVersion = '22.0.0';
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

  if (majorVersion >= 22) {
    log(`   Node version: ${nodeVersion} (meets requirement >= ${requiredVersion})`, 'green');
    return true;
  } else {
    log(`   Node version: ${nodeVersion} (does not meet requirement >= ${requiredVersion})`, 'red');
    log(`   ⚠️  Vercel may use Node 20.x by default - check Vercel settings`, 'yellow');
    return false;
  }
}

// 2. Check package.json engines
function checkEngines() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (packageJson.engines && packageJson.engines.node) {
    log(`   Engines.node: ${packageJson.engines.node}`, 'green');
    return true;
  } else {
    log(`   ⚠️  No engines.node specified in package.json`, 'yellow');
    return 'warning';
  }
}

// 3. Check for .nvmrc file
function checkNvmrc() {
  if (fs.existsSync('.nvmrc')) {
    const nvmrc = fs.readFileSync('.nvmrc', 'utf8').trim();
    log(`   .nvmrc exists: ${nvmrc}`, 'green');
    return true;
  } else {
    log(`   ⚠️  .nvmrc file not found (optional but recommended)`, 'yellow');
    return 'warning';
  }
}

// 4. Check TypeScript configuration
function checkTypeScriptConfig() {
  if (!fs.existsSync('tsconfig.json')) {
    log(`   ❌ tsconfig.json not found`, 'red');
    return false;
  }

  const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));

  const issues = [];
  if (!tsconfig.compilerOptions) {
    issues.push('Missing compilerOptions');
  } else {
    if (tsconfig.compilerOptions.strict !== true) {
      issues.push('strict mode not enabled');
    }
    if (!tsconfig.compilerOptions.paths || !tsconfig.compilerOptions.paths['@/*']) {
      issues.push('Missing @/* path alias');
    }
  }

  if (issues.length > 0) {
    log(`   ⚠️  TypeScript config issues: ${issues.join(', ')}`, 'yellow');
    return 'warning';
  }

  log(`   TypeScript config looks good`, 'green');
  return true;
}

// 5. Check route handlers for Next.js 16 pattern
function checkRouteHandlers() {
  const apiDir = path.join(process.cwd(), 'app', 'api');
  if (!fs.existsSync(apiDir)) {
    return 'warning';
  }

  const routeFiles = [];
  function findRouteFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        findRouteFiles(filePath);
      } else if (file === 'route.ts' || file === 'route.tsx') {
        routeFiles.push(filePath);
      }
    }
  }

  findRouteFiles(apiDir);

  const issues = [];
  for (const file of routeFiles) {
    const content = fs.readFileSync(file, 'utf8');

    // Check for old Next.js 15 pattern (context.params without await)
    if (content.includes('context.params') && !content.includes('await context.params')) {
      // But exclude if it's in a comment or string
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (
          line.includes('context.params') &&
          !line.includes('await context.params') &&
          !line.trim().startsWith('//') &&
          !line.includes('Promise<')
        ) {
          issues.push(`${file}:${i + 1} - Missing await on context.params`);
        }
      }
    }

    // Check for missing Promise type
    if (content.includes('context: { params:') && !content.includes('Promise<')) {
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('context: { params:') && !line.includes('Promise<')) {
          issues.push(`${file}:${i + 1} - Missing Promise type on context.params`);
        }
      }
    }
  }

  if (issues.length > 0) {
    log(`   ❌ Found ${issues.length} route handler issues:`, 'red');
    issues.slice(0, 5).forEach(issue => log(`      - ${issue}`, 'red'));
    if (issues.length > 5) {
      log(`      ... and ${issues.length - 5} more`, 'yellow');
    }
    return false;
  }

  log(`   ✅ All ${routeFiles.length} route handlers use Next.js 16 pattern`, 'green');
  return true;
}

// 6. Check for server-only code in client components
function checkServerOnlyInClient() {
  const appDir = path.join(process.cwd(), 'app');
  if (!fs.existsSync(appDir)) {
    return 'warning';
  }

  const issues = [];
  function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('"use client"')) {
      return;
    }

    // Check for server-only imports
    const serverOnlyPatterns = [
      /import.*from ['"]fs['"]/,
      /import.*from ['"]path['"]/,
      /import.*from ['"]os['"]/,
      /process\.env[^NEXT_PUBLIC_]/,
    ];

    for (const pattern of serverOnlyPatterns) {
      if (pattern.test(content)) {
        issues.push(filePath);
        break;
      }
    }
  }

  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        checkFile(filePath);
      }
    }
  }

  walkDir(appDir);

  if (issues.length > 0) {
    log(`   ❌ Found ${issues.length} client components with server-only code:`, 'red');
    issues.slice(0, 5).forEach(issue => log(`      - ${issue}`, 'red'));
    return false;
  }

  log(`   ✅ No server-only code in client components`, 'green');
  return true;
}

// 7. Check next.config.ts
function checkNextConfig() {
  if (!fs.existsSync('next.config.ts')) {
    log(`   ❌ next.config.ts not found`, 'red');
    return false;
  }

  const content = fs.readFileSync('next.config.ts', 'utf8');
  const issues = [];

  // Check for compress: true (should be false for Vercel)
  if (content.includes('compress: true')) {
    issues.push('compress should be false for Vercel');
  }

  // Check for Content-Encoding headers
  if (content.includes("key: 'Content-Encoding'")) {
    issues.push('Remove explicit Content-Encoding headers');
  }

  if (issues.length > 0) {
    log(`   ⚠️  next.config.ts issues: ${issues.join(', ')}`, 'yellow');
    return 'warning';
  }

  log(`   ✅ next.config.ts looks good`, 'green');
  return true;
}

// 8. Check environment variables (from .env.example)
function checkEnvExample() {
  if (!fs.existsSync('env.example')) {
    log(`   ⚠️  env.example not found`, 'yellow');
    return 'warning';
  }

  const envExample = fs.readFileSync('env.example', 'utf8');
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'AUTH0_SECRET',
    'AUTH0_BASE_URL',
  ];

  const missing = requiredVars.filter(varName => !envExample.includes(varName));

  if (missing.length > 0) {
    log(`   ⚠️  Missing variables in env.example: ${missing.join(', ')}`, 'yellow');
    return 'warning';
  }

  log(`   ✅ env.example includes required variables`, 'green');
  return true;
}

// 9. Check dependencies
function checkDependencies() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    const criticalDeps = ['next', 'react', 'react-dom', 'typescript'];
    const missing = criticalDeps.filter(dep => !deps[dep]);

    if (missing.length > 0) {
      log(`   ❌ Missing critical dependencies: ${missing.join(', ')}`, 'red');
      return false;
    }

    log(`   ✅ All critical dependencies present`, 'green');
    return true;
  } catch (error) {
    log(`   ❌ Error checking dependencies: ${error.message}`, 'red');
    return false;
  }
}

// Main execution
log('\n🔍 Vercel Build Diagnostic Tool', 'cyan');
log('================================\n', 'cyan');

const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
};

const checks = [
  ['Node Version', checkNodeVersion],
  ['Package.json Engines', checkEngines],
  ['.nvmrc File', checkNvmrc],
  ['TypeScript Configuration', checkTypeScriptConfig],
  ['Route Handlers (Next.js 16)', checkRouteHandlers],
  ['Server-Only Code in Client', checkServerOnlyInClient],
  ['next.config.ts', checkNextConfig],
  ['Environment Variables Example', checkEnvExample],
  ['Dependencies', checkDependencies],
];

checks.forEach(([title, checkFn]) => {
  const result = check(title, checkFn);
  if (result === true) {
    results.passed++;
  } else if (result === false) {
    results.failed++;
  } else {
    results.warnings++;
  }
});

// Summary
log('\n================================', 'cyan');
log('📊 Diagnostic Summary', 'cyan');
log('================================', 'cyan');
log(`✅ Passed: ${results.passed}`, 'green');
log(`⚠️  Warnings: ${results.warnings}`, 'yellow');
log(`❌ Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');

if (results.failed > 0) {
  log('\n💡 Next Steps:', 'cyan');
  log('1. Fix the failed checks above', 'yellow');
  log('2. Run: npm run pre-deploy', 'yellow');
  log('3. Check Vercel build logs for specific errors', 'yellow');
  log('4. Verify environment variables in Vercel dashboard', 'yellow');
  process.exit(1);
} else if (results.warnings > 0) {
  log('\n💡 Recommendations:', 'cyan');
  log('Review warnings above - they may cause issues in production', 'yellow');
  process.exit(0);
} else {
  log('\n✅ All checks passed!', 'green');
  log('Your code should build successfully on Vercel.', 'green');
  process.exit(0);
}
