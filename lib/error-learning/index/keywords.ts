/**
 * Extract keywords from text
 */
export function extractKeywords(text: string): string[] {
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
