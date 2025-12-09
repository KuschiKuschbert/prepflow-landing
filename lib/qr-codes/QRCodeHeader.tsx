'use client';

import { Icon } from '@/components/ui/Icon';
import { Copy, LucideIcon, QrCode } from 'lucide-react';

export interface QRCodeHeaderProps {
  /** Entity name to display */
  name: string;
  /** Entity type label */
  typeLabel: string;
  /** Optional subtitle (location, category, etc.) */
  subtitle?: string | null;
  /** Whether the ID was copied */
  copied: boolean;
  /** Copy ID handler */
  onCopyId: () => void;
  /** Custom icon to display (defaults to QrCode) */
  icon?: LucideIcon;
  /** Additional metadata badge content */
  metadataBadge?: React.ReactNode;
  /** Optional description explaining permanence */
  permanentLinkNote?: string;
}

export function QRCodeHeader({
  name,
  typeLabel,
  subtitle,
  copied,
  onCopyId,
  icon = QrCode,
  metadataBadge,
  permanentLinkNote = "This QR code is permanently linked — it'll stay valid even if you rename this item. No reprinting needed!",
}: QRCodeHeaderProps) {
  return (
    <div className="relative z-10 mb-3 flex-shrink-0">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20">
          <Icon icon={icon} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 id="qr-code-title" className="truncate text-lg font-bold text-white">
            {name}
          </h2>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="text-xs text-gray-400">{typeLabel}</span>
            {subtitle && <span className="text-xs text-gray-500">• {subtitle}</span>}
          </div>
        </div>
        <button
          onClick={onCopyId}
          className="flex flex-shrink-0 items-center gap-1 rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] px-2 py-1 text-xs font-medium text-gray-400 transition-all hover:border-[#29E7CD]/30 hover:bg-[#3a3a3a] hover:text-[#29E7CD]"
          title="Copy ID"
        >
          <Icon icon={Copy} size="xs" aria-hidden={true} />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Optional Metadata Badge */}
      {metadataBadge && (
        <div className="ml-10 rounded-lg border border-[#29E7CD]/20 bg-[#29E7CD]/10 px-2 py-1">
          {metadataBadge}
        </div>
      )}

      {/* Permanent Link Note */}
      {permanentLinkNote && (
        <div className="mt-1.5 ml-10 rounded-lg border border-[#29E7CD]/20 bg-[#2a2a2a]/50 px-2 py-1">
          <p className="text-xs leading-relaxed text-gray-400">
            <span className="font-semibold text-[#29E7CD]">Permanently linked</span> —{' '}
            {permanentLinkNote}
          </p>
        </div>
      )}
    </div>
  );
}
