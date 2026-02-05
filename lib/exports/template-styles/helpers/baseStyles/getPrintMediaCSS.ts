export function getPrintMediaCSS(): string {
  return `
    /* Print Styles */
    @media print {
      @page {
        margin: 1.5cm;
      }

      body {
        background: #ffffff !important;
        color: #000000 !important;
        padding: 0 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      /* Hide background elements for clean print */
      .background-grid,
      .corner-glow-cyan,
      .corner-glow-magenta,
      .concentric-circles,
      .theme-background-layer {
        display: none !important;
      }

      .content-wrapper {
        background: transparent !important;
        box-shadow: none !important;
        padding: 0 !important;
        border: none !important;
        margin: 0 !important;
      }

      /* Force high contrast for text */
      h1, h2, h3, h4, h5, h6 {
        color: #000000 !important;
        -webkit-text-fill-color: #000000 !important;
        text-shadow: none !important;
      }

      p, span, div, li, td, th {
        color: #000000;
        text-shadow: none !important;
      }

      .header-meta {
        color: #444444 !important;
      }

      /* Ensure borders print */
      th, td {
        border-color: #dddddd !important;
      }

      /* Footer */
      .footer {
        color: #666666 !important;
        border-top-color: #eeeeee !important;
        position: fixed;
        bottom: 0;
        width: 100%;
      }

      /* Avoid page breaks inside elements */
      .recipe-card, .menu-item, tr, li {
        page-break-inside: avoid;
      }
    }
  `;
}
