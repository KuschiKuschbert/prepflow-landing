/**
 * Get compliance variant styles (audit-ready, formal layout, detailed tables)
 *
 * @returns {string} CSS for compliance variant
 */
import { getComplianceBaseStyles } from './getComplianceVariantCSS/baseStyles';
import { getComplianceReportStyles } from './getComplianceVariantCSS/reportStyles';

export function getComplianceVariantCSS(): string {
  return `
    ${getComplianceBaseStyles()}
    ${getComplianceReportStyles()}
  `;
}
