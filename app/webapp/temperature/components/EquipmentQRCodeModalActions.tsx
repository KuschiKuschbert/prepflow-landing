'use client';

import { Icon } from '@/components/ui/Icon';
import { Printer } from 'lucide-react';
import { RefObject } from 'react';

interface EquipmentQRCodeModalActionsProps {
  printRef: RefObject<HTMLDivElement | null>;
  equipment: {
    name: string;
    equipment_type: string;
    location: string | null;
  };
  onClose: () => void;
}

export function EquipmentQRCodeModalActions({
  printRef,
  equipment,
  onClose,
}: EquipmentQRCodeModalActionsProps) {
  const handlePrint = () => {
    if (!printRef.current) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - ${equipment.name}</title>
          <style>
            @media print {
              @page {
                margin: 20mm;
                size: A4;
              }
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              padding: 40px;
              margin: 0;
            }
            .qr-container {
              text-align: center;
              padding: 20px;
              border: 2px solid #000;
              border-radius: 8px;
              background: white;
            }
            .qr-code {
              margin: 20px 0;
            }
            .equipment-name {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
              color: #000;
            }
            .equipment-type {
              font-size: 16px;
              color: #666;
              margin-bottom: 10px;
            }
            .equipment-location {
              font-size: 14px;
              color: #888;
              margin-bottom: 20px;
            }
            .instructions {
              font-size: 12px;
              color: #666;
              margin-top: 20px;
              max-width: 300px;
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <div class="equipment-name">${equipment.name}</div>
            ${equipment.equipment_type ? `<div class="equipment-type">${equipment.equipment_type}</div>` : ''}
            ${equipment.location ? `<div class="equipment-location">Location: ${equipment.location}</div>` : ''}
            <div class="qr-code">
              ${printRef.current.querySelector('.qr-code-svg')?.outerHTML || ''}
            </div>
            <div class="instructions">
              Scan this QR code to view equipment details and log temperature readings
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();

    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div className="relative z-10 flex flex-shrink-0 gap-2">
      <button
        onClick={handlePrint}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-3 py-2 text-xs font-semibold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#29E7CD]/30"
      >
        <Icon icon={Printer} size="sm" />
        Print
      </button>
      <button
        onClick={onClose}
        className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] px-3 py-2 text-xs font-medium text-white transition-all hover:border-[#29E7CD]/30 hover:bg-[#3a3a3a]"
      >
        Close
      </button>
    </div>
  );
}
