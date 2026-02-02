/**
 * Create signature for menu item to detect changes.
 */
import type { MenuItem } from '@/lib/types/menu-builder';

export function createItemSignature(item: MenuItem): string {
  return `${item.id}:${item.actual_selling_price ?? 'null'}:${item.category}:${item.position}`;
}
