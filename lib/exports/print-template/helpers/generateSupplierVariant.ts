import { getAllTemplateStyles } from '../../template-styles/index';
import { escapeHtml, formatDateAustralian, formatMetaInfo } from '../../template-utils';
import { type ExportTheme } from '../../themes';

export function generateSupplierVariant(
  title: string,
  subtitle: string | undefined,
  content: string,
  totalItems: number | undefined,
  customMeta: string | undefined,
  theme: ExportTheme = 'cyber-carrot',
): string {
  const generatedDate = formatDateAustralian();
  const metaInfo = formatMetaInfo({ totalItems, customMeta });
  const escapedTitle = escapeHtml(title);
  const escapedSubtitle = subtitle ? escapeHtml(subtitle) : '';
  const styles = getAllTemplateStyles('supplier', theme);

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
  <div class="print-background-layer"></div>
  <div class="content-wrapper variant-supplier">
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
    <div class="export-content variant-supplier">
      ${content}
    </div>
    <div class="footer">
      <p>Created with PrepFlow</p>
    </div>
  </div>
</body>
</html>`;
}
