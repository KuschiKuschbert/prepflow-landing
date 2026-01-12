#!/usr/bin/env node

/**
 * RSI Status Dashboard
 * Displays current metrics and status of the Recursive Self-Improvement system.
 */

const { register } = require('tsx/cjs/api');
register();

const { ImprovementMetrics } = require('../../lib/rsi/feedback/improvement-metrics');
const { ChangeTracker } = require('../../lib/rsi/safety/change-tracker');

async function main() {
  console.log('\n🤖 RSI System Status');
  console.log('====================\n');

  try {
    const metrics = await ImprovementMetrics.calculateMetrics();
    console.log('📊 Aggregate Metrics:');
    console.log(`   Total Changes:    ${metrics.totalChanges}`);
    console.log(`   Success Rate:     ${metrics.successRate.toFixed(1)}%`);
    console.log(`   Rollback Rate:    ${metrics.rollbackRate.toFixed(1)}%`);
    console.log(`   Active Period:    ${metrics.activePeriodDays} days`);

    console.log('\n📜 Recent Changes:');
    const history = await ChangeTracker.getHistory();
    const recent = history.slice(-5).reverse();

    if (recent.length === 0) {
      console.log('   No changes recorded yet.');
    } else {
      recent.forEach(change => {
        const icon = change.status === 'applied' ? '✅' : (change.status === 'rolled_back' ? '↩️ ' : '❌');
        console.log(`   ${icon} [${change.timestamp.substring(0, 10)}] ${change.type}: ${change.description} (Conf: ${change.confidenceScore})`);
      });
    }

  } catch (error) {
    console.error('Failed to retrieve status:', error);
  }
}

main();
