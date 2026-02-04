'use client';

import { Icon } from '@/components/ui/Icon';
import type { KitchenSection, PrepList, SectionData } from '@/lib/types/prep-lists';
import { useTranslation } from '@/lib/useTranslation';
import { Printer, X } from 'lucide-react';
import { useState } from 'react';
import { usePrepListExport } from '../hooks/usePrepListExport';

interface PrepListExportProps {
  prepList?: PrepList;
  generatedData?: {
    sections: SectionData[];
    menuName: string;
  };
  kitchenSections?: KitchenSection[];
  onClose: () => void;
}

/**
 * Sub-component for the export modal header
 */
function ExportHeader({ onClose, hasPrepList }: { onClose: () => void; hasPrepList: boolean }) {
  const { t } = useTranslation();
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-[var(--foreground)]">
          {t('prepLists.export', 'Export Prep List')}
        </h2>
        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          {hasPrepList
            ? t('prepLists.exportDesc', 'Print or export this prep list')
            : t('prepLists.exportGeneratedDesc', 'Choose sections to export')}
        </p>
      </div>
      <button
        onClick={onClose}
        className="p-2 text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
        aria-label="Close"
      >
        <Icon icon={X} size="md" aria-hidden={true} />
      </button>
    </div>
  );
}

/**
 * Sub-component for section selection
 */
function SectionSelector({
  sections,
  selectedSections,
  toggleSection,
  selectAll,
  clearAll,
}: {
  sections: SectionData[];
  selectedSections: string[];
  toggleSection: (id: string) => void;
  selectAll: () => void;
  clearAll: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="mb-6 space-y-4">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="text-sm font-medium text-[var(--foreground)]">
            {t('prepLists.selectSections', 'Select Sections')}
          </label>
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="text-xs text-[var(--primary)] hover:text-[var(--primary)]/80"
            >
              {t('prepLists.selectAll', 'Select All')}
            </button>
            <button
              onClick={clearAll}
              className="text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            >
              {t('prepLists.clear', 'Clear')}
            </button>
          </div>
        </div>
        <div className="max-h-48 space-y-2 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-3">
          {sections.map((section, index) => {
            const sectionId = section.sectionId || `uncategorized-${index}`;
            const isSelected = section.sectionId
              ? selectedSections.includes(section.sectionId)
              : false;
            const hasContent =
              section.aggregatedIngredients.length > 0 ||
              (section.prepInstructions && section.prepInstructions.length > 0);

            if (!hasContent) return null;

            return (
              <label
                key={sectionId}
                className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-[var(--muted)]"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSection(section.sectionId || '')}
                  className="h-4 w-4 rounded border-[var(--border)] bg-[var(--background)] text-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]"
                />
                <span className="flex-1 text-sm text-[var(--foreground)]">
                  {section.sectionName}
                </span>
                <span className="text-xs text-[var(--foreground-muted)]">
                  {section.aggregatedIngredients.length} ingredients
                  {section.prepInstructions && section.prepInstructions.length > 0
                    ? `, ${section.prepInstructions.length} instructions`
                    : ''}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Sub-component for action buttons
 */
function ExportActions({ onCancel, onPrint }: { onCancel: () => void; onPrint: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-end gap-3">
      <button
        onClick={onCancel}
        className="rounded-xl bg-[var(--muted)] px-6 py-3 text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--muted)]/80"
      >
        {t('prepLists.cancel', 'Cancel')}
      </button>
      <button
        onClick={onPrint}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-xl"
      >
        <Icon icon={Printer} size="sm" aria-hidden={true} />
        {t('prepLists.print', 'Print')}
      </button>
    </div>
  );
}

export function PrepListExport({ prepList, generatedData, onClose }: PrepListExportProps) {
  const { t } = useTranslation();
  const { printPrepList, printGeneratedPrepList } = usePrepListExport();
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [includeInstructions, setIncludeInstructions] = useState(true);

  const handlePrint = () => {
    if (prepList) {
      printPrepList(prepList);
    } else if (generatedData) {
      printGeneratedPrepList(generatedData.sections, generatedData.menuName, {
        sections: selectedSections.length > 0 ? selectedSections : undefined,
        includeInstructions,
      });
    }
    onClose();
  };

  const toggleSection = (sectionId: string) => {
    setSelectedSections(prev =>
      prev.includes(sectionId) ? prev.filter(id => id !== sectionId) : [...prev, sectionId],
    );
  };

  const selectAllSections = () => {
    if (!generatedData) return;
    setSelectedSections(
      generatedData.sections.map(s => s.sectionId).filter((id): id is string => id !== null),
    );
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 via-[var(--tertiary)]/20 to-[var(--primary)]/20 p-[1px]">
        <div className="rounded-3xl bg-[var(--surface)]/95 p-6">
          <ExportHeader onClose={onClose} hasPrepList={!!prepList} />

          {generatedData && (
            <>
              <SectionSelector
                sections={generatedData.sections}
                selectedSections={selectedSections}
                toggleSection={toggleSection}
                selectAll={selectAllSections}
                clearAll={() => setSelectedSections([])}
              />
              <label className="mb-6 flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={includeInstructions}
                  onChange={e => setIncludeInstructions(e.target.checked)}
                  className="h-4 w-4 rounded border-[var(--border)] bg-[var(--background)] text-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]"
                />
                <span className="text-sm text-[var(--foreground)]">
                  {t('prepLists.includeInstructions', 'Include Prep Instructions')}
                </span>
              </label>
            </>
          )}

          <ExportActions onCancel={onClose} onPrint={handlePrint} />
        </div>
      </div>
    </div>
  );
}
