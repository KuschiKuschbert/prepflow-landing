/**
 * Shared PDF/HTML Export Template Utility
 * Provides consistent professional formatting for all PrepFlow exports
 * Client-safe: Uses public URLs instead of filesystem access
 */

export interface ExportTemplateOptions {
  title: string;
  subtitle?: string;
  content: string;
  forPDF?: boolean;
  totalItems?: number;
  customMeta?: string;
}

/**
 * Get PrepFlow logo URL or inline SVG
 * Client-safe: Uses public URL or inline SVG fallback (no filesystem access)
 */
function getLogoUrl(): string {
  // Use public URL for logo (works in both client and server contexts)
  // For HTML exports, this will work as a relative URL
  // For PDF exports via API, the server can handle the logo separately if needed
  return '/images/prepflow-logo.png';
}

/**
 * Get inline SVG logo as base64 data URI (fallback)
 * Used when public URL is not available (e.g., in standalone HTML files)
 * Client-safe: Uses browser APIs only
 */
function getInlineSVGLogo(): string {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" width="200" height="80"><defs><linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#29E7CD;stop-opacity:0.9" /><stop offset="100%" style="stop-color:#29E7CD;stop-opacity:0.6" /></linearGradient><linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#3B82F6;stop-opacity:0.8" /><stop offset="100%" style="stop-color:#3B82F6;stop-opacity:0.5" /></linearGradient><linearGradient id="magentaGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#D925C7;stop-opacity:0.9" /><stop offset="100%" style="stop-color:#D925C7;stop-opacity:0.6" /></linearGradient><pattern id="wavePattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M0,10 Q5,5 10,10 T20,10" stroke="rgba(255,255,255,0.3)" stroke-width="1" fill="none"/></pattern></defs><ellipse cx="30" cy="25" rx="18" ry="15" fill="url(#cyanGradient)" opacity="0.85"/><rect x="20" y="20" width="35" height="25" rx="8" fill="url(#blueGradient)" opacity="0.75"/><rect x="20" y="20" width="35" height="25" rx="8" fill="url(#wavePattern)" opacity="0.4"/><rect x="25" y="30" width="30" height="20" rx="6" fill="url(#magentaGradient)" opacity="0.8" transform="rotate(-15 40 40)"/><g opacity="0.7"><path d="M 55 20 Q 65 15 75 18" stroke="#D925C7" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="75" cy="18" r="2" fill="#D925C7"/><path d="M 58 25 Q 68 20 78 23" stroke="#D925C7" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="78" cy="23" r="2" fill="#D925C7"/><path d="M 60 30 Q 70 25 80 28" stroke="#D925C7" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="80" cy="28" r="2" fill="#D925C7"/></g><circle cx="15" cy="50" r="6" fill="#29E7CD" opacity="0.8"/><circle cx="20" cy="58" r="4" fill="#D925C7" opacity="0.8"/><circle cx="75" cy="45" r="7" fill="#29E7CD" opacity="0.7"/><text x="100" y="45" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="600" fill="white" letter-spacing="-0.5"><tspan font-weight="700">P</tspan>rep<tspan font-weight="700">F</tspan>low</text></svg>`;

  // Convert SVG to base64 data URI (client-safe, works in browser)
  // Use btoa which is available in all browsers
  try {
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgContent)));
  } catch {
    // Fallback: return SVG as data URI without base64 encoding
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);
  }
}

/**
 * Generate professional PDF/HTML export template with PrepFlow branding
 *
 * @param {ExportTemplateOptions} options - Template options
 * @returns {string} Complete HTML document
 */
export function generateExportTemplate({
  title,
  subtitle,
  content,
  forPDF = false,
  totalItems,
  customMeta,
}: ExportTemplateOptions): string {
  // Use public URL for logo (works in browser context)
  // For standalone HTML files, use inline SVG as fallback
  const logoUrl = forPDF ? getInlineSVGLogo() : getLogoUrl();
  const generatedDate = new Date().toLocaleString();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PrepFlow - ${title}</title>
  <style>
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

    /* Background Elements */
    .background-grid {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      background-image:
        linear-gradient(rgba(41,231,205,0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(59,130,246,0.06) 1px, transparent 1px);
      background-size: 48px 48px;
      background-position: 0px 0px, 0px 0px;
      opacity: 0.6;
    }

    .corner-glow-cyan {
      position: fixed;
      left: 0;
      top: 0;
      width: 420px;
      height: 420px;
      pointer-events: none;
      z-index: 0;
      background: radial-gradient(closest-side, rgba(41,231,205,0.18), transparent 70%);
      opacity: 0.5;
    }

    .corner-glow-magenta {
      position: fixed;
      right: 0;
      top: 120px;
      width: 400px;
      height: 400px;
      pointer-events: none;
      z-index: 0;
      background: radial-gradient(closest-side, rgba(217,37,199,0.16), transparent 70%);
      opacity: 0.5;
    }

    .concentric-circles {
      position: fixed;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 400px;
      height: 400px;
      pointer-events: none;
      z-index: 0;
      opacity: 0.3;
    }

    .circle {
      position: absolute;
      border-radius: 50%;
      border: 1.5px solid rgba(41, 231, 205, 0.08);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .circle-1 { width: 80px; height: 80px; }
    .circle-2 { width: 130px; height: 130px; border-color: rgba(41, 231, 205, 0.06); }
    .circle-3 { width: 180px; height: 180px; border-color: rgba(41, 231, 205, 0.05); }
    .circle-4 { width: 230px; height: 230px; border-color: rgba(41, 231, 205, 0.04); }

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

    /* Content Area */
    .export-content {
      margin-top: 32px;
    }

    /* Footer */
    .footer {
      margin-top: 40px;
      padding-top: 24px;
      border-top: 2px solid rgba(42, 42, 42, 0.8);
      text-align: center;
      color: rgba(255, 255, 255, 0.5);
      font-size: 12px;
    }

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
  </style>
</head>
<body>
  <!-- Background Elements -->
  <div class="background-grid"></div>
  <div class="corner-glow-cyan"></div>
  <div class="corner-glow-magenta"></div>
  <div class="concentric-circles">
    <div class="circle circle-1"></div>
    <div class="circle circle-2"></div>
    <div class="circle circle-3"></div>
    <div class="circle circle-4"></div>
  </div>

  <!-- Content -->
  <div class="content-wrapper">
    <!-- Header -->
    <header class="header">
      <img src="${logoUrl}" alt="PrepFlow Logo" class="logo" />
      <div class="header-content">
        <h1>PrepFlow</h1>
        <h2>${subtitle || title}</h2>
      </div>
      <div class="header-meta">
        <div>Generated: ${generatedDate}</div>
        ${totalItems !== undefined ? `<div style="margin-top: 4px;">Total Items: ${totalItems}</div>` : ''}
        ${customMeta ? `<div style="margin-top: 4px;">${customMeta}</div>` : ''}
      </div>
    </header>

    <!-- Content -->
    <div class="export-content">
      ${content}
    </div>

    <!-- Footer -->
    <footer class="footer">
      <p>Generated by PrepFlow - Kitchen Management Platform</p>
      <p style="margin-top: 4px;">www.prepflow.org</p>
    </footer>
  </div>

  ${forPDF ? '<script>window.onload = function() { window.print(); }</script>' : ''}
</body>
</html>`;
}

/**
 * Escape HTML special characters
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}
