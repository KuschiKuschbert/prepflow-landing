import { getAllTemplateStyles } from '../../template-styles/index';
import { escapeHtml, formatDateAustralian } from '../../template-utils';
import { type ExportTheme } from '../../themes';

export function generateMenuVariant(
  title: string,
  subtitle: string | undefined,
  content: string,
  theme: ExportTheme = 'cyber-carrot',
): string {
  const generatedDate = formatDateAustralian();
  const escapedTitle = escapeHtml(title);
  const escapedSubtitle = subtitle ? escapeHtml(subtitle) : '';
  const styles = getAllTemplateStyles('menu', theme);

  // Note: content is expected to be pre-formatted with menu-specific classes
  // or we wrap the generic content. For now, we assume generic content
  // but the styles will try to apply. Ideally, the content generation
  // for a menu should use specific HTML structure.

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapedTitle} - Menu</title>
  <style>
    ${styles}
  </style>
</head>
<body class="variant-menu">
  <div class="print-background-layer"></div>
  <div class="content-wrapper">
    <header class="header">
      <!-- Logo is optional or centered in CSS -->
      <div class="header-content">
        <h1>${escapedTitle}</h1>
        ${escapedSubtitle ? `<h2>${escapedSubtitle}</h2>` : ''}
      </div>
    </header>

    <main class="export-content">
      ${content}
    </main>

    <footer class="footer">
      <p>Created with PrepFlow</p>
    </footer>
  </div>
</body>
</html>`;
}
