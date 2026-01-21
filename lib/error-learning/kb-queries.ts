import { loadKnowledgeBase } from './storage';
import type { KnowledgeBaseError, KnowledgeBasePattern, KnowledgeBaseRule } from './types';

/**
 * Get error from knowledge base
 */
export async function getErrorFromKnowledgeBase(
  errorId: string,
): Promise<KnowledgeBaseError | null> {
  const kb = await loadKnowledgeBase();
  return kb.errors.find(err => err.id === errorId) || null;
}

/**
 * Get similar errors
 */
export async function getSimilarErrors(errorId: string): Promise<KnowledgeBaseError[]> {
  const kb = await loadKnowledgeBase();
  const error = kb.errors.find(err => err.id === errorId);

  if (!error) {
    return [];
  }

  return kb.errors.filter(err => error.similarErrors.includes(err.id));
}

/**
 * Search knowledge base
 */
export async function searchKnowledgeBase(query: string): Promise<{
  errors: KnowledgeBaseError[];
  patterns: KnowledgeBasePattern[];
  rules: KnowledgeBaseRule[];
}> {
  const kb = await loadKnowledgeBase();
  const queryLower = query.toLowerCase();

  const errors = kb.errors.filter(
    err =>
      err.pattern.toLowerCase().includes(queryLower) ||
      err.errorType.toLowerCase().includes(queryLower) ||
      err.category.toLowerCase().includes(queryLower),
  );

  const patterns = kb.patterns.filter(
    pattern =>
      pattern.name.toLowerCase().includes(queryLower) ||
      pattern.description.toLowerCase().includes(queryLower) ||
      pattern.detection.toLowerCase().includes(queryLower),
  );

  const rules = kb.rules.filter(
    rule =>
      rule.name.toLowerCase().includes(queryLower) ||
      rule.source.toLowerCase().includes(queryLower),
  );

  return { errors, patterns, rules };
}
