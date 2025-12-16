/**
 * Unassigned dishes component.
 */

import { useTranslation } from '@/lib/useTranslation';
import type { KitchenSection, MenuDish } from '../types';

interface UnassignedDishesProps {
  unassignedDishes: MenuDish[];
  sections: KitchenSection[];
  onAssignDish: (dishId: string, sectionId: string | null) => void;
}

export function UnassignedDishes({
  unassignedDishes,
  sections,
  onAssignDish,
}: UnassignedDishesProps) {
  const { t } = useTranslation();

  if (unassignedDishes.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-semibold text-[var(--foreground)]">
        {t('dishSections.unassignedDishes', 'Unassigned Dishes')} ({unassignedDishes.length})
      </h2>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="space-y-3">
          {unassignedDishes.map(dish => (
            <div
              key={dish.id}
              className="flex items-center justify-between rounded-lg bg-[var(--muted)]/30 p-4"
            >
              <div>
                <p className="font-semibold text-[var(--foreground)]">{dish.name}</p>
                <p className="text-sm text-[var(--foreground-muted)]">{dish.category}</p>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value=""
                  onChange={e => onAssignDish(dish.id, e.target.value || null)}
                  className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                >
                  <option value="">{t('dishSections.assignToSection', 'Assign to section')}</option>
                  {sections.map(section => (
                    <option key={section.id} value={section.id}>
                      {section.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
