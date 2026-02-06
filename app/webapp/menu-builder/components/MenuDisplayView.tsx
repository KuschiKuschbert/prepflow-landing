/**
 * Menu Display View Component
 * Displays menu items in a modern pub-style format with prices and categories
 */

'use client';

import { DietaryBadge } from '@/components/ui/DietaryBadge';
import { Menu, MenuItem } from '@/lib/types/menu-builder';
import { useMemo } from 'react';

interface MenuDisplayViewProps {
  menu: Menu;
  menuItems: MenuItem[];
}

/**
 * Component that displays menu items grouped by category in a modern pub-style format
 *
 * @component
 * @param {MenuDisplayViewProps} props - Component props
 * @returns {JSX.Element} Menu display view
 */
export function MenuDisplayView({ menu, menuItems }: MenuDisplayViewProps) {
  // Group items by category and sort
  const itemsByCategory = useMemo(() => {
    const grouped = new Map<string, MenuItem[]>();

    menuItems.forEach(item => {
      const category = item.category || 'Uncategorized';
      if (!grouped.has(category)) {
        grouped.set(category, []);
      }
      grouped.get(category)!.push(item);
    });

    // Sort categories alphabetically
    const sortedCategories = Array.from(grouped.keys()).sort();

    // Sort items within each category by position
    sortedCategories.forEach(category => {
      grouped.get(category)!.sort((a, b) => a.position - b.position);
    });

    return sortedCategories.map(category => ({
      category,
      items: grouped.get(category)!,
    }));
  }, [menuItems]);

  if (menuItems.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center space-y-3 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-subtle)] text-center">
        <p className="text-[var(--foreground-muted)]">No menu items added yet.</p>
        <p className="text-sm text-[var(--foreground-subtle)]">
          Add dishes or recipes to build your menu.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-[800px] max-w-5xl space-y-16 rounded-sm border border-neutral-800 bg-neutral-900/50 px-8 py-12">
      {/* Menu Header (Centered) */}
      <div className="space-y-6 text-center">
        <h2 className="desktop:text-6xl font-header text-5xl font-bold tracking-tight text-white uppercase">
          {menu.menu_name}
        </h2>
        {menu.description && (
          <div className="mx-auto max-w-2xl text-xl leading-relaxed font-light text-neutral-400 italic">
            &ldquo;{menu.description}&rdquo;
          </div>
        )}
        <div className="mx-auto h-0.5 w-32 bg-neutral-800"></div>
      </div>

      {/* Menu Items by Category */}
      <div className="space-y-16">
        {itemsByCategory.map(({ category, items }) => (
          <div key={category} className="space-y-10">
            {/* Category Header */}
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-neutral-800"></div>
              <h3 className="font-header text-2xl font-bold tracking-[0.2em] text-white uppercase">
                {category}
              </h3>
              <div className="h-px w-12 bg-neutral-800"></div>
            </div>

            {/* Items Grid - modernized list layout instead of cards for cleaner "menu" feel */}
            <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
              {items.map(item => {
                const isDish = !!item.dish_id;
                const itemName = isDish
                  ? item.dishes?.dish_name || 'Unknown Dish'
                  : item.recipes?.recipe_name || 'Unknown Recipe';

                const description = isDish ? item.dishes?.description : item.recipes?.description;

                // Get price
                const price =
                  item.actual_selling_price ||
                  (isDish ? item.dishes?.selling_price : item.recommended_selling_price) ||
                  0;

                // Get dietary info
                const isVegetarian =
                  item.is_vegetarian ??
                  (isDish ? item.dishes?.is_vegetarian : item.recipes?.is_vegetarian);
                const isVegan =
                  item.is_vegan ?? (isDish ? item.dishes?.is_vegan : item.recipes?.is_vegan);
                const dietaryConfidence =
                  item.dietary_confidence ||
                  (isDish ? item.dishes?.dietary_confidence : item.recipes?.dietary_confidence);

                return (
                  <div key={item.id} className="group relative flex flex-col">
                    <div className="mb-2 flex items-baseline justify-between border-b border-neutral-800 pb-1">
                      <h4 className="font-header text-lg font-bold text-neutral-100">{itemName}</h4>
                      <span className="font-header ml-4 text-lg font-semibold text-neutral-100">
                        ${price.toFixed(2)}
                      </span>
                    </div>

                    {description && (
                      <p className="text-sm leading-relaxed font-light text-neutral-500">
                        {description}
                      </p>
                    )}

                    {(isVegetarian || isVegan) && (
                      <div className="mt-2">
                        <DietaryBadge
                          isVegetarian={isVegetarian}
                          isVegan={isVegan}
                          confidence={dietaryConfidence}
                          size="sm"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
