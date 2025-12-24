import type { QRCodeEntity } from '../types';
import { typeConfig } from '../config';

/**
 * Generate HTML for printing QR codes
 */
export function generatePrintHTML(entitiesToPrint: QRCodeEntity[]): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>PrepFlow QR Codes</title>
        <style>
          @page { size: A4; margin: 8mm; }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: white;
            color: black;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .header {
            text-align: center;
            padding: 15px 0;
            margin-bottom: 15px;
            border-bottom: 3px solid #29E7CD;
          }
          .header h1 { font-size: 22px; margin-bottom: 4px; }
          .header p { font-size: 11px; color: #666; }
          .grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            padding: 5px;
          }
          .qr-card {
            border: 1.5px solid #ddd;
            border-radius: 8px;
            padding: 10px 8px;
            text-align: center;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .qr-code {
            width: 70px;
            height: 70px;
            margin: 0 auto 6px;
          }
          .qr-code canvas { width: 100% !important; height: 100% !important; }
          .name {
            font-size: 9px;
            font-weight: 600;
            margin-bottom: 2px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 100%;
          }
          .type {
            font-size: 7px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          .scan-text {
            font-size: 6px;
            color: #999;
            margin-top: 4px;
          }
          @media print {
            .no-print { display: none !important; }
            body { -webkit-print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📱 PrepFlow QR Codes</h1>
          <p>Scan with any phone camera to access • ${entitiesToPrint.length} codes</p>
        </div>
        <div class="grid">
          ${entitiesToPrint
            .map((item, idx) => {
              const config = typeConfig[item.type] || { label: item.type };
              const itemName = item.name || 'Item';
              return `
              <div class="qr-card">
                <div class="qr-code" id="qr-${idx}"></div>
                <div class="name" title="${itemName}">${itemName}</div>
                <div class="type">${config.label}</div>
                <div class="scan-text">Scan to view</div>
              </div>
            `;
            })
            .join('')}
        </div>
        <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
        <script>
          const urls = ${JSON.stringify(entitiesToPrint.map(e => e.destinationUrl))};
          let loaded = 0;
          urls.forEach((url, idx) => {
            QRCode.toCanvas(document.createElement('canvas'), url, { width: 70, margin: 0 }, function(err, canvas) {
              if (!err) {
                const container = document.getElementById('qr-' + idx);
                if (container) {
                  container.innerHTML = '';
                  container.appendChild(canvas);
                }
              }
              loaded++;
              if (loaded === urls.length) {
                setTimeout(() => window.print(), 300);
              }
            });
          });
        </script>
      </body>
    </html>
  `;
}
