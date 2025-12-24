import { getAllTemplateStyles } from '../../template-styles';
import { formatDateAustralian, formatMetaInfo, escapeHtml } from '../../template-utils';

export function generateComplianceVariant(
  title: string,
  subtitle: string | undefined,
  content: string,
  totalItems: number | undefined,
  customMeta: string | undefined,
): string {
  const generatedDate = formatDateAustralian();
  const metaInfo = formatMetaInfo({ totalItems, customMeta });
  const escapedTitle = escapeHtml(title);
  const escapedSubtitle = subtitle ? escapeHtml(subtitle) : '';
  const styles = getAllTemplateStyles('compliance');

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
  <div class="content-wrapper variant-compliance">
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
    <div class="export-content variant-compliance">
      ${content}
    </div>
  </div>
</body>
</html>`;
}
