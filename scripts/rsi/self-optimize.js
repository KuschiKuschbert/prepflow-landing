#!/usr/bin/env node

/**
 * RSI Self-Optimization Script
 * Runs the optimization cycle to tune system parameters.
 */

const { register } = require('tsx/cjs/api');
register();

const { Optimizer } = require('../../lib/rsi/self-optimization/optimizer');

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  console.log('🧠 RSI Self-Optimizer Starting...');
  console.log('==============================');

  try {
    const suggestions = await Optimizer.analyze();

    if (suggestions.length === 0) {
      console.log('✅ System is optimal. No changes suggested.');
      return;
    }

    console.log(`Found ${suggestions.length} optimization suggestions:\n`);

    for (const suggestion of suggestions) {
      console.log(`🔹 Parameter: ${suggestion.parameter}`);
      console.log(`   Current:   ${suggestion.currentValue}`);
      console.log(`   Proposed:  ${suggestion.proposedValue}`);
      console.log(`   Reason:    ${suggestion.reason}`);
      console.log(`   Confidence: ${(suggestion.confidence * 100).toFixed(0)}%`);

      if (dryRun) {
        console.log('   [DRY RUN] Change skipped.\n');
      } else {
        // In a real system, we would apply these config changes to a config file.
        // For Phase 3, we just log them.
        console.log(
          '   ℹ️  Auto-application not yet implemented for config. Please update manually.\n',
        );
      }
    }
  } catch (error) {
    console.error('Self-optimization cycle failed:', error);
    process.exit(1);
  }
}

main().catch(console.error);
