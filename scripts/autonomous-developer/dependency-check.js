#!/usr/bin/env node

/**
 * Dependency Check Script
 * Analyzes dependencies and suggests upgrades
 */

const {
  analyzeDependencyHealth,
  predictBreakingChanges,
  detectUnusedDependencies,
  getUpgradeRecommendations,
  learnFromDependencyError,
} = require('../../lib/autonomous-developer/dependencies/dependency-analyzer');

/**
 * Check dependency health
 */
async function checkHealth(packageName) {
  const health = await analyzeDependencyHealth(packageName);

  console.log(`\n📦 Dependency Health: ${packageName}\n`);
  console.log(`   Version: ${health.version}`);
  console.log(`   Health Score: ${health.healthScore}/100`);
  console.log(`   Update Frequency: ${health.updateFrequency}`);
  console.log(`   Security Vulnerabilities: ${health.securityVulnerabilities}`);
  console.log(`   Issues: ${health.issues.length}\n`);

  if (health.issues.length > 0) {
    console.log('Issues:');
    health.issues.forEach(issue => {
      console.log(`  - ${issue.type} (${issue.severity}): ${issue.description}`);
      if (issue.learnedFrom && issue.learnedFrom.length > 0) {
        console.log(`    Learned from ${issue.learnedFrom.length} error(s)`);
      }
    });
  }
}

/**
 * Check for upgrades
 */
async function checkUpgrades() {
  const recommendations = await getUpgradeRecommendations();

  if (recommendations.length === 0) {
    console.log('✅ No upgrade recommendations');
    return;
  }

  console.log(`\n📦 Upgrade Recommendations (${recommendations.length}):\n`);

  recommendations.forEach(rec => {
    console.log(`  - ${rec.package}`);
    console.log(`    Current: ${rec.currentVersion}`);
    console.log(`    Recommended: ${rec.recommendedVersion}`);
    console.log(`    Type: ${rec.type}`);
    console.log(`    Risk: ${rec.risk}`);
    console.log(`    Reason: ${rec.reason}`);
    if (rec.breakingChanges && rec.breakingChanges.length > 0) {
      console.log(`    Breaking Changes: ${rec.breakingChanges.join(', ')}`);
    }
    console.log('');
  });
}

/**
 * Detect unused dependencies
 */
async function checkUnused() {
  const unused = await detectUnusedDependencies();

  if (unused.length === 0) {
    console.log('✅ No unused dependencies detected');
    return;
  }

  console.log(`\n📦 Unused Dependencies (${unused.length}):\n`);
  unused.forEach(dep => {
    console.log(`  - ${dep.package} (${dep.currentVersion})`);
    console.log(`    ${dep.description}\n`);
  });
}

/**
 * Learn from error
 */
async function learnFromError(packageName, errorMessage, errorId) {
  await learnFromDependencyError(packageName, errorMessage, errorId);
  console.log(`✅ Learned from error: ${errorId}`);
  console.log(`   Package: ${packageName}`);
  console.log(`   Issue type will be tracked for future upgrades`);
}

/**
 * Main CLI
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'health':
      const packageName = args[1];
      if (!packageName) {
        console.error('Usage: dependency-check.js health <package-name>');
        process.exit(1);
      }
      await checkHealth(packageName);
      break;

    case 'upgrades':
      await checkUpgrades();
      break;

    case 'unused':
      await checkUnused();
      break;

    case 'learn':
      const [pkg, errorMsg, errorId] = args.slice(1);
      if (!pkg || !errorMsg || !errorId) {
        console.error('Usage: dependency-check.js learn <package> <error-message> <error-id>');
        process.exit(1);
      }
      await learnFromError(pkg, errorMsg, errorId);
      break;

    default:
      console.log(`
Dependency Check Script

Usage:
  dependency-check.js health <package>        Check dependency health
  dependency-check.js upgrades                Get upgrade recommendations
  dependency-check.js unused                  Detect unused dependencies
  dependency-check.js learn <pkg> <error> <id> Learn from dependency error

Examples:
  dependency-check.js health react
  dependency-check.js upgrades
  dependency-check.js unused
  dependency-check.js learn react "Breaking change" error-123
      `);
      break;
  }
}

if (require.main === module) {
  main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
}

module.exports = { checkHealth, checkUpgrades, checkUnused };
