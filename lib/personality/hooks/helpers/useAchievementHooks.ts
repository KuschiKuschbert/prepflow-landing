'use client';

import {
  trackRecipeCreated,
  trackIngredientAdded,
  trackDishCreated,
  trackCOGSCalculated,
  trackPerformanceAnalyzed,
  trackTemperatureLogged,
  trackRecipeShared,
  trackMenuBuilt,
} from '../../achievement-tracker';
import { createAchievementHook } from './useAchievementHooks/helpers/createAchievementHook';

export const useOnRecipeCreated = createAchievementHook({
  feature: 'recipes',
  trackFn: trackRecipeCreated,
  successType: 'create',
});

export const useOnIngredientAdded = createAchievementHook({
  feature: 'ingredients',
  trackFn: trackIngredientAdded,
  successType: 'create',
});

export const useOnDishCreated = createAchievementHook({
  feature: 'menu',
  trackFn: trackDishCreated,
  successType: 'create',
});

export const useOnCOGSCalculated = createAchievementHook({
  feature: 'cogs',
  trackFn: trackCOGSCalculated,
  successType: 'update',
});

export const useOnPerformanceAnalyzed = createAchievementHook({
  feature: 'performance',
  trackFn: trackPerformanceAnalyzed,
  successType: 'update',
});

export const useOnTemperatureLogged = createAchievementHook({
  feature: 'temperature',
  trackFn: trackTemperatureLogged,
  successType: 'create',
});

export const useOnRecipeShared = createAchievementHook({
  trackFn: trackRecipeShared,
  successType: 'update',
});

export const useOnMenuBuilt = createAchievementHook({
  trackFn: trackMenuBuilt,
  successType: 'create',
});
