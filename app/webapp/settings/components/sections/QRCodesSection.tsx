'use client';

import { Icon } from '@/components/ui/Icon';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useNotification } from '@/contexts/NotificationContext';
import { Printer, QrCode, X } from 'lucide-react';
import { useCallback } from 'react';
import { QRCodeSection } from './QRCodesSection/components/QRCodeSection';
import { useQRCodes } from './QRCodesSection/hooks/useQRCodes';
import { useQRCodeSelection } from './QRCodesSection/hooks/useQRCodeSelection';
import { useQRCodePrint } from './QRCodesSection/hooks/useQRCodePrint';
import { groupEntities, sortEntityTypes } from './QRCodesSection/utils/groupEntities';
import { useState } from 'react';

/**
 * QR Codes Section component for settings page
 */
export function QRCodesSection() {
  const { showError } = useNotification();
  const { entities, loading, error, refetch } = useQRCodes();
  const { selectedItems, toggleSelect, selectAllInSection, clearSelection } =
    useQRCodeSelection(entities);
  const { handlePrint } = useQRCodePrint(showError);

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['recipe', 'cleaning-area', 'storage-area']),
  );

  // Group entities by type
  const groupedEntities = groupEntities(entities);

  // Sort groups by order
  const sortedTypes = sortEntityTypes(Object.keys(groupedEntities));

  const toggleSection = useCallback((type: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }, []);

  const handleSelectAllInSection = useCallback(
    (type: string) => {
      const sectionEntities = groupedEntities[type] || [];
      selectAllInSection(sectionEntities);
    },
    [groupedEntities, selectAllInSection],
  );

  const handlePrintSelected = useCallback(() => {
    const selected = entities.filter(e => selectedItems.has(e.id));
    handlePrint(selected);
  }, [entities, selectedItems, handlePrint]);

  const handlePrintAll = useCallback(() => {
    handlePrint(entities);
  }, [entities, handlePrint]);

  const handlePrintSection = useCallback(
    (type: string) => {
      handlePrint(groupedEntities[type] || []);
    },
    [groupedEntities, handlePrint],
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton variant="card" count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-[var(--color-error)]/20 bg-[var(--color-error)]/10 p-6 text-center">
        <p className="text-[var(--color-error)]">{error}</p>
        <button
          onClick={refetch}
          className="mt-4 rounded-lg bg-[var(--color-error)]/20 px-4 py-2 text-[var(--color-error)] hover:bg-[var(--color-error)]/30"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="tablet:flex-row tablet:items-center tablet:justify-between flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[var(--foreground)]">QR Code Library</h2>
          <p className="text-sm text-[var(--foreground-muted)]">
            {entities.length} QR codes in {sortedTypes.length} categories
          </p>
        </div>

        {/* Print Buttons */}
        <div className="flex gap-2">
          {selectedItems.size > 0 && (
            <button
              onClick={handlePrintSelected}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--color-info)] px-4 py-2.5 font-medium text-[var(--button-active-text)]"
            >
              <Icon icon={Printer} size="sm" />
              Print {selectedItems.size} Selected
            </button>
          )}
          {entities.length > 0 && (
            <button
              onClick={handlePrintAll}
              className="flex items-center gap-2 rounded-xl border border-[var(--primary)] bg-[var(--primary)]/10 px-4 py-2.5 font-medium text-[var(--primary)] hover:bg-[var(--primary)]/20"
            >
              <Icon icon={Printer} size="sm" />
              Print All ({entities.length})
            </button>
          )}
        </div>
      </div>

      {/* Clear Selection */}
      {selectedItems.size > 0 && (
        <div className="flex items-center justify-between rounded-xl bg-[var(--primary)]/10 px-4 py-2">
          <span className="text-sm text-[var(--primary)]">{selectedItems.size} items selected</span>
          <button
            onClick={clearSelection}
            className="flex items-center gap-1 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          >
            <Icon icon={X} size="xs" />
            Clear
          </button>
        </div>
      )}

      {/* Collapsible Sections */}
      <div className="space-y-4">
        {sortedTypes.map(type => (
          <QRCodeSection
            key={type}
            type={type}
            entities={groupedEntities[type] || []}
            isExpanded={expandedSections.has(type)}
            selectedItems={selectedItems}
            onToggleSection={() => toggleSection(type)}
            onToggleSelect={toggleSelect}
            onSelectAllInSection={() => handleSelectAllInSection(type)}
            onPrintSection={() => handlePrintSection(type)}
          />
        ))}
      </div>

      {/* Empty State */}
      {entities.length === 0 && (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--muted)]">
            <Icon icon={QrCode} size="lg" className="text-[var(--foreground-subtle)]" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-[var(--foreground)]">No QR Codes Found</h3>
          <p className="text-sm text-[var(--foreground-muted)]">
            Create recipes, cleaning areas, equipment, or employees to generate QR codes.
          </p>
        </div>
      )}

      {/* Print Tips */}
      {entities.length > 0 && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/50 p-4">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
            <Icon icon={Printer} size="sm" className="text-[var(--primary)]" />
            Printing Tips
          </h3>
          <ul className="space-y-1 text-xs text-[var(--foreground-muted)]">
            <li>• Click section headers to expand/collapse categories</li>
            <li>• Use &quot;Print&quot; button next to each section to print that category only</li>
            <li>• Layout fits ~20 QR codes per A4 page (4 columns)</li>
            <li>• Laminate printed codes for durability in kitchen environments</li>
          </ul>
        </div>
      )}
    </div>
  );
}
