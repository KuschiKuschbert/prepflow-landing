import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import type { RecipeRecord } from '../types';

/**
 * Fetch all recipes
 */
export async function fetchRecipes(): Promise<{ recipes: RecipeRecord[] } | NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  const { data: recipes, error: recipesError } = await supabaseAdmin
    .from('recipes')
    .select('id, name');

  if (recipesError) {
    logger.error('[Audit Prices] Error fetching recipes:', {
      error: recipesError,
    });
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to fetch recipes', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  return { recipes: recipes || [] };
}
