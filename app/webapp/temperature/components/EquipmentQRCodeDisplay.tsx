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
    <div
      ref={printRef}
      className="relative z-10 mb-2 flex min-h-0 flex-1 flex-col items-center justify-center"
    >
      {baseUrl ? (
        <>
          {/* Modern QR Code Container */}
          <div className="relative mb-2">
            {/* Outer glow effect */}
            <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 opacity-50 blur-lg" />

            {/* Frame wrapper with gradient border */}
            <div className="relative rounded-xl bg-gradient-to-br from-[#29E7CD] via-[#29E7CD]/70 to-[#D925C7] p-0.5 shadow-lg">
              {/* Inner frame border */}
              <div className="relative rounded-xl bg-gradient-to-br from-[#D925C7]/50 to-[#29E7CD]/50 p-0.5">
                {/* QR Code container */}
                <div className="qr-code-svg relative rounded-xl bg-white p-3 shadow-2xl">
                  {/* Decorative corner accents */}
                  <div className="absolute top-0 left-0 h-8 w-8 rounded-tl-xl border-t-2 border-l-2 border-[#29E7CD] opacity-50" />
                  <div className="absolute top-0 right-0 h-8 w-8 rounded-tr-xl border-t-2 border-r-2 border-[#D925C7] opacity-50" />
                  <div className="absolute bottom-0 left-0 h-8 w-8 rounded-bl-xl border-b-2 border-l-2 border-[#29E7CD] opacity-50" />
                  <div className="absolute right-0 bottom-0 h-8 w-8 rounded-br-xl border-r-2 border-b-2 border-[#D925C7] opacity-50" />

                  {/* QR Code */}
                  <div className="relative z-10 flex items-center justify-center">
                    <QRCode
                      value={equipmentUrl}
                      size={180}
                      level="H"
                      fgColor="#000000"
                      bgColor="#FFFFFF"
                    />
                  </div>

                  {/* Inner shadow for depth */}
                  <div className="pointer-events-none absolute inset-0 rounded-xl shadow-inner" />
                </div>
              </div>
            </div>
          </div>

          {/* Important Info */}
          <div className="mt-2 max-w-xs text-center">
            <p className="text-xs leading-relaxed text-gray-400">
              Scan with your phone camera to log temperature readings
            </p>
            <p className="mt-1 text-xs text-gray-500 italic">
              No app needed — just point and shoot, chef!
            </p>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 p-4">
          <div className="animate-pulse rounded-xl bg-[#2a2a2a] p-6 shadow-xl">
            <div className="h-40 w-40 rounded-lg bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20"></div>
          </div>
          <p className="text-center text-xs font-medium text-gray-400">Generating QR code...</p>
        </div>
      )}
    </div>
  );
}
