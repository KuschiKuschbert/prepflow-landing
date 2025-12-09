'use client';

import { Icon } from '@/components/ui/Icon';
import { Printer } from 'lucide-react';
import { RefObject } from 'react';
import { printQRCode } from '@/lib/qr-codes/qr-print-template';

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

    const qrCodeElement = printRef.current.querySelector('.qr-code-svg');
    if (!qrCodeElement) return;

    const qrCodeHtml = qrCodeElement.outerHTML;
    const locationText = equipment.location ? `Location: ${equipment.location}` : undefined;

    // Use unified print template with Cyber Carrot branding
    printQRCode({
      entityName: equipment.name,
      entityType: equipment.equipment_type,
      subtitle: locationText,
      qrCodeHtml,
      instructions: 'Scan this QR code to view equipment details and log temperature readings',
    });
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
