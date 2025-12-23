/**
 * Get CSS styles for PDF/HTML export template
 */
import { getBaseStyles } from './getStyles/baseStyles';
import { getBackgroundStyles } from './getStyles/backgroundStyles';
import { getContentStyles } from './getStyles/contentStyles';
import { getPrintStyles } from './getStyles/printStyles';

export function getExportStyles(): string {
  return `
    ${getBaseStyles()}
    ${getBackgroundStyles()}
    ${getContentStyles()}
    ${getPrintStyles()}
  `;
}
