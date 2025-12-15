/**
 * Create signature for menu item to detect changes.
 */
import type { MenuItem } from '../../../../types';

export function createItemSignature(item: MenuItem): string {
  return `${item.id}:${item.actual_selling_price ?? 'null'}:${item.category}:${item.position}`;
}
