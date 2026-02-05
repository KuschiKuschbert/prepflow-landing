import { ExportTheme, getThemeCSS, themes } from '@/lib/exports/themes';

/**
 * Base styles (reset, typography, page setup)
 */
export function getBaseStyles(theme: ExportTheme = 'cyber-carrot'): string {
  const themeCSS = getThemeCSS(theme);
  const themeConfig = themes[theme] || themes['cyber-carrot'];
  const bgPage = themeConfig.cssVariables['--pf-color-bg-page'] || '#09090b';

  return `
    ${themeCSS}

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    @page {
      margin: 1.5cm;
      size: A4;
    }

    body {
      font-family: var(--pf-font-family-body, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif);
      background: ${bgPage};
      color: var(--pf-color-text-main, #ffffff);
      min-height: 100vh;
      position: relative;
      padding: 40px 20px;
    }

    /* Content Area */
    .export-content {
      margin-top: 32px;
    }
  `;
}
