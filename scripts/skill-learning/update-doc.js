#!/usr/bin/env node

/**
 * Updates docs/SKILL_LEARNING.md with current evolvable skills, proposals, and mapping stats.
 * Called by skill:status and skill:evolve to keep the doc in sync.
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(process.cwd(), '.agent/skills');
const PROPOSED_DIR = path.join(process.cwd(), 'docs/skill-learning/proposed');
const MAPPING_PATH = path.join(process.cwd(), 'docs/skill-learning/skill-mapping.json');
const DOC_PATH = path.join(process.cwd(), 'docs/SKILL_LEARNING.md');

function gatherState() {
  const state = { evolvable: [], proposed: [], errorPatterns: 0, rsiTypes: 0 };

  if (fs.existsSync(SKILLS_DIR)) {
    const skillDirs = fs.readdirSync(SKILLS_DIR).filter(name => {
      const stat = fs.statSync(path.join(SKILLS_DIR, name));
      return stat.isDirectory();
    });
    for (const name of skillDirs) {
      const skillPath = path.join(SKILLS_DIR, name, 'SKILL.md');
      if (fs.existsSync(skillPath)) {
        const content = fs.readFileSync(skillPath, 'utf8');
        const fm = content.match(/^---\s*\n([\s\S]*?)\n---/);
        if (fm && /evolvable:\s*true/.test(fm[1])) {
          state.evolvable.push(name);
        }
      }
    }
  }

  if (fs.existsSync(PROPOSED_DIR)) {
    state.proposed = fs.readdirSync(PROPOSED_DIR).filter(f => f.endsWith('.md'));
  }

  if (fs.existsSync(MAPPING_PATH)) {
    const mapping = JSON.parse(fs.readFileSync(MAPPING_PATH, 'utf8'));
    state.errorPatterns = Object.keys(mapping.errorPatterns || {}).length;
    state.rsiTypes = Object.keys(mapping.rsiTypes || {}).length;
  }

  return state;
}

function generateDoc(state) {
  const updated = new Date().toISOString();
  const evolvableList =
    state.evolvable.length > 0 ? state.evolvable.map(s => `- ${s}`).join('\n') : '- (none)';
  const proposedList =
    state.proposed.length > 0 ? state.proposed.map(f => `- ${f}`).join('\n') : '- (none)';

  return `# Skill Learning System

Skills can evolve automatically from error-learning and RSI (Recursive Self-Improvement) insights.

## Overview

- **Evolvable skills**: Skills with \`evolvable: true\` in frontmatter can receive proposed updates.
- **Sources**: \`docs/errors/knowledge-base.json\` (error patterns) and \`docs/rsi/improvements.json\` (RSI history).
- **Mapping**: \`docs/skill-learning/skill-mapping.json\` maps pattern IDs and RSI types to skill names.
- **Staging**: Proposals are written to \`docs/skill-learning/proposed/{skill-name}.md\` for review before merging.

## Current State

*Auto-generated at ${updated}*

**Evolvable skills:** ${state.evolvable.length}

${evolvableList}

**Pending proposals:** ${state.proposed.length}

${proposedList}

**Mapping:** ${state.errorPatterns} error patterns, ${state.rsiTypes} RSI types

## When Evolution Runs

- **Error-learning workflow**: After CI succeeds (errors were fixed), rule generation runs and proposes skill updates for mapped patterns.
- **RSI nightly**: \`npm run rsi:run\` includes \`skill:evolve\`, which processes both error-learning and RSI insights.
- **Manual**: Run \`npm run skill:evolve\` to process learnings and generate proposals.

## Commands

| Command                  | Description                                                |
| ------------------------ | ---------------------------------------------------------- |
| \`npm run skill:evolve\` | Process error-learning + RSI, generate skill proposals      |
| \`npm run skill:status\` | List evolvable skills, pending proposals, mapping stats    |
| \`npm run skill:review\` | Show proposed changes and paths for manual review          |
| \`npm run skill:merge\`  | Merge proposal(s) into live skills (\`<name>\` or \`--all\`) |
| \`npm run skill:map-suggest\` | Suggest skill-mapping.json entries for unmapped patterns |
| \`npm run skill:map-apply\` | Apply suggestions to skill-mapping.json (\`--dry-run\` to preview) |
| \`npm run skill:evolve -- --auto-map\` | Evolve and auto-apply mapping suggestions |

## Review and Merge

1. Run \`npm run skill:review\` to see proposed files.
2. Diff proposed vs current: \`diff .agent/skills/prepflow-error-recovery/SKILL.md docs/skill-learning/proposed/prepflow-error-recovery.md\`
3. Merge: \`npm run skill:merge prepflow-error-recovery\` or \`npm run skill:merge --all\` (copies proposal to live skill and removes proposal).

The system will not re-propose patterns that are already present in the skill (checks for existing "## Learned:" section).

## Configuration

- **docs/skill-learning/config.json**: \`minFixCount\` (default 3), \`minRsiConfidence\` (default 0.8).
- **docs/skill-learning/skill-mapping.json**: Add \`errorPatterns\` (patternId -> skill) and \`rsiTypes\` (RSI type -> skill).

Non-evolvable skills (standards, say-no, merge-ready, leave-better) are never auto-updated.
`;
}

function updateDoc() {
  const state = gatherState();
  const content = generateDoc(state);
  fs.writeFileSync(DOC_PATH, content, 'utf8');
}

module.exports = { updateDoc, gatherState };
if (require.main === module) {
  updateDoc();
}
