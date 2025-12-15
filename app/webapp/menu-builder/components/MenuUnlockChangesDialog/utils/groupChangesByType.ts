import { MenuChangeTracking } from '@/lib/menu-lock/change-tracking';

/**
 * Group changes by entity type
 */
export function groupChangesByType(changes: MenuChangeTracking[]) {
  const grouped: Record<string, MenuChangeTracking[]> = {
    dish: [],
    recipe: [],
    ingredient: [],
  };

  for (const change of changes) {
    if (grouped[change.entity_type]) {
      grouped[change.entity_type].push(change);
    }
  }

  return grouped;
}

