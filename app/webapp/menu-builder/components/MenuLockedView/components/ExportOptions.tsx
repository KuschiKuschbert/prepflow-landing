'use client';

import { Icon } from '@/components/ui/Icon';
import { logger } from '@/lib/logger';
import { Download, FileDown, FileSpreadsheet, FileText } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Version identifier for cache-busting verification
// Increment this version to force browser cache refresh
const EXPORT_OPTIONS_VERSION = '2.0.1-dropdown-cache-bust';

export type ExportContentType =
  | 'menu'
  | 'matrix'
  | 'recipe-cards'
  | 'all'
  | 'menu-matrix'
  | 'menu-recipes'
  | 'matrix-recipes';

export type ExportFormat = 'pdf' | 'html' | 'csv';

interface ExportOptionsProps {
  handleExport: (contentType: ExportContentType, format: ExportFormat) => void;
  exportLoading: string | null;
}

const CONTENT_OPTIONS: Array<{ value: ExportContentType; label: string }> = [
  { value: 'menu', label: 'Menu Display' },
  { value: 'matrix', label: 'Allergen Matrix' },
  { value: 'recipe-cards', label: 'Recipe Cards' },
  { value: 'menu-matrix', label: 'Menu + Matrix' },
  { value: 'menu-recipes', label: 'Menu + Recipe Cards' },
  { value: 'matrix-recipes', label: 'Matrix + Recipe Cards' },
  { value: 'all', label: 'All (Menu + Matrix + Recipe Cards)' },
];

export function ExportOptions({ handleExport, exportLoading }: ExportOptionsProps) {
  // Log version on mount to verify new code is running
  useEffect(() => {
    logger.dev('[ExportOptions] Component version:', { version: EXPORT_OPTIONS_VERSION });
    logger.dev('[ExportOptions] NEW VERSION LOADED:', { version: EXPORT_OPTIONS_VERSION });
    logger.dev('[ExportOptions] CACHE BUST - Version 2.0.0-dropdown is running!');
    // Also log to window for easy debugging
    if (typeof window !== 'undefined') {
      (window as unknown as { __EXPORT_OPTIONS_VERSION__: string }).__EXPORT_OPTIONS_VERSION__ =
        EXPORT_OPTIONS_VERSION;
    }
  }, []);

  const [selectedContent, setSelectedContent] = useState<ExportContentType | null>(null);
  const [showContentDropdown, setShowContentDropdown] = useState(false);
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);
  const contentDropdownRef = useRef<HTMLDivElement>(null);
  const formatDropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isAnyExporting = exportLoading !== null;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        contentDropdownRef.current &&
        !contentDropdownRef.current.contains(event.target as Node) &&
        formatDropdownRef.current &&
        !formatDropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowContentDropdown(false);
        setShowFormatDropdown(false);
        setSelectedContent(null);
      }
    };

    if (showContentDropdown || showFormatDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }
  }, [showContentDropdown, showFormatDropdown]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowContentDropdown(false);
        setShowFormatDropdown(false);
        setSelectedContent(null);
      }
    };

    if (showContentDropdown || showFormatDropdown) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showContentDropdown, showFormatDropdown]);

  const handleContentSelect = (contentType: ExportContentType) => {
    setSelectedContent(contentType);
    setShowContentDropdown(false);
    setShowFormatDropdown(true);
  };

  const handleFormatClick = (format: ExportFormat) => {
    if (selectedContent) {
      handleExport(selectedContent, format);
      setShowFormatDropdown(false);
      setSelectedContent(null);
    }
  };

  const getLoadingKey = (contentType: ExportContentType, format: ExportFormat): string => {
    return `${contentType}-${format}`;
  };

  const isExporting = (contentType: ExportContentType, format: ExportFormat): boolean => {
    return exportLoading === getLoadingKey(contentType, format);
  };

  return (
    <div className="relative" data-export-version={EXPORT_OPTIONS_VERSION}>
      {/* Export Button */}
      <button
        ref={buttonRef}
        onClick={() => {
          if (!isAnyExporting) {
            setShowContentDropdown(!showContentDropdown);
            setShowFormatDropdown(false);
            setSelectedContent(null);
          }
        }}
        disabled={isAnyExporting}
        className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)]/80 px-4 py-2 text-sm font-medium text-[var(--foreground-secondary)] transition-all hover:bg-[var(--surface)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Icon icon={Download} size="sm" aria-hidden={true} />
        <span>Export</span>
      </button>

      {/* Content Selection Dropdown */}
      {showContentDropdown && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowContentDropdown(false)}
            aria-hidden={true}
          />
          <div
            ref={contentDropdownRef}
            className="absolute top-full right-0 z-50 mt-2 w-64 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-xl"
          >
            <div className="p-2">
              <div className="mb-2 px-3 py-1.5 text-xs font-semibold tracking-wider text-[var(--foreground-muted)] uppercase">
                What to export
              </div>
              {CONTENT_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleContentSelect(option.value)}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Format Selection Dropdown */}
      {showFormatDropdown && selectedContent && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setShowFormatDropdown(false);
              setSelectedContent(null);
            }}
            aria-hidden={true}
          />
          <div
            ref={formatDropdownRef}
            className="absolute top-full right-0 z-50 mt-2 w-48 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-xl"
          >
            <div className="p-2">
              <div className="mb-2 px-3 py-1.5 text-xs font-semibold tracking-wider text-[var(--foreground-muted)] uppercase">
                Export format
              </div>
              <button
                onClick={() => handleFormatClick('pdf')}
                disabled={isAnyExporting}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  isExporting(selectedContent, 'pdf')
                    ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                    : 'text-[var(--foreground-secondary)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
                }`}
              >
                <Icon icon={FileDown} size="sm" aria-hidden={true} />
                <span>{isExporting(selectedContent, 'pdf') ? 'Exporting...' : 'PDF'}</span>
              </button>
              <button
                onClick={() => handleFormatClick('html')}
                disabled={isAnyExporting}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  isExporting(selectedContent, 'html')
                    ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                    : 'text-[var(--foreground-secondary)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
                }`}
              >
                <Icon icon={FileText} size="sm" aria-hidden={true} />
                <span>{isExporting(selectedContent, 'html') ? 'Exporting...' : 'HTML'}</span>
              </button>
              <button
                onClick={() => handleFormatClick('csv')}
                disabled={isAnyExporting}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  isExporting(selectedContent, 'csv')
                    ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                    : 'text-[var(--foreground-secondary)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
                }`}
              >
                <Icon icon={FileSpreadsheet} size="sm" aria-hidden={true} />
                <span>{isExporting(selectedContent, 'csv') ? 'Exporting...' : 'CSV'}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
