import { DietaryBadge } from '@/components/ui/DietaryBadge';
import { Icon } from '@/components/ui/Icon';
import { AUSTRALIAN_ALLERGENS } from '@/lib/allergens/australian-allergens';
import {
  Nut,
  Milk,
  Egg,
  Bean,
  Wheat,
  Fish,
  CircleDot,
  Flower,
  AlertTriangle,
  Circle,
  AlertCircle,
  CheckCircle2,
  LucideIcon,
} from 'lucide-react';
import { MenuItemWithAllergens } from '../hooks/useMenuItemsWithAllergens';

const ALLERGEN_ICONS: Record<string, LucideIcon> = {
  nuts: Nut,
  milk: Milk,
  eggs: Egg,
  soy: Bean,
  gluten: Wheat,
  fish: Fish,
  shellfish: Fish,
  sesame: CircleDot,
  lupin: Flower,
  sulphites: AlertTriangle,
  mustard: Circle,
};

interface AllergenMatrixTableProps {
  menuItemsWithAllergens: MenuItemWithAllergens[];
  onRowClick: (
    e: React.MouseEvent<HTMLTableRowElement>,
    menuItemId: string,
    menuItemName: string,
    menuItemType: 'dish' | 'recipe',
  ) => void;
  onRowKeyDown: (
    e: React.KeyboardEvent<HTMLTableRowElement>,
    menuItemId: string,
    menuItemName: string,
    menuItemType: 'dish' | 'recipe',
  ) => void;
}

export function AllergenMatrixTable({
  menuItemsWithAllergens,
  onRowClick,
  onRowKeyDown,
}: AllergenMatrixTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#2a2a2a]">
          <thead className="sticky top-0 z-10 bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                Item Name
              </th>
              {AUSTRALIAN_ALLERGENS.map(allergen => {
                const AllergenIcon = ALLERGEN_ICONS[allergen.code];
                return (
                  <th
                    key={allergen.code}
                    className="px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-300 uppercase"
                  >
                    <div className="flex flex-col items-center gap-1">
                      {AllergenIcon && (
                        <Icon
                          icon={AllergenIcon}
                          size="sm"
                          className="text-[#29E7CD]"
                          aria-hidden={true}
                        />
                      )}
                      <span className="text-[10px] leading-tight">{allergen.displayName}</span>
                    </div>
                  </th>
                );
              })}
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                Dietary
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a] bg-[#1f1f1f]">
            {menuItemsWithAllergens.length === 0 ? (
              <tr>
                <td
                  colSpan={AUSTRALIAN_ALLERGENS.length + 2}
                  className="px-6 py-8 text-center text-gray-400"
                >
                  No items in this menu
                </td>
              </tr>
            ) : (
              menuItemsWithAllergens.map(item => {
                const allergenCount = item.allergens.length;
                return (
                  <tr
                    key={item.id}
                    onClick={e =>
                      onRowClick(e, item.menuItemId, item.name || '', item.type || 'dish')
                    }
                    onKeyDown={e =>
                      onRowKeyDown(e, item.menuItemId, item.name || '', item.type || 'dish')
                    }
                    className="cursor-pointer transition-colors hover:bg-[#2a2a2a]/20"
                    role="button"
                    tabIndex={0}
                    aria-label={`Click to view all ingredients for ${item.name}`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-white">
                      <div className="flex items-center gap-2">
                        <span>{item.name}</span>
                        {allergenCount > 0 && (
                          <span
                            className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-400"
                            title={`${allergenCount} allergen${allergenCount > 1 ? 's' : ''}`}
                          >
                            {allergenCount}
                          </span>
                        )}
                      </div>
                    </td>
                    {AUSTRALIAN_ALLERGENS.map(allergen => {
                      const allergensArray = Array.isArray(item.allergens) ? item.allergens : [];
                      const containsAllergen = allergensArray.includes(allergen.code);
                      const AllergenIcon = ALLERGEN_ICONS[allergen.code];

                      return (
                        <td
                          key={allergen.code}
                          className="px-4 py-4 text-center"
                          role="gridcell"
                          aria-label={
                            containsAllergen
                              ? `${item.name} contains ${allergen.displayName}`
                              : `${item.name} does not contain ${allergen.displayName}`
                          }
                        >
                          {containsAllergen ? (
                            <div className="flex items-center justify-center gap-1.5">
                              {AllergenIcon && (
                                <Icon
                                  icon={AllergenIcon}
                                  size="sm"
                                  className="text-red-500"
                                  aria-hidden={true}
                                />
                              )}
                              <Icon
                                icon={AlertCircle}
                                size="xs"
                                className="text-red-500"
                                aria-hidden={true}
                              />
                            </div>
                          ) : (
                            <div className="flex items-center justify-center">
                              <Icon
                                icon={CheckCircle2}
                                size="xs"
                                className="text-green-500/50"
                                aria-hidden={true}
                              />
                            </div>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-6 py-4">
                      {item.isVegetarian || item.isVegan ? (
                        <DietaryBadge
                          isVegetarian={item.isVegetarian}
                          isVegan={item.isVegan}
                          confidence={item.dietaryConfidence}
                          size="sm"
                        />
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
