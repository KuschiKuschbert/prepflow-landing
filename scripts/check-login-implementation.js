#!/usr/bin/env node

/**
 * Comprehensive Login Implementation Check
 * Verifies all Auth0 Management API integration code is correct
 */

const fs = require('fs');
const path = require('path');

const errors = [];
const warnings = [];
const checks = [];

function checkFile(filePath, description) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    errors.push(`❌ ${description}: File not found: ${filePath}`);
    return false;
  }
  checks.push(`✅ ${description}: File exists`);
  return true;
}

function checkExports(filePath, expectedExports, description) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    errors.push(`❌ ${description}: File not found`);
    return false;
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  const missingExports = expectedExports.filter(exp => !content.includes(exp));

  if (missingExports.length > 0) {
    errors.push(`❌ ${description}: Missing exports: ${missingExports.join(', ')}`);
    return false;
  }

  checks.push(`✅ ${description}: All exports present (${expectedExports.join(', ')})`);
  return true;
}

function checkImports(filePath, expectedImports, description) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    errors.push(`❌ ${description}: File not found`);
    return false;
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  const missingImports = expectedImports.filter(imp => !content.includes(imp));

  if (missingImports.length > 0) {
    warnings.push(`⚠️  ${description}: Missing imports: ${missingImports.join(', ')}`);
    return false;
  }

  checks.push(`✅ ${description}: All imports present`);
  return true;
}

console.log('🔍 Comprehensive Login Implementation Check\n');
console.log('='.repeat(60));

// Check 1: Core Management API utilities
console.log('\n📦 Step 1: Auth0 Management API Utilities');
checkFile('lib/auth0-management.ts', 'Management API utilities file');
checkExports(
  'lib/auth0-management.ts',
  [
    'getSocialConnections',
    'verifyGoogleConnection',
    'verifyCallbackUrls',
    'getUserProfileFromManagementAPI',
    'getUserRoles',
    'extractAuth0UserId',
  ],
  'Management API exports',
);

// Check 2: JWT callback enhancement
console.log('\n🔐 Step 2: JWT Callback Enhancement');
checkFile('lib/auth-options.ts', 'Auth options file');
checkImports('lib/auth-options.ts', ['getUserProfileFromManagementAPI'], 'JWT callback imports');

// Check 3: SignIn callback
console.log('\n🚪 Step 3: SignIn Callback');
const authOptionsContent = fs.readFileSync(
  path.join(process.cwd(), 'lib/auth-options.ts'),
  'utf-8',
);
if (authOptionsContent.includes('async signIn')) {
  checks.push('✅ SignIn callback: Present in auth-options.ts');
} else {
  errors.push('❌ SignIn callback: Not found in auth-options.ts');
}

// Check 4: Diagnostic endpoints
console.log('\n🔬 Step 4: Diagnostic Endpoints');
checkFile(
  'app/api/test/auth0-social-connections/route.ts',
  'Social connections diagnostic endpoint',
);
checkExports(
  'app/api/test/auth0-social-connections/route.ts',
  ['GET'],
  'Social connections endpoint exports',
);
checkImports(
  'app/api/test/auth0-social-connections/route.ts',
  ['getSocialConnections', 'verifyGoogleConnection', 'verifyCallbackUrls'],
  'Social connections endpoint imports',
);

checkFile('app/api/test/auth0-callback-diagnostic/route.ts', 'Callback diagnostic endpoint');
checkExports(
  'app/api/test/auth0-callback-diagnostic/route.ts',
  ['GET'],
  'Callback diagnostic endpoint exports',
);

// Check 5: Auto-fix endpoint
console.log('\n🔧 Step 5: Auto-Fix Endpoint');
checkFile('app/api/fix/auth0-callback-urls/route.ts', 'Auto-fix endpoint');
checkExports('app/api/fix/auth0-callback-urls/route.ts', ['POST'], 'Auto-fix endpoint exports');
checkImports(
  'app/api/fix/auth0-callback-urls/route.ts',
  ['getSocialConnections', 'verifyGoogleConnection', 'verifyCallbackUrls'],
  'Auto-fix endpoint imports',
);

// Check 6: TypeScript compilation
console.log('\n📝 Step 6: TypeScript Compilation');
try {
  const { execSync } = require('child_process');
  execSync('npm run type-check', { stdio: 'pipe' });
  checks.push('✅ TypeScript: No compilation errors');
} catch (error) {
  errors.push('❌ TypeScript: Compilation errors found');
  console.error('TypeScript errors:', error.message);
}

// Check 7: Build check
console.log('\n🏗️  Step 7: Build Check');
try {
  const { execSync } = require('child_process');
  execSync('npm run build', { stdio: 'pipe' });
  checks.push('✅ Build: Successful');
} catch (error) {
  errors.push('❌ Build: Failed');
  console.error('Build errors:', error.message);
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('\n📊 Summary\n');

if (checks.length > 0) {
  console.log('✅ Passed Checks:');
  checks.forEach(check => console.log(`  ${check}`));
}

if (warnings.length > 0) {
  console.log('\n⚠️  Warnings:');
  warnings.forEach(warning => console.log(`  ${warning}`));
}

if (errors.length > 0) {
  console.log('\n❌ Errors:');
  errors.forEach(error => console.log(`  ${error}`));
  process.exit(1);
} else {
  console.log('\n✅ All checks passed! Login implementation is ready.');
  process.exit(0);
}
