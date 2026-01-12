/**
 * PR Description Generator
 * Generates PR descriptions, commit messages, and changelog entries
 */

import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

export interface PRDescription {
  title: string;
  description: string;
  changes: string[];
  relatedIssues: string[];
  testingNotes: string;
  breakingChanges?: string[];
}

/**
 * Generate PR description from git diff
 */
export async function generatePRDescription(baseBranch = 'main'): Promise<PRDescription> {
  try {
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    const diff = execSync(`git diff ${baseBranch}...HEAD --stat`, { encoding: 'utf8' });
    const fileChanges = diff.split('\n').filter(line => line.includes('|')).map(line => {
      const match = line.match(/(\S+)\s+\|\s+(\d+)/);
      return match ? { file: match[1], changes: parseInt(match[2], 10) } : null;
    }).filter(Boolean) as Array<{ file: string; changes: number }>;

    const changedFiles = fileChanges.map(f => f.file);
    const totalChanges = fileChanges.reduce((sum, f) => sum + f.changes, 0);

    // Analyze changes
    const features = changedFiles.filter(f => f.includes('feature') || f.includes('add'));
    const fixes = changedFiles.filter(f => f.includes('fix') || f.includes('bug'));
    const refactors = changedFiles.filter(f => f.includes('refactor'));

    // Generate title
    let title = '';
    if (features.length > 0) {
      title = `feat: ${features[0].split('/').pop()?.replace(/\.(ts|tsx|js|jsx)$/, '') || 'New feature'}`;
    } else if (fixes.length > 0) {
      title = `fix: ${fixes[0].split('/').pop()?.replace(/\.(ts|tsx|js|jsx)$/, '') || 'Bug fix'}`;
    } else if (refactors.length > 0) {
      title = `refactor: ${refactors[0].split('/').pop()?.replace(/\.(ts|tsx|js|jsx)$/, '') || 'Code refactoring'}`;
    } else {
      title = `chore: Update ${changedFiles.length} file(s)`;
    }

    // Generate description
    const description = generateDescription(changedFiles, totalChanges);

    // Extract changes
    const changes = fileChanges.map(f => `${f.file} (${f.changes} changes)`);

    // Check for breaking changes
    const breakingChanges = detectBreakingChanges(changedFiles);

    return {
      title,
      description,
      changes,
      relatedIssues: [], // Would extract from commit messages
      testingNotes: generateTestingNotes(changedFiles),
      breakingChanges: breakingChanges.length > 0 ? breakingChanges : undefined,
    };
  } catch (err) {
    throw new Error(`Failed to generate PR description: ${err}`);
  }
}

/**
 * Generate description
 */
function generateDescription(files: string[], totalChanges: number): string {
  return `## Changes

This PR includes ${totalChanges} changes across ${files.length} file(s).

### Modified Files

${files.map(f => `- ${f}`).join('\n')}

### Summary

${generateSummary(files)}
`;
}

/**
 * Generate summary
 */
function generateSummary(files: string[]): string {
  const apiFiles = files.filter(f => f.includes('/api/'));
  const componentFiles = files.filter(f => f.includes('/components/'));
  const libFiles = files.filter(f => f.includes('/lib/'));

  const parts: string[] = [];

  if (apiFiles.length > 0) {
    parts.push(`- ${apiFiles.length} API route(s) modified`);
  }

  if (componentFiles.length > 0) {
    parts.push(`- ${componentFiles.length} component(s) modified`);
  }

  if (libFiles.length > 0) {
    parts.push(`- ${libFiles.length} utility/helper(s) modified`);
  }

  return parts.join('\n') || 'Various files updated';
}

/**
 * Detect breaking changes
 */
function detectBreakingChanges(files: string[]): string[] {
  const breaking: string[] = [];

  // Check for API route changes (potential breaking)
  const apiChanges = files.filter(f => f.includes('/api/') && f.includes('route.'));
  if (apiChanges.length > 0) {
    breaking.push('API routes modified - verify backward compatibility');
  }

  // Check for type definition changes
  const typeChanges = files.filter(f => f.includes('.types.') || f.includes('types.ts'));
  if (typeChanges.length > 0) {
    breaking.push('Type definitions modified - may affect TypeScript consumers');
  }

  return breaking;
}

/**
 * Generate testing notes
 */
function generateTestingNotes(files: string[]): string {
  const notes: string[] = [];

  if (files.some(f => f.includes('/api/'))) {
    notes.push('- Test API endpoints manually or with integration tests');
  }

  if (files.some(f => f.includes('/components/'))) {
    notes.push('- Test UI components in browser');
  }

  if (files.some(f => f.includes('/lib/'))) {
    notes.push('- Run unit tests for utility functions');
  }

  return notes.join('\n') || 'No specific testing notes';
}

/**
 * Generate commit message from changes
 */
export async function generateCommitMessage(files: string[]): Promise<string> {
  const stagedFiles = files.length > 0 ? files : getStagedFiles();

  if (stagedFiles.length === 0) {
    return 'chore: Update files';
  }

  // Analyze file types
  const apiFiles = stagedFiles.filter(f => f.includes('/api/'));
  const componentFiles = stagedFiles.filter(f => f.includes('/components/'));
  const testFiles = stagedFiles.filter(f => f.includes('.test.') || f.includes('.spec.'));
  const fixFiles = stagedFiles.filter(f => f.includes('fix'));

  // Determine type
  let type = 'chore';
  let scope = '';
  let subject = '';

  if (fixFiles.length > 0) {
    type = 'fix';
    subject = fixFiles[0].split('/').pop()?.replace(/\.(ts|tsx|js|jsx)$/, '') || 'bug';
  } else if (apiFiles.length > 0) {
    type = 'feat';
    scope = 'api';
    subject = apiFiles[0].split('/').pop()?.replace(/route\.(ts|js)$/, '') || 'endpoint';
  } else if (componentFiles.length > 0) {
    type = 'feat';
    scope = 'ui';
    subject = componentFiles[0].split('/').pop()?.replace(/\.(tsx|jsx)$/, '') || 'component';
  } else if (testFiles.length > 0) {
    type = 'test';
    subject = 'Add tests';
  }

  return `${type}${scope ? `(${scope})` : ''}: ${subject}`;
}

/**
 * Get staged files
 */
function getStagedFiles(): string[] {
  try {
    const output = execSync('git diff --cached --name-only', { encoding: 'utf8' });
    return output.trim().split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * Generate changelog entry
 */
export interface ChangelogEntry {
  type: 'feat' | 'fix' | 'refactor' | 'perf' | 'docs' | 'chore';
  description: string;
  scope?: string;
  breaking?: boolean;
  relatedIssues?: string[];
}

export function generateChangelogEntry(commits: string[]): ChangelogEntry[] {
  const entries: ChangelogEntry[] = [];

  for (const commit of commits) {
    // Parse conventional commit
    const match = commit.match(/(\w+)(?:\(([^)]+)\))?:\s*(.+)/);
    if (match) {
      const [, type, scope, description] = match;
      entries.push({
        type: type as ChangelogEntry['type'],
        description,
        scope: scope || undefined,
        breaking: description.includes('BREAKING'),
      });
    }
  }

  return entries;
}

/**
 * Learn from code review feedback
 */
export interface ReviewFeedback {
  prId: string;
  feedback: string;
  accepted: boolean;
  learnedPattern: string;
  appliedAt: string;
}

const REVIEW_FEEDBACK_FILE = path.join(process.cwd(), 'docs/autonomous-developer/review-feedback.json');

/**
 * Save review feedback
 */
export async function saveReviewFeedback(feedback: ReviewFeedback): Promise<void> {
  const allFeedback = await loadReviewFeedback();
  allFeedback.push(feedback);

  const dir = path.dirname(REVIEW_FEEDBACK_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(REVIEW_FEEDBACK_FILE, JSON.stringify(allFeedback, null, 2));
}

/**
 * Load review feedback
 */
export async function loadReviewFeedback(): Promise<ReviewFeedback[]> {
  try {
    const content = await fs.readFile(REVIEW_FEEDBACK_FILE, 'utf8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

/**
 * Learn from feedback patterns
 */
export async function learnFromFeedback(): Promise<string[]> {
  const feedback = await loadReviewFeedback();
  const acceptedPatterns = feedback.filter(f => f.accepted).map(f => f.learnedPattern);
  
  // Count pattern frequency
  const patternCounts = acceptedPatterns.reduce((acc, pattern) => {
    acc[pattern] = (acc[pattern] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Return patterns that were accepted 3+ times
  return Object.entries(patternCounts)
    .filter(([_, count]) => count >= 3)
    .map(([pattern]) => pattern);
}
