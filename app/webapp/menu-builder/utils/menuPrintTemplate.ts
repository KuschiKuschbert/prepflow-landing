/**
 * Client-side menu print template
 *
 * Generates professional print template with PrepFlow logo and background elements
 * Client-side compatible version (uses public URL for logo instead of readFileSync)
 */

/**
 * Generate professional menu print template with PrepFlow branding
 *
 * @param {Object} options - Template options
 * @param {string} options.title - Menu name
 * @param {string} [options.subtitle] - Menu description or "Menu"
 * @param {string} options.content - Menu content HTML
 * @param {number} [options.totalItems] - Total number of menu items
 * @param {string} [options.customMeta] - Custom metadata (e.g., lock date/info)
 * @returns {string} Complete HTML document
 */
export function generateMenuPrintTemplate({
  title,
  subtitle,
  content,
  totalItems,
  customMeta,
}: {
  title: string;
  subtitle?: string;
  content: string;
  totalItems?: number;
  customMeta?: string;
}): string {
  const generatedDate = new Date().toLocaleString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Use public URL for logo (client-side compatible)
  const logoUrl = '/images/prepflow-logo.png';

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
      <img src="${logoUrl}" alt="PrepFlow Logo" class="logo" onerror="this.style.display='none'" />
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
</body>
</html>`;
}


