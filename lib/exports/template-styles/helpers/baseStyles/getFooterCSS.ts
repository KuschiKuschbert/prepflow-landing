/**
 * Get Cyber Carrot footer CSS
 *
 * @returns {string} CSS for footer
 */
export function getFooterCSS(): string {
  return `
    /* Footer */
    .footer {
      margin-top: 40px;
      padding-top: 24px;
      border-top: var(--pf-border-width) solid var(--pf-color-border);
      text-align: center;
      color: var(--pf-color-text-muted);
      font-size: 12px;
    }
  `;
}
