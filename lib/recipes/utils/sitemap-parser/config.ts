/**
 * Sitemap and recipe URL patterns. Extracted for filesize limit.
 */
import type { SourceType } from '../../types';
import { SOURCES } from '../../config';

export const RECIPE_URL_PATTERNS: Partial<Record<SourceType, RegExp>> = {
  [SOURCES.ALLRECIPES]: /allrecipes\.com\/recipe\//i,
  [SOURCES.FOOD_NETWORK]: /foodnetwork\.com\/recipes\/[^/]+$/i,
  [SOURCES.RECIPE_NLG]: /recipe-nlg/i,
  [SOURCES.EPICURIOUS]: /epicurious\.com\/recipes\/food\/views\//i,
  [SOURCES.BON_APPETIT]: /bonappetit\.com\/recipe\//i,
  [SOURCES.TASTY]: /tasty\.co\/recipe\//i,
  [SOURCES.FOOD_AND_WINE]: /foodandwine\.com\/recipe\//i,
};

export const SITEMAP_URLS: Partial<Record<SourceType, string>> = {
  [SOURCES.ALLRECIPES]: 'https://www.allrecipes.com/sitemap.xml',
  [SOURCES.FOOD_NETWORK]: 'https://www.foodnetwork.com/sitemap.xml',
  [SOURCES.EPICURIOUS]: 'https://www.epicurious.com/sitemap.xml',
  [SOURCES.BON_APPETIT]: 'https://www.bonappetit.com/sitemap.xml',
  [SOURCES.TASTY]: 'https://tasty.co/sitemaps/tasty/sitemap.xml',
  [SOURCES.FOOD_AND_WINE]: 'https://www.foodandwine.com/sitemap.xml',
};

export const EXCLUDE_PATTERNS = [
  /\/collection\//i,
  /\/category\//i,
  /\/photos\//i,
  /\/search\//i,
  /\/tag\//i,
  /\/author\//i,
  /\/page\//i,
];
