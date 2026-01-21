import fs from 'fs/promises';
import path from 'path';
import { buildKnowledgeIndex } from './builder';
import type { IndexEntry } from './types';

export const INDEX_FILE = path.join(process.cwd(), '.error-capture/knowledge-index.json');

/**
 * Load index
 */
export async function loadKnowledgeIndex(): Promise<IndexEntry[]> {
  try {
    const content = await fs.readFile(INDEX_FILE, 'utf8');
    return JSON.parse(content) as IndexEntry[];
  } catch {
    // Index doesn't exist, build it
    return buildKnowledgeIndex();
  }
}
