/**
 * Autosave ID Strategy
 * Derives a stable autosave ID, preferring a server ID and falling back to a deterministic hash
 * of important key fields to avoid draft key churn for new/unsaved entities.
 */

export function deriveAutosaveId(
  entityType: string,
  serverId?: string | null,
  keyFields: Array<string | number> = [],
): string {
  if (serverId && serverId !== 'new') return String(serverId);
  const base = `${entityType}:${keyFields.map(String).join('|')}`;
  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    const chr = base.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return `tmp_${entityType}_${Math.abs(hash)}`;
}
