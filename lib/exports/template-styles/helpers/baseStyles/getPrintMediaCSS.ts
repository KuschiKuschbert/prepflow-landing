export function getPrintMediaCSS(): string {
  return `
    /* Print Styles */
    @media print {
      @page {
        margin: 1.5cm;
      }

      /* Logo Print Fix: Always optimize for white paper */
      .logo {
        /* Force high contrast (black logo) for print */
        filter: invert(1) !important;
        mix-blend-mode: multiply !important;
      }

      body {
        /* background: #ffffff !important; -- Removed */
        /* color: #000000 !important; -- Removed */
        padding: 0 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      /* Hide background elements for clean print */
      /* We actually want these for the stylized export! */
      /* .background-grid,
      .corner-glow-cyan,
      .corner-glow-magenta,
      .concentric-circles,
      .theme-background-layer {
        display: none !important;
      } */

      body,
      html,
      .content-wrapper,
      .export-content {
        background: transparent !important;
        box-shadow: none !important;
        padding: 0 !important;
        border: none !important;
        margin: 0 !important;
        /* CRITICAL FOR PAGE BREAKS: */
        overflow: visible !important;
        display: block !important;
        height: auto !important;
        width: 100% !important;
        float: none !important;
      }

      /* Force high contrast for text - ONLY if not using a dark theme?
         For now, let's remove the force so themes work. */
      h1, h2, h3, h4, h5, h6 {
        /* color: #000000 !important; */
        /* -webkit-text-fill-color: #000000 !important; */
        text-shadow: none !important;
      }

      p, span, div, li, td, th {
        /* color: #000000; */
        text-shadow: none !important;
      }

      .header-meta {
        /* color: #444444 !important; */
      }

      /* Ensure borders print */
      th, td {
        border-color: var(--pf-color-border) !important;
      }

      /* Page Break Helpers */
      .print-page-break,
      .print-section-break {
        page-break-before: always !important;
        break-before: page !important;
        display: block !important;
        width: 100%;
        height: 1px; /* Ensure render engine sees it */
        margin-top: -1px; /* Offset height */
        overflow: hidden;
        opacity: 0; /* Visible to layout, invisible to eye */
        clear: both;
        position: relative;
      }

      /* Force block display for our new section containers */
      .section-menu,
      .section-matrix,
      .section-recipes {
        display: block !important;
        width: 100%;
        margin: 0;
        padding: 0;
      }

      /* Footer */
      .footer {
        color: var(--pf-color-text-muted) !important;
        border-top-color: var(--pf-color-border) !important;
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
