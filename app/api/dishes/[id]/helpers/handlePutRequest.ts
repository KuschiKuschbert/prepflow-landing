import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { Dish } from '@/types/dish';
import { NextRequest, NextResponse } from 'next/server';
import { DishIngredientInput, DishRecipeInput } from '../../helpers/schemas';
import { buildDishUpdateData } from './buildDishUpdateData';
import { detectDishChanges } from './detectDishChanges';
import { fetchDishWithRelations } from './fetchDishWithRelations';
import { getUserEmail } from './getUserEmail';
import { handleIngredientUpdates } from './put/handleIngredientUpdates';
import { handleRecipeUpdates } from './put/handleRecipeUpdates';
import { performDishUpdate } from './put/performDishUpdate';
import { triggerSideEffects } from './put/triggerSideEffects';

interface UpdateDishBody {
  dish_name?: string;
  description?: string;
  selling_price?: number | string;
  category?: string;
  recipes?: DishRecipeInput[];
  ingredients?: DishIngredientInput[];
  [key: string]: unknown;
}

/**
 * Handles PUT request for updating a dish
 *
 * @param {NextRequest} request - Request object
 * @param {string} dishId - Dish ID
 * @returns {Promise<NextResponse>} Updated dish response
 */
export async function handlePutRequest(
  request: NextRequest,
  dishId: string,
): Promise<NextResponse> {
  const body = (await request.json()) as UpdateDishBody;
  const { recipes, ingredients } = body;

  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  // Get user email for change tracking
  const userEmail = await getUserEmail(request);

  // Fetch current dish to detect changes
  let currentDish: Dish | null = null;
  try {
    const enrichedDish = await fetchDishWithRelations(dishId);
    currentDish = enrichedDish as unknown as Dish;
  } catch (err) {
    logger.warn('[Dishes API] Could not fetch current dish for change detection:', err);
  }

  // Build update data
  const updateData = buildDishUpdateData(body);

  // Detect changes
  const { changes, changeDetails } = detectDishChanges(currentDish, updateData);

  // Update dish
  const updatedDish = await performDishUpdate(dishId, updateData);

  const dishName = (updatedDish.dish_name || currentDish?.dish_name || 'Unknown Dish') as string;

  // Update recipes if provided
  await handleRecipeUpdates(dishId, dishName, recipes, changes, changeDetails, userEmail || 'unknown');

  // Update ingredients if provided
  await handleIngredientUpdates(dishId, dishName, ingredients, changes, changeDetails, userEmail || 'unknown');

  // Trigger side effects
  await triggerSideEffects(request, dishId, dishName, changes, changeDetails, userEmail || 'unknown');

  return NextResponse.json({
    success: true,
    dish: updatedDish,
  });
}
