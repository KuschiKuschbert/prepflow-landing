/**
 * Shared PDF/HTML Export Template Utility
 * Provides consistent professional formatting for all PrepFlow exports
 * Client-safe: Uses public URLs instead of filesystem access
 */

import { buildExportHTML } from './pdf-template/helpers/buildHTML';
import { escapeHtml } from './pdf-template/helpers/escapeHtml';
import { getInlineSVGLogo, getLogoUrl } from './pdf-template/helpers/getLogo';
import { getExportStyles } from './pdf-template/helpers/getStyles';

import { ExportTheme } from './themes';

export interface ExportTemplateOptions {
  title: string;
  subtitle?: string;
  content: string;
  forPDF?: boolean;
  totalItems?: number;
  customMeta?: string;
  theme?: ExportTheme;
}

/**
 * Generate professional PDF/HTML export template with PrepFlow branding
 *
 * @param {ExportTemplateOptions} options - Template options
 * @returns {string} Complete HTML document
 */
export function generateExportTemplate({
  title,
  subtitle,
  content,
  forPDF = false,
  totalItems,
  customMeta,
  theme = 'cyber-carrot',
}: ExportTemplateOptions): string {
  // Use public URL for logo (works in browser context)
  // For standalone HTML files, use inline SVG as fallback
  const logoUrl = forPDF ? getInlineSVGLogo() : getLogoUrl();
  const generatedDate = new Date().toLocaleString();
  const styles = getExportStyles(theme);
  const bodyHTML = buildExportHTML(
    logoUrl,
    title,
    subtitle,
    content,
    generatedDate,
    totalItems,
    customMeta,
    forPDF,
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PrepFlow - ${title}</title>
  <style>
${styles}
  </style>
</head>
<body>
${bodyHTML}
</body>
</html>`;
}

// Re-export helper functions for external use
export { escapeHtml };
