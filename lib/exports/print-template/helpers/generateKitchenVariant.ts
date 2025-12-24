import { getAllTemplateStyles } from '../../template-styles';
import { formatDateAustralian, escapeHtml } from '../../template-utils';

export function generateKitchenVariant(
  title: string,
  subtitle: string | undefined,
  content: string,
): string {
  const generatedDate = formatDateAustralian();
  const escapedTitle = escapeHtml(title);
  const escapedSubtitle = subtitle ? escapeHtml(subtitle) : '';
  const styles = getAllTemplateStyles('kitchen');

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
  <div class="content-wrapper variant-kitchen">
    <header class="header variant-kitchen">
      <div class="header-content variant-kitchen">
        <h1 class="variant-kitchen">${escapedTitle}</h1>
        ${escapedSubtitle ? `<h2 class="variant-kitchen">${escapedSubtitle}</h2>` : ''}
      </div>
      <div class="header-meta variant-kitchen">
        <div>${generatedDate}</div>
      </div>
    </header>
    <div class="export-content variant-kitchen">
      ${content}
    </div>
  </div>
</body>
</html>`;
}
