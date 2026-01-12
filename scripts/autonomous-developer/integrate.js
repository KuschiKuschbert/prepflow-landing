#!/usr/bin/env node

/**
 * Integration Script
 * Integrates autonomous developer with existing systems
 */

const fs = require('fs');
const path = require('path');

/**
 * Integrate with pre-commit hook
 */
function integratePreCommit() {
  const preCommitPath = path.join(process.cwd(), '.husky/pre-commit');
  
  if (!fs.existsSync(preCommitPath)) {
    console.error('Pre-commit hook not found');
    return;
  }

  let content = fs.readFileSync(preCommitPath, 'utf8');

  // Add autonomous developer checks if not already present
  if (!content.includes('autonomous-developer')) {
    const integration = `
# Autonomous Developer Integration
# Run predictive bug detection on staged files
if [ -n "$FILTERED_STAGED_FILES" ]; then
  echo "Running autonomous developer analysis..."
  for file in $FILTERED_STAGED_FILES; do
    if [[ "$file" == *.ts ]] || [[ "$file" == *.tsx ]] || [[ "$file" == *.js ]] || [[ "$file" == *.jsx ]]; then
      node scripts/autonomous-developer/predict-bugs.js "$file" 2>/dev/null || true
    fi
  done
fi
`;

    content += integration;
    fs.writeFileSync(preCommitPath, content);
    console.log('✅ Integrated with pre-commit hook');
  } else {
    console.log('✅ Already integrated with pre-commit hook');
  }
}

/**
 * Integrate with build process
 */
function integrateBuild() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // Add post-build script for performance recording
  if (!packageJson.scripts['postbuild']) {
    packageJson.scripts['postbuild'] = 'node scripts/autonomous-developer/performance-check.js record || true';
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    console.log('✅ Integrated with build process');
  } else {
    console.log('⚠️ postbuild script already exists - manual integration needed');
  }
}

/**
 * Create knowledge base directories
 */
function createKnowledgeBaseDirs() {
  const dirs = [
    'docs/autonomous-developer',
    'docs/autonomous-developer/code-reviews',
    'docs/autonomous-developer/adr',
    'docs/autonomous-developer/prs',
    'docs/autonomous-developer/analyses',
    'docs/errors/reports',
    '.error-capture',
  ];

  dirs.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`✅ Created: ${dir}`);
    }
  });
}

/**
 * Main CLI
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'all';

  switch (command) {
    case 'pre-commit':
      integratePreCommit();
      break;

    case 'build':
      integrateBuild();
      break;

    case 'dirs':
      createKnowledgeBaseDirs();
      break;

    case 'all':
      createKnowledgeBaseDirs();
      integratePreCommit();
      integrateBuild();
      console.log('\n✅ All integrations complete!');
      break;

    default:
      console.log(`
Integration Script

Usage:
  integrate.js [command]

Commands:
  all         Run all integrations (default)
  pre-commit  Integrate with pre-commit hook
  build       Integrate with build process
  dirs        Create knowledge base directories
      `);
      break;
  }
}

if (require.main === module) {
  main();
}

module.exports = { integratePreCommit, integrateBuild, createKnowledgeBaseDirs };
