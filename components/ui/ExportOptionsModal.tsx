'use client';

/**
 * Unified export options modal component
 * Provides format, variant, and filter selection for complex exports
 * Uses Cyber Carrot styling and PrepFlow voice
 */

import { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';
import { X, Download, FileText, FileSpreadsheet, FileCode, Check } from 'lucide-react';
import type { TemplateVariant } from '@/lib/exports/template-utils';
import { getVariantDisplayName, getVariantDescription } from '@/lib/exports/template-utils';
import type { ExportFormat } from './ExportButton';

export interface ExportFilter {
  id: string;
  label: string;
  value: string | boolean;
  type?: 'select' | 'checkbox' | 'date-range';
  options?: Array<{ value: string; label: string }>;
}

export interface ExportOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: {
    format: ExportFormat;
    variant?: TemplateVariant;
    filters?: Record<string, any>;
  }) => void | Promise<void>;
  loading?: boolean;
  title?: string;
  availableFormats?: ExportFormat[];
  availableVariants?: TemplateVariant[];
  filters?: ExportFilter[];
  defaultFormat?: ExportFormat;
  defaultVariant?: TemplateVariant;
}

export function ExportOptionsModal({
  isOpen,
  onClose,
  onExport,
  loading = false,
  title = 'Export Options',
  availableFormats = ['csv', 'pdf', 'html'],
  availableVariants = ['default', 'kitchen', 'customer', 'supplier', 'compliance', 'compact'],
  filters = [],
  defaultFormat = 'pdf',
  defaultVariant = 'default',
}: ExportOptionsModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>(defaultFormat);
  const [selectedVariant, setSelectedVariant] = useState<TemplateVariant>(defaultVariant);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const modalRef = useRef<HTMLDivElement>(null);

  // Initialize filter values
  useEffect(() => {
    if (isOpen) {
      const initialFilters: Record<string, any> = {};
      filters.forEach(filter => {
        initialFilters[filter.id] = filter.value;
      });
      setFilterValues(initialFilters);
      setSelectedFormat(defaultFormat);
      setSelectedVariant(defaultVariant);
    }
  }, [isOpen, filters, defaultFormat, defaultVariant]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      document.addEventListener('keydown', handleTab);
      firstElement?.focus();

      return () => {
        document.removeEventListener('keydown', handleTab);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

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

  const handleExport = async () => {
    await onExport({
      format: selectedFormat,
      variant: selectedVariant,
      filters: filterValues,
    });
  };

  const handleFilterChange = (filterId: string, value: any) => {
    setFilterValues(prev => ({
      ...prev,
      [filterId]: value,
    }));
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-options-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 id="export-options-title" className="text-xl font-bold text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
            aria-label="Close export options"
          >
            <Icon icon={X} size="md" aria-hidden={true} />
          </button>
        </div>

        {/* Format Selection */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-300">Export Format</label>
          <div className="grid grid-cols-3 gap-3">
            {availableFormats.map(format => {
              const IconComponent = formatIcons[format];
              const isSelected = selectedFormat === format;
              return (
                <button
                  key={format}
                  onClick={() => setSelectedFormat(format)}
                  disabled={loading}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                    isSelected
                      ? 'border-[#29E7CD] bg-[#29E7CD]/10'
                      : 'border-[#2a2a2a] bg-[#2a2a2a]/30 hover:border-[#29E7CD]/50'
                  } ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                  aria-label={`Select ${formatLabels[format]} format`}
                  aria-pressed={isSelected}
                >
                  <Icon
                    icon={IconComponent}
                    size="md"
                    className={isSelected ? 'text-[#29E7CD]' : 'text-gray-400'}
                    aria-hidden={true}
                  />
                  <span
                    className={`text-sm font-medium ${isSelected ? 'text-[#29E7CD]' : 'text-gray-300'}`}
                  >
                    {formatLabels[format]}
                  </span>
                  {isSelected && (
                    <Icon icon={Check} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Variant Selection */}
        {availableVariants.length > 1 && (
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-300">Template Style</label>
            <select
              value={selectedVariant}
              onChange={e => setSelectedVariant(e.target.value as TemplateVariant)}
              disabled={loading}
              className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 px-4 py-2 text-white transition-colors hover:border-[#29E7CD]/50 focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {availableVariants.map(variant => (
                <option key={variant} value={variant}>
                  {getVariantDisplayName(variant)} - {getVariantDescription(variant)}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-400">{getVariantDescription(selectedVariant)}</p>
          </div>
        )}

        {/* Filters */}
        {filters.length > 0 && (
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-300">Filters</label>
            <div className="space-y-3">
              {filters.map(filter => (
                <div key={filter.id}>
                  {filter.type === 'checkbox' ? (
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filterValues[filter.id] as boolean}
                        onChange={e => handleFilterChange(filter.id, e.target.checked)}
                        disabled={loading}
                        className="h-4 w-4 rounded border-[#2a2a2a] bg-[#2a2a2a]/30 text-[#29E7CD] focus:ring-[#29E7CD] disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <span className="text-sm text-gray-300">{filter.label}</span>
                    </label>
                  ) : filter.type === 'select' && filter.options ? (
                    <div>
                      <label className="mb-1 block text-xs text-gray-400">{filter.label}</label>
                      <select
                        value={filterValues[filter.id] as string}
                        onChange={e => handleFilterChange(filter.id, e.target.value)}
                        disabled={loading}
                        className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 px-4 py-2 text-sm text-white transition-colors hover:border-[#29E7CD]/50 focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {filter.options.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="mb-1 block text-xs text-gray-400">{filter.label}</label>
                      <input
                        type="text"
                        value={filterValues[filter.id] as string}
                        onChange={e => handleFilterChange(filter.id, e.target.value)}
                        disabled={loading}
                        className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 px-4 py-2 text-sm text-white transition-colors hover:border-[#29E7CD]/50 focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-[#29E7CD]/50 hover:bg-[#2a2a2a] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-2 text-sm font-medium text-black transition-all hover:shadow-lg hover:shadow-[#29E7CD]/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon icon={Download} size="sm" aria-hidden={true} />
            {loading ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>
    </div>
  );
}
