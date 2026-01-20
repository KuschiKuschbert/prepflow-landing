import type { AntiPattern } from './types';

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
 * Detect anti-patterns in code
 */
export function detectAntiPatterns(content: string, filePath: string): AntiPattern[] {
  const antiPatterns: AntiPattern[] = [];

  // God Object
  const classMatches = content.matchAll(/class\s+\w+[^{]*\{/g);
  for (const match of Array.from(classMatches)) {
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
