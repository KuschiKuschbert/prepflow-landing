import { extractKeywords } from './keywords';
import { loadKnowledgeIndex } from './storage';
import type { IndexEntry } from './types';

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
