/**
 * Architecture Decision Records (ADR) Generator
 * Tracks and generates architectural decisions
 */

import fs from 'fs/promises';
import path from 'path';

export interface ArchitectureDecision {
  id: string;
  title: string;
  status: 'proposed' | 'accepted' | 'deprecated' | 'superseded';
  context: string;
  decision: string;
  consequences: string[];
  alternatives: string[];
  relatedDecisions?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DesignPattern {
  name: string;
  type: 'creational' | 'structural' | 'behavioral';
  description: string;
  usage: string[];
  benefits: string[];
  drawbacks: string[];
}

const ADR_DIR = path.join(process.cwd(), 'docs/autonomous-developer/adr');
const PATTERNS_FILE = path.join(process.cwd(), 'docs/autonomous-developer/design-patterns.json');

/**
 * Generate ADR from code pattern
 */
export async function generateADRFromPattern(
  pattern: DesignPattern,
  context: string,
): Promise<string> {
  const adrId = `adr-${Date.now()}`;
  const adr: ArchitectureDecision = {
    id: adrId,
    title: `Use ${pattern.name} Pattern`,
    status: 'proposed',
    context,
    decision: `We will use the ${pattern.name} pattern for ${context}`,
    consequences: pattern.benefits,
    alternatives: [`Alternative: ${pattern.name}`, 'Alternative: Different pattern'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await saveADR(adr);
  return adrId;
}

/**
 * Save ADR
 */
export async function saveADR(adr: ArchitectureDecision): Promise<void> {
  await fs.mkdir(ADR_DIR, { recursive: true });
  const filePath = path.join(ADR_DIR, `${adr.id}.md`);

  const markdown = generateADRMarkdown(adr);
  await fs.writeFile(filePath, markdown, 'utf8');
}

/**
 * Generate ADR markdown
 */
function generateADRMarkdown(adr: ArchitectureDecision): string {
  return `# ${adr.id}: ${adr.title}

**Status:** ${adr.status}
**Date:** ${new Date(adr.createdAt).toLocaleDateString()}

## Context

${adr.context}

## Decision

${adr.decision}

## Consequences

${adr.consequences.map(c => `- ${c}`).join('\n')}

## Alternatives Considered

${adr.alternatives.map(a => `- ${a}`).join('\n')}

${adr.relatedDecisions && adr.relatedDecisions.length > 0 ? `## Related Decisions

${adr.relatedDecisions.map(id => `- ${id}`).join('\n')}
` : ''}
`;
}

/**
 * Detect design patterns in code
 */
export function detectDesignPatterns(content: string, filePath: string): DesignPattern[] {
  const patterns: DesignPattern[] = [];

  // Singleton pattern
  if (/class\s+\w+\s*\{[^}]*private\s+static\s+instance[^}]*getInstance\(\)/.test(content)) {
    patterns.push({
      name: 'Singleton',
      type: 'creational',
      description: 'Ensures a class has only one instance',
      usage: [filePath],
      benefits: ['Single instance', 'Global access'],
      drawbacks: ['Hard to test', 'Tight coupling'],
    });
  }

  // Factory pattern
  if (/class\s+\w+Factory\s*\{/.test(content)) {
    patterns.push({
      name: 'Factory',
      type: 'creational',
      description: 'Creates objects without specifying exact classes',
      usage: [filePath],
      benefits: ['Flexible object creation', 'Decouples creation from usage'],
      drawbacks: ['Can become complex'],
    });
  }

  // Repository pattern
  if (/class\s+\w+Repository\s*\{/.test(content)) {
    patterns.push({
      name: 'Repository',
      type: 'structural',
      description: 'Abstraction layer for data access',
      usage: [filePath],
      benefits: ['Decouples data access', 'Easier testing'],
      drawbacks: ['Additional abstraction layer'],
    });
  }

  // Strategy pattern
  if (/interface\s+\w+Strategy|class\s+\w+Strategy/.test(content)) {
    patterns.push({
      name: 'Strategy',
      type: 'behavioral',
      description: 'Defines family of algorithms, makes them interchangeable',
      usage: [filePath],
      benefits: ['Flexible algorithms', 'Easy to extend'],
      drawbacks: ['More classes'],
    });
  }

  // Observer pattern
  if (/\.subscribe\(|\.on\(|addEventListener\(/.test(content) && /\.notify\(|\.emit\(|dispatchEvent\(/.test(content)) {
    patterns.push({
      name: 'Observer',
      type: 'behavioral',
      description: 'One-to-many dependency between objects',
      usage: [filePath],
      benefits: ['Loose coupling', 'Dynamic relationships'],
      drawbacks: ['Memory leaks if not cleaned up'],
    });
  }

  return patterns;
}

/**
 * Detect anti-patterns
 */
export interface AntiPattern {
  name: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  suggestion: string;
  file: string;
  line?: number;
}

export function detectAntiPatterns(content: string, filePath: string): AntiPattern[] {
  const antiPatterns: AntiPattern[] = [];

  // God Object
  const classMatches = content.matchAll(/class\s+\w+[^{]*\{/g);
  for (const match of classMatches) {
    const classContent = extractClassContent(content, match.index || 0);
    const methodCount = (classContent.match(/\w+\s*\([^)]*\)\s*\{/g) || []).length;
    const propertyCount = (classContent.match(/(public|private|protected)\s+\w+:/g) || []).length;

    if (methodCount > 20 || propertyCount > 15) {
      antiPatterns.push({
        name: 'God Object',
        description: `Class with ${methodCount} methods and ${propertyCount} properties`,
        severity: 'high',
        suggestion: 'Split into smaller, focused classes (Single Responsibility Principle)',
        file: filePath,
      });
    }
  }

  // Spaghetti Code (deep nesting)
  const maxNesting = calculateMaxNesting(content);
  if (maxNesting > 5) {
    antiPatterns.push({
      name: 'Spaghetti Code',
      description: `Code has ${maxNesting} levels of nesting`,
      severity: 'high',
      suggestion: 'Extract nested logic into separate functions',
      file: filePath,
    });
  }

  // Magic Numbers
  const magicNumbers = (content.match(/\b\d{3,}\b/g) || []).length;
  if (magicNumbers > 10) {
    antiPatterns.push({
      name: 'Magic Numbers',
      description: `Found ${magicNumbers} magic numbers`,
      severity: 'medium',
      suggestion: 'Extract magic numbers to named constants',
      file: filePath,
    });
  }

  // Copy-Paste Programming
  const duplicates = detectDuplicateBlocks(content);
  if (duplicates.length > 3) {
    antiPatterns.push({
      name: 'Copy-Paste Programming',
      description: `Found ${duplicates.length} duplicate code blocks`,
      severity: 'medium',
      suggestion: 'Extract duplicate code into reusable functions',
      file: filePath,
    });
  }

  return antiPatterns;
}

/**
 * Extract class content
 */
function extractClassContent(content: string, startIndex: number): string {
  let braceCount = 0;
  let inClass = false;
  let result = '';

  for (let i = startIndex; i < content.length; i++) {
    const char = content[i];
    if (char === '{') {
      braceCount++;
      inClass = true;
    }
    if (inClass) {
      result += char;
    }
    if (char === '}') {
      braceCount--;
      if (braceCount === 0 && inClass) {
        break;
      }
    }
  }

  return result;
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

/**
 * Detect duplicate blocks
 */
function detectDuplicateBlocks(content: string): Array<{ start: number; end: number }> {
  const lines = content.split('\n');
  const duplicates: Array<{ start: number; end: number }> = [];

  for (let i = 0; i < lines.length - 5; i++) {
    const sequence = lines.slice(i, i + 5).join('\n');
    const normalized = sequence.trim().replace(/\s+/g, ' ');

    for (let j = i + 5; j < lines.length - 5; j++) {
      const otherSequence = lines.slice(j, j + 5).join('\n');
      const otherNormalized = otherSequence.trim().replace(/\s+/g, ' ');

      if (normalized === otherNormalized && normalized.length > 50) {
        duplicates.push({ start: i + 1, end: i + 5 });
        break;
      }
    }
  }

  return duplicates;
}

/**
 * Load design patterns
 */
export async function loadDesignPatterns(): Promise<DesignPattern[]> {
  try {
    const content = await fs.readFile(PATTERNS_FILE, 'utf8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

/**
 * Save design pattern
 */
export async function saveDesignPattern(pattern: DesignPattern): Promise<void> {
  const patterns = await loadDesignPatterns();
  patterns.push(pattern);

  const dir = path.dirname(PATTERNS_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(PATTERNS_FILE, JSON.stringify(patterns, null, 2));
}
