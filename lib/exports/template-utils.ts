/**
 * Template utility functions for print/export templates
 * Provides consistent formatting, logo loading, and content escaping
 */

export { formatDateAustralian, formatDateShort, formatDateRange } from './template-utils/helpers/formatDate';
export { formatCurrency } from './template-utils/helpers/formatCurrency';
export {
  TemplateVariant,
  getRecommendedVariant,
  getVariantDescription,
  getVariantDisplayName,
} from './template-utils/helpers/variantUtils';
export { escapeHtml, getFooterHtml, formatMetaInfo } from './template-utils/helpers/htmlUtils';

/**
 * Get logo URL for client-side use (public URL)
 */
export function getLogoUrl(): string {
  return '/images/prepflow-logo.png';
}
