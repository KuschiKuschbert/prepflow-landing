import { getAllTemplateStyles } from '../../template-styles/index';
import { escapeHtml, formatDateAustralian } from '../../template-utils';
import { type ExportTheme } from '../../themes';

/**
 * Generate runsheet print variant (restaurant/catering format)
 * Professional layout for event runsheets with event details and timeline
 */
export function generateRunsheetVariant(
  title: string,
  subtitle: string | undefined,
  content: string,
  theme: ExportTheme = 'cyber-carrot',
  logoSrc: string = '/images/prepflow-logo.png',
): string {
  const generatedDate = formatDateAustralian();
  const escapedTitle = escapeHtml(title);
  const escapedSubtitle = subtitle ? escapeHtml(subtitle) : '';
  const styles = getAllTemplateStyles('runsheet', theme);

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
<body class="variant-runsheet">
  <div class="print-background-layer"></div>
  <div class="content-wrapper variant-runsheet">
    <header class="header variant-runsheet">
      <div class="header-content variant-runsheet">
        <h1 class="variant-runsheet">${escapedTitle}</h1>
        ${escapedSubtitle ? `<h2 class="variant-runsheet">${escapedSubtitle}</h2>` : ''}
      </div>
      <div class="header-meta variant-runsheet">
        <div>${generatedDate}</div>
      </div>
    </header>
    <div class="export-content variant-runsheet">
      ${content}
    </div>
    <div class="footer">
      <p>Created with PrepFlow</p>
    </div>
  </div>
</body>
</html>`;
}
