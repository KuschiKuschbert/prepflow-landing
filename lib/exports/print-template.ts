/**
 * Unified client-side print template
 * Provides consistent professional formatting for all PrepFlow print operations
 * Uses Cyber Carrot design system and PrepFlow voice
 */

import { getAllTemplateStyles } from './template-styles';
import {
  formatDateAustralian,
  getLogoUrl,
  formatMetaInfo,
  getFooterHtml,
  escapeHtml,
} from './template-utils';
import { logger } from '@/lib/logger';

export type TemplateVariant =
  | 'default'
  | 'kitchen'
  | 'customer'
  | 'supplier'
  | 'compliance'
  | 'compact';

export interface PrintTemplateOptions {
  title: string;
  subtitle?: string;
  content: string;
  totalItems?: number;
  customMeta?: string;
  variant?: TemplateVariant;
}

/**
 * Generate professional print template with PrepFlow branding
 * Client-side compatible (uses public URL for logo)
 *
 * @param {PrintTemplateOptions} options - Template options
 * @returns {string} Complete HTML document ready for printing
 */
export function generatePrintTemplate({
  title,
  subtitle,
  content,
  totalItems,
  customMeta,
  variant = 'default',
}: PrintTemplateOptions): string {
  const generatedDate = formatDateAustralian();
  const logoUrl = getLogoUrl();
  const metaInfo = formatMetaInfo({ totalItems, customMeta });
  const footerHtml = getFooterHtml();
  const escapedTitle = escapeHtml(title);
  const escapedSubtitle = subtitle ? escapeHtml(subtitle) : '';
  const styles = getAllTemplateStyles(variant);

  // Customer variant: polished, marketing-focused, photo-ready
  if (variant === 'customer') {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapedTitle}</title>
  <style>
    ${styles}
  </style>
</head>
<body class="variant-customer">
  <!-- Content -->
  <div class="content-wrapper variant-customer">
    <!-- Elegant Header -->
    <header class="header variant-customer">
      <div class="header-content variant-customer">
        <h1 class="variant-customer">${escapedTitle}</h1>
        ${escapedSubtitle ? `<h2 class="variant-customer">${escapedSubtitle}</h2>` : ''}
      </div>
      ${metaInfo ? `<div class="header-meta variant-customer">${generatedDate}</div>` : ''}
    </header>

    <!-- Content -->
    <div class="export-content variant-customer">
      ${content}
    </div>
  </div>
</body>
</html>`;
  }

  // Supplier variant: purchase order format, formal layout
  if (variant === 'supplier') {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Purchase Order - ${escapedTitle}</title>
  <style>
    ${styles}
  </style>
</head>
<body class="variant-supplier">
  <!-- Content -->
  <div class="content-wrapper variant-supplier">
    <!-- Formal Header -->
    <header class="header variant-supplier">
      <div class="header-content variant-supplier">
        <h1 class="variant-supplier">PURCHASE ORDER</h1>
        ${escapedSubtitle ? `<h2 class="variant-supplier">${escapedSubtitle}</h2>` : ''}
      </div>
      <div class="header-meta variant-supplier">
        <div>Date: ${generatedDate}</div>
        ${metaInfo ? `<div style="margin-top: 4px;">${metaInfo}</div>` : ''}
      </div>
    </header>

    <!-- Content -->
    <div class="export-content variant-supplier">
      ${content}
    </div>
  </div>
</body>
</html>`;
  }

  // Compliance variant: audit-ready, formal layout
  if (variant === 'compliance') {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Compliance Report - ${escapedTitle}</title>
  <style>
    ${styles}
  </style>
</head>
<body class="variant-compliance">
  <!-- Content -->
  <div class="content-wrapper variant-compliance">
    <!-- Formal Header -->
    <header class="header variant-compliance">
      <div class="header-content variant-compliance">
        <h1 class="variant-compliance">COMPLIANCE REPORT</h1>
        ${escapedSubtitle ? `<h2 class="variant-compliance">${escapedSubtitle}</h2>` : ''}
      </div>
      <div class="header-meta variant-compliance">
        <div>Report Generated: ${generatedDate}</div>
        ${metaInfo ? `<div style="margin-top: 4px;">${metaInfo}</div>` : ''}
      </div>
    </header>

    <!-- Content -->
    <div class="export-content variant-compliance">
      ${content}
    </div>
  </div>
</body>
</html>`;
  }

  // Compact variant: compact layout, minimal spacing
  if (variant === 'compact') {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapedTitle}</title>
  <style>
    ${styles}
  </style>
</head>
<body class="variant-compact">
  <!-- Content -->
  <div class="content-wrapper variant-compact">
    <!-- Compact Header -->
    <header class="header variant-compact">
      <div class="header-content variant-compact">
        <h1 class="variant-compact">${escapedTitle}</h1>
        ${escapedSubtitle ? `<h2 class="variant-compact">${escapedSubtitle}</h2>` : ''}
      </div>
      <div class="header-meta variant-compact">
        <div>${generatedDate}</div>
      </div>
    </header>

    <!-- Content -->
    <div class="export-content variant-compact">
      ${content}
    </div>
  </div>
</body>
</html>`;
  }

  // Kitchen variant: minimal branding, compact layout
  if (variant === 'kitchen') {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapedTitle}</title>
  <style>
    ${styles}
  </style>
</head>
<body class="variant-kitchen">
  <!-- Content -->
  <div class="content-wrapper variant-kitchen">
    <!-- Minimal Header -->
    <header class="header variant-kitchen">
      <div class="header-content variant-kitchen">
        <h1 class="variant-kitchen">${escapedTitle}</h1>
        ${escapedSubtitle ? `<h2 class="variant-kitchen">${escapedSubtitle}</h2>` : ''}
      </div>
      <div class="header-meta variant-kitchen">
        <div>${generatedDate}</div>
      </div>
    </header>

    <!-- Content -->
    <div class="export-content variant-kitchen">
      ${content}
    </div>
  </div>
</body>
</html>`;
  }

  // Default variant: full branding
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PrepFlow - ${escapedTitle}</title>
  <style>
    ${styles}
  </style>
</head>
<body>
  <!-- Background Elements -->
  <div class="background-grid"></div>
  <div class="corner-glow-cyan"></div>
  <div class="corner-glow-magenta"></div>
  <div class="concentric-circles">
    <div class="circle circle-1"></div>
    <div class="circle circle-2"></div>
    <div class="circle circle-3"></div>
    <div class="circle circle-4"></div>
  </div>

  <!-- Content -->
  <div class="content-wrapper">
    <!-- Header -->
    <header class="header">
      <img src="${logoUrl}" alt="PrepFlow Logo" class="logo" onerror="this.style.display='none'" />
      <div class="header-content">
        <h1>PrepFlow</h1>
        <h2>${escapedSubtitle || escapedTitle}</h2>
      </div>
      <div class="header-meta">
        <div>Generated: ${generatedDate}</div>
        ${metaInfo ? `<div style="margin-top: 4px;">${metaInfo}</div>` : ''}
      </div>
    </header>

    <!-- Content -->
    <div class="export-content">
      ${content}
    </div>

    <!-- Footer -->
    <footer class="footer">
      ${footerHtml}
    </footer>
  </div>
</body>
</html>`;
}

/**
 * Print content using unified template
 * Opens print dialog automatically
 *
 * @param {PrintTemplateOptions} options - Template options
 * @returns {void} Opens print window
 */
export function printWithTemplate(options: PrintTemplateOptions): void {
  const html = generatePrintTemplate(options);
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    logger.warn('[Print Template] Failed to open print window - popup blocked?');
    return;
  }

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();

  // Wait for content to load, then print
  setTimeout(() => {
    printWindow.print();
    // Don't close immediately - let user cancel if needed
    // printWindow.close();
  }, 250);
}
