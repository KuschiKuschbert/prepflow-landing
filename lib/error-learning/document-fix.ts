/**
 * Fix Documentation API
 * Documents how errors were fixed for learning and knowledge base
 */

import { supabaseAdmin } from '../supabase';

export interface FixDocumentation {
  errorId: string;
  fixId: string;
  rootCause: string;
  solution: string;
  codeChanges?: string; // Git diff or description
  preventionStrategies: string[];
  relatedErrors?: string[]; // IDs of similar errors
  documentedAt: string;
  documentedBy: 'system' | 'user';
}

/**
 * Document a fix for an error
 */
export async function documentFix(
  errorId: string,
  fix: {
    rootCause: string;
    solution: string;
    codeChanges?: string;
    preventionStrategies: string[];
    relatedErrors?: string[];
    documentedBy?: 'system' | 'user';
  },
): Promise<string> {
  const fixId = `fix-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const documentation: FixDocumentation = {
    errorId,
    fixId,
    rootCause: fix.rootCause,
    solution: fix.solution,
    codeChanges: fix.codeChanges,
    preventionStrategies: fix.preventionStrategies,
    relatedErrors: fix.relatedErrors || [],
    documentedAt: new Date().toISOString(),
    documentedBy: fix.documentedBy || 'user',
  };

  // Store fix documentation in database
  try {
    // First, check if we need to create a fixes table or use JSON storage
    // For now, we'll store in a JSON file and later migrate to database
    const fs = await import('fs/promises');
    const path = await import('path');

    const knowledgeBaseDir = path.join(process.cwd(), 'docs/errors');
    const fixesFile = path.join(knowledgeBaseDir, 'fixes.json');

    // Ensure directory exists
    await fs.mkdir(knowledgeBaseDir, { recursive: true });

    // Load existing fixes
    let fixes: FixDocumentation[] = [];
    try {
      const content = await fs.readFile(fixesFile, 'utf8');
      fixes = JSON.parse(content);
    } catch {
      // File doesn't exist yet, start with empty array
    }

    // Add new fix
    fixes.push(documentation);

    // Save fixes
    await fs.writeFile(fixesFile, JSON.stringify(fixes, null, 2));

    // Update error status in admin_error_logs if errorId is from database
    try {
      if (supabaseAdmin) {
        const { error: updateError } = await supabaseAdmin
          .from('admin_error_logs')
          .update({
            status: 'documented',
          updated_at: new Date().toISOString(),
        })
        .eq('id', errorId);

      if (updateError) {
          // Error might not be in database (could be from build/pre-commit)
          // This is okay, just log it
          console.warn('[Fix Documentation] Error not found in database:', errorId);
        }
      }
    } catch (err) {
      // Error might not be in database, that's okay
      console.warn('[Fix Documentation] Could not update error status:', err);
    }

    return fixId;
  } catch (err) {
    console.error('[Fix Documentation] Failed to document fix:', err);
    throw err;
  }
}

/**
 * Get fix documentation for an error
 */
export async function getFixDocumentation(errorId: string): Promise<FixDocumentation | null> {
  try {
    const fs = require('fs/promises');
    const path = require('path');

    const fixesFile = path.join(process.cwd(), 'docs/errors/fixes.json');

    const content = await fs.readFile(fixesFile, 'utf8');
    const fixes: FixDocumentation[] = JSON.parse(content);

    return fixes.find(fix => fix.errorId === errorId) || null;
  } catch {
    return null;
  }
}

/**
 * Get all fixes for similar errors
 */
export async function getSimilarFixes(
  errorPattern: string,
  limit = 5,
): Promise<FixDocumentation[]> {
  try {
    const fs = require('fs/promises');
    const path = require('path');

    const fixesFile = path.join(process.cwd(), 'docs/errors/fixes.json');

    const content = await fs.readFile(fixesFile, 'utf8');
    const fixes: FixDocumentation[] = JSON.parse(content);

    // Simple pattern matching (can be enhanced with fuzzy matching)
    const patternLower = errorPattern.toLowerCase();

    return fixes
      .filter(fix => {
        return (
          fix.rootCause.toLowerCase().includes(patternLower) ||
          fix.solution.toLowerCase().includes(patternLower) ||
          fix.preventionStrategies.some(strategy => strategy.toLowerCase().includes(patternLower))
        );
      })
      .slice(0, limit);
  } catch {
    return [];
  }
}

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

${fix.codeChanges ? `## Code Changes

\`\`\`diff
${fix.codeChanges}
\`\`\`
` : ''}

## Prevention Strategies

${fix.preventionStrategies.map((strategy, index) => `${index + 1}. ${strategy}`).join('\n')}

${fix.relatedErrors && fix.relatedErrors.length > 0 ? `## Related Errors

${fix.relatedErrors.map(errId => `- ${errId}`).join('\n')}
` : ''}
`;
}

/**
 * Save fix markdown to file
 */
export async function saveFixMarkdown(fix: FixDocumentation): Promise<string> {
  const fs = require('fs/promises');
  const path = require('path');

  const fixesDir = path.join(process.cwd(), 'docs/errors/fixes');
  await fs.mkdir(fixesDir, { recursive: true });

  const fileName = `${fix.fixId}.md`;
  const filePath = path.join(fixesDir, fileName);

  const markdown = generateFixMarkdown(fix);
  await fs.writeFile(filePath, markdown, 'utf8');

  return filePath;
}
