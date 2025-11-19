/**
 * Menu Locked View Component
 * Displays allergen matrix and menu information when menu is locked
 */

'use client';

import { DietaryBadge } from '@/components/ui/DietaryBadge';
import { Icon } from '@/components/ui/Icon';
import { useNotification } from '@/contexts/NotificationContext';
import { AUSTRALIAN_ALLERGENS, consolidateAllergens } from '@/lib/allergens/australian-allergens';
import { logger } from '@/lib/logger';
import { FileDown, FileSpreadsheet, FileText, Lock } from 'lucide-react';
import { useState } from 'react';
import { Menu, MenuItem } from '../types';

interface MenuLockedViewProps {
  menu: Menu;
  menuItems: MenuItem[];
  onUnlock: () => void;
}

export function MenuLockedView({ menu, menuItems, onUnlock }: MenuLockedViewProps) {
  const { showError, showSuccess } = useNotification();
  const [exportLoading, setExportLoading] = useState<string | null>(null);



  // Get unique menu items (dishes and recipes) with their allergens
  const menuItemsWithAllergens = menuItems.map((item, index) => {
    // Extract allergens - ensure it's always an array
    let allergens: string[] = [];


    // Try item.allergens first (from enriched item)
    if (item.allergens && Array.isArray(item.allergens)) {
      allergens = item.allergens;
    } else if (item.dish_id && item.dishes?.allergens) {
      // Try dish allergens
      if (Array.isArray(item.dishes.allergens)) {
        allergens = item.dishes.allergens;
      }
    } else if (item.recipe_id && item.recipes?.allergens) {
      // Try recipe allergens
      if (Array.isArray(item.recipes.allergens)) {
        allergens = item.recipes.allergens;
      }
    }

    // Consolidate allergens (map old codes to new) and validate
    const validAllergenCodes = AUSTRALIAN_ALLERGENS.map(a => a.code);
    const beforeFilter = [...allergens];
    allergens = consolidateAllergens(allergens).filter(code => validAllergenCodes.includes(code));

    // Debug logging (dev only) - log ALL items, even with empty allergens
    if (process.env.NODE_ENV === 'development') {
      logger.dev('[MenuLockedView] Item allergens:', {
        itemName: item.dish_id ? item.dishes?.dish_name : item.recipes?.recipe_name,
        itemId: item.id,
        itemType: item.dish_id ? 'dish' : 'recipe',
        rawItemAllergens: item.allergens,
        dishAllergens: item.dishes?.allergens,
        recipeAllergens: item.recipes?.allergens,
        beforeFilter,
        afterFilter: allergens,
        allergensCount: allergens.length,
        allAllergenCodes: validAllergenCodes,
      });
    }

    const isVegetarian = item.is_vegetarian ?? (item.dish_id ? item.dishes?.is_vegetarian : item.recipes?.is_vegetarian);
    const isVegan = item.is_vegan ?? (item.dish_id ? item.dishes?.is_vegan : item.recipes?.is_vegan);
    const dietaryConfidence = item.dietary_confidence || (item.dish_id ? item.dishes?.dietary_confidence : item.recipes?.dietary_confidence);

    // Final safety check - ensure allergens is always a proper array
    const finalAllergens = Array.isArray(allergens) ? allergens : [];

    return {
      id: item.id,
      name: item.dish_id ? item.dishes?.dish_name : item.recipes?.recipe_name || 'Unknown',
      type: item.dish_id ? 'dish' : 'recipe',
      allergens: finalAllergens,
      isVegetarian,
      isVegan,
      dietaryConfidence,
      category: item.category,
      price: item.actual_selling_price || (item.dish_id ? item.dishes?.selling_price : item.recommended_selling_price) || 0,
    };
  });

  const handleExport = async (format: 'pdf' | 'html' | 'csv') => {
    setExportLoading(format);
    try {
      const response = await fetch(`/api/menus/${menu.id}/allergen-matrix/export?format=${format}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to export allergen matrix');
      }

      // Handle file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${menu.menu_name}_allergen_matrix.${format === 'csv' ? 'csv' : format === 'pdf' ? 'pdf' : 'html'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showSuccess(`Allergen matrix exported as ${format.toUpperCase()}`);
    } catch (err) {
      logger.error('[MenuLockedView] Export error:', err);
      showError(err instanceof Error ? err.message : 'Failed to export allergen matrix');
    } finally {
      setExportLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Locked Status Banner */}
      <div className="rounded-2xl border border-yellow-500/50 bg-yellow-500/10 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon icon={Lock} size="lg" className="text-yellow-400" aria-hidden={true} />
            <div>
              <h2 className="text-xl font-semibold text-white">Menu Locked</h2>
              <p className="text-sm text-gray-400">
                This menu has been finalized. View the allergen matrix below or export it for printing.
                {menu.locked_at && (
                  <span className="ml-2">
                    Locked on {new Date(menu.locked_at).toLocaleDateString()}
                    {menu.locked_by && ` by ${menu.locked_by}`}
                  </span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={onUnlock}
            className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 px-4 py-2 text-sm font-medium text-yellow-400 transition-all hover:bg-yellow-500/20"
          >
            Unlock Menu
          </button>
        </div>
      </div>

      {/* Export Options */}
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">Export Allergen Matrix</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleExport('pdf')}
            disabled={exportLoading !== null}
            className="flex items-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a]/80 px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-[#1f1f1f] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon icon={FileDown} size="sm" aria-hidden={true} />
            <span>{exportLoading === 'pdf' ? 'Exporting...' : 'PDF'}</span>
          </button>
          <button
            onClick={() => handleExport('html')}
            disabled={exportLoading !== null}
            className="flex items-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a]/80 px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-[#1f1f1f] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon icon={FileText} size="sm" aria-hidden={true} />
            <span>{exportLoading === 'html' ? 'Exporting...' : 'HTML'}</span>
          </button>
          <button
            onClick={() => handleExport('csv')}
            disabled={exportLoading !== null}
            className="flex items-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a]/80 px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-[#1f1f1f] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon icon={FileSpreadsheet} size="sm" aria-hidden={true} />
            <span>{exportLoading === 'csv' ? 'Exporting...' : 'CSV'}</span>
          </button>
        </div>
      </div>

      {/* Allergen Matrix */}
      <div className="overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#2a2a2a]">
            <thead className="sticky top-0 z-10 bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                  Item Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                  Type
                </th>
                {AUSTRALIAN_ALLERGENS.map(allergen => (
                  <th
                    key={allergen.code}
                    className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-300"
                  >
                    {allergen.displayName}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                  Dietary
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a] bg-[#1f1f1f]">
              {menuItemsWithAllergens.length === 0 ? (
                <tr>
                  <td colSpan={AUSTRALIAN_ALLERGENS.length + 3} className="px-6 py-8 text-center text-gray-400">
                    No items in this menu
                  </td>
                </tr>
              ) : (
                menuItemsWithAllergens.map(item => (
                  <tr key={item.id} className="transition-colors hover:bg-[#2a2a2a]/20">
                    <td className="px-6 py-4 text-sm font-medium text-white">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-400 capitalize">{item.type}</td>
                    {AUSTRALIAN_ALLERGENS.map(allergen => {
                      // Defensive check - ensure allergens is an array
                      const allergensArray = Array.isArray(item.allergens) ? item.allergens : [];
                      const containsAllergen = allergensArray.includes(allergen.code);


                      return (
                        <td key={allergen.code} className="px-4 py-4 text-center">
                          {containsAllergen ? (
                            <span className="text-red-500" title={`Contains ${allergen.displayName}`}>
                              ❌
                            </span>
                          ) : (
                            <span className="text-green-500" title={`No ${allergen.displayName}`}>
                              ✅
                            </span>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-6 py-4">
                      <DietaryBadge
                        isVegetarian={item.isVegetarian}
                        isVegan={item.isVegan}
                        confidence={item.dietaryConfidence}
                        size="sm"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
