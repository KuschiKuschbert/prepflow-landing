/**
 * Empty state component for sections page.
 */

import { UtensilsCrossed } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { useTranslation } from '@/lib/useTranslation';

interface SectionsEmptyStateProps {
  onAddClick: () => void;
}

export function SectionsEmptyState({ onAddClick }: SectionsEmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div className="py-12 text-center">
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20">
        <Icon icon={UtensilsCrossed} size="xl" className="text-[#29E7CD]" aria-hidden={true} />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-white">
        {t('dishSections.noSections', 'No Kitchen Sections')}
      </h3>
      <p className="mb-6 text-gray-400">
        {t(
          'dishSections.noSectionsDesc',
          'Create kitchen sections to organize your dishes for prep lists',
        )}
      </p>
      <button
        onClick={onAddClick}
        className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-xl"
      >
        {t('dishSections.createFirstSection', 'Create Your First Section')}
      </button>
    </div>
  );
}
