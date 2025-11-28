/**
 * Empty state component for prep lists page.
 */

import { ListChecks } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { useTranslation } from '@/lib/useTranslation';

interface PrepListsEmptyStateProps {
  onCreateClick: () => void;
}

export function PrepListsEmptyState({ onCreateClick }: PrepListsEmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div className="py-12 text-center">
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20">
        <Icon icon={ListChecks} size="xl" className="text-[#29E7CD]" aria-hidden={true} />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-white">
        {t('prepLists.noPrepLists', 'No Prep Lists')}
      </h3>
      <p className="mb-6 text-gray-400">
        {t(
          'prepLists.noPrepListsDesc',
          'Create your first prep list to organize kitchen preparation',
        )}
      </p>
      <button
        onClick={onCreateClick}
        className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-xl"
      >
        {t('prepLists.createFirstPrepList', 'Create Your First Prep List')}
      </button>
    </div>
  );
}
