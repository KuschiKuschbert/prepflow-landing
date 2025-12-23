/**
 * Client-side menu print template
 *
 * Generates professional print template with PrepFlow logo and background elements
 * Client-side compatible version (uses public URL for logo instead of readFileSync)
 */

import { getMenuPrintTemplateStyles } from './menuPrintTemplate/styles';
import {
  generateBackgroundElements,
  generateHeaderHTML,
  generateFooterHTML,
  generateContentWrapperHTML,
} from './menuPrintTemplate/htmlStructure';

/**
 * Generate professional menu print template with PrepFlow branding
 *
 * @param {Object} options - Template options
 * @param {string} options.title - Menu name
 * @param {string} [options.subtitle] - Menu description or "Menu"
 * @param {string} options.content - Menu content HTML
 * @param {number} [options.totalItems] - Total number of menu items
 * @param {string} [options.customMeta] - Custom metadata (e.g., lock date/info)
 * @returns {string} Complete HTML document
 */
export function generateMenuPrintTemplate({
  title,
  subtitle,
  content,
  totalItems,
  customMeta,
}: {
  title: string;
  subtitle?: string;
  content: string;
  totalItems?: number;
  customMeta?: string;
}): string {
  const generatedDate = new Date().toLocaleString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Use public URL for logo (client-side compatible)
  const logoUrl = '/images/prepflow-logo.png';

  const styles = getMenuPrintTemplateStyles();
  const backgroundElements = generateBackgroundElements();
  const headerHTML = generateHeaderHTML({
    logoUrl,
    title,
    subtitle,
    generatedDate,
    totalItems,
    customMeta,
  });
  const footerHTML = generateFooterHTML();
  const contentWrapperHTML = generateContentWrapperHTML({
    content,
    headerHTML,
    footerHTML,
  });

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
  ${backgroundElements}
  ${contentWrapperHTML}
</body>
</html>`;
}



