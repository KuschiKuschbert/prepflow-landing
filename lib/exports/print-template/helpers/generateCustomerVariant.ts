import { getAllTemplateStyles } from '../../template-styles';
import { formatDateAustralian, formatMetaInfo, escapeHtml } from '../../template-utils';

export function generateCustomerVariant(
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
  const styles = getAllTemplateStyles('customer');

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
  <div class="content-wrapper variant-customer">
    <header class="header variant-customer">
      <div class="header-content variant-customer">
        <h1 class="variant-customer">${escapedTitle}</h1>
        ${escapedSubtitle ? `<h2 class="variant-customer">${escapedSubtitle}</h2>` : ''}
      </div>
      ${metaInfo ? `<div class="header-meta variant-customer">${generatedDate}</div>` : ''}
    </header>
    <div class="export-content variant-customer">
      ${content}
    </div>
  </div>
</body>
</html>`;
}
