import { Recipe } from '@/lib/types/recipes';
import { setupSubscriptionsHelper } from './recipeSubscriptionSetup/helpers/setupSubscriptions';
import type { SubscriptionRefs } from '@/lib/types/recipes';

export function setupRecipeSubscriptions(refs: SubscriptionRefs, recipes: Recipe[]) {
  return setupSubscriptionsHelper(refs, recipes);
}

export type { SubscriptionRefs };
