#!/usr/bin/env node

/**
 * RSI Auto-Fixer Script
 * Main entry point for the Automated Fixer system.
 * Now with real providers for ESLint and console cleanup.
 */

const { register } = require('tsx/cjs/api');
register();

const { FixOrchestrator } = require('../../lib/rsi/auto-fix/fix-orchestrator');
const { ESLintFixProvider } = require('../../lib/rsi/auto-fix/providers/eslint-fix-provider');
const { ConsoleCleanupProvider } = require('../../lib/rsi/auto-fix/providers/console-cleanup-provider');

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const eslintOnly = args.includes('--eslint-only');
  const consoleOnly = args.includes('--console-only');

  const orchestrator = new FixOrchestrator();

  // Register providers based on flags
  if (!consoleOnly) {
    orchestrator.registerProvider(new ESLintFixProvider());
  }

  if (!eslintOnly) {
    orchestrator.registerProvider(new ConsoleCleanupProvider());
  }

  console.log('🔧 RSI Auto-Fix Providers:');
  console.log('   - ESLint Auto-Fix:', eslintOnly || !consoleOnly ? '✅' : '⏭️ Skipped');
  console.log('   - Console Cleanup:', consoleOnly || !eslintOnly ? '✅' : '⏭️ Skipped');
  console.log('');

  await orchestrator.run({
    dryRun,
  });
}

main().catch(console.error);
