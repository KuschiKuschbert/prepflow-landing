/**
 * CSS styles for menu print template
 */
import { getBackgroundStyles } from './styles/helpers/backgroundStyles';
import { getBaseStyles } from './styles/helpers/baseStyles';
import { getContentStyles } from './styles/helpers/contentStyles';
import { getPrintStyles } from './styles/helpers/printStyles';

export function getMenuPrintTemplateStyles(): string {
  return `${getBaseStyles()}${getBackgroundStyles()}${getContentStyles()}${getPrintStyles()}`;
}
