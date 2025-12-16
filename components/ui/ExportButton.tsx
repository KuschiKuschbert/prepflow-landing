'use client';

/**
 * Standardized export button component with dropdown
 * Supports CSV, PDF, HTML export formats
 * Uses Cyber Carrot styling and PrepFlow voice
 */

import { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';
import { Download, FileText, FileSpreadsheet, FileCode, ChevronDown, Loader2 } from 'lucide-react';

export type ExportFormat = 'csv' | 'pdf' | 'html';

export interface ExportButtonProps {
  onExport: (format: ExportFormat) => void | Promise<void>;
  loading?: ExportFormat | null;
  disabled?: boolean;
  label?: string;
  className?: string;
  availableFormats?: ExportFormat[];
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export function ExportButton({
  onExport,
  loading = null,
  disabled = false,
  label = 'Export',
  className = '',
  availableFormats = ['csv', 'pdf', 'html'],
  variant = 'primary',
  size = 'md',
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const formatLabels: Record<ExportFormat, string> = {
    csv: 'CSV',
    pdf: 'PDF',
    html: 'HTML',
  };

  const formatIcons: Record<ExportFormat, typeof FileText> = {
    csv: FileSpreadsheet,
    pdf: FileText,
    html: FileCode,
  };

  const handleExport = async (format: ExportFormat) => {
    await onExport(format);
    setIsOpen(false);
  };

  const baseClasses =
    'flex items-center gap-2 rounded-lg font-medium text-[var(--foreground)] transition-all duration-200';
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  const variantClasses = {
    primary:
      'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] hover:from-[var(--primary)]/80 hover:to-[var(--accent)]/80 hover:shadow-lg hover:shadow-[var(--primary)]/30 text-[var(--button-active-text)]',
    secondary: 'bg-[var(--muted)] border border-[var(--border)] hover:border-[var(--primary)]/30 hover:bg-[var(--surface-variant)]',
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className} ${
          disabled ? 'cursor-not-allowed opacity-50' : ''
        }`}
        aria-label={label}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Icon icon={Download} size="sm" aria-hidden={true} />
        <span className="tablet:inline hidden">{label}</span>
        <Icon
          icon={ChevronDown}
          size="sm"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden={true}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-lg">
          <div className="py-1">
            {availableFormats.map(format => {
              const IconComponent = formatIcons[format];
              const isLoading = loading === format;
              return (
                <button
                  key={format}
                  onClick={() => handleExport(format)}
                  disabled={isLoading || disabled}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--muted)] disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={`Export as ${formatLabels[format]}`}
                >
                  {isLoading ? (
                    <Icon
                      icon={Loader2}
                      size="sm"
                      className="animate-spin text-[var(--primary)]"
                      aria-hidden={true}
                    />
                  ) : (
                    <Icon
                      icon={IconComponent}
                      size="sm"
                      className="text-[var(--foreground-muted)]"
                      aria-hidden={true}
                    />
                  )}
                  <span>{isLoading ? 'Exporting...' : formatLabels[format]}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
