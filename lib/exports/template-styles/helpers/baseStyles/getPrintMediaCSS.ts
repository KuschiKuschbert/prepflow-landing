/**
 * Get print-optimized styles (@media print)
 *
 * @returns {string} CSS for print media
 */
export function getPrintMediaCSS(): string {
  return `
    /* Print Styles */
    @media print {
      body {
        background: #ffffff;
        padding: 0;
      }

      .background-grid,
      .corner-glow-cyan,
      .corner-glow-magenta,
      .concentric-circles {
        opacity: 0.15;
      }

      .content-wrapper {
        background: #ffffff;
        box-shadow: none;
        padding: 20px;
      }

      .header-content h1 {
        -webkit-text-fill-color: #000000;
        background: none;
        color: #000000;
      }

      .header-content h2 {
        color: #333333;
      }

      .header-meta {
        color: #666666;
      }

      .footer {
        color: #666666;
        border-color: #e0e0e0;
      }

      @page {
        margin: 1.5cm;
      }
    }
  `;
}

