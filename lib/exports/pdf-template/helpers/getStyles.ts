/**
 * Get CSS styles for PDF/HTML export template
 */
import { ExportTheme } from '../../themes';
import { getBackgroundStyles } from './getStyles/backgroundStyles';
import { getBaseStyles } from './getStyles/baseStyles';
import { getContentStyles } from './getStyles/contentStyles';
import { getPrintStyles } from './getStyles/printStyles';

export function getExportStyles(theme: ExportTheme = 'cyber-carrot'): string {
  return `
    ${getBaseStyles(theme)}
    ${getBackgroundStyles(theme)}
    ${getContentStyles(theme)}
    ${getPrintStyles(theme)}
  `;
}
