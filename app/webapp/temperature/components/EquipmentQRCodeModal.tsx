'use client';

import { Icon } from '@/components/ui/Icon';
import { Copy, Printer, QrCode, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

// Dynamically import QRCode to avoid SSR issues
const QRCode = dynamic(() => import('react-qr-code'), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 w-64 items-center justify-center">
      <div className="animate-pulse rounded-xl bg-[#2a2a2a] p-8">
        <div className="h-64 w-64"></div>
      </div>
    </div>
  ),
});

interface EquipmentQRCodeModalProps {
  equipment: {
    id: string;
    name: string;
    equipment_type: string;
    location: string | null;
    min_temp_celsius?: number | null;
    max_temp_celsius?: number | null;
  };
  isOpen: boolean;
  onClose: () => void;
  temperatureTypes?: Array<{ value: string; label: string; icon: string }>;
}

export function EquipmentQRCodeModal({
  equipment,
  isOpen,
  onClose,
  temperatureTypes = [],
}: EquipmentQRCodeModalProps) {
  const getTypeLabel = (type: string) =>
    temperatureTypes.find(t => t.value === type)?.label || type;
  const [baseUrl, setBaseUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Get base URL from window location
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, [equipment.id]);

  // Focus management and viewport positioning
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;

      // Calculate scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      // Focus the close button when modal opens (after a brief delay for animation)
      const focusTimeout = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 150);

      // Scroll to top of modal if needed
      if (modalRef.current) {
        modalRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      return () => {
        clearTimeout(focusTimeout);
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(equipment.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Use baseUrl if available, otherwise use a placeholder that will update
  const equipmentUrl = baseUrl
    ? `${baseUrl}/webapp/equipment/${equipment.id}`
    : `/webapp/equipment/${equipment.id}`;

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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => {
        // Close modal when clicking backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-code-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md max-h-[95vh] rounded-2xl bg-gradient-to-br from-[#1f1f1f] to-[#2a2a2a] border border-[#2a2a2a] shadow-2xl p-3 desktop:p-4 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient accent */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#29E7CD]/10 via-transparent to-[#D925C7]/10 opacity-50 pointer-events-none" />

        {/* Close button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-[#2a2a2a]/80 hover:bg-[#3a3a3a] backdrop-blur-sm transition-all hover:scale-110 z-10 focus:outline-none focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#1f1f1f]"
          aria-label="Close QR code modal"
        >
          <Icon icon={X} size="sm" className="text-gray-400" />
        </button>

        {/* Header */}
        <div className="mb-3 relative z-10 flex-shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20">
              <Icon icon={QrCode} size="sm" className="text-[#29E7CD]" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 id="qr-code-title" className="text-lg font-bold text-white truncate">{equipment.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-400">{getTypeLabel(equipment.equipment_type)}</span>
                {equipment.location && (
                  <span className="text-xs text-gray-500">• {equipment.location}</span>
                )}
              </div>
            </div>
            <button
              onClick={handleCopyId}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#2a2a2a] hover:bg-[#3a3a3a] text-gray-400 hover:text-[#29E7CD] transition-all text-xs font-medium border border-[#2a2a2a] hover:border-[#29E7CD]/30 flex-shrink-0"
              title="Copy Equipment ID"
            >
              <Icon icon={Copy} size="xs" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Temperature Range */}
          {(equipment.min_temp_celsius !== null || equipment.max_temp_celsius !== null) && (
            <div className="ml-10 px-2 py-1 rounded-lg bg-[#29E7CD]/10 border border-[#29E7CD]/20">
              <span className="text-xs font-semibold text-[#29E7CD]">
                {equipment.min_temp_celsius !== null && equipment.max_temp_celsius !== null
                  ? `${equipment.min_temp_celsius}°C - ${equipment.max_temp_celsius}°C`
                  : equipment.min_temp_celsius !== null
                    ? `≥${equipment.min_temp_celsius}°C`
                    : `≤${equipment.max_temp_celsius}°C`}
              </span>
            </div>
          )}

          {/* Permanent Link Note */}
          <div className="ml-10 mt-1.5 px-2 py-1 rounded-lg bg-[#2a2a2a]/50 border border-[#29E7CD]/20">
            <p className="text-xs text-gray-400 leading-relaxed">
              <span className="text-[#29E7CD] font-semibold">Permanently linked</span> — This QR code is like a well-seasoned pan: it'll stick around even if you rename the equipment. No reprinting needed!
            </p>
          </div>
        </div>

        {/* QR Code Display */}
        <div ref={printRef} className="flex flex-col items-center mb-2 relative z-10 flex-1 min-h-0 justify-center">
          {baseUrl ? (
            <>
              {/* Modern QR Code Container */}
              <div className="relative mb-2">
                {/* Outer glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 blur-lg opacity-50 -z-10" />

                {/* Frame wrapper with gradient border */}
                <div className="relative p-0.5 rounded-xl bg-gradient-to-br from-[#29E7CD] via-[#29E7CD]/70 to-[#D925C7] shadow-lg">
                  {/* Inner frame border */}
                  <div className="relative p-0.5 rounded-xl bg-gradient-to-br from-[#D925C7]/50 to-[#29E7CD]/50">
                    {/* QR Code container */}
                    <div className="qr-code-svg relative p-3 bg-white rounded-xl shadow-2xl">
                      {/* Decorative corner accents */}
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#29E7CD] rounded-tl-xl opacity-50" />
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#D925C7] rounded-tr-xl opacity-50" />
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#29E7CD] rounded-bl-xl opacity-50" />
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#D925C7] rounded-br-xl opacity-50" />

                      {/* QR Code */}
                      <div className="flex items-center justify-center relative z-10">
                        <QRCode
                          value={equipmentUrl}
                          size={180}
                          level="H"
                          fgColor="#000000"
                          bgColor="#FFFFFF"
                        />
                      </div>

                      {/* Inner shadow for depth */}
                      <div className="absolute inset-0 rounded-xl shadow-inner pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Info */}
              <div className="mt-2 text-center max-w-xs">
                <p className="text-xs text-gray-400 leading-relaxed">
                  Scan with your phone camera to log temperature readings
                </p>
                <p className="text-xs text-gray-500 mt-1 italic">
                  No app needed — just point and shoot, chef!
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 p-4">
              <div className="animate-pulse rounded-xl bg-[#2a2a2a] p-6 shadow-xl">
                <div className="h-40 w-40 rounded-lg bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20"></div>
              </div>
              <p className="text-xs text-gray-400 text-center font-medium">
                Generating QR code...
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 relative z-10 flex-shrink-0">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white text-xs font-semibold hover:shadow-lg hover:shadow-[#29E7CD]/30 transition-all hover:scale-105"
          >
            <Icon icon={Printer} size="sm" />
            Print
          </button>
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-lg bg-[#2a2a2a] text-white text-xs font-medium hover:bg-[#3a3a3a] transition-all border border-[#2a2a2a] hover:border-[#29E7CD]/30"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
