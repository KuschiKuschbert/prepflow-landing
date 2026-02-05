import { logger } from '@/lib/logger';
import { type ExportTheme, themes } from '../themes';

const STORAGE_KEY = 'prepflow-export-theme';

/**
 * Get the saved export theme from localStorage
 */
export function getSavedExportTheme(): ExportTheme {
  if (typeof window === 'undefined') return 'cyber-carrot';

  try {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme && (Object.keys(themes) as string[]).includes(savedTheme)) {
      return savedTheme as ExportTheme;
    }
  } catch (error) {
    logger.warn('[themeUtils] Failed to read export theme from localStorage:', error);
  }

  return 'cyber-carrot';
}

/**
 * Save the export theme to localStorage
 */
export function saveExportTheme(theme: ExportTheme): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (error) {
    logger.error('[themeUtils] Failed to save export theme to localStorage:', error);
  }
}
