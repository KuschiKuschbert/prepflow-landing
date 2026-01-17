import { RecipeMerge } from './types';

export function identifyRecipeMerges(
  recGroups: Record<string, { ids: string[]; survivor?: string }>,
  usageByRecipe: Record<string, number>,
): RecipeMerge[] {
  const recMerges: RecipeMerge[] = [];
  for (const [key, group] of Object.entries(recGroups)) {
    if (group.ids.length <= 1) continue;
    // Choose survivor by usage
    const enriched = group.ids.map(id => ({ id, usage: usageByRecipe[id] || 0 }));
    enriched.sort((a, b) => b.usage - a.usage);
    const survivor = enriched[0].id;
    const removed = group.ids.filter(id => id !== survivor);
    group.survivor = survivor;
    recMerges.push({ key, survivor, removed });
  }
  return recMerges;
}
