/**
 * Knowledge Base Indexing
 * Builds searchable index for fast error lookup
 */

import { loadKnowledgeBase } from './knowledge-base';
import fs from 'fs/promises';
import path from 'path';

export interface IndexEntry {
  id: string;
  type: 'error' | 'pattern';
  keywords: string[];
  categories: string[];
  file?: string;
  score?: number;
}

const INDEX_FILE = path.join(process.cwd(), '.error-capture/knowledge-index.json');

/**
 * Extract keywords from text
 */
function extractKeywords(text: string): string[] {
  // Remove common words and extract meaningful keywords
  const stopWords = new Set([
    'the',
    'a',
    'an',
    'and',
    'or',
    'but',
    'in',
    'on',
    'at',
    'to',
    'for',
    'of',
    'with',
    'by',
    'from',
    'as',
    'is',
    'was',
    'are',
    'were',
    'be',
    'been',
    'being',
    'have',
    'has',
    'had',
    'do',
    'does',
    'did',
    'will',
    'would',
    'should',
    'could',
    'may',
    'might',
    'must',
    'can',
    'this',
    'that',
    'these',
    'those',
    'i',
    'you',
    'he',
    'she',
    'it',
    'we',
    'they',
    'error',
    'failed',
    'failed',
    'failure',
    'exception',
    'throw',
    'catch',
  ]);

  return text
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
    .filter((word, index, arr) => arr.indexOf(word) === index); // Unique
}

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

/**
 * Search index by query
 */
export async function searchKnowledgeIndex(query: string): Promise<IndexEntry[]> {
  const index = await loadKnowledgeIndex();
  const queryKeywords = extractKeywords(query);
  const results: IndexEntry[] = [];

  for (const entry of index) {
    let score = 0;

    // Calculate score based on keyword matches
    for (const queryKeyword of queryKeywords) {
      for (const entryKeyword of entry.keywords) {
        if (entryKeyword.includes(queryKeyword) || queryKeyword.includes(entryKeyword)) {
          score += 1;
        }
      }
    }

    // Boost score for exact matches
    const exactMatches = queryKeywords.filter(qk => entry.keywords.includes(qk)).length;
    score += exactMatches * 2;

    if (score > 0) {
      results.push({
        ...entry,
        score,
      });
    }
  }

  // Sort by score (highest first)
  results.sort((a, b) => (b.score || 0) - (a.score || 0));

  return results;
}

/**
 * Rebuild index (useful after knowledge base updates)
 */
export async function rebuildKnowledgeIndex(): Promise<IndexEntry[]> {
  return buildKnowledgeIndex();
}
