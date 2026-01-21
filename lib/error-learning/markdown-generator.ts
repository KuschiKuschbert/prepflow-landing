import * as fs from 'fs/promises';
import * as path from 'path';
import type { FixDocumentation } from './types';

/**
 * Generate markdown documentation for a fix
 */
export function generateFixMarkdown(fix: FixDocumentation): string {
  return `# Fix Documentation

**Error ID:** ${fix.errorId}
**Fix ID:** ${fix.fixId}
**Documented At:** ${new Date(fix.documentedAt).toLocaleString()}
**Documented By:** ${fix.documentedBy}

## Root Cause

${fix.rootCause}

## Solution

${fix.solution}

${
  fix.codeChanges
    ? `## Code Changes

\`\`\`diff
${fix.codeChanges}
\`\`\`
`
    : ''
}

## Prevention Strategies

${fix.preventionStrategies.map((strategy, index) => `${index + 1}. ${strategy}`).join('\n')}

${
  fix.relatedErrors && fix.relatedErrors.length > 0
    ? `## Related Errors

${fix.relatedErrors.map(errId => `- ${errId}`).join('\n')}
`
    : ''
}
`;
}

/**
 * Save fix markdown to file
 */
export async function saveFixMarkdown(fix: FixDocumentation): Promise<string> {
  const fixesDir = path.join(process.cwd(), 'docs/errors/fixes');
  await fs.mkdir(fixesDir, { recursive: true });

  const fileName = `${fix.fixId}.md`;
  const filePath = path.join(fixesDir, fileName);

  const markdown = generateFixMarkdown(fix);
  await fs.writeFile(filePath, markdown, 'utf8');

  return filePath;
}
