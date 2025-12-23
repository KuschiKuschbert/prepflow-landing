import { getAllTemplateStyles } from '../../template-styles';
import { formatDateAustralian, escapeHtml } from '../../template-utils';

export function generateCompactVariant(
  title: string,
  subtitle: string | undefined,
  content: string,
): string {
  const generatedDate = formatDateAustralian();
  const escapedTitle = escapeHtml(title);
  const escapedSubtitle = subtitle ? escapeHtml(subtitle) : '';
  const styles = getAllTemplateStyles('compact');

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
  <div class="content-wrapper variant-compact">
    <header class="header variant-compact">
      <div class="header-content variant-compact">
        <h1 class="variant-compact">${escapedTitle}</h1>
        ${escapedSubtitle ? `<h2 class="variant-compact">${escapedSubtitle}</h2>` : ''}
      </div>
      <div class="header-meta variant-compact">
        <div>${generatedDate}</div>
      </div>
    </header>
    <div class="export-content variant-compact">
      ${content}
    </div>
  </div>
</body>
</html>`;
}

