/**
 * Get Cyber Carrot content wrapper CSS
 *
 * @returns {string} CSS for content wrapper
 */
export function getContentWrapperCSS(): string {
  return `
    /* Content Container */
    .content-wrapper {
      position: relative;
      z-index: 1;
      max-width: 1200px;
      margin: 0 auto;
      background: var(--pf-color-bg-content);
      border-radius: var(--pf-border-radius);
      padding: 40px;
      box-shadow: var(--pf-shadow-content);
    }
  `;
}
