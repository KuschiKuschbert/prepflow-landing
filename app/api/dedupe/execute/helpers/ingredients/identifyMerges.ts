import { IngredientGroup, IngredientMerge, UsageMap } from './types';

export function identifyIngredientMerges(
  ingGroups: Record<string, IngredientGroup>,
  usageByIng: UsageMap,
): IngredientMerge[] {
  const ingMerges: IngredientMerge[] = [];
  for (const [key, group] of Object.entries(ingGroups)) {
    if (group.ids.length <= 1) continue;
    // Choose survivor by usage, then recency
    const enriched = group.ids.map(id => ({ id, usage: usageByIng[id] || 0 }));
    // Sort descending by usage
    enriched.sort((a, b) => b.usage - a.usage);

    // Survivor is the one with highest usage
    const survivor = enriched[0].id;
    const removed = group.ids.filter(id => id !== survivor);

    group.survivor = survivor;
    ingMerges.push({ key, survivor, removed });
  }
  return ingMerges;
}
