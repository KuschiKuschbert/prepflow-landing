#!/usr/bin/env node

/**
 * RSI Orchestrator Script
 * The Master Switch. Runs the complete RSI cycle.
 */

const { register } = require('tsx/cjs/api');
register();

const { RSIOrchestrator } = require('../../lib/rsi/orchestrator');

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  const config = {
      dryRun,
      modules: {
          autoFix: true,
          selfOptimize: true,
          metaLearning: true, // Typically runs nightly
          ruleEvolution: true, // Typically runs nightly
          autoRefactor: false // Expensive, defaulted to false
      }
  };

  if (args.includes('--full')) {
      config.modules.autoRefactor = true;
  }

  await RSIOrchestrator.run(config);
}

main().catch(console.error);
