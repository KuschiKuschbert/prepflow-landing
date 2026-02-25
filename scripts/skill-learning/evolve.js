#!/usr/bin/env node

/**
 * Skill Evolution Script
 * Runs error-learning rule generation (which proposes skill updates)
 * and RSI insight processing to propose skill updates from improvements history.
 */

const { register } = require('tsx/cjs/api');
register();

const fs = require('fs');
const path = require('path');

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  console.log('🧠 Skill Evolution Starting...');
  if (dryRun) console.log('[DRY RUN]');
  console.log('================================');

  if (dryRun) {
    console.log('\nSkipping writes in dry run. Run without --dry-run to propose skill updates.');
    return;
  }

  // 1. Run error-learning rule generation (triggers skill proposals for mapped patterns)
  console.log('\n📚 Processing error-learning knowledge base...');
  try {
    const { generateRulesFromKnowledgeBase } = require('../../lib/error-learning/rule-generator');
    const { patterns } = await generateRulesFromKnowledgeBase();
    console.log(
      `   Processed ${patterns.length} patterns (skill proposals auto-created for mapped patterns).`,
    );
  } catch (err) {
    console.error('   Error:', err.message);
  }

  // 2. Process RSI improvements for skill proposals
  const historyPath = path.join(process.cwd(), 'docs/rsi/improvements.json');
  if (fs.existsSync(historyPath)) {
    console.log('\n📊 Processing RSI improvements history...');
    const history = JSON.parse(fs.readFileSync(historyPath, 'utf-8') || '[]');
    const { FrequencyAnalysisStrategy } = require('../../lib/rsi/meta-learning/learning-strategy');
    const { maybeUpdateSkillFromRsi } = require('../../lib/skill-learning');

    const strategy = new FrequencyAnalysisStrategy();
    const insights = await strategy.analyze(history);

    for (const insight of insights) {
      const result = await maybeUpdateSkillFromRsi(
        insight.patternId,
        insight.insight,
        insight.confidence,
      );
      if (result?.proposed) {
        console.log(`   📝 Skill proposal: ${result.skillName} -> ${result.path}`);
      }
    }
    console.log(`   Processed ${insights.length} RSI insights.`);
  }

  console.log(
    '\n✅ Skill evolution complete. Review proposed changes in docs/skill-learning/proposed/',
  );

  // Optional: auto-apply unmapped pattern suggestions
  if (args.includes('--auto-map')) {
    try {
      const { main: mapApply } = require('./map-apply');
      const { added } = mapApply();
      if (added > 0) console.log(`Auto-mapped ${added} pattern(s) to skill-mapping.json`);
    } catch (err) {
      console.error('Map apply failed:', err.message);
    }
  }

  // Keep docs/SKILL_LEARNING.md in sync
  try {
    const { updateDoc } = require('./update-doc');
    updateDoc();
    console.log('Updated docs/SKILL_LEARNING.md');
  } catch (err) {
    console.error('Failed to update SKILL_LEARNING.md:', err.message);
  }
}

main().catch(console.error);
