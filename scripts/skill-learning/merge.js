#!/usr/bin/env node

/**
 * Skill Merge Script
 * Copies proposed skill changes into live skills and removes proposals.
 * Usage: npm run skill:merge <skill-name>
 *        npm run skill:merge --all
 *        npm run skill:merge -- --interactive
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');
const { updateDoc } = require('./update-doc');

const SKILLS_DIR = path.join(process.cwd(), '.agent/skills');
const PROPOSED_DIR = path.join(process.cwd(), 'docs/skill-learning/proposed');

function runDiff(fileA, fileB) {
  try {
    return execSync(`diff "${fileA}" "${fileB}"`, { encoding: 'utf8', maxBuffer: 1024 * 1024 });
  } catch (e) {
    if (e.stdout) return e.stdout;
    return '';
  }
}

function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve((answer || '').trim().toLowerCase());
    });
  });
}

async function interactiveMerge(toMerge) {
  let merged = 0;
  for (const skillName of toMerge) {
    const proposedPath = path.join(PROPOSED_DIR, `${skillName}.md`);
    const skillPath = path.join(SKILLS_DIR, skillName, 'SKILL.md');

    console.log(`\n--- ${skillName} ---`);
    if (fs.existsSync(skillPath)) {
      const diff = runDiff(skillPath, proposedPath);
      if (diff) {
        console.log(diff.slice(0, 4000));
        if (diff.length > 4000) console.log('... (truncated)');
      } else {
        console.log('(no diff - files identical or new skill)');
      }
    } else {
      console.log('(new skill - no current SKILL.md)');
    }

    const answer = await prompt('Merge? (y/n/s) [y=merge, n=skip, s=skip and keep for later]: ');
    if (answer === 'y' || answer === 'yes' || answer === '') {
      const skillDir = path.join(SKILLS_DIR, skillName);
      if (!fs.existsSync(skillDir)) fs.mkdirSync(skillDir, { recursive: true });
      const content = fs.readFileSync(proposedPath, 'utf8');
      fs.writeFileSync(skillPath, content, 'utf8');
      fs.unlinkSync(proposedPath);
      console.log(`Merged: ${skillName}`);
      merged++;
    } else if (answer === 's' || answer === 'skip') {
      console.log(`Skipped (keep): ${skillName}`);
    } else {
      console.log(`Skipped: ${skillName}`);
    }
  }
  return merged;
}

function main() {
  const args = process.argv.slice(2);
  const interactive = args.includes('--interactive');
  const target = args.find(a => a !== '--interactive');

  if (!target && !interactive) {
    console.log('Usage: npm run skill:merge <skill-name>');
    console.log('       npm run skill:merge --all');
    console.log('       npm run skill:merge -- --interactive');
    return;
  }

  if (!fs.existsSync(PROPOSED_DIR)) {
    console.log('No proposed changes. Run `npm run skill:evolve` to generate proposals.');
    return;
  }

  const proposed = fs.readdirSync(PROPOSED_DIR).filter(f => f.endsWith('.md'));
  if (proposed.length === 0) {
    console.log('No proposed changes.');
    return;
  }

  const toMerge =
    interactive || target === '--all'
      ? proposed.map(f => f.replace(/\.md$/, ''))
      : proposed.includes(`${target}.md`)
        ? [target]
        : [];

  if (toMerge.length === 0) {
    if (target === '--all' || interactive) {
      console.log('No proposed changes to merge.');
    } else {
      console.log(`No proposal found for "${target}". Available: ${proposed.join(', ')}`);
    }
    return;
  }

  const doMerge = async () => {
    let merged = 0;
    if (interactive) {
      merged = await interactiveMerge(toMerge);
    } else {
      for (const skillName of toMerge) {
        const proposedPath = path.join(PROPOSED_DIR, `${skillName}.md`);
        const skillPath = path.join(SKILLS_DIR, skillName, 'SKILL.md');
        const skillDir = path.join(SKILLS_DIR, skillName);
        if (!fs.existsSync(skillDir)) fs.mkdirSync(skillDir, { recursive: true });
        const content = fs.readFileSync(proposedPath, 'utf8');
        fs.writeFileSync(skillPath, content, 'utf8');
        fs.unlinkSync(proposedPath);
        console.log(`Merged: ${skillName}`);
        merged++;
      }
    }
    console.log(`\nMerged ${merged} skill(s).`);
    try {
      updateDoc();
      console.log('Updated docs/SKILL_LEARNING.md');
    } catch (err) {
      console.error('Failed to update SKILL_LEARNING.md:', err.message);
    }
  };

  doMerge().catch(console.error);
}

main();
