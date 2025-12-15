/**
 * QR Code print template utility
 * Uses unified print template with Cyber Carrot branding
 */

import { printWithTemplate } from '@/lib/exports/print-template';

export interface QRCodePrintOptions {
  entityName: string;
  entityType?: string;
  subtitle?: string;
  qrCodeHtml: string;
  instructions?: string;
}

/**
 * Print QR code using unified template
 *
 * @param {QRCodePrintOptions} options - QR code print options
 * @returns {void} Opens print dialog
 */
export function printQRCode({
  entityName,
  entityType,
  subtitle,
  qrCodeHtml,
  instructions = 'Scan this QR code to access',
}: QRCodePrintOptions): void {
  const qrContent = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; padding: 40px;">
      <div style="text-align: center; padding: 30px; border: 2px solid rgba(41, 231, 205, 0.3); border-radius: 16px; background: rgba(31, 31, 31, 0.5); max-width: 400px;">
        <div style="font-size: 24px; font-weight: bold; margin-bottom: 12px; color: #ffffff;">
          ${entityName}
        </div>
        ${entityType ? `<div style="font-size: 16px; color: rgba(255, 255, 255, 0.7); margin-bottom: 8px;">${entityType}</div>` : ''}
        ${subtitle ? `<div style="font-size: 14px; color: rgba(255, 255, 255, 0.6); margin-bottom: 24px;">${subtitle}</div>` : ''}
        <div style="margin: 24px 0; display: flex; justify-content: center; align-items: center;">
          ${qrCodeHtml}
        </div>
        <div style="font-size: 12px; color: rgba(255, 255, 255, 0.6); margin-top: 24px; max-width: 300px; margin-left: auto; margin-right: auto;">
          ${instructions}
        </div>
      </div>
    </div>
  `;

  printWithTemplate({
    title: `QR Code - ${entityName}`,
    subtitle: entityType || 'QR Code',
    content: qrContent,
  });
}

