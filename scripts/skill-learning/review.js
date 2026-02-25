#!/usr/bin/env node

/**
 * Skill Review Script
 * Lists proposed skill changes and shows diff paths for manual review.
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(process.cwd(), '.agent/skills');
const PROPOSED_DIR = path.join(process.cwd(), 'docs/skill-learning/proposed');

function main() {
  console.log('🧠 Skill Learning - Proposed Changes Review');
  console.log('============================================\n');

  if (!fs.existsSync(PROPOSED_DIR)) {
    console.log('No proposed changes. Run `npm run skill:evolve` to generate proposals.');
    return;
  }

  const proposed = fs.readdirSync(PROPOSED_DIR).filter(f => f.endsWith('.md'));
  if (proposed.length === 0) {
    console.log('No proposed changes.');
    return;
  }

  for (const file of proposed) {
    const skillName = file.replace(/\.md$/, '');
    const proposedPath = path.join(PROPOSED_DIR, file);
    const currentPath = path.join(SKILLS_DIR, skillName, 'SKILL.md');

    console.log(`\n### ${skillName}`);
    console.log(`   Proposed: ${proposedPath}`);
    console.log(`   Current:  ${currentPath}`);

    if (fs.existsSync(currentPath)) {
      const current = fs.readFileSync(currentPath, 'utf8');
      const proposedContent = fs.readFileSync(proposedPath, 'utf8');
      const currentLines = current.split('\n').length;
      const proposedLines = proposedContent.split('\n').length;
      console.log(`   Lines:    ${currentLines} -> ${proposedLines}`);
    }

    console.log(`   To merge: copy proposed over current SKILL.md after review.`);
  }

  console.log('\n---');
  console.log('To accept a proposal, copy the proposed file over the skill SKILL.md.');
  console.log(
    'Example: cp docs/skill-learning/proposed/prepflow-error-recovery.md .agent/skills/prepflow-error-recovery/SKILL.md',
  );
}

main();
