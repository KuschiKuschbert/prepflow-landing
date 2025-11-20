import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { aggregateIngredientsFromRecipes } from './helpers/aggregateFromRecipes';
import { collectRecipeAndDishIds } from './helpers/collectRecipeAndDishIds';
import { fetchDishData, fetchRecipeIngredients } from './helpers/fetchBatchData';
import { fetchKitchenSections } from './helpers/fetchKitchenSections';
import { fetchMenuData } from './helpers/fetchMenuData';
import { mergeDishRecipeIngredients } from './helpers/mergeDishRecipeIngredients';
import { processDish } from './helpers/processDish';
import { processRecipe } from './helpers/processRecipe';

interface SectionData {
  sectionId: string | null;
  sectionName: string;
  aggregatedIngredients: any[];
  recipeGrouped: any[];
  prepInstructions: any[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      menuId,
      userId,
      error: validationError,
    } = await import('./helpers/validateRequest').then(m => m.validateRequest(body));

    if (validationError) {
      return validationError;
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database connection not available',
          message: 'Database connection could not be established',
        },
        { status: 500 },
      );
    }

    // Fetch menu data
    const { menu, menuItems } = await fetchMenuData(menuId!);

    if (!menuItems || menuItems.length === 0) {
      return NextResponse.json({
        success: true,
        menuName: menu.menu_name,
        sections: [],
        unassignedItems: [],
      });
    }

    // Fetch all kitchen sections
    const sectionsMap = await fetchKitchenSections();

    // Collect all recipe IDs and dish IDs for batch fetching
    const { recipeIds, dishIds, recipeInstructionsMap } = collectRecipeAndDishIds(menuItems);

    // Batch fetch all recipe ingredients upfront
    const recipeIngredientsMap = await fetchRecipeIngredients(recipeIds);

    // Batch fetch all dish data upfront
    const { dishSectionsMap, dishRecipesMap, dishIngredientsMap } = await fetchDishData(
      dishIds,
      recipeIds,
      recipeInstructionsMap,
    );

    // Merge dish recipe ingredients into main map
    await mergeDishRecipeIngredients(recipeIds, recipeIngredientsMap);

    // Map to store section data
    const sectionsData = new Map<string | null, SectionData>();
    const unassignedItems: any[] = [];

    // Process each menu item using pre-fetched data
    for (const menuItem of menuItems) {
      try {
        // Handle dish - dishes relation might be an array or single object
        if (menuItem.dish_id) {
          const dishes = (menuItem as any).dishes;
          if (dishes) {
            const dish = Array.isArray(dishes) ? dishes[0] : dishes;
            if (dish && dish.id && dish.dish_name) {
              const dishSection = dishSectionsMap.get(dish.id) || {
                sectionId: null,
                sectionName: 'Uncategorized',
              };
              const dishRecipes = dishRecipesMap.get(dish.id) || [];
              const dishIngredients = dishIngredientsMap.get(dish.id) || [];

              processDish(
                dish.id,
                dish.dish_name,
                sectionsData,
                unassignedItems,
                sectionsMap,
                dishSection,
                dishRecipes,
                dishIngredients,
                recipeIngredientsMap,
                recipeInstructionsMap,
              );
              continue; // Skip recipe processing if dish was processed
            }
          }
        }

        // Handle recipe directly in menu - recipes relation might be an array or single object
        if (menuItem.recipe_id) {
          const recipes = (menuItem as any).recipes;
          if (recipes) {
            const recipe = Array.isArray(recipes) ? recipes[0] : recipes;
            if (recipe && recipe.id && recipe.recipe_name) {
              const recipeIngredients = recipeIngredientsMap.get(recipe.id) || [];
              const instructions = recipeInstructionsMap.get(recipe.id) || null;

              processRecipe(
                recipe.id,
                recipe.recipe_name,
                null,
                null,
                sectionsData,
                unassignedItems,
                sectionsMap,
                1,
                instructions,
                recipeIngredients,
                null, // No dish section for standalone recipes
              );
            }
          }
        }
      } catch (itemError) {
        logger.error(`Error processing menu item ${menuItem.id}:`, itemError);
        // Continue processing other items even if one fails
      }
    }

    // Convert sections map to array
    let sections: SectionData[] = Array.from(sectionsData.values());

    // Add uncategorized section if there are unassigned items
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
      menuName: menu.menu_name,
      menuId: menu.id,
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
