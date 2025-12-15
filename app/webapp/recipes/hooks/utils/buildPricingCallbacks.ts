import { Recipe, RecipeIngredientWithDetails, RecipePriceData } from '../../types';
import { createPricingCallbacksHelper } from './buildPricingCallbacks/helpers/createCallbacks';

/**
 * Build pricing calculation callbacks.
 * @param {Object} params - Callback parameters
 * @returns {Object} Pricing callbacks
 */
export function buildPricingCallbacks({
  calculateRecommendedPrice,
  inFlightRequestsRef,
  batchRequestCacheRef,
  setRecipePrices,
  debounceTimerRef,
}: {
  calculateRecommendedPrice: (
    recipe: Recipe,
    ingredients: RecipeIngredientWithDetails[],
  ) => RecipePriceData | null;
  inFlightRequestsRef: React.MutableRefObject<Map<string, AbortController>>;
  batchRequestCacheRef: React.MutableRefObject<
    Map<string, Promise<Record<string, RecipeIngredientWithDetails[]>>>
  >;
  setRecipePrices: (
    prices:
      | Record<string, RecipePriceData>
      | ((prev: Record<string, RecipePriceData>) => Record<string, RecipePriceData>),
  ) => void;
  debounceTimerRef: React.MutableRefObject<NodeJS.Timeout | null>;
}) {
  return createPricingCallbacksHelper(
    calculateRecommendedPrice,
    inFlightRequestsRef,
    batchRequestCacheRef,
    setRecipePrices,
    debounceTimerRef,
  );
}
