import { getAllTemplateStyles } from '../../template-styles/index';
import { escapeHtml, formatDateAustralian } from '../../template-utils';
import { type ExportTheme } from '../../themes';

export function generateKitchenVariant(
  title: string,
  subtitle: string | undefined,
  content: string,
  theme: ExportTheme = 'cyber-carrot',
): string {
  const generatedDate = formatDateAustralian();
  const escapedTitle = escapeHtml(title);
  const escapedSubtitle = subtitle ? escapeHtml(subtitle) : '';
  const styles = getAllTemplateStyles('kitchen', theme);

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
  <div class="print-background-layer"></div>
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
    <div class="footer">
      <p>Created with PrepFlow</p>
    </div>
  </div>
</body>
</html>`;
}
