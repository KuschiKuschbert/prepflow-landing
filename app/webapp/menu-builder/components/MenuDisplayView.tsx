/**
 * Menu Display View Component
 * Displays menu items in a modern pub-style format with prices and categories
 */

'use client';

import { useMemo } from 'react';
import { Menu, MenuItem } from '../types';
import { DietaryBadge } from '@/components/ui/DietaryBadge';
import { FoodImageDisplay } from '@/components/ui/FoodImageDisplay';

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
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
        <p className="text-[var(--foreground-muted)]">No items in this menu</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Menu Header */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">{menu.menu_name}</h2>
        {menu.description && <p className="mt-2 text-sm text-[var(--foreground-muted)]">{menu.description}</p>}
      </div>

      {/* Menu Items by Category */}
      {itemsByCategory.map(({ category, items }) => (
        <div key={category} className="space-y-4">
          {/* Category Header */}
          <div className="flex items-center gap-3 border-b border-[var(--border)] pb-2">
            <h3 className="text-xl font-semibold tracking-wider text-[var(--foreground)] uppercase">
              {category}
            </h3>
            <span className="text-sm text-[var(--foreground-muted)]">({items.length})</span>
          </div>

          {/* Items Grid */}
          <div className="desktop:grid-cols-2 large-desktop:grid-cols-3 grid grid-cols-1 gap-4">
            {items.map(item => {
              const isDish = !!item.dish_id;
              const itemName = isDish
                ? item.dishes?.dish_name || 'Unknown Dish'
                : item.recipes?.recipe_name || 'Unknown Recipe';

              const description = isDish ? item.dishes?.description : item.recipes?.description;

              // Get price - prefer actual_selling_price, fallback to selling_price or recommended_selling_price
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

              // Get image URLs from dish or recipe (all plating methods)
              const imageUrl = isDish
                ? (item.dishes as any)?.image_url
                : (item.recipes as any)?.image_url;
              const imageUrlAlternative = isDish
                ? (item.dishes as any)?.image_url_alternative
                : (item.recipes as any)?.image_url_alternative;
              const imageUrlModern = isDish
                ? (item.dishes as any)?.image_url_modern
                : (item.recipes as any)?.image_url_modern;
              const imageUrlMinimalist = isDish
                ? (item.dishes as any)?.image_url_minimalist
                : (item.recipes as any)?.image_url_minimalist;
              const entityId = isDish ? item.dish_id : item.recipe_id;

              return (
                <div
                  key={item.id}
                  className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-all duration-200 hover:border-[var(--primary)]/50 hover:shadow-lg"
                >
                  {/* Food Image */}
                  {(imageUrl || imageUrlAlternative || imageUrlModern || imageUrlMinimalist) && (
                    <div className="mb-4">
                      <FoodImageDisplay
                        imageUrl={imageUrl}
                        imageUrlAlternative={imageUrlAlternative}
                        imageUrlModern={imageUrlModern}
                        imageUrlMinimalist={imageUrlMinimalist}
                        alt={itemName}
                        className="w-full"
                        priority={false}
                        showSelector={true}
                      />
                    </div>
                  )}

                  {/* Item Header with Name and Price */}
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <h4 className="flex-1 text-lg font-semibold text-[var(--foreground)]">{itemName}</h4>
                    <div className="flex-shrink-0">
                      <span className="text-lg font-bold text-[var(--primary)]">${price.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Description */}
                  {description && (
                    <p className="mb-3 text-sm leading-relaxed text-[var(--foreground-muted)]">{description}</p>
                  )}

                  {/* Dietary Badge */}
                  {(isVegetarian || isVegan) && (
                    <div className="mt-3">
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
  );
}
