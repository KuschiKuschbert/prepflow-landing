/**
 * Base styles (reset, typography, page setup)
 */
export function getBaseStyles(): string {
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
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(180deg, rgba(10,10,10,1) 0%, rgba(8,8,10,1) 100%);
      color: #ffffff;
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
