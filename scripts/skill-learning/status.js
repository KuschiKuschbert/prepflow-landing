#!/usr/bin/env node

/**
 * Skill Status Script
 * Lists evolvable skills, pending proposals, and mapping stats.
 * Also updates docs/SKILL_LEARNING.md with current state.
 */

const fs = require('fs');
const path = require('path');
const { updateDoc } = require('./update-doc');

const SKILLS_DIR = path.join(process.cwd(), '.agent/skills');
const PROPOSED_DIR = path.join(process.cwd(), 'docs/skill-learning/proposed');
const MAPPING_PATH = path.join(process.cwd(), 'docs/skill-learning/skill-mapping.json');

function main() {
  console.log('🧠 Skill Learning Status');
  console.log('========================\n');

  // Evolvable skills
  if (!fs.existsSync(SKILLS_DIR)) {
    console.log('No .agent/skills directory found.');
    return;
  }

  const skillDirs = fs.readdirSync(SKILLS_DIR).filter(name => {
    const stat = fs.statSync(path.join(SKILLS_DIR, name));
    return stat.isDirectory();
  });

  const evolvable = [];
  for (const name of skillDirs) {
    const skillPath = path.join(SKILLS_DIR, name, 'SKILL.md');
    if (fs.existsSync(skillPath)) {
      const content = fs.readFileSync(skillPath, 'utf8');
      const fm = content.match(/^---\s*\n([\s\S]*?)\n---/);
      if (fm && /evolvable:\s*true/.test(fm[1])) {
        evolvable.push(name);
      }
    }
  }

  console.log('Evolvable skills:', evolvable.length > 0 ? evolvable.join(', ') : 'none');
  console.log('');

  // Pending proposals
  if (fs.existsSync(PROPOSED_DIR)) {
    const proposed = fs.readdirSync(PROPOSED_DIR).filter(f => f.endsWith('.md'));
    console.log('Pending proposals:', proposed.length);
    proposed.forEach(f => console.log(`   - ${f}`));
  } else {
    console.log('Pending proposals: 0');
  }
  console.log('');

  // Mapping
  if (fs.existsSync(MAPPING_PATH)) {
    const mapping = JSON.parse(fs.readFileSync(MAPPING_PATH, 'utf8'));
    const epCount = Object.keys(mapping.errorPatterns || {}).length;
    const rsiCount = Object.keys(mapping.rsiTypes || {}).length;
    console.log('Mapping: ', epCount, 'error patterns, ', rsiCount, 'RSI types');
  }

  console.log('\nRun `npm run skill:review` to see proposed diffs.');
  console.log('Run `npm run skill:evolve` to process new learnings.');

  // Keep docs/SKILL_LEARNING.md in sync
  try {
    updateDoc();
    console.log('\nUpdated docs/SKILL_LEARNING.md');
  } catch (err) {
    console.error('Failed to update SKILL_LEARNING.md:', err.message);
  }
}

main();
