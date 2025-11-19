'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { Icon } from '@/components/ui/Icon';
import { X, Printer, FileText } from 'lucide-react';
import { usePrepListExport } from '../hooks/usePrepListExport';
import type { PrepList, SectionData, KitchenSection } from '../types';

interface PrepListExportProps {
  prepList?: PrepList;
  generatedData?: {
    sections: SectionData[];
    menuName: string;
  };
  kitchenSections?: KitchenSection[];
  onClose: () => void;
}

export function PrepListExport({
  prepList,
  generatedData,
  kitchenSections = [],
  onClose,
}: PrepListExportProps) {
  const { t } = useTranslation();
  const { printPrepList, printGeneratedPrepList } = usePrepListExport();
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [includeInstructions, setIncludeInstructions] = useState(true);

  const handlePrint = () => {
    if (prepList) {
      printPrepList(prepList);
    } else if (generatedData) {
      const options = {
        sections: selectedSections.length > 0 ? selectedSections : undefined,
        includeInstructions,
      };
      printGeneratedPrepList(generatedData.sections, generatedData.menuName, options);
    }
    onClose();
  };

  const toggleSection = (sectionId: string | null) => {
    if (!sectionId) return;
    setSelectedSections(prev =>
      prev.includes(sectionId) ? prev.filter(id => id !== sectionId) : [...prev, sectionId],
    );
  };

  const selectAllSections = () => {
    if (!generatedData) return;
    const allSectionIds = generatedData.sections
      .map(s => s.sectionId)
      .filter((id): id is string => id !== null);
    setSelectedSections(allSectionIds);
  };

  const clearSelection = () => {
    setSelectedSections([]);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              {t('prepLists.export', 'Export Prep List')}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {prepList
                ? t('prepLists.exportDesc', 'Print or export this prep list')
                : t('prepLists.exportGeneratedDesc', 'Choose sections to export')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 transition-colors hover:text-white"
            aria-label="Close"
          >
            <Icon icon={X} size="md" aria-hidden={true} />
          </button>
        </div>

        {/* Options */}
        {generatedData && (
          <div className="mb-6 space-y-4">
            {/* Section Selection */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="text-sm font-medium text-white">
                  {t('prepLists.selectSections', 'Select Sections')}
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={selectAllSections}
                    className="text-xs text-[#29E7CD] hover:text-[#29E7CD]/80"
                  >
                    {t('prepLists.selectAll', 'Select All')}
                  </button>
                  <button
                    onClick={clearSelection}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    {t('prepLists.clear', 'Clear')}
                  </button>
                </div>
              </div>
              <div className="max-h-48 space-y-2 overflow-y-auto rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-3">
                {generatedData.sections.map((section, index) => {
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
                      className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-[#2a2a2a]"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSection(section.sectionId || '')}
                        className="h-4 w-4 rounded border-[#2a2a2a] bg-[#0a0a0a] text-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]"
                      />
                      <span className="flex-1 text-sm text-white">{section.sectionName}</span>
                      <span className="text-xs text-gray-400">
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

            {/* Include Instructions Toggle */}
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={includeInstructions}
                onChange={e => setIncludeInstructions(e.target.checked)}
                className="h-4 w-4 rounded border-[#2a2a2a] bg-[#0a0a0a] text-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]"
              />
              <span className="text-sm text-white">
                {t('prepLists.includeInstructions', 'Include Prep Instructions')}
              </span>
            </label>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl bg-[#2a2a2a] px-6 py-3 text-gray-300 transition-colors hover:bg-[#2a2a2a]/80"
          >
            {t('prepLists.cancel', 'Cancel')}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-xl"
          >
            <Icon icon={Printer} size="sm" aria-hidden={true} />
            {t('prepLists.print', 'Print')}
          </button>
        </div>
      </div>
    </div>
  );
}

