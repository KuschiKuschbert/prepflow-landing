/**
 * Category keyword mappings for rule-based detection.
 * More specific categories should come first to avoid false matches.
 */
import { PROTEIN_KEYWORDS } from './constants/protein';
import { PRODUCE_KEYWORDS } from './constants/produce';
import { PANTRY_KEYWORDS } from './constants/pantry';
import { OTHER_KEYWORDS } from './constants/other';

export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  ...PROTEIN_KEYWORDS,
  ...PRODUCE_KEYWORDS,
  ...PANTRY_KEYWORDS,
  ...OTHER_KEYWORDS,
};
