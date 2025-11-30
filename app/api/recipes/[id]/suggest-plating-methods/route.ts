/**
 * GET /api/recipes/[id]/suggest-plating-methods
 *
 * Returns AI-suggested plating methods for a recipe based on dish name and ingredients
 */

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { supabaseAdmin } from '@/lib/supabase';
import { detectSuitablePlatingMethods } from '@/lib/ai/plating-method-detection';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const recipeId = id;

    // Check authentication
    let token;
    try {
      token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    } catch (tokenError) {
      logger.error('[Plating Method Suggestion] Token check failed:', {
        error: tokenError instanceof Error ? tokenError.message : String(tokenError),
        recipeId,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication failed', 'AUTH_ERROR', 401),
        { status: 401 },
      );
    }

    if (!token) {
      logger.warn('[Plating Method Suggestion] No token found', {
        recipeId,
        cookies: req.headers.get('cookie') ? 'present' : 'missing',
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'AUTH_ERROR', 401),
        { status: 401 },
      );
    }

    // Fetch recipe with ingredients
    const { data: recipe, error: recipeError } = await supabaseAdmin
      .from('recipes')
      .select('id, name, description')
      .eq('id', recipeId)
      .single();

    if (recipeError || !recipe) {
      logger.error('[Plating Method Suggestion] Recipe not found:', {
        error: recipeError?.message,
        recipeId,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Recipe not found', 'NOT_FOUND', 404),
        { status: 404 },
      );
    }

    // Fetch recipe ingredients
    const { data: recipeIngredients, error: ingredientsError } = await supabaseAdmin
      .from('recipe_ingredients')
      .select('ingredient_id, quantity, unit')
      .eq('recipe_id', recipeId);

    if (ingredientsError) {
      logger.error('[Plating Method Suggestion] Failed to fetch ingredients:', {
        error: ingredientsError.message,
        recipeId,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to fetch ingredients', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Fetch ingredient details
    const ingredientIds = recipeIngredients?.map(ri => ri.ingredient_id) || [];
    if (ingredientIds.length === 0) {
      return NextResponse.json({
        success: true,
        suggestions: [],
        message: 'No ingredients found for this recipe',
      });
    }

    const { data: ingredients, error: ingredientsDetailsError } = await supabaseAdmin
      .from('ingredients')
      .select('id, ingredient_name, category, storage_location')
      .in('id', ingredientIds);

    if (ingredientsDetailsError || !ingredients) {
      logger.error('[Plating Method Suggestion] Failed to fetch ingredient details:', {
        error: ingredientsDetailsError?.message,
        recipeId,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to fetch ingredient details', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Get recipe name and description
    const recipeName = (recipe as any).name || 'Recipe';
    const recipeDescription = (recipe as any).description || undefined;

    // Use AI to detect suitable plating methods
    logger.dev('[Plating Method Suggestion] Detecting suitable plating methods', {
      recipeId,
      recipeName,
      ingredientCount: ingredients.length,
    });

    const detectionResult = await detectSuitablePlatingMethods(
      recipeName,
      ingredients,
      recipeDescription,
    );

    logger.dev('[Plating Method Suggestion] Detection completed', {
      recipeId,
      suggestionCount: detectionResult.suggestions.length,
      method: detectionResult.method,
    });

    return NextResponse.json({
      success: true,
      suggestions: detectionResult.suggestions,
      dishCategory: detectionResult.dishCategory,
      overallReasoning: detectionResult.overallReasoning,
      method: detectionResult.method,
    });
  } catch (error) {
    logger.error('[Plating Method Suggestion] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to suggest plating methods',
        'INTERNAL_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}

