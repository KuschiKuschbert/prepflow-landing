import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { fetchMenuData } from './helpers/fetchMenuData';
import { processDish } from './helpers/processDish';
import { processRecipe } from './helpers/processRecipe';
import { aggregateIngredientsFromRecipes } from './helpers/aggregateFromRecipes';

import { logger } from '@/lib/logger';
interface SectionData {
  sectionId: string | null;
  sectionName: string;
  aggregatedIngredients: any[];
  recipeGrouped: any[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { menuId, userId } = body;

    if (!menuId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'Menu ID is required',
        },
        { status: 400 },
      );
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
    const { menu, menuItems } = await fetchMenuData(menuId);

    if (!menuItems || menuItems.length === 0) {
      return NextResponse.json({
        success: true,
        menuName: menu.menu_name,
        sections: [],
        unassignedItems: [],
      });
    }

    // Fetch all kitchen sections
    const { data: kitchenSections } = await supabaseAdmin
      .from('kitchen_sections')
      .select('id, name')
      .eq('is_active', true);

    const sectionsMap = new Map<string, { id: string; name: string }>();
    if (kitchenSections) {
      kitchenSections.forEach(section => {
        sectionsMap.set(section.id, { id: section.id, name: section.name });
      });
    }

    // Map to store section data
    const sectionsData = new Map<string | null, SectionData>();
    const unassignedItems: any[] = [];

    // Process each menu item
    for (const menuItem of menuItems) {
      try {
        // Handle dish - dishes relation might be an array or single object
        if (menuItem.dish_id) {
          const dishes = (menuItem as any).dishes;
          if (dishes) {
            // Handle both array and single object cases
            const dish = Array.isArray(dishes) ? dishes[0] : dishes;
            if (dish && dish.id && dish.dish_name) {
              await processDish(
                dish.id,
                dish.dish_name,
                sectionsData,
                unassignedItems,
                sectionsMap,
              );
              continue; // Skip recipe processing if dish was processed
            }
          }
        }

        // Handle recipe directly in menu - recipes relation might be an array or single object
        if (menuItem.recipe_id) {
          const recipes = (menuItem as any).recipes;
          if (recipes) {
            // Handle both array and single object cases
            const recipe = Array.isArray(recipes) ? recipes[0] : recipes;
            if (recipe && recipe.id && recipe.name) {
              await processRecipe(
                recipe.id,
                recipe.name,
                null,
                null,
                sectionsData,
                unassignedItems,
                sectionsMap,
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
    const sections: SectionData[] = Array.from(sectionsData.values());

    // Add uncategorized section if there are unassigned items
    if (unassignedItems.length > 0) {
      sections.push({
        sectionId: null,
        sectionName: 'Uncategorized',
        aggregatedIngredients: aggregateIngredientsFromRecipes(unassignedItems),
        recipeGrouped: unassignedItems,
      });
    }

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
