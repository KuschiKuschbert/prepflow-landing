/**
 * Handlers for recipe create/update flow in POST.
 */
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { triggerRecipeSync } from '@/lib/square/sync/hooks';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import type { CreateRecipeInput } from './schemas';
import { checkExistingRecipe } from './checkExistingRecipe';
import { createRecipe } from './createRecipe';
import { updateRecipe } from './updateRecipe';

function triggerSyncHook(
  request: NextRequest,
  recipeId: string | number,
  action: 'create' | 'update',
) {
  (async () => {
    try {
      await triggerRecipeSync(request, recipeId.toString(), action);
    } catch (err) {
      logger.error('[Recipes API] Error triggering Square sync:', {
        error: err instanceof Error ? err.message : String(err),
        recipeId,
      });
    }
  })();
}

export async function handleExistingRecipe(
  request: NextRequest,
  existingRecipe: { id: string | number },
  recipeData: CreateRecipeInput,
): Promise<NextResponse> {
  const { recipe: updatedRecipe, error: updateError } = await updateRecipe(
    existingRecipe.id,
    recipeData,
  );
  if (updateError) {
    const apiError = ApiErrorHandler.fromSupabaseError(updateError, 500);
    return NextResponse.json(apiError, { status: apiError.status || 500 });
  }
  triggerSyncHook(request, existingRecipe.id, 'update');
  revalidateTag('recipes', 'default');
  return NextResponse.json({ success: true, recipe: updatedRecipe, isNew: false });
}

export async function handleNewRecipe(
  request: NextRequest,
  recipeData: CreateRecipeInput,
  userId: string,
): Promise<NextResponse> {
  const { recipe: newRecipe, error: createError } = await createRecipe(
    recipeData.recipe_name,
    recipeData,
    userId,
  );
  if (createError) {
    const safeError = createError as { message: string; code?: string };
    logger.error('[Recipes API] Database error creating recipe:', {
      error: safeError.message || String(createError),
      code: safeError.code,
      context: { endpoint: '/api/recipes', operation: 'POST', recipeName: recipeData.recipe_name },
    });
    const apiError = ApiErrorHandler.fromSupabaseError(createError, 500);
    return NextResponse.json(apiError, { status: apiError.status || 500 });
  }
  if (newRecipe) {
    triggerSyncHook(request, newRecipe.id, 'create');
    revalidateTag('recipes', 'default');
  }
  return NextResponse.json({ success: true, recipe: newRecipe, isNew: true });
}

export async function resolveCreateOrUpdate(
  request: NextRequest,
  recipeData: CreateRecipeInput,
  userId: string,
): Promise<NextResponse> {
  const { recipe: existingRecipe, error: checkError } = await checkExistingRecipe(
    recipeData.recipe_name,
  );
  if (existingRecipe && !checkError) {
    return handleExistingRecipe(request, existingRecipe, recipeData);
  }
  return handleNewRecipe(request, recipeData, userId);
}
