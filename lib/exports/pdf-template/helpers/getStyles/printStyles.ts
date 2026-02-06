import { ExportTheme, themes } from '@/lib/exports/themes';

/**
 * Print-optimized styles (@media print)
 */
export function getPrintStyles(theme: ExportTheme = 'cyber-carrot'): string {
  const config = themes[theme] || themes['cyber-carrot'];
  const primary = config.cssVariables['--pf-color-primary'];
  const textMuted = config.cssVariables['--pf-color-text-muted'];
  const border = config.cssVariables['--pf-color-border'];
  const bgPage = config.cssVariables['--pf-color-bg-page'];

  // For light themes (like phantom-pepper), we use different print colors
  const isLightTheme = theme === 'phantom-pepper';
  const printBg = isLightTheme ? '#ffffff' : '#000000';
  const printText = isLightTheme ? '#000000' : '#ffffff';

  return `
    /* Print Styles */
    @media print {
      body {
        background: ${printBg} !important;
        color: ${printText} !important;
        padding: 0;
      }

      .background-grid,
      .corner-glow-cyan,
      .corner-glow-magenta,
      .concentric-circles {
        opacity: 0.1;
      }

      .content-wrapper {
        background: ${printBg} !important;
        box-shadow: none;
        padding: 20px;
        border-color: ${border};
      }

      .header-content h1 {
        -webkit-text-fill-color: ${primary} !important;
        background: none;
        color: ${primary} !important;
      }

      .header-content h2 {
        color: ${textMuted} !important;
      }

      .header-meta {
        color: ${textMuted} !important;
      }

      .footer {
        color: ${textMuted} !important;
        border-color: ${border};
      }

      @page {
        margin: 1.5cm;
      }
    }
  `;
}
