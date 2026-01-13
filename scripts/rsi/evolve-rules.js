#!/usr/bin/env node

/**
 * RSI Rule Evolution Script
 * Triggers the meta-learning cycle to analyze history and synthesize new rules.
 */

const { register } = require('tsx/cjs/api');
register();

const { FrequencyAnalysisStrategy } = require('../../lib/rsi/meta-learning/learning-strategy');
const { KnowledgeSynthesizer } = require('../../lib/rsi/meta-learning/knowledge-synthesizer');
const fs = require('fs');
const path = require('path');

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  console.log('🧠 RSI Meta-Learning / Rule Evolution Starting...');
  console.log('==============================================');

  // Load history (Mock for Phase 4)
  const historyPath = path.join(process.cwd(), 'docs/rsi/improvements.json');
  let history = [];
  if (fs.existsSync(historyPath)) {
    history = JSON.parse(fs.readFileSync(historyPath, 'utf-8') || '[]');
  }

  // 1. Run Learning Strategies
  const strategy = new FrequencyAnalysisStrategy();
  const insights = await strategy.analyze(history);

  console.log(`\n💡 Generated ${insights.length} insights.`);
  insights.forEach(i => console.log(`   - [${(i.confidence * 100).toFixed(0)}%] ${i.insight}`));

  // 2. Synthesize Knowledge
  const rules = await KnowledgeSynthesizer.synthesize(insights);

  console.log(`\n📚 Synthesized ${rules.length} new rule candidates.`);
  rules.forEach(r => {
    console.log(`   - ${r.description}`);
  });

  // 3. Save to Learning History (if not dry run)
  if (!dryRun) {
    const learningPath = path.join(process.cwd(), 'docs/rsi/learning-history.json');
    let learningLog = [];
    if (fs.existsSync(learningPath)) {
      learningLog = JSON.parse(fs.readFileSync(learningPath, 'utf-8') || '[]');
    }

    const sessionLog = {
      timestamp: new Date().toISOString(),
      insights,
      rulesGenerated: rules,
    };

    learningLog.push(sessionLog);
    fs.writeFileSync(learningPath, JSON.stringify(learningLog, null, 2));
    console.log('\n✅ Learning session saved to history.');
  } else {
    console.log('\n[DRY RUN] Learning session not saved.');
  }
}

main().catch(console.error);
