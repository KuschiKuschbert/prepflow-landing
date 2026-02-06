/**
 * Get base styles (reset, typography, page setup)
 *
 * @returns {string} CSS for base styles
 */
export function getBaseStylesCSS(): string {
  return `
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
      font-family: var(--pf-font-family-body);
      background: var(--pf-color-bg-page);
      color: var(--pf-color-text-main);
      min-height: 100vh;
      position: relative;
      padding: 40px 20px;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* Content Area */
    .export-content {
      margin-top: 32px;
    }

    /* Typography Defaults */
    h1, h2, h3, h4, h5, h6 {
      font-family: var(--pf-font-family-header);
      color: var(--pf-color-text-header);
      margin-bottom: 0.5em;
      line-height: 1.2;
    }

    p {
      margin-bottom: 1em;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1.5rem;
    }

    th {
      text-align: left;
      padding: 12px;
      border-bottom: 2px solid var(--pf-color-border);
      color: var(--pf-color-text-header);
      font-weight: 600;
    }

    td {
      padding: 12px;
      border-bottom: 1px solid var(--pf-color-border);
      vertical-align: top;
    }

    /* Lists */
    ul, ol {
      margin-bottom: 1em;
      padding-left: 1.5em;
    }

    li {
      margin-bottom: 0.25em;
    }
  `;
}
