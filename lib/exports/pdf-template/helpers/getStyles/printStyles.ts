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
  const textMain = config.cssVariables['--pf-color-text-main'];

  return `
    /* Print Styles */
    @media print {
      @page {
        margin: 0;
        size: auto;
      }

      html {
        background-color: ${bgPage} !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      body {
        background-color: ${bgPage} !important;
        color: ${textMain} !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        margin: 0;
        padding: 0;
      }

      .content-wrapper {
        background-color: ${bgPage} !important;
        border: none !important;
        box-shadow: none !important;
        margin: 0;
        padding: 1.5cm;
        min-height: 100vh;
      }

      /* Ensure text visibility on dark themes */
      h1, h2, h3, h4, p, span, div {
        color: ${textMain} !important;
      }

      .header-content h1 {
        color: ${primary} !important;
        -webkit-text-fill-color: ${primary} !important;
      }

      .header-content h2,
      .header-meta,
      .footer {
        color: ${textMuted} !important;
      }

      /* Hide browser default headers/footers if possible (controlled by user settings usually, but margin:0 helps) */
    }
  `;
}
