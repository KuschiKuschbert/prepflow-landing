import { CRITICAL_KEYWORDS, HIGH_KEYWORDS, SAFETY_KEYWORDS } from '../constants';

/**
 * Match keywords in text and return highest severity found
 */
export function matchKeywords(text: string): 'safety' | 'critical' | 'high' | null {
  for (const keyword of SAFETY_KEYWORDS) {
    if (text.includes(keyword)) {
      return 'safety';
    }
  }

  for (const keyword of CRITICAL_KEYWORDS) {
    if (text.includes(keyword)) {
      return 'critical';
    }
  }

  for (const keyword of HIGH_KEYWORDS) {
    if (text.includes(keyword)) {
      return 'high';
    }
  }

  return null;
}
