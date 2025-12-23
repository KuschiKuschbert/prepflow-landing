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
      background: rgba(31, 31, 31, 0.95);
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }
  `;
}

