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

  // Filter plans by risk and impact
  const allPlans = plans.map(plan => ({
    ...plan,
    risk: RiskAssessor.assess(plan.type || 'refactor', plan.targetFiles || [])
  }));

  const selectedPlan = allPlans[0];
  console.log(`\n📋 Selected Plan: ${selectedPlan.title}`);
  console.log(`   Description: ${selectedPlan.description}`);
  console.log(`   Impact: ${selectedPlan.impactScore} | Risk Level: ${selectedPlan.risk.level} (${selectedPlan.risk.score})`);

  if (selectedPlan.risk.level === RiskLevel.HIGH || selectedPlan.risk.level === RiskLevel.CRITICAL) {
    console.log(`\n⚠️  This plan is too risky for autonomous execution: ${selectedPlan.risk.reasons.join(', ')}`);
    console.log(`   Human approval required. Skipping automatic apply.`);
    return;
  }

  // 2. Execute (or Dry Run)
  if (!selectedPlan.targetFiles || !selectedPlan.codemodPath) {
    console.log(`\n⚠️  This plan is 'Manual Debt'. No automated codemod available.`);
    console.log(`   Please manually address: ${selectedPlan.sourceDebtItem}`);
    return;
  }

  if (dryRun) {
    console.log(
      `\n[DRY RUN] Would execute codemod: ${selectedPlan.codemodPath} on ${selectedPlan.targetFiles.join(', ')}`,
    );

    const result = await CodemodRunner.run(
      selectedPlan.codemodPath,
      selectedPlan.targetFiles,
      true, // dryRun
    );
    console.log('   Dry run complete.');
  } else {
    console.log(`\n🚀 Executing refactor...`);
    const result = await CodemodRunner.run(
      selectedPlan.codemodPath,
      selectedPlan.targetFiles,
      false,
    );

    if (result.success) {
      console.log('✅ Refactoring applied.');

      // 3. Validate
      console.log('🔍 Validating changes...');
      const isValid = await ValidationSuite.validate(selectedPlan.targetFiles);

      if (isValid) {
        console.log('✅ Validation passed. Ready for review.');
      } else {
        console.error('❌ Validation failed or no changes detected. Reverting...');
        await RollbackManager.rollbackAll();
      }
    } else {
      console.error('❌ Refactoring execution failed. Cleaning up...');
      await RollbackManager.rollbackAll();
    }
  }
}

main().catch(console.error);
