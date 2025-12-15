import { Recipe } from '../../types';
import { setupSubscriptionsHelper } from './recipeSubscriptionSetup/helpers/setupSubscriptions';
import type { SubscriptionRefs } from './recipeSubscriptionSetup/types';

export function setupRecipeSubscriptions(refs: SubscriptionRefs, recipes: Recipe[]) {
  return setupSubscriptionsHelper(refs, recipes);
}

export type { SubscriptionRefs };
