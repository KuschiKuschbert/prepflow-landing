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
import {
  FileDown,
  FileSpreadsheet,
  FileText,
  Lock,
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
import { useState, useMemo, useRef, useEffect, memo } from 'react';
import { Menu, MenuItem } from '../types';
import { AllergenTooltip } from './AllergenTooltip';
import { IngredientPopover } from './IngredientPopover';

interface MenuLockedViewProps {
  menu: Menu;
  menuItems: MenuItem[];
  onUnlock: () => void;
}

// Valid allergen codes - constant outside component to avoid recalculation
const VALID_ALLERGEN_CODES = AUSTRALIAN_ALLERGENS.map(a => a.code);

// Icon mapping for allergens
const ALLERGEN_ICONS: Record<string, LucideIcon> = {
  nuts: Nut,
  milk: Milk,
  eggs: Egg,
  soy: Bean,
  gluten: Wheat,
  fish: Fish,
  shellfish: Fish, // Using Fish icon for shellfish
  sesame: CircleDot,
  lupin: Flower,
  sulphites: AlertTriangle,
  mustard: Circle,
};

function MenuLockedViewComponent({ menu, menuItems, onUnlock }: MenuLockedViewProps) {
  // CRITICAL: This log MUST appear if new code is running
  logger.dev('🚨🚨🚨 MENU_LOCKED_VIEW_NEW_CODE_2025_11_21_V3 - CODE IS RUNNING 🚨🚨🚨', {
    menuId: menu.id,
    menuItemsCount: menuItems.length,
    timestamp: new Date().toISOString(),
    version: '3.0',
  });
  logger.dev('🚨🚨🚨 MENU_LOCKED_VIEW_NEW_CODE_2025_11_21_V3 🚨🚨🚨', {
    menuId: menu.id,
    menuItemsCount: menuItems.length,
    timestamp: new Date().toISOString(),
    version: '3.0',
  });

  const { showError, showSuccess } = useNotification();
  const [exportLoading, setExportLoading] = useState<string | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<{
    id: string;
    name: string;
    type: 'dish' | 'recipe';
    mousePosition: { x: number; y: number };
  } | null>(null);
  const hasLoggedRef = useRef(false);
  const prevMenuRef = useRef(menu);
  const prevMenuItemsRef = useRef(menuItems);
  const renderCountRef = useRef(0);

  // Track component renders
  renderCountRef.current += 1;
  const renderId = renderCountRef.current;

  // Log render with what changed
  useEffect(() => {
    const prevMenu = prevMenuRef.current;
    const prevMenuItems = prevMenuItemsRef.current;
    const changes: string[] = [];

    if (prevMenu.id !== menu.id) changes.push(`menu.id: ${prevMenu.id} → ${menu.id}`);
    if (prevMenu.is_locked !== menu.is_locked)
      changes.push(`menu.is_locked: ${prevMenu.is_locked} → ${menu.is_locked}`);
    if (prevMenu.locked_at !== menu.locked_at) changes.push(`menu.locked_at changed`);
    if (prevMenu.menu_name !== menu.menu_name) changes.push(`menu.menu_name changed`);
    if (prevMenuItems.length !== menuItems.length)
      changes.push(`menuItems.length: ${prevMenuItems.length} → ${menuItems.length}`);
    if (prevMenuItems !== menuItems) {
      // Check if it's a reference change or actual content change
      const itemIdsChanged =
        prevMenuItems.map(i => i.id).join(',') !== menuItems.map(i => i.id).join(',');
      if (itemIdsChanged) changes.push(`menuItems IDs changed`);
      else changes.push(`menuItems reference changed (same content)`);
    }

    if (changes.length > 0) {
      logger.dev(`[MenuLockedView] Render #${renderId} - Props changed:`, {
        changes,
        menuId: menu.id,
        menuItemsLength: menuItems.length,
        prevMenuItemsLength: prevMenuItems.length,
        menuItemsRefChanged: prevMenuItems !== menuItems,
      });
    } else {
      logger.dev(`[MenuLockedView] Render #${renderId} - No prop changes detected`, {
        menuId: menu.id,
        menuItemsLength: menuItems.length,
      });
    }

    prevMenuRef.current = menu;
    prevMenuItemsRef.current = menuItems;
  }, [menu, menuItems, renderId]);

  // Get unique menu items (dishes and recipes) with their allergens - memoized to prevent recalculation
  const menuItemsWithAllergens = useMemo(() => {
    logger.dev(`[MenuLockedView] useMemo RECALCULATING menuItemsWithAllergens`, {
      itemCount: menuItems.length,
      menuId: menu.id,
      renderId,
    });

    return menuItems.map((item, index) => {
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
      allergens = consolidateAllergens(allergens).filter(code =>
        VALID_ALLERGEN_CODES.includes(code),
      );

      // Final safety check - ensure allergens is always a proper array
      const finalAllergens = Array.isArray(allergens) ? allergens : [];

      // Client-side validation: ensure vegan status doesn't conflict with allergens
      let isVegetarian =
        item.is_vegetarian ??
        (item.dish_id ? item.dishes?.is_vegetarian : item.recipes?.is_vegetarian);
      let isVegan =
        item.is_vegan ?? (item.dish_id ? item.dishes?.is_vegan : item.recipes?.is_vegan);

      // Validate vegan status against allergens (client-side safety check)
      if (isVegan === true && finalAllergens.length > 0) {
        const hasMilk = finalAllergens.includes('milk');
        const hasEggs = finalAllergens.includes('eggs');
        if (hasMilk || hasEggs) {
          logger.warn(
            '[MenuLockedView] Client-side validation: vegan=true but allergens include milk/eggs',
            {
              itemId: item.id,
              itemName: item.dish_id ? item.dishes?.dish_name : item.recipes?.recipe_name,
              allergens: finalAllergens,
              hasMilk,
              hasEggs,
            },
          );
          isVegan = false; // Correct the conflict
        }
      }

      const dietaryConfidence =
        item.dietary_confidence ||
        (item.dish_id ? item.dishes?.dietary_confidence : item.recipes?.dietary_confidence);

      return {
        id: item.id,
        menuItemId: item.dish_id || item.recipe_id || item.id, // Use dish_id or recipe_id for API calls
        name: item.dish_id ? item.dishes?.dish_name : item.recipes?.recipe_name || 'Unknown',
        type: item.dish_id ? 'dish' : 'recipe',
        allergens: finalAllergens,
        isVegetarian,
        isVegan,
        dietaryConfidence,
        category: item.category,
        price:
          item.actual_selling_price ||
          (item.dish_id ? item.dishes?.selling_price : item.recommended_selling_price) ||
          0,
      };
    });
  }, [menuItems, menu.id, renderId]);

  const handleExport = async (format: 'pdf' | 'html' | 'csv') => {
    setExportLoading(format);
    try {
      const response = await fetch(
        `/api/menus/${menu.id}/allergen-matrix/export?format=${format}`,
        {
          method: 'GET',
        },
      );

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

  const handleRowClick = (
    e: React.MouseEvent<HTMLTableRowElement>,
    menuItemId: string,
    menuItemName: string,
    menuItemType: 'dish' | 'recipe',
  ) => {
    // Don't open if clicking on a link or button inside the row
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) {
      return;
    }

    setSelectedMenuItem({
      id: menuItemId,
      name: menuItemName,
      type: menuItemType,
      mousePosition: {
        x: e.clientX,
        y: e.clientY,
      },
    });
  };

  const handleCloseModal = () => {
    setSelectedMenuItem(null);
  };

  const handleRowKeyDown = (
    e: React.KeyboardEvent<HTMLTableRowElement>,
    menuItemId: string,
    menuItemName: string,
    menuItemType: 'dish' | 'recipe',
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // For keyboard, use center of row as position
      const rect = e.currentTarget.getBoundingClientRect();
      setSelectedMenuItem({
        id: menuItemId,
        name: menuItemName,
        type: menuItemType,
        mousePosition: {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        },
      });
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
                This menu has been finalized. View the allergen matrix below or export it for
                printing.
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
                      <AllergenTooltip allergenCode={allergen.code} position="bottom">
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
                      </AllergenTooltip>
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
                        handleRowClick(
                          e,
                          item.menuItemId,
                          item.name || '',
                          (item.type || 'dish') as 'dish' | 'recipe',
                        )
                      }
                      onKeyDown={e =>
                        handleRowKeyDown(
                          e,
                          item.menuItemId,
                          item.name || '',
                          (item.type || 'dish') as 'dish' | 'recipe',
                        )
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
                        // Defensive check - ensure allergens is an array
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
                              <AllergenTooltip allergenCode={allergen.code} position="top">
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
                              </AllergenTooltip>
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

      {/* Ingredient Popover */}
      {selectedMenuItem && (
        <IngredientPopover
          isOpen={true}
          menuItemId={selectedMenuItem.id}
          menuItemName={selectedMenuItem.name}
          menuItemType={selectedMenuItem.type}
          mousePosition={selectedMenuItem.mousePosition}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders when props don't change
export const MenuLockedView = memo(MenuLockedViewComponent, (prevProps, nextProps) => {
  // Only re-render if menu or menuItems actually changed
  const menuChanged =
    prevProps.menu.id !== nextProps.menu.id ||
    prevProps.menu.is_locked !== nextProps.menu.is_locked ||
    prevProps.menu.locked_at !== nextProps.menu.locked_at ||
    prevProps.menu.menu_name !== nextProps.menu.menu_name;

  const menuItemsChanged =
    prevProps.menuItems.length !== nextProps.menuItems.length ||
    prevProps.menuItems !== nextProps.menuItems; // Reference check

  if (menuChanged || menuItemsChanged) {
    logger.dev('[MenuLockedView] memo comparison - Props changed, allowing re-render', {
      menuChanged,
      menuItemsChanged,
      prevMenuId: prevProps.menu.id,
      nextMenuId: nextProps.menu.id,
      prevMenuItemsLength: prevProps.menuItems.length,
      nextMenuItemsLength: nextProps.menuItems.length,
    });
    return false; // Allow re-render
  }

  logger.dev('[MenuLockedView] memo comparison - Props unchanged, preventing re-render');
  return true; // Prevent re-render
});
