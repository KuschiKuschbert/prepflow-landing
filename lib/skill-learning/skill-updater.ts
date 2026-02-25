/**
 * Skill Updater - Stages learned patterns into skill proposals
 */

import fs from 'fs';
import path from 'path';
import { loadConfig } from './config';
import { getSkillForErrorPattern, getSkillForRsiType } from './skill-mapper';
import type { SkillUpdateInput, SkillUpdateResult } from './types';

const EVOLVABLE_REGEX = /evolvable:\s*true/;

function isSkillEvolvable(skillPath: string): boolean {
  try {
    const content = fs.readFileSync(skillPath, 'utf8');
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) return false;
    return EVOLVABLE_REGEX.test(frontmatterMatch[1]);
  } catch {
    return false;
  }
}

function buildLearnedSection(input: SkillUpdateInput): string {
  return `\n## Learned: ${input.patternName}\n\n*Auto-learned from ${input.source} (pattern: ${input.patternId})*\n\n### Detection\n${input.detection}\n\n### Fix\n${input.fix}\n\n### Prevention\n${input.prevention}\n\n`;
}

/**
 * Propose a skill update from an error-learning pattern.
 * Writes to docs/skill-learning/proposed/{skill-name}.md (staged, not merged).
 */
export async function proposeSkillUpdate(
  input: SkillUpdateInput,
  skillName: string,
): Promise<SkillUpdateResult> {
  const config = loadConfig();
  const skillsBase = path.join(process.cwd(), config.skillsDir);
  const proposedBase = path.join(process.cwd(), config.proposedDir);
  const skillPath = path.join(skillsBase, skillName, 'SKILL.md');
  const proposedPath = path.join(proposedBase, `${skillName}.md`);

  try {
    if (!fs.existsSync(skillPath)) {
      return {
        skillName,
        proposed: false,
        path: skillPath,
        error: `Skill not found: ${skillName}`,
      };
    }

    if (!isSkillEvolvable(skillPath)) {
      return {
        skillName,
        proposed: false,
        path: skillPath,
        error: `Skill ${skillName} is not evolvable`,
      };
    }

    fs.mkdirSync(proposedBase, { recursive: true });

    const section = buildLearnedSection(input);
    let proposedContent = '';

    if (fs.existsSync(proposedPath)) {
      proposedContent = fs.readFileSync(proposedPath, 'utf8');
    } else {
      proposedContent = fs.readFileSync(skillPath, 'utf8');
    }

    const marker = `## Learned: ${input.patternName}`;
    if (proposedContent.includes(marker)) {
      return { skillName, proposed: false, path: proposedPath, error: 'Pattern already proposed' };
    }

    const insertPoint = proposedContent.indexOf('## Style Guide');
    if (insertPoint >= 0) {
      proposedContent =
        proposedContent.slice(0, insertPoint) + section + proposedContent.slice(insertPoint);
    } else {
      proposedContent += section;
    }

    fs.writeFileSync(proposedPath, proposedContent, 'utf8');
    return { skillName, proposed: true, path: proposedPath };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { skillName, proposed: false, path: proposedPath, error: message };
  }
}

/**
 * Maybe update a skill from an error-learning pattern.
 * Resolves skill from mapping, checks evolvability, stages proposal.
 */
export async function maybeUpdateSkillFromPattern(
  patternId: string,
  input: Omit<SkillUpdateInput, 'patternId' | 'source'>,
): Promise<SkillUpdateResult | null> {
  const skillName = getSkillForErrorPattern(patternId);
  if (!skillName) return null;

  return proposeSkillUpdate(
    {
      ...input,
      patternId,
      source: 'error-learning',
    },
    skillName,
  );
}

/**
 * Maybe update a skill from an RSI insight.
 */
export async function maybeUpdateSkillFromRsi(
  rsiType: string,
  insight: string,
  confidence: number,
): Promise<SkillUpdateResult | null> {
  const skillName = getSkillForRsiType(rsiType);
  if (!skillName) return null;

  const config = loadConfig();
  if (confidence < config.minRsiConfidence) return null;

  return proposeSkillUpdate(
    {
      patternId: rsiType,
      patternName: `RSI: ${rsiType}`,
      description: insight,
      detection: `RSI improvement type: ${rsiType}`,
      fix: insight,
      prevention: `Apply ${rsiType} pattern when similar context arises`,
      source: 'rsi',
    },
    skillName,
  );
}
