/**
 * Get item name from menu item.
 */
import type { MenuItem } from '@/lib/types/menu-builder';

export function getItemName(item: MenuItem | undefined): string {
  return item?.dishes?.dish_name || item?.recipes?.recipe_name || 'this item';
}
