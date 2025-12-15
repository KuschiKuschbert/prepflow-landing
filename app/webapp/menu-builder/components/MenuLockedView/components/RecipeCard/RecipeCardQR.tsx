/**
 * Recipe Card QR Code Section Component
 */
'use client';

import { QRCodeSVG } from 'qrcode.react';

interface RecipeCardQRProps {
  recipeUrl: string;
}

export function RecipeCardQR({ recipeUrl }: RecipeCardQRProps) {
  return (
    <div className="mt-4 flex items-center justify-between rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] p-3">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-white p-2">
          <QRCodeSVG value={recipeUrl} size={64} level="M" bgColor="#FFFFFF" fgColor="#000000" />
        </div>
        <div>
          <p className="text-xs font-medium text-white">📱 Scan for Instructions</p>
          <p className="text-[10px] text-gray-500">Access this recipe on any device</p>
        </div>
      </div>
      <a
        href={recipeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg bg-[#29E7CD]/20 px-3 py-1.5 text-xs font-medium text-[#29E7CD] hover:bg-[#29E7CD]/30"
        onClick={e => e.stopPropagation()}
      >
        Open Recipe
      </a>
    </div>
  );
}
