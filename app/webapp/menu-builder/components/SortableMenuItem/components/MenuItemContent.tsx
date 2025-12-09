'use client';

import { AllergenDisplay } from '@/components/ui/AllergenDisplay';
import { DietaryBadge } from '@/components/ui/DietaryBadge';
import { Icon } from '@/components/ui/Icon';
import { consolidateAllergens } from '@/lib/allergens/australian-allergens';
import { logger } from '@/lib/logger';
import { AlertCircle, AlertTriangle, ChefHat, Utensils } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { MenuItem } from '../../../types';
import { useMenuItemStatistics } from '../hooks/useMenuItemStatistics';

interface MenuItemContentProps {
  item: MenuItem;
  menuId: string;
}

/**
 * Menu item content component (icon, name, price).
 *
 * @component
 * @param {MenuItemContentProps} props - Component props
 * @returns {JSX.Element} Menu item content
 */
export function MenuItemContent({ item, menuId }: MenuItemContentProps) {
  const prevItemRef = useRef<MenuItem>(item);
  const renderCountRef = useRef(0);

  // Log component render and item prop changes
  useEffect(() => {
    renderCountRef.current += 1;
    const itemReferenceChanged = prevItemRef.current !== item;
    const priceChanged = prevItemRef.current.actual_selling_price !== item.actual_selling_price;

    logger.dev('[MenuItemContent] Component render', {
      itemId: item.id,
      itemName: item.dishes?.dish_name || item.recipes?.recipe_name,
      renderCount: renderCountRef.current,
      itemReferenceChanged,
      priceChanged,
      itemReference: item,
      prevItemReference: prevItemRef.current,
      referencesEqual: prevItemRef.current === item,
      actual_selling_price: item.actual_selling_price,
      actual_selling_price_type: typeof item.actual_selling_price,
      prev_actual_selling_price: prevItemRef.current.actual_selling_price,
      prev_actual_selling_price_type: typeof prevItemRef.current.actual_selling_price,
      dishes_selling_price: item.dishes?.selling_price,
      recommended_selling_price: item.recommended_selling_price,
    });

    if (itemReferenceChanged || priceChanged) {
      logger.dev('[MenuItemContent] Item prop changed', {
        itemId: item.id,
        itemName: item.dishes?.dish_name || item.recipes?.recipe_name,
        itemReferenceChanged,
        priceChanged,
        oldPrice: prevItemRef.current.actual_selling_price,
        oldPriceType: typeof prevItemRef.current.actual_selling_price,
        newPrice: item.actual_selling_price,
        newPriceType: typeof item.actual_selling_price,
        oldItemReference: prevItemRef.current,
        newItemReference: item,
      });
    }

    prevItemRef.current = item;
  }, [item, menuId]);

  // Load statistics for warning/critical icons
  const { hasWarning, hasCritical } = useMenuItemStatistics(menuId, item);
  const isRecipe = !!item.recipe_id;
  const isDish = !!item.dish_id;

  // Final client-side validation: ensure vegan status doesn't conflict with allergens
  const itemAllergens =
    item.allergens || (isDish ? item.dishes?.allergens : item.recipes?.allergens) || [];
  const consolidatedAllergens = consolidateAllergens(itemAllergens);
  const itemIsVegan = item.is_vegan ?? (isDish ? item.dishes?.is_vegan : item.recipes?.is_vegan);

  // Validate and correct vegan status if it conflicts with allergens
  let validatedIsVegan = itemIsVegan;
  if (validatedIsVegan === true && consolidatedAllergens.length > 0) {
    const hasMilk = consolidatedAllergens.includes('milk');
    const hasEggs = consolidatedAllergens.includes('eggs');
    if (hasMilk || hasEggs) {
      logger.warn(
        '[MenuItemContent] Final validation: vegan=true but allergens include milk/eggs',
        {
          itemId: item.id,
          itemName: isDish ? item.dishes?.dish_name : item.recipes?.recipe_name,
          allergens: consolidatedAllergens,
          hasMilk,
          hasEggs,
        },
      );
      validatedIsVegan = false; // Correct the conflict
    }
  }

  return (
    <div className="flex flex-1 items-center gap-2">
      {/* Type Icon */}
      {isDish ? (
        <Icon icon={Utensils} size="sm" className="text-[#29E7CD]" />
      ) : isRecipe ? (
        <Icon icon={ChefHat} size="sm" className="text-[#D925C7]" />
      ) : null}

      <div className="flex-1">
        {isDish ? (
          <>
            <div className="font-medium text-white">{item.dishes?.dish_name || 'Unknown Dish'}</div>
            <div className="flex items-baseline gap-2">
              {/* Show "Recommended:" label only if actual price exists and differs from recommended */}
              {item.actual_selling_price != null &&
                item.recommended_selling_price != null &&
                Math.abs(item.actual_selling_price - item.recommended_selling_price) > 0.01 && (
                  <div className="text-xs text-gray-500">
                    Recommended: ${item.recommended_selling_price.toFixed(2)}
                  </div>
                )}
              <div className="flex items-center gap-1.5">
                <div className="cursor-pointer text-sm font-semibold text-[#29E7CD] transition-colors hover:text-[#29E7CD]/80">
                  {item.actual_selling_price != null ? (
                    <>${item.actual_selling_price.toFixed(2)}</>
                  ) : item.dishes?.selling_price != null ? (
                    <>${item.dishes.selling_price.toFixed(2)}</>
                  ) : item.recommended_selling_price != null ? (
                    <>${item.recommended_selling_price.toFixed(2)}</>
                  ) : null}
                </div>
                {hasCritical && (
                  <Icon
                    icon={AlertCircle}
                    size="xs"
                    className="text-red-400"
                    aria-label="Critical: Profit margin or food cost needs immediate attention"
                  />
                )}
                {!hasCritical && hasWarning && (
                  <Icon
                    icon={AlertTriangle}
                    size="xs"
                    className="text-yellow-400"
                    aria-label="Warning: Profit margin or food cost may need adjustment"
                  />
                )}
              </div>
            </div>
            {/* Allergens and Dietary Info for Dish */}
            {((item.allergens?.length ?? 0) > 0 ||
              item.is_vegetarian ||
              item.is_vegan ||
              (item.dishes?.allergens?.length ?? 0) > 0 ||
              item.dishes?.is_vegetarian ||
              item.dishes?.is_vegan) && (
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <AllergenDisplay
                  allergens={item.allergens || item.dishes?.allergens || []}
                  size="sm"
                  showEmpty={false}
                />
                <DietaryBadge
                  isVegetarian={item.is_vegetarian ?? item.dishes?.is_vegetarian}
                  isVegan={isDish ? validatedIsVegan : (item.is_vegan ?? item.dishes?.is_vegan)}
                  confidence={item.dietary_confidence || item.dishes?.dietary_confidence}
                  size="sm"
                />
              </div>
            )}
          </>
        ) : isRecipe ? (
          <>
            <div className="font-medium text-white">
              {item.recipes?.recipe_name || 'Unknown Recipe'}
            </div>
            <div className="flex items-baseline gap-2">
              {/* Show "Recommended:" label only if actual price exists and differs from recommended */}
              {item.actual_selling_price != null &&
                item.recommended_selling_price != null &&
                Math.abs(item.actual_selling_price - item.recommended_selling_price) > 0.01 && (
                  <div className="text-xs text-gray-500">
                    Recommended: ${item.recommended_selling_price.toFixed(2)}
                  </div>
                )}
              <div className="flex items-center gap-1.5">
                <div className="cursor-pointer text-sm font-semibold text-[#29E7CD] transition-colors hover:text-[#29E7CD]/80">
                  {item.actual_selling_price != null ? (
                    <>${item.actual_selling_price.toFixed(2)}</>
                  ) : item.recommended_selling_price != null ? (
                    <>${item.recommended_selling_price.toFixed(2)}</>
                  ) : null}
                </div>
                {hasCritical && (
                  <Icon
                    icon={AlertCircle}
                    size="xs"
                    className="text-red-400"
                    aria-label="Critical: Profit margin or food cost needs immediate attention"
                  />
                )}
                {!hasCritical && hasWarning && (
                  <Icon
                    icon={AlertTriangle}
                    size="xs"
                    className="text-yellow-400"
                    aria-label="Warning: Profit margin or food cost may need adjustment"
                  />
                )}
              </div>
              {/* Show "per serve" only when using recommended price (no actual price set) */}
              {item.actual_selling_price == null && item.recommended_selling_price != null && (
                <div className="text-xs text-gray-400">per serve</div>
              )}
            </div>
            {/* Allergens and Dietary Info for Recipe */}
            {((item.allergens?.length ?? 0) > 0 ||
              item.is_vegetarian ||
              item.is_vegan ||
              (item.recipes?.allergens?.length ?? 0) > 0 ||
              item.recipes?.is_vegetarian ||
              item.recipes?.is_vegan) && (
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <AllergenDisplay
                  allergens={item.allergens || item.recipes?.allergens || []}
                  size="sm"
                  showEmpty={false}
                />
                <DietaryBadge
                  isVegetarian={item.is_vegetarian ?? item.recipes?.is_vegetarian}
                  isVegan={isRecipe ? validatedIsVegan : (item.is_vegan ?? item.recipes?.is_vegan)}
                  confidence={item.dietary_confidence || item.recipes?.dietary_confidence}
                  size="sm"
                />
              </div>
            )}
          </>
        ) : (
          <div className="font-medium text-white">Unknown Item</div>
        )}
      </div>
    </div>
  );
}
