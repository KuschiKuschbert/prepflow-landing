import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { aggregateIngredientsFromRecipes } from './helpers/aggregateFromRecipes';
import { fetchAndMergeData } from './helpers/fetchAndMergeData';
import { processMenuItem } from './helpers/processMenuItem';
import { RecipeGroupedItem, SectionData } from './types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      menuId,
      userId: _userId,
      error: validationError,
    } = await import('./helpers/validateRequest').then(m => m.validateRequest(body));

    if (validationError) {
      return validationError;
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Database connection could not be established',
          'DATABASE_ERROR',
          500,
        ),
        { status: 500 },
      );
    }

    // Fetch and merge all necessary data
    const {
      menu,
      menuItems,
      sectionsMap,
      dishSectionsMap,
      dishRecipesMap,
      dishIngredientsMap,
      recipeIngredientsMap,
      recipeInstructionsMap,
    } = await fetchAndMergeData(menuId!);

    if (!menuItems || menuItems.length === 0) {
      return NextResponse.json({
        success: true,
        menuName: menu?.menu_name || 'Unknown Menu',
        sections: [],
        unassignedItems: [],
      });
    }

    // Map to store section data
    const sectionsData = new Map<string | null, SectionData>();
    const unassignedItems: RecipeGroupedItem[] = [];

    // Process each menu item using pre-fetched data
    // Process each menu item using pre-fetched data
    for (const menuItem of menuItems) {
      processMenuItem({
        menuItem,
        sectionsData,
        unassignedItems,
        sectionsMap,
        dishSectionsMap,
        dishRecipesMap,
        dishIngredientsMap,
        recipeIngredientsMap,
        recipeInstructionsMap,
      });
    }

    // Convert sections map to array
    const sections: SectionData[] = Array.from(sectionsData.values());

    // Add uncategorized section if there are unassigned items
    // Note: unassignedItems are essentially RecipeGroupedItem[]
    if (unassignedItems.length > 0) {
      sections.push({
        sectionId: null,
        sectionName: 'Uncategorized',
        aggregatedIngredients: aggregateIngredientsFromRecipes(unassignedItems),
        recipeGrouped: unassignedItems,
        prepInstructions: [],
      });
    }

    // AI prep details analysis removed - will be done async on frontend

    return NextResponse.json({
      success: true,
      menuName: menu?.menu_name || 'Unknown Menu',
      menuId: menu?.id || menuId,
      sections,
      unassignedItems: unassignedItems.length > 0 ? unassignedItems : undefined,
    });
  } catch (err) {
    logger.error('Unexpected error:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
