#!/usr/bin/env node

/**
 * RSI Auto-Rule Script
 * Manages the generation, evaluation, and activation of evolved rules.
 */

const { register } = require('tsx/cjs/api');
register();

const { RuleGenerator } = require('../../lib/rsi/rule-evolution/rule-generator');
const { RuleEvaluator } = require('../../lib/rsi/rule-evolution/rule-evaluator');
const { RuleManager } = require('../../lib/rsi/rule-evolution/rule-manager');

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const command = args[0] || 'generate'; // generate, list

  console.log('⚖️  RSI Rule Evolution Agent Starting...');
  console.log('=====================================');

  if (command === 'list') {
      const rules = await RuleManager.getActiveRules();
      console.log(`\nActive Rules (${rules.length}):`);
      rules.forEach(r => console.log(` - [${r.severity}] ${r.name}: ${r.description}`));
      return;
  }

  if (command === 'generate') {
      // Mock Insight (usually would come from learning-history.json)
      const mockInsight = {
          patternId: 'fix-any-types',
          insight: 'Replacing "any" with specific interfaces has 100% success rate in API routes.'
      };

      console.log(`\nProcessing insight: "${mockInsight.insight}"`);

      const rule = await RuleGenerator.generateFromInsight(mockInsight);

      if (rule) {
          console.log(`\nGenerated Rule Candidate:`);
          console.log(`  Name: ${rule.name}`);
          console.log(`  Check: ${rule.definition}`);

          // Evaluate
          const evaluation = await RuleEvaluator.evaluate(rule);

          if (evaluation.isValid) {
              console.log('✅ Rule passed evaluation.');

              if (dryRun) {
                  console.log('[DRY RUN] Rule activation skipped.');
              } else {
                  await RuleManager.activateRule(rule);
              }
          } else {
              console.log('❌ Rule failed evaluation. Discarding.');
          }
      } else {
          console.log('No rule could be generated from this insight.');
      }
  }
}

main().catch(console.error);
