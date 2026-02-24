import * as fs from 'fs/promises';
import * as path from 'path';
import { logger } from '../logger';
import { supabaseAdmin } from '../supabase';
import type { FixDocumentation } from './types';

const KNOWLEDGE_BASE_DIR = path.join(process.cwd(), 'docs/errors');
const FIXES_FILE = path.join(KNOWLEDGE_BASE_DIR, 'fixes.json');

/**
 * Load existing fixes
 */
export async function loadFixes(): Promise<FixDocumentation[]> {
  try {
    const content = await fs.readFile(FIXES_FILE, 'utf8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

/**
 * Save fixes to JSON storage
 */
async function saveFixes(fixes: FixDocumentation[]): Promise<void> {
  await fs.mkdir(KNOWLEDGE_BASE_DIR, { recursive: true });
  await fs.writeFile(FIXES_FILE, JSON.stringify(fixes, null, 2));
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

  try {
    const fixes = await loadFixes();
    fixes.push(documentation);
    await saveFixes(fixes);

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
          logger.warn('[Fix Documentation] Error not found in database:', { errorId });
        }
      }
    } catch (err) {
      logger.warn('[Fix Documentation] Could not update error status:', err);
    }

    return fixId;
  } catch (err) {
    logger.error('[Fix Documentation] Failed to document fix:', err);
    throw err;
  }
}
