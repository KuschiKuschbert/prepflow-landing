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
      border-bottom: 2px solid rgba(42, 42, 42, 0.8);
    }

    .logo {
      width: 120px;
      height: auto;
      flex-shrink: 0;
      object-fit: contain;
    }

    .header-content h1 {
      font-size: 32px;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
      background: linear-gradient(135deg, #29E7CD 0%, #D925C7 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .header-content h2 {
      font-size: 18px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.8);
      margin: 4px 0 0 0;
    }

    .header-meta {
      margin-left: auto;
      text-align: right;
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
    }
  `;
}

