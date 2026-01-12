/**
 * Technical Debt Tracker
 * Tracks and prioritizes technical debt
 */

import fs from 'fs/promises';
import path from 'path';

export interface TechnicalDebt {
  id: string;
  file: string;
  line: number;
  type: 'code-smell' | 'complexity' | 'duplication' | 'missing-tests' | 'outdated-pattern';
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  priority: number; // Calculated from severity + impact
  estimatedEffort: 'low' | 'medium' | 'high';
  suggestedRefactoring: string;
  detectedAt: string;
  resolvedAt?: string;
  relatedIssues?: string[];
}

const TECHNICAL_DEBT_FILE = path.join(process.cwd(), 'docs/autonomous-developer/technical-debt.json');

/**
 * Load technical debt
 */
export async function loadTechnicalDebt(): Promise<TechnicalDebt[]> {
  try {
    const content = await fs.readFile(TECHNICAL_DEBT_FILE, 'utf8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

/**
 * Save technical debt
 */
export async function saveTechnicalDebt(debt: TechnicalDebt[]): Promise<void> {
  const dir = path.dirname(TECHNICAL_DEBT_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(TECHNICAL_DEBT_FILE, JSON.stringify(debt, null, 2));
}

/**
 * Add technical debt
 */
export async function addTechnicalDebt(debt: Omit<TechnicalDebt, 'id' | 'detectedAt' | 'priority'>): Promise<string> {
  const allDebt = await loadTechnicalDebt();

  const priority = calculatePriority(debt.severity, debt.estimatedEffort);

  const newDebt: TechnicalDebt = {
    id: `debt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...debt,
    priority,
    detectedAt: new Date().toISOString(),
  };

  allDebt.push(newDebt);
  await saveTechnicalDebt(allDebt);

  return newDebt.id;
}

/**
 * Calculate priority score
 */
function calculatePriority(severity: TechnicalDebt['severity'], effort: TechnicalDebt['estimatedEffort']): number {
  const severityScores = { critical: 4, high: 3, medium: 2, low: 1 };
  const effortScores = { low: 3, medium: 2, high: 1 }; // Lower effort = higher priority

  return severityScores[severity] * effortScores[effort];
}

/**
 * Get prioritized technical debt
 */
export async function getPrioritizedDebt(limit = 10): Promise<TechnicalDebt[]> {
  const debt = await loadTechnicalDebt();
  const unresolved = debt.filter(d => !d.resolvedAt);

  return unresolved.sort((a, b) => b.priority - a.priority).slice(0, limit);
}

/**
 * Mark debt as resolved
 */
export async function resolveTechnicalDebt(debtId: string): Promise<void> {
  const debt = await loadTechnicalDebt();
  const item = debt.find(d => d.id === debtId);

  if (item) {
    item.resolvedAt = new Date().toISOString();
    await saveTechnicalDebt(debt);
  }
}

/**
 * Detect refactoring opportunities
 */
export interface RefactoringOpportunity {
  file: string;
  type: 'extract-function' | 'extract-class' | 'simplify-conditional' | 'remove-duplication' | 'reduce-complexity';
  description: string;
  lines: { start: number; end: number };
  suggestion: string;
  estimatedImpact: 'low' | 'medium' | 'high';
}

/**
 * Detect refactoring opportunities in code
 */
export function detectRefactoringOpportunities(
  filePath: string,
  content: string,
): RefactoringOpportunity[] {
  const opportunities: RefactoringOpportunity[] = [];
  const lines = content.split('\n');

  // Detect long functions that could be extracted
  const functionMatches = content.matchAll(/function\s+\w+[^{]*\{/g);
  for (const match of functionMatches) {
    const startLine = content.substring(0, match.index || 0).split('\n').length;
    const functionContent = extractFunctionContent(content, match.index || 0);
    const functionLines = functionContent.split('\n').length;

    if (functionLines > 30) {
      opportunities.push({
        file: filePath,
        type: 'extract-function',
        description: `Function at line ${startLine} is ${functionLines} lines - consider extracting smaller functions`,
        lines: { start: startLine, end: startLine + functionLines },
        suggestion: 'Extract logical blocks into separate functions (see FILE_SIZE_REFACTORING_GUIDE.md)',
        estimatedImpact: 'high',
      });
    }
  }

  // Detect complex conditionals
  const complexConditionals = detectComplexConditionals(content);
  for (const conditional of complexConditionals) {
    opportunities.push({
      file: filePath,
      type: 'simplify-conditional',
      description: `Complex conditional at line ${conditional.line} with ${conditional.complexity} conditions`,
      lines: { start: conditional.line, end: conditional.line + 5 },
      suggestion: 'Extract conditional logic into named functions or use early returns',
      estimatedImpact: 'medium',
    });
  }

  // Detect duplication
  const duplicates = detectCodeDuplication(content);
  for (const duplicate of duplicates) {
    opportunities.push({
      file: filePath,
      type: 'remove-duplication',
      description: `Duplicate code block at lines ${duplicate.start}-${duplicate.end}`,
      lines: { start: duplicate.start, end: duplicate.end },
      suggestion: 'Extract duplicate code into reusable function',
      estimatedImpact: 'high',
    });
  }

  return opportunities;
}

/**
 * Extract function content
 */
function extractFunctionContent(content: string, startIndex: number): string {
  let braceCount = 0;
  let inFunction = false;
  let result = '';

  for (let i = startIndex; i < content.length; i++) {
    const char = content[i];
    if (char === '{') {
      braceCount++;
      inFunction = true;
    }
    if (inFunction) {
      result += char;
    }
    if (char === '}') {
      braceCount--;
      if (braceCount === 0 && inFunction) {
        break;
      }
    }
  }

  return result;
}

/**
 * Detect complex conditionals
 */
function detectComplexConditionals(content: string): Array<{ line: number; complexity: number }> {
  const lines = content.split('\n');
  const complex: Array<{ line: number; complexity: number }> = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Count && and || operators
    const andCount = (line.match(/&&/g) || []).length;
    const orCount = (line.match(/\|\|/g) || []).length;
    const totalComplexity = andCount + orCount;

    if (totalComplexity > 3) {
      complex.push({ line: i + 1, complexity: totalComplexity });
    }
  }

  return complex;
}

/**
 * Detect code duplication
 */
function detectCodeDuplication(content: string): Array<{ start: number; end: number }> {
  const lines = content.split('\n');
  const duplicates: Array<{ start: number; end: number }> = [];

  // Look for repeated sequences of 5+ lines
  for (let i = 0; i < lines.length - 5; i++) {
    const sequence = lines.slice(i, i + 5).join('\n');
    const normalized = sequence.trim().replace(/\s+/g, ' ').replace(/[a-zA-Z_][a-zA-Z0-9_]*/g, 'VAR');

    // Check if this sequence appears again
    for (let j = i + 5; j < lines.length - 5; j++) {
      const otherSequence = lines.slice(j, j + 5).join('\n');
      const otherNormalized = otherSequence.trim().replace(/\s+/g, ' ').replace(/[a-zA-Z_][a-zA-Z0-9_]*/g, 'VAR');

      if (normalized === otherNormalized && normalized.length > 50) {
        duplicates.push({ start: i + 1, end: i + 5 });
        break;
      }
    }
  }

  return duplicates;
}

/**
 * Analyze code complexity
 */
export interface ComplexityMetrics {
  cyclomaticComplexity: number;
  maxNesting: number;
  functionCount: number;
  averageFunctionLength: number;
  duplicateBlocks: number;
}

export function analyzeComplexity(content: string): ComplexityMetrics {
  const lines = content.split('\n');
  const functions = content.match(/function\s+\w+|const\s+\w+\s*=\s*(async\s+)?\(/g) || [];
  const functionLengths: number[] = [];

  // Calculate function lengths
  const functionMatches = content.matchAll(/(?:function\s+\w+|const\s+\w+\s*=\s*(?:async\s+)?\([^)]*\)\s*=>)/g);
  for (const match of functionMatches) {
    const funcContent = extractFunctionContent(content, match.index || 0);
    functionLengths.push(funcContent.split('\n').length);
  }

  // Calculate cyclomatic complexity (simplified)
  const decisionPoints = (content.match(/\b(if|else|for|while|switch|case|catch|&&|\|\|)\b/g) || []).length;
  const cyclomaticComplexity = decisionPoints + 1;

  // Calculate max nesting
  const maxNesting = calculateMaxNesting(content);

  // Detect duplicates
  const duplicates = detectCodeDuplication(content);

  return {
    cyclomaticComplexity,
    maxNesting,
    functionCount: functions.length,
    averageFunctionLength: functionLengths.length > 0 ? functionLengths.reduce((a, b) => a + b, 0) / functionLengths.length : 0,
    duplicateBlocks: duplicates.length,
  };
}

/**
 * Calculate max nesting
 */
function calculateMaxNesting(content: string): number {
  let maxNesting = 0;
  let currentNesting = 0;

  for (const char of content) {
    if (char === '{') {
      currentNesting++;
      maxNesting = Math.max(maxNesting, currentNesting);
    } else if (char === '}') {
      currentNesting--;
    }
  }

  return maxNesting;
}
