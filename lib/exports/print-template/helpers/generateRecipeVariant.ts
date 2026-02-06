import { getAllTemplateStyles } from '../../template-styles/index';
import { escapeHtml, formatDateAustralian } from '../../template-utils';
import { type ExportTheme } from '../../themes';

export function generateRecipeVariant(
  title: string,
  subtitle: string | undefined,
  content: string,
  theme: ExportTheme = 'cyber-carrot',
  logoSrc: string = '/images/prepflow-logo.png',
): string {
  const generatedDate = formatDateAustralian();
  const escapedTitle = escapeHtml(title);
  const escapedSubtitle = subtitle ? escapeHtml(subtitle) : '';
  const styles = getAllTemplateStyles('recipe', theme);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapedTitle} - Recipe Card</title>
  <style>
    ${styles}
  </style>
</head>
<body class="variant-recipe">
  <div class="print-background-layer"></div>
  <div class="content-wrapper">
    <header class="header">
      <div class="header-content">
        <h1>${escapedTitle}</h1>
        ${escapedSubtitle ? `<h2>${escapedSubtitle}</h2>` : ''}
      </div>
    </header>

    <!-- Content is expected to be formatted with recipe-container structure
         If standard content is passed, it will just render in the main flow.
    -->
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
