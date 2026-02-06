/**
 * Get Cyber Carrot header CSS
 *
 * @returns {string} CSS for header
 */
export function getHeaderCSS(): string {
  return `
    /* Header */
    .header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: var(--pf-border-width) solid var(--pf-color-border);
    }

    .logo {
      width: 120px;
      height: auto;
      flex-shrink: 0;
      object-fit: contain;
      filter: var(--pf-logo-filter);
    }

    .header-content h1 {
      font-size: 32px;
      font-weight: 700;
      color: var(--pf-color-text-header);
      margin: 0;
      /* Default gradient for Cyber Carrot, others can override or use solid color */
      color: var(--pf-color-primary);
    }

    .header-content h2 {
      font-size: 18px;
      font-weight: 500;
      color: var(--pf-color-text-muted);
      margin: 4px 0 0 0;
    }

    .header-meta {
      margin-left: auto;
      text-align: right;
      color: var(--pf-color-text-muted);
      font-size: 14px;
    }
  `;
}
