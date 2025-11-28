/**
 * Header component for prep lists page.
 */

import { ChefHat, ListChecks } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { useTranslation } from '@/lib/useTranslation';

interface PrepListsHeaderProps {
  onGenerateClick: () => void;
  onCreateClick: () => void;
}

export function PrepListsHeader({ onGenerateClick, onCreateClick }: PrepListsHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold text-white">
          <Icon icon={ListChecks} size="lg" aria-hidden={true} />
          {t('prepLists.title', 'Prep Lists')}
        </h1>
        <p className="text-gray-400">
          {t('prepLists.subtitle', 'Create and manage kitchen prep lists by section')}
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onGenerateClick}
          className="flex items-center gap-2 rounded-2xl bg-[#29E7CD]/10 px-6 py-3 font-semibold text-[#29E7CD] transition-all duration-200 hover:bg-[#29E7CD]/20"
        >
          <Icon icon={ChefHat} size="md" aria-hidden={true} />
          {t('prepLists.generateFromMenu', 'Generate from Menu')}
        </button>
        <button
          onClick={onCreateClick}
          className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-xl"
        >
          + {t('prepLists.createPrepList', 'Create Prep List')}
        </button>
      </div>
    </div>
  );
}
