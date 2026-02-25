#!/usr/bin/env node

/**
 * Map Apply Script
 * Appends suggested skill-mapping entries for unmapped patterns to skill-mapping.json.
 * Usage: npm run skill:map-apply [--dry-run]
 */

const fs = require('fs');
const path = require('path');

const KB_PATH = path.join(process.cwd(), 'docs/errors/knowledge-base.json');
const MAPPING_PATH = path.join(process.cwd(), 'docs/skill-learning/skill-mapping.json');

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
  return 'prepflow-error-recovery';
}

function getUnmapped() {
  if (!fs.existsSync(KB_PATH)) return [];
  const kb = JSON.parse(fs.readFileSync(KB_PATH, 'utf8'));
  const mapping = fs.existsSync(MAPPING_PATH)
    ? JSON.parse(fs.readFileSync(MAPPING_PATH, 'utf8'))
    : { errorPatterns: {}, rsiTypes: {} };
  const mapped = Object.keys(mapping.errorPatterns || {});

  const patternKeys = new Set();
  for (const err of kb.errors || []) {
    patternKeys.add(`${err.errorType}-${err.category}`);
  }
  for (const p of kb.patterns || []) {
    if (p.id) patternKeys.add(p.id);
  }

  return [...patternKeys].filter(k => !mapped.includes(k));
}

function main() {
  const dryRun = process.argv.includes('--dry-run');
  const isStandalone = require.main === module;

  if (isStandalone) {
    console.log('Skill Map Apply' + (dryRun ? ' [DRY RUN]' : ''));
    console.log('==============\n');
  }

  const unmapped = getUnmapped();
  if (unmapped.length === 0) {
    if (isStandalone) console.log('All patterns already mapped.');
    return { added: 0 };
  }

  const mapping = fs.existsSync(MAPPING_PATH)
    ? JSON.parse(fs.readFileSync(MAPPING_PATH, 'utf8'))
    : { errorPatterns: {}, rsiTypes: {} };
  mapping.errorPatterns = mapping.errorPatterns || {};

  let added = 0;
  for (const id of unmapped.sort()) {
    const skill = suggestSkill(id);
    mapping.errorPatterns[id] = skill;
    added++;
    if (isStandalone) console.log(`  + "${id}": "${skill}"`);
  }

  if (!dryRun && added > 0) {
    fs.writeFileSync(MAPPING_PATH, JSON.stringify(mapping, null, 2) + '\n', 'utf8');
  }
  if (isStandalone) {
    console.log(`\n${dryRun ? 'Would add' : 'Added'} ${added} mapping(s).`);
  }
  return { added };
}

module.exports = { main, getUnmapped };
if (require.main === module) {
  main();
}
