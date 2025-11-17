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
  prepInstructions: any[];
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

    // Collect all recipe IDs and dish IDs for batch fetching
    const recipeIds = new Set<string>();
    const dishIds = new Set<string>();
    const recipeInstructionsMap = new Map<string, string | null>();

    for (const menuItem of menuItems) {
      if (menuItem.dish_id) {
        const dishes = (menuItem as any).dishes;
        if (dishes) {
          const dish = Array.isArray(dishes) ? dishes[0] : dishes;
          if (dish && dish.id) {
            dishIds.add(dish.id);
          }
        }
      }
      if (menuItem.recipe_id) {
        const recipes = (menuItem as any).recipes;
        if (recipes) {
          const recipe = Array.isArray(recipes) ? recipes[0] : recipes;
          if (recipe && recipe.id) {
            recipeIds.add(recipe.id);
            recipeInstructionsMap.set(recipe.id, recipe.instructions || null);
          }
        }
      }
    }

    // Batch fetch all recipe ingredients upfront
    const recipeIngredientsMap = new Map<string, any[]>();
    if (recipeIds.size > 0) {
      const { data: allRecipeIngredients } = await supabaseAdmin
        .from('recipe_ingredients')
        .select('recipe_id, ingredient_id, quantity, unit, ingredients(id, ingredient_name)')
        .in('recipe_id', Array.from(recipeIds));

      if (allRecipeIngredients) {
        for (const ri of allRecipeIngredients) {
          const recipeId = (ri as any).recipe_id;
          if (!recipeIngredientsMap.has(recipeId)) {
            recipeIngredientsMap.set(recipeId, []);
          }
          recipeIngredientsMap.get(recipeId)!.push(ri);
        }
      }
    }

    // Batch fetch all dish data upfront
    const dishSectionsMap = new Map<string, { sectionId: string | null; sectionName: string }>();
    const dishRecipesMap = new Map<
      string,
      Array<{ recipe_id: string; quantity: number; recipe: any }>
    >();
    const dishIngredientsMap = new Map<string, any[]>();

    if (dishIds.size > 0) {
      const dishIdsArray = Array.from(dishIds);

      // Batch fetch dish sections
      const { data: allDishSections } = await supabaseAdmin
        .from('dish_sections')
        .select('dish_id, section_id, kitchen_sections(id, name)')
        .in('dish_id', dishIdsArray);

      if (allDishSections) {
        for (const ds of allDishSections) {
          const dishId = (ds as any).dish_id;
          const sectionId = (ds as any).section_id;
          const section = (ds as any).kitchen_sections;
          dishSectionsMap.set(dishId, {
            sectionId,
            sectionName: section?.name || 'Uncategorized',
          });
        }
      }

      // Batch fetch dish recipes
      const { data: allDishRecipes } = await supabaseAdmin
        .from('dish_recipes')
        .select('dish_id, recipe_id, quantity, recipes(id, recipe_name, instructions)')
        .in('dish_id', dishIdsArray);

      if (allDishRecipes) {
        for (const dr of allDishRecipes) {
          const dishId = (dr as any).dish_id;
          if (!dishRecipesMap.has(dishId)) {
            dishRecipesMap.set(dishId, []);
          }
          dishRecipesMap.get(dishId)!.push({
            recipe_id: (dr as any).recipe_id,
            quantity: (dr as any).quantity || 1,
            recipe: (dr as any).recipes,
          });
          // Also add recipe ID to recipeIds set for ingredient fetching
          if ((dr as any).recipes?.id) {
            recipeIds.add((dr as any).recipes.id);
            recipeInstructionsMap.set(
              (dr as any).recipes.id,
              (dr as any).recipes.instructions || null,
            );
          }
        }
      }

      // Batch fetch dish ingredients
      const { data: allDishIngredients } = await supabaseAdmin
        .from('dish_ingredients')
        .select('dish_id, ingredient_id, quantity, unit, ingredients(id, ingredient_name)')
        .in('dish_id', dishIdsArray);

      if (allDishIngredients) {
        for (const di of allDishIngredients) {
          const dishId = (di as any).dish_id;
          if (!dishIngredientsMap.has(dishId)) {
            dishIngredientsMap.set(dishId, []);
          }
          dishIngredientsMap.get(dishId)!.push(di);
        }
      }

      // Fetch ingredients for recipes in dishes (if not already fetched)
      if (recipeIds.size > 0) {
        const { data: dishRecipeIngredients } = await supabaseAdmin
          .from('recipe_ingredients')
          .select('recipe_id, ingredient_id, quantity, unit, ingredients(id, ingredient_name)')
          .in('recipe_id', Array.from(recipeIds));

        if (dishRecipeIngredients) {
          for (const ri of dishRecipeIngredients) {
            const recipeId = (ri as any).recipe_id;
            if (!recipeIngredientsMap.has(recipeId)) {
              recipeIngredientsMap.set(recipeId, []);
            }
            if (
              !recipeIngredientsMap
                .get(recipeId)!
                .some(existing => existing.ingredient_id === (ri as any).ingredient_id)
            ) {
              recipeIngredientsMap.get(recipeId)!.push(ri);
            }
          }
        }
      }
    }

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
