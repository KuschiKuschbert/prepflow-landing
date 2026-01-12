/**
 * Code Pattern Detector
 * Detects architectural patterns, code smells, and best practices
 */

import { loadKnowledgeBase } from '../../error-learning/knowledge-base';

export interface CodePattern {
  type: 'architectural' | 'code-smell' | 'best-practice' | 'anti-pattern';
  name: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  suggestion: string;
  reference?: string;
}

export interface CodeReviewIssue {
  file: string;
  line: number;
  column?: number;
  pattern: CodePattern;
  codeSnippet: string;
  fixSuggestion: string;
}

/**
 * Detect architectural patterns
 */
function detectArchitecturalPatterns(content: string, filePath: string): CodePattern[] {
  const patterns: CodePattern[] = [];

  // Singleton pattern detection
  if (/class\s+\w+\s*\{[^}]*private\s+static\s+instance[^}]*getInstance\(\)/.test(content)) {
    patterns.push({
      type: 'architectural',
      name: 'Singleton Pattern',
      description: 'Singleton pattern detected - consider dependency injection for testability',
      severity: 'medium',
      suggestion: 'Consider using dependency injection instead of singleton for better testability',
      reference: 'See dependency injection patterns in docs/autonomous-developer/architecture-patterns.md',
    });
  }

  // Factory pattern detection
  if (/class\s+\w+Factory\s*\{/.test(content)) {
    patterns.push({
      type: 'architectural',
      name: 'Factory Pattern',
      description: 'Factory pattern detected - good architectural choice',
      severity: 'low',
      suggestion: 'Factory pattern is appropriate for object creation',
    });
  }

  // Repository pattern detection
  if (/class\s+\w+Repository\s*\{/.test(content)) {
    patterns.push({
      type: 'architectural',
      name: 'Repository Pattern',
      description: 'Repository pattern detected - good data access abstraction',
      severity: 'low',
      suggestion: 'Repository pattern provides good data access abstraction',
    });
  }

  return patterns;
}

/**
 * Detect code smells
 */
function detectCodeSmells(content: string, filePath: string): CodePattern[] {
  const patterns: CodePattern[] = [];

  // Long method detection (> 50 lines)
  const lines = content.split('\n');
  const functionMatches = content.matchAll(/function\s+\w+[^{]*\{/g);
  for (const match of functionMatches) {
    const startLine = content.substring(0, match.index).split('\n').length;
    const functionContent = extractFunctionContent(content, match.index || 0);
    const functionLines = functionContent.split('\n').length;

    if (functionLines > 50) {
      patterns.push({
        type: 'code-smell',
        name: 'Long Method',
        description: `Function at line ${startLine} is ${functionLines} lines long`,
        severity: 'high',
        suggestion: 'Extract smaller functions - methods should be < 30 lines',
        reference: 'See docs/FILE_SIZE_REFACTORING_GUIDE.md',
      });
    }
  }

  // Deep nesting detection (> 4 levels)
  const maxNesting = calculateMaxNesting(content);
  if (maxNesting > 4) {
    patterns.push({
      type: 'code-smell',
      name: 'Deep Nesting',
      description: `Code has ${maxNesting} levels of nesting`,
      severity: 'high',
      suggestion: 'Extract nested logic into separate functions - max 3-4 levels',
    });
  }

  // Duplicate code detection (simple heuristic)
  const duplicateBlocks = detectDuplicateBlocks(content);
  if (duplicateBlocks.length > 0) {
    patterns.push({
      type: 'code-smell',
      name: 'Duplicate Code',
      description: `Found ${duplicateBlocks.length} potential duplicate code blocks`,
      severity: 'medium',
      suggestion: 'Extract duplicate code into reusable functions',
    });
  }

  // Magic numbers detection
  const magicNumbers = content.match(/\b\d{3,}\b/g);
  if (magicNumbers && magicNumbers.length > 5) {
    patterns.push({
      type: 'code-smell',
      name: 'Magic Numbers',
      description: 'Multiple magic numbers detected',
      severity: 'medium',
      suggestion: 'Extract magic numbers to named constants',
    });
  }

  // God object detection (too many methods/properties)
  const classMatches = content.matchAll(/class\s+\w+[^{]*\{/g);
  for (const match of classMatches) {
    const classContent = extractClassContent(content, match.index || 0);
    const methodCount = (classContent.match(/\w+\s*\([^)]*\)\s*\{/g) || []).length;
    const propertyCount = (classContent.match(/(public|private|protected)\s+\w+:/g) || []).length;

    if (methodCount > 20 || propertyCount > 15) {
      patterns.push({
        type: 'code-smell',
        name: 'God Object',
        description: `Class has ${methodCount} methods and ${propertyCount} properties`,
        severity: 'high',
        suggestion: 'Split class into smaller, focused classes (Single Responsibility Principle)',
      });
    }
  }

  return patterns;
}

/**
 * Detect best practices
 */
async function detectBestPractices(
  content: string,
  filePath: string,
): Promise<CodePattern[]> {
  const patterns: CodePattern[] = [];

  // Check against learned patterns from knowledge base
  const kb = await loadKnowledgeBase();

  // Check for missing error handling (learned from error patterns)
  if (/async\s+function/.test(content) && !/try\s*\{/.test(content)) {
    const errorPattern = kb.patterns.find(p => p.name.includes('try-catch'));
    if (errorPattern) {
      patterns.push({
        type: 'best-practice',
        name: 'Missing Error Handling',
        description: 'Async function without try-catch block',
        severity: 'high',
        suggestion: errorPattern.fix,
        reference: `See error-patterns.mdc: ${errorPattern.name}`,
      });
    }
  }

  // Check for missing ApiErrorHandler in API routes
  if (filePath.includes('/api/') && filePath.includes('route.')) {
    if (/NextResponse\.json\([^)]*error/.test(content) && !/ApiErrorHandler/.test(content)) {
      patterns.push({
        type: 'best-practice',
        name: 'Missing ApiErrorHandler',
        description: 'API route should use ApiErrorHandler for error responses',
        severity: 'high',
        suggestion: 'Use ApiErrorHandler.createError() for consistent error responses',
        reference: 'See ERROR_HANDLING_STANDARDS.md',
      });
    }
  }

  // Check for missing logger in catch blocks
  if (/catch\s*\(/.test(content) && !/logger\.(error|warn)/.test(content)) {
    patterns.push({
      type: 'best-practice',
      name: 'Missing Error Logging',
      description: 'Catch block without error logging',
      severity: 'medium',
      suggestion: 'Add logger.error() in catch blocks for debugging',
      reference: 'See ERROR_HANDLING_STANDARDS.md',
    });
  }

  return patterns;
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
 * Calculate maximum nesting level
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
 * Detect duplicate code blocks (simple heuristic)
 */
function detectDuplicateBlocks(content: string): Array<{ start: number; end: number }> {
  const lines = content.split('\n');
  const duplicates: Array<{ start: number; end: number }> = [];

  // Look for repeated sequences of 5+ lines
  for (let i = 0; i < lines.length - 5; i++) {
    const sequence = lines.slice(i, i + 5).join('\n');
    const normalized = sequence.trim().replace(/\s+/g, ' ');

    // Check if this sequence appears again
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
 * Review code file
 */
export async function reviewCodeFile(
  filePath: string,
  content: string,
): Promise<CodeReviewIssue[]> {
  const issues: CodeReviewIssue[] = [];

  // Detect architectural patterns
  const archPatterns = detectArchitecturalPatterns(content, filePath);
  for (const pattern of archPatterns) {
    issues.push({
      file: filePath,
      line: 1, // Pattern applies to whole file
      pattern,
      codeSnippet: content.substring(0, 200),
      fixSuggestion: pattern.suggestion,
    });
  }

  // Detect code smells
  const smells = detectCodeSmells(content, filePath);
  for (const smell of smells) {
    const lineMatch = content.match(new RegExp(smell.name, 'i'));
    const line = lineMatch ? content.substring(0, lineMatch.index).split('\n').length : 1;

    issues.push({
      file: filePath,
      line,
      pattern: smell,
      codeSnippet: content.split('\n').slice(Math.max(0, line - 3), line + 3).join('\n'),
      fixSuggestion: smell.suggestion,
    });
  }

  // Detect best practices
  const bestPractices = await detectBestPractices(content, filePath);
  for (const practice of bestPractices) {
    const lineMatch = content.match(/async\s+function|catch\s*\(|NextResponse\.json/);
    const line = lineMatch ? content.substring(0, lineMatch.index || 0).split('\n').length : 1;

    issues.push({
      file: filePath,
      line,
      pattern: practice,
      codeSnippet: content.split('\n').slice(Math.max(0, line - 3), line + 3).join('\n'),
      fixSuggestion: practice.suggestion,
    });
  }

  return issues;
}

/**
 * Generate code review report
 */
export function generateCodeReviewReport(issues: CodeReviewIssue[]): string {
  const bySeverity = {
    critical: issues.filter(i => i.pattern.severity === 'critical'),
    high: issues.filter(i => i.pattern.severity === 'high'),
    medium: issues.filter(i => i.pattern.severity === 'medium'),
    low: issues.filter(i => i.pattern.severity === 'low'),
  };

  return `
# Code Review Report

## Summary

- **Total Issues:** ${issues.length}
- **Critical:** ${bySeverity.critical.length}
- **High:** ${bySeverity.high.length}
- **Medium:** ${bySeverity.medium.length}
- **Low:** ${bySeverity.low.length}

## Issues by Type

### Architectural Patterns
${issues.filter(i => i.pattern.type === 'architectural').map(i => `- **${i.pattern.name}** (${i.pattern.severity}): ${i.pattern.description}`).join('\n')}

### Code Smells
${issues.filter(i => i.pattern.type === 'code-smell').map(i => `- **${i.file}:${i.line}** - ${i.pattern.name} (${i.pattern.severity}): ${i.pattern.description}`).join('\n')}

### Best Practices
${issues.filter(i => i.pattern.type === 'best-practice').map(i => `- **${i.file}:${i.line}** - ${i.pattern.name} (${i.pattern.severity}): ${i.pattern.description}`).join('\n')}

## Detailed Issues

${issues.map(issue => `
### ${issue.pattern.name} - ${issue.file}:${issue.line}

**Severity:** ${issue.pattern.severity}
**Type:** ${issue.pattern.type}
**Description:** ${issue.pattern.description}

**Suggestion:**
${issue.fixSuggestion}

${issue.pattern.reference ? `**Reference:** ${issue.pattern.reference}` : ''}

**Code:**
\`\`\`
${issue.codeSnippet}
\`\`\`
`).join('\n')}
`;
}
