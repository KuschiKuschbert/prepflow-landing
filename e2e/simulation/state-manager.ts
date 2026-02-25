/**
 * State manager - tracks created entity IDs per persona prefix.
 * Used by action registry to pass dependent IDs (e.g. recipe id when adding ingredients).
 */
export type EntityType =
  | 'ingredients'
  | 'recipes'
  | 'menus'
  | 'dishes'
  | 'temperatureLogs'
  | 'orderLists'
  | 'prepLists';

const store: Map<string, Map<EntityType, string[]>> = new Map();

/**
 * Record a created entity ID for a prefix.
 */
export function addCreated(prefix: string, type: EntityType, id: string): void {
  let prefixMap = store.get(prefix);
  if (!prefixMap) {
    prefixMap = new Map();
    store.set(prefix, prefixMap);
  }
  const ids = prefixMap.get(type) ?? [];
  ids.push(id);
  prefixMap.set(type, ids);
}

/**
 *
 * Get all created IDs for a prefix and type.
 */
export function getCreated(prefix: string, type: EntityType): string[] {
  const prefixMap = store.get(prefix);
  if (!prefixMap) return [];
  return (prefixMap.get(type) ?? []) as string[];
}

/**
 * Get the first created ID for a prefix and type.
 */
export function getFirstCreated(prefix: string, type: EntityType): string | undefined {
  const ids = getCreated(prefix, type);
  return ids[0];
}

/**
 * Clear all tracked state for a prefix (e.g. after teardown).
 */
export function clear(prefix: string): void {
  store.delete(prefix);
}

/**
 * Clear all state for all prefixes.
 */
export function clearAll(): void {
  store.clear();
}
