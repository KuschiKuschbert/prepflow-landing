import { useTranslation } from '@/lib/useTranslation';
import { UtensilsCrossed } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

interface DishSectionsHeaderProps {
  onAddClick: () => void;
}

export function DishSectionsHeader({ onAddClick }: DishSectionsHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold text-white">
          <Icon icon={UtensilsCrossed} size="lg" aria-hidden={true} />
          {t('dishSections.title', 'Dish Sections')}
        </h1>
        <p className="text-gray-400">
          {t('dishSections.subtitle', 'Organize dishes by kitchen sections for prep lists')}
        </p>
      </div>
      <button
        onClick={onAddClick}
        className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-xl"
      >
        + {t('dishSections.addSection', 'Add Section')}
      </button>
    </div>
  );
}
