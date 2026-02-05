import { ExportTheme, themes } from '@/lib/exports/themes';

/**
 * Content wrapper, header, and footer CSS
 */
export function getContentStyles(theme: ExportTheme = 'cyber-carrot'): string {
  const config = themes[theme] || themes['cyber-carrot'];
  const primary = config.cssVariables['--pf-color-primary'];
  const secondary = config.cssVariables['--pf-color-secondary'];
  const textMuted = config.cssVariables['--pf-color-text-muted'];
  const border = config.cssVariables['--pf-color-border'];
  const bgContent = config.cssVariables['--pf-color-bg-content'];
  const shadowContent = config.cssVariables['--pf-shadow-content'];
  const logoFilter = config.cssVariables['--pf-logo-filter'];
  const headerFont = config.cssVariables['--pf-font-family-header'];

  return `
    /* Content Container */
    .content-wrapper {
      position: relative;
      z-index: 1;
      max-width: 1200px;
      margin: 0 auto;
      background: ${bgContent};
      border-radius: var(--pf-border-radius, 24px);
      padding: 40px;
      box-shadow: ${shadowContent};
      border: var(--pf-border-width, 1px) solid ${border};
    }

    /* Header */
    .header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 2px solid ${border};
    }

    .logo {
      width: 120px;
      height: auto;
      flex-shrink: 0;
      object-fit: contain;
      filter: ${logoFilter};
    }

    .header-content h1 {
      font-family: ${headerFont};
      font-size: 32px;
      font-weight: 700;
      color: ${primary};
      margin: 0;
      background: linear-gradient(135deg, ${primary} 0%, ${secondary} 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .header-content h2 {
      font-size: 18px;
      font-weight: 500;
      color: ${textMuted};
      margin: 4px 0 0 0;
    }

    .header-meta {
      margin-left: auto;
      text-align: right;
      color: ${textMuted};
      font-size: 14px;
    }

    /* Footer */
    .footer {
      margin-top: 40px;
      padding-top: 24px;
      border-top: 2px solid ${border};
      text-align: center;
      color: ${textMuted};
      font-size: 12px;
    }
  `;
}
