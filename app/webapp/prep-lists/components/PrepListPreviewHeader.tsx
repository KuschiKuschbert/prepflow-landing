/**
 * Header component for PrepListPreview.
 */

import { useTranslation } from '@/lib/useTranslation';
import { Icon } from '@/components/ui/Icon';
import { X, List, Grid, Printer } from 'lucide-react';

interface PrepListPreviewHeaderProps {
  menuName: string;
  viewMode: 'aggregated' | 'recipe-grouped';
  onViewModeChange: (mode: 'aggregated' | 'recipe-grouped') => void;
  onExport: () => void;
  onClose: () => void;
}

/**
 * Header component for PrepListPreview.
 *
 * @param {PrepListPreviewHeaderProps} props - Component props
 * @returns {JSX.Element} Header component
 */
export function PrepListPreviewHeader({
  menuName,
  viewMode,
  onViewModeChange,
  onExport,
  onClose,
}: PrepListPreviewHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between border-b border-[#2a2a2a] p-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">
          {t('prepLists.previewTitle', 'Preview Prep Lists')} - {menuName}
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          {t('prepLists.previewSubtitle', 'Review and edit ingredients before saving')}
        </p>
      </div>
      <div className="flex items-center gap-4">
        {/* View Toggle */}
        <div className="flex items-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] p-1">
          <button
            onClick={() => onViewModeChange('aggregated')}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
              viewMode === 'aggregated'
                ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Icon icon={List} size="sm" aria-hidden={true} />
            {t('prepLists.aggregated', 'Aggregated')}
          </button>
          <button
            onClick={() => onViewModeChange('recipe-grouped')}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
              viewMode === 'recipe-grouped'
                ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Icon icon={Grid} size="sm" aria-hidden={true} />
            {t('prepLists.recipeGrouped', 'By Recipe')}
          </button>
        </div>
        <button
          onClick={onExport}
          className="flex items-center gap-2 rounded-xl bg-[#29E7CD]/10 px-4 py-2 text-sm font-medium text-[#29E7CD] transition-colors hover:bg-[#29E7CD]/20"
        >
          <Icon icon={Printer} size="sm" aria-hidden={true} />
          {t('prepLists.export', 'Export')}
        </button>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 transition-colors hover:text-white"
          aria-label="Close"
        >
          <Icon icon={X} size="md" aria-hidden={true} />
        </button>
      </div>
    </div>
  );
}
