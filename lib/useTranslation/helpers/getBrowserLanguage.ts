/**
 * Get browser language - Only English and German.
 */
import { logger } from '@/lib/logger';

// Available languages - Only English and German
export const availableLanguages = {
  'en-AU': { name: 'English', flag: '🇬🇧' },
  'de-DE': { name: 'Deutsch', flag: '🇩🇪' },
};

/**
 * Get browser language - Only English and German
 * Wrapped in try-catch to handle HMR edge cases
 */
export function getBrowserLanguage(): string {
  if (typeof window === 'undefined') return 'en-AU';

  try {
    // Safely access navigator (may not be available during HMR)
    const browserLang = navigator?.language || 'en-AU';
    if (availableLanguages[browserLang as keyof typeof availableLanguages]) return browserLang;
    const langCode = browserLang.split('-')[0];
    if (langCode === 'de') return 'de-DE';
    return 'en-AU';
  } catch (error) {
    // Fallback during HMR or if navigator is unavailable
    // Silently fail during HMR to prevent console spam
    try {
      logger.warn('Failed to get browser language, using default:', error);
    } catch {
      // Ignore logger errors during HMR (logger may not be available)
    }
    return 'en-AU';
  }
}



