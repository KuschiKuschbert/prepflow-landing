import { getAllTemplateStyles } from '../../template-styles';
import {
    escapeHtml,
    formatDateAustralian,
    formatMetaInfo,
    getFooterHtml,
    getLogoUrl,
} from '../../template-utils';

export function generateDefaultVariant(
  title: string,
  subtitle: string | undefined,
  content: string,
  totalItems: number | undefined,
  customMeta: string | undefined,
): string {
  const generatedDate = formatDateAustralian();
  const logoUrl = getLogoUrl();
  const metaInfo = formatMetaInfo({ totalItems, customMeta });
  const footerHtml = getFooterHtml();
  const escapedTitle = escapeHtml(title);
  const escapedSubtitle = subtitle ? escapeHtml(subtitle) : '';
  const styles = getAllTemplateStyles('default');

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
<body class="variant-default">
  <div class="background-grid"></div>
  <div class="corner-glow-cyan"></div>
  <div class="corner-glow-magenta"></div>
  <div class="concentric-circles">
    <div class="circle circle-1"></div>
    <div class="circle circle-2"></div>
    <div class="circle circle-3"></div>
    <div class="circle circle-4"></div>
  </div>
  <div class="content-wrapper">
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
    <div class="export-content">
      ${content}
    </div>
    <footer class="footer">
      ${footerHtml}
    </footer>
  </div>
</body>
</html>`;
}
