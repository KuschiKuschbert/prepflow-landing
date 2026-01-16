/**
 * RSI Architecture Analysis Module
 * Merged from autonomous-developer/architecture/adr-generator.ts
 *
 * Detects design patterns and anti-patterns, generates ADRs.
 */

import fs from 'fs/promises';
import path from 'path';

export interface DesignPattern {
  name: string;
  type: 'creational' | 'structural' | 'behavioral';
  description: string;
  usage: string[];
  benefits: string[];
  drawbacks: string[];
}

export interface AntiPattern {
  name: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  suggestion: string;
  file: string;
  line?: number;
}

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

const ADR_DIR = path.join(process.cwd(), 'docs/architecture/adr');
const PATTERNS_FILE = path.join(process.cwd(), 'docs/architecture/design-patterns.json');

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
  if (
    /\.subscribe\(|\.on\(|addEventListener\(/.test(content) &&
    /\.notify\(|\.emit\(|dispatchEvent\(/.test(content)
  ) {
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
 * Detect anti-patterns in code
 */
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

  return antiPatterns;
}

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
 * Generate ADR from detected pattern
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

async function saveADR(adr: ArchitectureDecision): Promise<void> {
  await fs.mkdir(ADR_DIR, { recursive: true });
  const filePath = path.join(ADR_DIR, `${adr.id}.md`);
  const markdown = generateADRMarkdown(adr);
  await fs.writeFile(filePath, markdown, 'utf8');
}

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
`;
}

/**
 * Load saved design patterns
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
 * Main entry point for RSI orchestrator
 */
export async function runArchitectureAnalysis(dryRun = false): Promise<void> {
  console.log('🏗️ Running Architecture Analysis...');

  const rootDir = process.cwd();
  const reportsDir = path.join(rootDir, 'reports');
  await fs.mkdir(reportsDir, { recursive: true });

  const dirsToScan = ['app', 'lib', 'components'];
  const allPatterns: Record<string, DesignPattern[]> = {};
  const allAntiPatterns: AntiPattern[] = [];

  // Helper to recursively scan directories
  async function scanDir(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== '.next' && entry.name !== '.git') {
          await scanDir(fullPath);
        }
      } else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry.name)) {
        const content = await fs.readFile(fullPath, 'utf8');
        const relativePath = path.relative(rootDir, fullPath);

        const patterns = detectDesignPatterns(content, relativePath);
        if (patterns.length > 0) {
            allPatterns[relativePath] = patterns;
        }

        const antiPatterns = detectAntiPatterns(content, relativePath);
        if (antiPatterns.length > 0) {
            allAntiPatterns.push(...antiPatterns);
        }
      }
    }
  }

  if (dryRun) {
    console.log('  [DRY RUN] Would analyze architecture of: ' + dirsToScan.join(', '));
    return;
  }

  console.log('  Scanning architecture...');
  for (const dir of dirsToScan) {
    const fullDir = path.join(rootDir, dir);
    try {
        await scanDir(fullDir);
    } catch (e) {
         console.warn(`  Could not scan ${dir}, skipping...`);
    }
  }

  // Generate Report
  const reportPath = path.join(reportsDir, 'rsi-architecture-analysis.md');
  let markdown = '# 🏗️ RSI Architecture Analysis Report\n\n';
  markdown += `**Date:** ${new Date().toLocaleString()}\n\n`;
  markdown += `**Detected Design Patterns:** ${Object.values(allPatterns).reduce((acc, p) => acc + p.length, 0)}\n`;
  markdown += `**Detected Anti-Patterns:** ${allAntiPatterns.length}\n\n`;

  markdown += '## ⚠️ Anti-Patterns Detected\n\n';
  if (allAntiPatterns.length === 0) {
      markdown += "✅ No anti-patterns detected.\n\n";
  } else {
      for (const ap of allAntiPatterns) {
          markdown += `### ${ap.name} (${ap.severity.toUpperCase()})\n`;
          markdown += `**File:** \`${ap.file}\`\n`;
          markdown += `**Description:** ${ap.description}\n`;
          markdown += `**Suggestion:** ${ap.suggestion}\n\n`;
      }
  }

  markdown += '## 🧩 Design Patterns Usage\n\n';
  if (Object.keys(allPatterns).length === 0) {
      markdown += "No specific design patterns detected.\n";
  } else {
      for (const [file, patterns] of Object.entries(allPatterns)) {
          markdown += `**${file}**\n`;
          for (const p of patterns) {
              markdown += `- **${p.name}** (${p.type}): ${p.description}\n`;
          }
          markdown += '\n';
      }
  }

  await fs.writeFile(reportPath, markdown, 'utf8');
  console.log(`  ✅ Architecture analysis complete. Report saved to ${path.relative(rootDir, reportPath)}`);
}
