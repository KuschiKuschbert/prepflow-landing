#!/usr/bin/env node

/**
 * RSI Manual Rollback Tool
 * Allows manual triggering of rollback for RSI changes.
 */

const { register } = require('tsx/cjs/api');
register();

const { RollbackManager } = require('../../lib/rsi/safety/rollback-manager');
const { ChangeTracker } = require('../../lib/rsi/safety/change-tracker');

async function main() {
  const args = process.argv.slice(2);
  const changeId = args[0];

  console.log('\n↩️  RSI Rollback Tool');
  console.log('=====================\n');

  if (!changeId) {
    console.log('Usage: npm run rsi:rollback <change-id>');
    console.log('       npm run rsi:rollback last');

    console.log('\nRecent changes:');
    const history = await ChangeTracker.getHistory();
    const recent = history.slice(-5).reverse();
    recent.forEach(change => {
      console.log(`ID: ${change.id} | ${change.type}: ${change.description}`);
    });
    return;
  }

  if (changeId === 'last') {
    const success = await RollbackManager.rollbackLastCommit();
    if (success) {
      console.log('✅ Successfully reverted last git commit.');
    } else {
      console.error('❌ Failed to revert last commit.');
    }
  } else {
    const success = await RollbackManager.rollbackChange(changeId);
    if (success) {
      console.log(`✅ Successfully rolled back change ${changeId}.`);
    } else {
      console.error(`❌ Failed to rollback change ${changeId}.`);
    }
  }
}

main();
