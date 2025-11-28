/**
 * List of kitchen sections component.
 */

import { Edit, Trash2, X, UtensilsCrossed } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { useTranslation } from '@/lib/useTranslation';
import type { KitchenSection } from '../types';

interface SectionsListProps {
  sections: KitchenSection[];
  onEdit: (section: KitchenSection) => void;
  onDelete: (sectionId: string) => void;
  onUnassignDish: (dishId: string) => void;
}

export function SectionsList({ sections, onEdit, onDelete, onUnassignDish }: SectionsListProps) {
  const { t } = useTranslation();

  return (
    <>
      {sections.map(section => (
        <div
          key={section.id}
          className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 transition-all duration-200 hover:border-[#29E7CD]/50 hover:shadow-xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${section.color}20` }}
              >
                <Icon
                  icon={UtensilsCrossed}
                  size="md"
                  className="text-current"
                  aria-hidden={true}
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{section.name}</h3>
                {section.description && (
                  <p className="text-sm text-gray-400">{section.description}</p>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(section)}
                className="rounded-xl p-2 text-[#29E7CD] transition-colors hover:bg-[#29E7CD]/10"
                title="Edit"
              >
                <Icon icon={Edit} size="md" aria-hidden={true} />
              </button>
              <button
                onClick={() => onDelete(section.id)}
                className="rounded-xl p-2 text-red-400 transition-colors hover:bg-red-400/10"
                title="Delete"
              >
                <Icon icon={Trash2} size="md" aria-hidden={true} />
              </button>
            </div>
          </div>
          <div className="rounded-xl bg-[#2a2a2a]/30 p-4">
            <h4 className="mb-3 text-sm font-semibold text-white">
              {t('dishSections.dishesInSection', 'Dishes in this section')} (
              {section.menu_dishes.length})
            </h4>
            {section.menu_dishes.length === 0 ? (
              <p className="text-sm text-gray-400">
                {t('dishSections.noDishesInSection', 'No dishes assigned to this section')}
              </p>
            ) : (
              <div className="space-y-2">
                {section.menu_dishes.map(dish => (
                  <div
                    key={dish.id}
                    className="flex items-center justify-between rounded-lg bg-[#1f1f1f] p-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{dish.name}</p>
                      <p className="text-xs text-gray-400">{dish.category}</p>
                    </div>
                    <button
                      onClick={() => onUnassignDish(dish.id)}
                      className="rounded p-1 text-red-400 transition-colors hover:bg-red-400/10"
                      title="Unassign"
                    >
                      <Icon icon={X} size="sm" aria-hidden={true} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
