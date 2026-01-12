/**
 * Documentation Generator
 * Auto-generates and maintains documentation
 */

import fs from 'fs/promises';
import path from 'path';

export interface DocumentationGap {
  file: string;
  type: 'missing-jsdoc' | 'outdated-doc' | 'missing-readme' | 'missing-examples';
  description: string;
  severity: 'high' | 'medium' | 'low';
  suggestedContent: string;
}

/**
 * Detect missing JSDoc
 */
export async function detectMissingJSDoc(filePath: string, content: string): Promise<DocumentationGap[]> {
  const gaps: DocumentationGap[] = [];
  const lines = content.split('\n');

  // Find exported functions without JSDoc
  const functionMatches = content.matchAll(/(?:export\s+)?(?:async\s+)?function\s+(\w+)/g);
  for (const match of functionMatches) {
    const funcName = match[1];
    const lineNum = content.substring(0, match.index || 0).split('\n').length;

    // Check if JSDoc exists before this function
    const beforeFunction = lines.slice(Math.max(0, lineNum - 5), lineNum).join('\n');
    if (!beforeFunction.includes('/**') && !beforeFunction.includes('* @')) {
      gaps.push({
        file: filePath,
        type: 'missing-jsdoc',
        description: `Function ${funcName} at line ${lineNum} is missing JSDoc`,
        severity: 'medium',
        suggestedContent: generateJSDoc(funcName, content, match.index || 0),
      });
    }
  }

  // Find exported classes without JSDoc
  const classMatches = content.matchAll(/(?:export\s+)?class\s+(\w+)/g);
  for (const match of classMatches) {
    const className = match[1];
    const lineNum = content.substring(0, match.index || 0).split('\n').length;

    const beforeClass = lines.slice(Math.max(0, lineNum - 5), lineNum).join('\n');
    if (!beforeClass.includes('/**') && !beforeClass.includes('* @')) {
      gaps.push({
        file: filePath,
        type: 'missing-jsdoc',
        description: `Class ${className} at line ${lineNum} is missing JSDoc`,
        severity: 'high',
        suggestedContent: generateClassJSDoc(className, content, match.index || 0),
      });
    }
  }

  return gaps;
}

/**
 * Generate JSDoc for function
 */
function generateJSDoc(funcName: string, content: string, funcIndex: number): string {
  const funcContent = extractFunctionSignature(content, funcIndex);
  const params = extractParameters(funcContent);

  let jsdoc = `/**\n * ${funcName}\n`;
  
  for (const param of params) {
    jsdoc += ` * @param {${param.type}} ${param.name} - ${param.description}\n`;
  }

  jsdoc += ` * @returns {ReturnType} Description of return value\n`;
  jsdoc += ` */`;

  return jsdoc;
}

/**
 * Generate JSDoc for class
 */
function generateClassJSDoc(className: string, content: string, classIndex: number): string {
  return `/**
 * ${className}
 * 
 * @class
 */`;
}

/**
 * Extract function signature
 */
function extractFunctionSignature(content: string, startIndex: number): string {
  let result = '';
  let parenCount = 0;
  let started = false;

  for (let i = startIndex; i < content.length; i++) {
    const char = content[i];
    if (char === '(') {
      started = true;
      parenCount++;
    }
    if (started) {
      result += char;
    }
    if (char === ')') {
      parenCount--;
      if (parenCount === 0) {
        break;
      }
    }
  }

  return result;
}

/**
 * Extract parameters from function signature
 */
function extractParameters(signature: string): Array<{ name: string; type: string; description: string }> {
  const paramMatch = signature.match(/\(([^)]+)\)/);
  if (!paramMatch) return [];

  const params = paramMatch[1].split(',').map(p => p.trim()).filter(Boolean);
  return params.map(param => {
    const typeMatch = param.match(/:?\s*(\w+)/);
    const nameMatch = param.match(/(\w+)/);
    
    return {
      name: nameMatch ? nameMatch[1] : 'param',
      type: typeMatch ? typeMatch[1] : 'unknown',
      description: 'Parameter description',
    };
  });
}

/**
 * Auto-generate JSDoc for file
 */
export async function autoGenerateJSDoc(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath, 'utf8');
  const gaps = await detectMissingJSDoc(filePath, content);
  let updatedContent = content;

  // Sort gaps by line number (reverse order to maintain line numbers)
  gaps.sort((a, b) => {
    const aLine = parseInt(a.description.match(/line (\d+)/)?.[1] || '0', 10);
    const bLine = parseInt(b.description.match(/line (\d+)/)?.[1] || '0', 10);
    return bLine - aLine;
  });

  const lines = updatedContent.split('\n');

  for (const gap of gaps) {
    if (gap.type === 'missing-jsdoc') {
      const lineMatch = gap.description.match(/line (\d+)/);
      if (lineMatch) {
        const lineNum = parseInt(lineMatch[1], 10) - 1;
        const jsdocLines = gap.suggestedContent.split('\n');
        lines.splice(lineNum, 0, ...jsdocLines);
      }
    }
  }

  return lines.join('\n');
}

/**
 * Detect outdated documentation
 */
export async function detectOutdatedDocs(
  filePath: string,
  content: string,
): Promise<DocumentationGap[]> {
  const gaps: DocumentationGap[] = [];

  // Check if JSDoc parameters match function parameters
  const functionMatches = content.matchAll(/\/\*\*[\s\S]*?\*\/\s*(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\(([^)]+)\)/g);
  for (const match of functionMatches) {
    const jsdoc = match[0].substring(0, match[0].indexOf('*/'));
    const funcParams = match[2].split(',').map(p => p.trim()).filter(Boolean);
    const jsdocParams = (jsdoc.match(/@param\s+\{[\w|]+\}\s+(\w+)/g) || []).map(p => {
      const nameMatch = p.match(/\w+/);
      return nameMatch ? nameMatch[0] : '';
    });

    // Check for mismatches
    const missingInDoc = funcParams.filter(p => {
      const paramName = p.split(':')[0].trim();
      return !jsdocParams.includes(paramName);
    });

    if (missingInDoc.length > 0) {
      gaps.push({
        file: filePath,
        type: 'outdated-doc',
        description: `JSDoc is missing parameters: ${missingInDoc.join(', ')}`,
        severity: 'medium',
        suggestedContent: `Add @param for: ${missingInDoc.join(', ')}`,
      });
    }
  }

  return gaps;
}

/**
 * Generate README for component/utility
 */
export function generateREADME(filePath: string, content: string): string {
  const fileName = path.basename(filePath, path.extname(filePath));
  const exports = extractExports(content);

  return `# ${fileName}

## Overview

${extractDescription(content)}

## Exports

${exports.map(exp => `- \`${exp.name}\` - ${exp.description}`).join('\n')}

## Usage

\`\`\`typescript
import { ${exports.map(e => e.name).join(', ')} } from './${fileName}';
\`\`\`

## Examples

${generateExamples(content, exports)}

## API Reference

${exports.map(exp => generateAPIReference(exp)).join('\n\n')}
`;
}

/**
 * Extract exports from file
 */
function extractExports(content: string): Array<{ name: string; type: 'function' | 'class' | 'type' | 'constant'; description: string }> {
  const exports: Array<{ name: string; type: 'function' | 'class' | 'type' | 'constant'; description: string }> = [];

  // Extract exported functions
  const functionExports = content.matchAll(/export\s+(?:async\s+)?function\s+(\w+)/g);
  for (const match of functionExports) {
    exports.push({
      name: match[1],
      type: 'function',
      description: 'Function description',
    });
  }

  // Extract exported classes
  const classExports = content.matchAll(/export\s+class\s+(\w+)/g);
  for (const match of classExports) {
    exports.push({
      name: match[1],
      type: 'class',
      description: 'Class description',
    });
  }

  // Extract exported types
  const typeExports = content.matchAll(/export\s+type\s+(\w+)/g);
  for (const match of typeExports) {
    exports.push({
      name: match[1],
      type: 'type',
      description: 'Type definition',
    });
  }

  return exports;
}

/**
 * Extract description from file
 */
function extractDescription(content: string): string {
  // Look for file-level comment
  const fileComment = content.match(/\/\*\*[\s\S]*?\*\//);
  if (fileComment) {
    return fileComment[0].replace(/\/\*\*|\*\//g, '').replace(/\*/g, '').trim();
  }

  return 'Component/utility description';
}

/**
 * Generate examples
 */
function generateExamples(content: string, exports: Array<{ name: string; type: string }>): string {
  return exports
    .filter(e => e.type === 'function')
    .map(exp => `### ${exp.name}

\`\`\`typescript
// Example usage
const result = ${exp.name}(/* parameters */);
\`\`\`
`)
    .join('\n');
}

/**
 * Generate API reference
 */
function generateAPIReference(exp: { name: string; type: string; description: string }): string {
  return `### ${exp.name}

**Type:** ${exp.type}
**Description:** ${exp.description}

\`\`\`typescript
// Signature
${exp.name}(/* parameters */)
\`\`\``;
}
