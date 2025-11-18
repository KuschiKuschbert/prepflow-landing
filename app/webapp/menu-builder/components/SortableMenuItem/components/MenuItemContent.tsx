'use client';

import { Icon } from '@/components/ui/Icon';
import { ChefHat, Utensils } from 'lucide-react';
import { MenuItem } from '../../../types';

interface MenuItemContentProps {
  item: MenuItem;
}

/**
 * Menu item content component (icon, name, price).
 *
 * @component
 * @param {MenuItemContentProps} props - Component props
 * @returns {JSX.Element} Menu item content
 */
export function MenuItemContent({ item }: MenuItemContentProps) {
  const isRecipe = !!item.recipe_id;
  const isDish = !!item.dish_id;

  return (
    <div className="flex flex-1 items-center gap-2">
      {isDish ? (
        <Icon icon={Utensils} size="sm" className="text-[#29E7CD]" />
      ) : isRecipe ? (
        <Icon icon={ChefHat} size="sm" className="text-[#D925C7]" />
      ) : null}
      <div className="flex-1">
        {isDish ? (
          <>
            <div className="font-medium text-white">
              {item.dishes?.dish_name || 'Unknown Dish'}
            </div>
            <div className="flex items-baseline gap-2">
              {item.recommended_selling_price != null && (
                <div className="text-xs text-gray-500">
                  Recommended: ${item.recommended_selling_price.toFixed(2)}
                </div>
              )}
              <div className="cursor-pointer text-sm font-semibold text-[#29E7CD] transition-colors hover:text-[#29E7CD]/80">
                {item.actual_selling_price != null ? (
                  <>${item.actual_selling_price.toFixed(2)}</>
                ) : (
                  item.dishes?.selling_price != null && (
                    <>${item.dishes.selling_price.toFixed(2)}</>
                  )
                )}
              </div>
            </div>
          </>
        ) : isRecipe ? (
          <>
            <div className="font-medium text-white">
              {item.recipes?.recipe_name || 'Unknown Recipe'}
            </div>
            <div className="flex items-baseline gap-2">
              {item.recommended_selling_price != null && (
                <div className="text-xs text-gray-500">
                  Recommended: ${item.recommended_selling_price.toFixed(2)}
                </div>
              )}
              <div className="cursor-pointer text-sm font-semibold text-[#29E7CD] transition-colors hover:text-[#29E7CD]/80">
                {item.actual_selling_price != null ? (
                  <>${item.actual_selling_price.toFixed(2)}</>
                ) : (
                  item.recommended_selling_price != null && (
                    <>${item.recommended_selling_price.toFixed(2)}</>
                  )
                )}
              </div>
              {item.recommended_selling_price != null && (
                <div className="text-xs text-gray-400">per serve</div>
              )}
            </div>
          </>
        ) : (
          <div className="font-medium text-white">Unknown Item</div>
        )}
      </div>
    </div>
  );
}
