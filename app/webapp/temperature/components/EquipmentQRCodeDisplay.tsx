'use client';

import dynamic from 'next/dynamic';
import { RefObject } from 'react';

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

interface EquipmentQRCodeDisplayProps {
  equipmentUrl: string;
  baseUrl: string;
  printRef: RefObject<HTMLDivElement | null>;
}

export function EquipmentQRCodeDisplay({
  equipmentUrl,
  baseUrl,
  printRef,
}: EquipmentQRCodeDisplayProps) {
  return (
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
          <p className="text-xs text-gray-400 text-center font-medium">Generating QR code...</p>
        </div>
      )}
    </div>
  );
}
