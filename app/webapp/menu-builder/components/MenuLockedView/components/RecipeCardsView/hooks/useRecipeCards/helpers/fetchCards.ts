/**
 * Helper to fetch recipe cards from API.
 */

import { logger } from '@/lib/logger';
import { RecipeCardData, SubRecipeCards } from '../../../types';

export interface FetchCardsResult {
  success: boolean;
  cards?: RecipeCardData[];
  subRecipeCards?: SubRecipeCards;
  error?: string;
}

/**
 * Fetch recipe cards from API.
 */
export async function fetchCards(menuId: string, signal?: AbortSignal): Promise<FetchCardsResult> {
  const response = await fetch(`/api/menus/${menuId}/recipe-cards`, {
    signal,
  });

  if (signal?.aborted) {
    logger.dev('[useRecipeCards] Request was aborted');
    return { success: false, error: 'Request aborted' };
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch recipe cards: ${response.status}`);
  }

  const data = await response.json();
  logger.dev('[useRecipeCards] Fetched cards:', {
    mainCards: data.cards?.length || 0,
    subRecipeCards: data.subRecipeCards ? Object.keys(data.subRecipeCards).length : 0,
  });

  if (data.success) {
    return {
      success: true,
      cards: data.cards,
      subRecipeCards: data.subRecipeCards,
    };
  }

  return {
    success: false,
    error: data.error || 'Failed to load recipe cards',
  };
}
