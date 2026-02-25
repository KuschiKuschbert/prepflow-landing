#!/usr/bin/env node

/**
 * Map Suggest Script
 * Suggests skill-mapping.json entries for unmapped error patterns.
 * Usage: npm run skill:map-suggest
 */

const fs = require('fs');
const path = require('path');

const KB_PATH = path.join(process.cwd(), 'docs/errors/knowledge-base.json');
const MAPPING_PATH = path.join(process.cwd(), 'docs/skill-learning/skill-mapping.json');

// Heuristics: patternId substring -> suggested skill
const SUGGEST_RULES = [
  [/ConfigurationError|Runtime|Auth0|env|NEXTAUTH/i, 'prepflow-error-recovery'],
  [/SyntaxError|CI|YAML|workflow|\.yml/i, 'prepflow-guardian'],
  [/HistoricalFix|Development|missing.*error|lint|BestPractice/i, 'prepflow-craft'],
  [/Architecture|ingredient|BestPractice|recipe|menu/i, 'prepflow-kitchen-domain'],
  [/cleanup|refactor|performance/i, 'prepflow-guardian'],
];

function suggestSkill(patternId) {
  for (const [re, skill] of SUGGEST_RULES) {
    if (re.test(patternId)) return skill;
  }
  return 'prepflow-error-recovery'; // default
}

function main() {
  console.log('🧠 Skill Mapping Suggestions');
  console.log('============================\n');

  if (!fs.existsSync(KB_PATH)) {
    console.log('Knowledge base not found.');
    return;
  }

  const kb = JSON.parse(fs.readFileSync(KB_PATH, 'utf8'));
  const mapped = fs.existsSync(MAPPING_PATH)
    ? Object.keys(JSON.parse(fs.readFileSync(MAPPING_PATH, 'utf8')).errorPatterns || {})
    : [];

  const patternKeys = new Set();
  for (const err of kb.errors || []) {
    const key = `${err.errorType}-${err.category}`;
    patternKeys.add(key);
  }
  for (const p of kb.patterns || []) {
    if (p.id) patternKeys.add(p.id);
  }

  const unmapped = [...patternKeys].filter(k => !mapped.includes(k));
  if (unmapped.length === 0) {
    console.log('All error patterns are mapped.');
    return;
  }

  console.log(`Unmapped patterns (add to docs/skill-learning/skill-mapping.json):\n`);
  for (const id of unmapped.sort()) {
    const skill = suggestSkill(id);
    console.log(`  "${id}": "${skill}"`);
  }
  console.log('\nCopy the lines above into errorPatterns in skill-mapping.json.');
}

main();
