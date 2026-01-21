import fs from 'fs/promises';
import path from 'path';
import { loadKnowledgeBase } from '../knowledge-base';
import { extractKeywords } from './keywords';
import { INDEX_FILE } from './storage';
import type { IndexEntry } from './types';

/**
 * Build index from knowledge base
 */
export async function buildKnowledgeIndex(): Promise<IndexEntry[]> {
  const kb = await loadKnowledgeBase();
  const index: IndexEntry[] = [];

  // Index errors
  for (const error of kb.errors) {
    const keywords: string[] = [];

    // Extract keywords from pattern
    keywords.push(...extractKeywords(error.pattern));

    // Extract keywords from error type
    keywords.push(...extractKeywords(error.errorType));

    // Extract keywords from category
    keywords.push(...extractKeywords(error.category));

    // Extract keywords from context
    if (error.context.file) {
      keywords.push(...extractKeywords(error.context.file));
    }

    // Extract keywords from fixes
    for (const fix of error.fixes) {
      keywords.push(...extractKeywords(fix.solution));
      keywords.push(...extractKeywords(fix.prevention));
    }

    index.push({
      id: error.id,
      type: 'error',
      keywords: [...new Set(keywords)], // Unique keywords
      categories: [error.category],
      file: error.context.file,
    });
  }

  // Index patterns
  for (const pattern of kb.patterns) {
    const keywords: string[] = [];

    // Extract keywords from name
    keywords.push(...extractKeywords(pattern.name));

    // Extract keywords from description
    keywords.push(...extractKeywords(pattern.description));

    // Extract keywords from detection
    keywords.push(...extractKeywords(pattern.detection));

    // Extract keywords from fix
    keywords.push(...extractKeywords(pattern.fix));

    // Extract keywords from prevention
    keywords.push(...extractKeywords(pattern.prevention));

    index.push({
      id: pattern.id,
      type: 'pattern',
      keywords: [...new Set(keywords)], // Unique keywords
      categories: [],
    });
  }

  // Save index
  const indexDir = path.dirname(INDEX_FILE);
  await fs.mkdir(indexDir, { recursive: true });
  await fs.writeFile(INDEX_FILE, JSON.stringify(index, null, 2), 'utf8');

  return index;
}

/**
 * Rebuild index (useful after knowledge base updates)
 */
export async function rebuildKnowledgeIndex(): Promise<IndexEntry[]> {
  return buildKnowledgeIndex();
}
