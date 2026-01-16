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
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

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

  const selectedPlan = plans[0]; // Pick highest priority
  console.log(`\n📋 Selected Plan: ${selectedPlan.title}`);
  console.log(`   Description: ${selectedPlan.description}`);
  console.log(`   Impact: ${selectedPlan.impactScore} | Risk: ${selectedPlan.riskScore}`);

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

    // Simulate codemod runner dry run output
    // (Assuming CodemodRunner.run isn't actually called here to avoid needing the file to exist for this demo)
    console.log('   (Simulating jscodeshift output...)');
    console.log('   files: 5, changed: 2, errors: 0');
  } else {
    console.log(`\n🚀 Executing refactor...`);
    // We need to ensure codemod file exists before real execution, or catch error
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
        console.log('✅ Validation passed. Ready to commit.');
      } else {
        console.error('❌ Validation failed or no changes detected. Reverting...');
        await execAsync('git checkout -- .');
      }
    } else {
      console.error('❌ Refactoring execution failed.');
      console.error(result.output);
    }
  }
}

main().catch(console.error);
