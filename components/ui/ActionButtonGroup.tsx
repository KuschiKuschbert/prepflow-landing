'use client';

/**
 * Unified action button group component
 * Groups related action buttons (Print, Export, Share, Copy, etc.)
 * Responsive: mobile shows dropdown, desktop shows button group
 * Uses Cyber Carrot styling and PrepFlow voice
 */

import { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';
import { MoreVertical, Printer, Download, Share2, Copy, Upload, X } from 'lucide-react';
import { logger } from '@/lib/logger';
import { PrintButton } from './PrintButton';
import { ExportButton, type ExportFormat } from './ExportButton';
import { ShareButton, type ShareMethod } from './ShareButton';
import { ImportButton } from './ImportButton';
import { CopyButton } from './CopyButton';

export interface ActionButtonGroupProps {
  // Print
  onPrint?: () => void;
  printLoading?: boolean;

  // Export
  onExport?: (format: ExportFormat) => void | Promise<void>;
  exportLoading?: ExportFormat | null;
  availableExportFormats?: ExportFormat[];

  // Share
  shareTitle?: string;
  shareUrl?: string;
  shareText?: string;
  onEmailShare?: (email: string, subject: string, body: string) => void;
  onPDFShare?: () => void;
  shareLoading?: ShareMethod | null;
  availableShareMethods?: ShareMethod[];

  // Copy
  copyText?: string;
  copyLabel?: string;

  // Import
  onImport?: () => void;
  importLoading?: boolean;

  // Common
  className?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export function ActionButtonGroup({
  onPrint,
  printLoading = false,
  onExport,
  exportLoading = null,
  availableExportFormats = ['csv', 'pdf', 'html'],
  shareTitle,
  shareUrl,
  shareText,
  onEmailShare,
  onPDFShare,
  shareLoading = null,
  availableShareMethods = ['link', 'email', 'pdf', 'web'],
  copyText,
  copyLabel = 'Copy',
  onImport,
  importLoading = false,
  className = '',
  variant = 'primary',
  size = 'md',
}: ActionButtonGroupProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobileMenuOpen]);

  const hasActions = !!(onPrint || onExport || shareTitle || copyText || onImport);
  if (!hasActions) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Desktop: Show all buttons */}
      <div className="desktop:flex hidden items-center gap-2">
        {onPrint && (
          <PrintButton onClick={onPrint} loading={printLoading} variant={variant} size={size} />
        )}
        {onExport && (
          <ExportButton
            onExport={onExport}
            loading={exportLoading}
            availableFormats={availableExportFormats}
            variant={variant}
            size={size}
          />
        )}
        {shareTitle && (
          <ShareButton
            title={shareTitle}
            shareUrl={shareUrl}
            shareText={shareText}
            onEmailShare={onEmailShare}
            onPDFShare={onPDFShare}
            loading={shareLoading}
            availableMethods={availableShareMethods}
            variant={variant}
            size={size}
          />
        )}
        {copyText && <CopyButton text={copyText} label={copyLabel} variant={variant} size={size} />}
        {onImport && (
          <ImportButton onClick={onImport} loading={importLoading} variant={variant} size={size} />
        )}
      </div>

      {/* Mobile: Show dropdown menu */}
      <div className="desktop:hidden relative" ref={menuRef}>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[var(--primary)]/30 hover:bg-[var(--surface-variant)]"
          aria-label="More actions"
          aria-expanded={isMobileMenuOpen}
        >
          <Icon icon={MoreVertical} size="sm" aria-hidden={true} />
        </button>

        {isMobileMenuOpen && (
          <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-lg">
            <div className="py-1">
              {onPrint && (
                <button
                  onClick={() => {
                    onPrint();
                    setIsMobileMenuOpen(false);
                  }}
                  disabled={printLoading}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--muted)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Icon icon={Printer} size="sm" className="text-[var(--foreground-muted)]" aria-hidden={true} />
                  <span>{printLoading ? 'Printing...' : 'Print'}</span>
                </button>
              )}

              {onExport && (
                <div className="border-t border-[var(--border)]">
                  {availableExportFormats.map(format => (
                    <button
                      key={format}
                      onClick={async () => {
                        try {
                          await onExport(format);
                          setIsMobileMenuOpen(false);
                        } catch (error) {
                          logger.error('[ActionButtonGroup] Error exporting:', {
                            error: error instanceof Error ? error.message : String(error),
                            format,
                          });
                          // Error is handled by onExport callback
                        }
                      }}
                      disabled={exportLoading === format}
                      className="flex w-full items-center gap-3 px-4 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--muted)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Icon
                        icon={Download}
                        size="sm"
                        className="text-[var(--foreground-muted)]"
                        aria-hidden={true}
                      />
                      <span>
                        {exportLoading === format
                          ? 'Exporting...'
                          : `Export ${format.toUpperCase()}`}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {shareTitle && (
                <button
                  onClick={() => {
                    // Trigger share - would open share modal
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
                >
                  <Icon icon={Share2} size="sm" className="text-[var(--foreground-muted)]" aria-hidden={true} />
                  <span>Share</span>
                </button>
              )}

              {copyText && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(copyText);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
                >
                  <Icon icon={Copy} size="sm" className="text-[var(--foreground-muted)]" aria-hidden={true} />
                  <span>{copyLabel}</span>
                </button>
              )}

              {onImport && (
                <button
                  onClick={() => {
                    onImport();
                    setIsMobileMenuOpen(false);
                  }}
                  disabled={importLoading}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--muted)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Icon icon={Upload} size="sm" className="text-[var(--foreground-muted)]" aria-hidden={true} />
                  <span>{importLoading ? 'Importing...' : 'Import CSV'}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
