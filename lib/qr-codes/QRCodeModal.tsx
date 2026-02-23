'use client';

import { Icon } from '@/lib/ui/Icon';
import { logger } from '@/lib/logger';
import { LucideIcon, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { QRCodeActions } from './QRCodeActions';
import { QRCodeDisplay } from './QRCodeDisplay';
import { QRCodeHeader } from './QRCodeHeader';
import { useQRCodeModal } from './useQRCodeModal';

export interface QRCodeModalEntity {
  id: string;
  name: string;
}

export interface QRCodeModalProps<T extends QRCodeModalEntity> {
  entity: T;
  isOpen: boolean;
  onClose: () => void;
  entityTypeLabel: string;
  urlPattern: string;
  icon?: LucideIcon;
  getSubtitle?: (entity: T) => string | null;
  getTypeLabel?: (entity: T) => string;
  instructions?: string;
  hint?: string;
  printInstructions?: string;
  permanentLinkNote?: string;
  metadataBadge?: React.ReactNode;
}

export function QRCodeModal<T extends QRCodeModalEntity>({
  entity,
  isOpen,
  onClose,
  entityTypeLabel,
  urlPattern,
  icon,
  getSubtitle,
  getTypeLabel,
  instructions,
  hint,
  printInstructions,
  permanentLinkNote,
  metadataBadge,
}: QRCodeModalProps<T>) {
  const [baseUrl, setBaseUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, [entity.id]);

  useQRCodeModal({
    isOpen,
    onClose,
    modalRef,
    closeButtonRef,
  });

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(entity.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      logger.error('Failed to copy:', error);
    }
  };

  if (!isOpen) return null;

  const entityUrl = baseUrl
    ? `${baseUrl}${urlPattern.replace('{id}', entity.id)}`
    : urlPattern.replace('{id}', entity.id);
  const typeLabel = getTypeLabel ? getTypeLabel(entity) : entityTypeLabel;
  const subtitle = getSubtitle ? getSubtitle(entity) : null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={e => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-code-title"
    >
      <div className="tablet:p-4 desktop:max-w-lg relative max-h-[95vh] w-full max-w-md rounded-2xl bg-gradient-to-r from-[#29E7CD]/20 via-[#D925C7]/20 via-[#FF6B00]/20 to-[#29E7CD]/20 p-[1px] shadow-2xl">
        <div
          ref={modalRef}
          className="flex max-h-[95vh] w-full flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-[#1f1f1f]/95 to-[#2a2a2a]/95 p-3"
          onClick={e => e.stopPropagation()}
        >
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-[#29E7CD]/10 via-transparent to-[#D925C7]/10 opacity-50" />

          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="absolute top-3 right-3 z-10 rounded-full bg-[#2a2a2a]/80 p-1.5 backdrop-blur-sm transition-all hover:scale-110 hover:bg-[#3a3a3a] focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-[#1f1f1f] focus:outline-none"
            aria-label="Close QR code modal"
          >
            <Icon icon={X} size="sm" className="text-gray-400" />
          </button>

          <QRCodeHeader
            name={entity.name}
            typeLabel={typeLabel}
            subtitle={subtitle}
            copied={copied}
            onCopyId={handleCopyId}
            icon={icon}
            metadataBadge={metadataBadge}
            permanentLinkNote={permanentLinkNote}
          />

          <QRCodeDisplay
            value={entityUrl}
            isReady={!!baseUrl}
            printRef={printRef}
            instructions={instructions}
            hint={hint}
          />

          <QRCodeActions
            printRef={printRef}
            entityName={entity.name}
            entityType={typeLabel}
            subtitle={subtitle}
            printInstructions={printInstructions}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}
