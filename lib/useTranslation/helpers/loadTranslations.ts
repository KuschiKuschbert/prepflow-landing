/**
 * Lazy load translation files.
 */
import { logger } from '@/lib/logger';

// Translation files mapping - lazy loaded
const translations: Record<string, Record<string, unknown>> = {};

/**
 * Lazy load translation files.
 */
export async function loadTranslations(language: string): Promise<Record<string, unknown>> {
  if (translations[language]) {
    return translations[language];
  }

  try {
    if (language === 'en-AU') {
      const { translations: enAU } = await import('../../translations/en-AU');
      translations['en-AU'] = enAU;
      return enAU;
    } else if (language === 'de-DE') {
      const { translations: deDE } = await import('../../translations/de-DE');
      translations['de-DE'] = deDE;
      return deDE;
    }
  } catch (error) {
    logger.error(`Failed to load translations for ${language}:`, error);
  }
  if (!translations['en-AU']) {
    const { translations: enAU } = await import('../../translations/en-AU');
    translations['en-AU'] = enAU;
  }
  return translations['en-AU'];
}

export function getCachedTranslations(): Record<string, Record<string, unknown>> {
  return translations;
}
