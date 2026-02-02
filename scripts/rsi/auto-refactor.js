#!/usr/bin/env node

/**
 * RSI Auto-Refactoring Script
 * Triggers the planning and execution of complex code transformations.
 */

const { register } = require('tsx/cjs/api');
register();

const { RefactoringPlanner } = require('../../lib/rsi/auto-refactoring/refactoring-planner');
const { CodemodRunner } = require('../../lib/rsi/auto-refactoring/codemod-runner');
const { ValidationSuite } = require('../../lib/rsi/auto-refactoring/validation-suite');
const { RiskAssessor, RiskLevel } = require('../../lib/rsi/safety/risk-assessor');
const { RollbackManager } = require('../../lib/rsi/safety/rollback-manager');

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  console.log('🏗️  RSI Auto-Refactoring Agent Starting...');
  console.log('=======================================');

  // 1. Plan
  const plans = await RefactoringPlanner.createPlan();
  if (plans.length === 0) {
    console.log('✅ No refactoring needed.');
    return;
  }

  // 1b. Filtering & Batching (New: Staged Batching)
  const allPlans = plans.map(plan => ({
    ...plan,
    risk: RiskAssessor.assess(plan.type || 'refactor', plan.targetFiles || []),
  }));

  const safePlans = allPlans.filter(
    p => p.risk.level !== RiskLevel.HIGH && p.risk.level !== RiskLevel.CRITICAL && p.codemodPath,
  );

  if (safePlans.length === 0) {
    console.log('✅ No safe, automated refactoring plans found.');
    return;
  }

  // Find independent plans (no overlapping target files)
  const selectedBatch = [];
  const affectedFiles = new Set();
  const MAX_BATCH_SIZE = 5; // Bumping to 5 for better recursive throughput

  for (const plan of safePlans) {
    if (selectedBatch.length >= MAX_BATCH_SIZE) break;

    const hasOverlap = plan.targetFiles.some(f => affectedFiles.has(f));
    if (!hasOverlap) {
      selectedBatch.push(plan);
      plan.targetFiles.forEach(f => affectedFiles.add(f));
    }
  }

  console.log(`\n📋 Selected Batch (${selectedBatch.length} tasks):`);
  selectedBatch.forEach((p, idx) => {
    console.log(`   ${idx + 1}. [${p.risk.level}] ${p.title}`);
  });

  // 2. Sequential Execution
  let resolvedCount = 0;
  for (const selectedPlan of selectedBatch) {
    console.log(
      `\n🚀 [${resolvedCount + 1}/${selectedBatch.length}] Executing: ${selectedPlan.title}...`,
    );

    if (dryRun) {
      console.log(`   [DRY RUN] Codemod: ${selectedPlan.codemodPath}`);
      resolvedCount++;
      continue;
    }

    const result = await CodemodRunner.run(
      selectedPlan.codemodPath,
      selectedPlan.targetFiles,
      false,
    );

    if (result.success) {
      console.log('   ✅ Applied.');

      // 3. Validate
      console.log('   🔍 Validating...');
      const isValid = await ValidationSuite.validate(selectedPlan.targetFiles);

      if (isValid) {
        console.log('   ✅ Passed.');
        if (
          selectedPlan.sourceDebtItem &&
          !selectedPlan.sourceDebtItem.includes('Architecture Report')
        ) {
          await RefactoringPlanner.resolveDebtItem(selectedPlan.sourceDebtItem);
        }
        resolvedCount++;
      } else {
        console.error('   ❌ Validation failed. Reverting...');
        await RollbackManager.discardChanges();
      }
    } else {
      console.error('   ❌ Execution failed. Cleaning up...');
      await RollbackManager.discardChanges();
    }
  }

  console.log(
    `\n✨ Batch processing complete. Resolved ${resolvedCount}/${selectedBatch.length} items.`,
  );

  // Extra logging for CI to help recursive trigger
  const remaining = plans.length - resolvedCount;
  console.log(`RSI_REMAINING_DEBT=${remaining}`);
}

main().catch(console.error);
