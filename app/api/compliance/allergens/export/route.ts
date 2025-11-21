/**
 * Compliance Allergen Export API Endpoint
 * GET /api/compliance/allergens/export
 * Exports allergen overview data in CSV, PDF, or HTML format
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import {
  AUSTRALIAN_ALLERGENS,
  consolidateAllergens,
  getAllergenDisplayName,
} from '@/lib/allergens/australian-allergens';
import {
  batchAggregateRecipeAllergens,
  aggregateDishAllergens,
  extractAllergenSources,
  mergeAllergenSources,
} from '@/lib/allergens/allergen-aggregation';
import { generateExportTemplate, escapeHtml } from '@/lib/exports/pdf-template';

/**
 * Exports allergen overview data for compliance.
 *
 * @param {NextRequest} request - Next.js request object
 * @returns {Promise<NextResponse>} Export file response
 */
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'html';
    const excludeAllergen = searchParams.get('exclude_allergen');
    const menuIdsParam = searchParams.get('menu_ids');
    const menuIds = menuIdsParam ? menuIdsParam.split(',').filter(id => id.trim()) : null;

    if (!['html', 'csv', 'pdf'].includes(format)) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Invalid format. Must be html, csv, or pdf',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    // Fetch all recipes - use select('*') to avoid column name issues
    let recipes: any[] = [];
    const { data: recipesData, error: recipesError } = await supabaseAdmin
      .from('recipes')
      .select('*');

    if (recipesError) {
      const errorCode = (recipesError as any).code;
      if (errorCode === '42P01') {
        // Table doesn't exist - return empty data
        logger.dev('[Compliance Allergen Export] Recipes table not found, returning empty data');
        recipes = [];
      } else {
        logger.error('[Compliance Allergen Export] Error fetching recipes:', {
          error: recipesError.message,
          code: errorCode,
          details: recipesError,
        });
        return NextResponse.json(
          ApiErrorHandler.createError(
            `Failed to fetch recipes: ${recipesError.message}`,
            'DATABASE_ERROR',
            500,
          ),
          { status: 500 },
        );
      }
    } else {
      recipes = recipesData || [];
    }

    // Fetch all dishes
    let dishes: any[] = [];
    const { data: dishesData, error: dishesError } = await supabaseAdmin
      .from('dishes')
      .select('id, dish_name, description, allergens');

    if (dishesError && (dishesError as any).code !== '42P01') {
      logger.warn('[Compliance Allergen Export] Error fetching dishes:', dishesError);
    } else if (dishesData) {
      dishes = dishesData;
    }

    // Batch aggregate allergens for recipes
    let allergensByRecipe: Record<string, string[]> = {};
    try {
      const recipeIds = (recipes || []).map(r => r.id);
      allergensByRecipe = await batchAggregateRecipeAllergens(recipeIds);
    } catch (err) {
      logger.warn('[Compliance Allergen Export] Error batch aggregating recipe allergens:', err);
    }

    // Fetch ingredient sources for recipes
    const recipeIngredientSources: Record<string, Record<string, string[]>> = {};
    try {
      const { data: recipeIngredients, error: recipeIngredientsError } = await supabaseAdmin
        .from('recipe_ingredients')
        .select(
          `
          recipe_id,
          ingredients (
            id,
            ingredient_name,
            allergens
          )
        `,
        );

      if (!recipeIngredientsError && recipeIngredients) {
        // Group ingredients by recipe_id
        const ingredientsByRecipe: Record<
          string,
          Array<{ ingredient_name: string; allergens?: string[] }>
        > = {};
        recipeIngredients.forEach((ri: any) => {
          const recipeId = ri.recipe_id;
          const ingredient = ri.ingredients;
          if (recipeId && ingredient) {
            if (!ingredientsByRecipe[recipeId]) {
              ingredientsByRecipe[recipeId] = [];
            }
            ingredientsByRecipe[recipeId].push({
              ingredient_name: ingredient.ingredient_name,
              allergens: ingredient.allergens,
            });
          }
        });

        // Extract allergen sources for each recipe using utility function
        Object.entries(ingredientsByRecipe).forEach(([recipeId, ingredients]) => {
          recipeIngredientSources[recipeId] = extractAllergenSources(ingredients);
        });
      }
    } catch (err) {
      logger.warn('[Compliance Allergen Export] Error fetching recipe ingredient sources:', err);
    }

    // Aggregate allergens for dishes and get ingredient sources
    const dishesWithAllergens = await Promise.all(
      (dishes || []).map(async dish => {
        let allergens: string[] = [];
        const allergenSources: Record<string, string[]> = {};

        try {
          if (dish.allergens && Array.isArray(dish.allergens)) {
            allergens = dish.allergens;
          } else {
            allergens = await aggregateDishAllergens(dish.id);
          }

          // Fetch dish ingredients to get allergen sources
          if (!supabaseAdmin) {
            throw new Error('Supabase admin client not initialized');
          }
          const { data: dishIngredients, error: dishIngredientsError } = await supabaseAdmin
            .from('dish_ingredients')
            .select(
              `
              ingredients (
                id,
                ingredient_name,
                allergens
              )
            `,
            )
            .eq('dish_id', dish.id);

          if (!dishIngredientsError && dishIngredients) {
            // Extract allergen sources using utility function
            const dishIngredientList = dishIngredients.map((di: any) => ({
              ingredient_name: di.ingredients?.ingredient_name || '',
              allergens: di.ingredients?.allergens,
            }));
            const dishIngredientSources = extractAllergenSources(dishIngredientList);
            Object.assign(allergenSources, dishIngredientSources);
          }

          // Also check dish recipes for allergens
          if (!supabaseAdmin) {
            throw new Error('Supabase admin client not initialized');
          }
          const { data: dishRecipes, error: dishRecipesError } = await supabaseAdmin
            .from('dish_recipes')
            .select(
              `
              recipe_id,
              recipes (
                id
              )
            `,
            )
            .eq('dish_id', dish.id);

          if (!dishRecipesError && dishRecipes) {
            // Collect recipe allergen sources for this dish
            const recipeSources: Record<string, string[]>[] = [];
            dishRecipes.forEach((dr: any) => {
              const recipeId = dr.recipe_id;
              if (recipeId && recipeIngredientSources[recipeId]) {
                recipeSources.push(recipeIngredientSources[recipeId]);
              }
            });

            // Merge recipe sources with dish ingredient sources using utility function
            if (recipeSources.length > 0) {
              const mergedSources = mergeAllergenSources(allergenSources, ...recipeSources);
              Object.assign(allergenSources, mergedSources);
            }
          }
        } catch (err) {
          logger.warn('[Compliance Allergen Export] Error aggregating dish allergens:', err);
        }
        return { ...dish, allergens, allergenSources };
      }),
    );

    // Fetch menu information
    let menuItemsMap: Record<string, Array<{ menu_id: string; menu_name: string }>> = {};
    try {
      const { data: menuItems, error: menuItemsError } = await supabaseAdmin
        .from('menu_items')
        .select('menu_id, dish_id, recipe_id, menus(id, menu_name)');

      if (!menuItemsError && menuItems) {
        menuItems.forEach((item: any) => {
          const itemId = item.dish_id || item.recipe_id;
          const menu = item.menus;
          if (itemId && menu) {
            if (!menuItemsMap[itemId]) {
              menuItemsMap[itemId] = [];
            }
            if (!menuItemsMap[itemId].some(m => m.menu_id === menu.id)) {
              menuItemsMap[itemId].push({
                menu_id: menu.id,
                menu_name: menu.menu_name || 'Unknown Menu',
              });
            }
          }
        });
      }
    } catch (err) {
      logger.warn('[Compliance Allergen Export] Error fetching menu items:', err);
    }

    // Combine recipes and dishes with allergen sources
    // Normalize recipe names (handle both recipe_name and name columns)
    const recipesWithNormalizedNames = recipes.map(r => ({
      ...r,
      recipe_name: (r as any).recipe_name || (r as any).name || '',
    }));

    const allItems = [
      ...recipesWithNormalizedNames.map(r => ({
        id: r.id,
        name: r.recipe_name,
        description: r.description,
        type: 'recipe' as const,
        allergens: consolidateAllergens(allergensByRecipe[r.id] || r.allergens || []).filter(code =>
          AUSTRALIAN_ALLERGENS.map(a => a.code).includes(code),
        ),
        allergenSources: recipeIngredientSources[r.id] || {},
        menus: menuItemsMap[r.id] || [],
      })),
      ...dishesWithAllergens.map(d => ({
        id: d.id,
        name: d.dish_name,
        description: d.description,
        type: 'dish' as const,
        allergens: consolidateAllergens(d.allergens || []).filter(code =>
          AUSTRALIAN_ALLERGENS.map(a => a.code).includes(code),
        ),
        allergenSources: d.allergenSources || {},
        menus: menuItemsMap[d.id] || [],
      })),
    ];

    // Apply filters
    let filteredItems = allItems;
    if (excludeAllergen) {
      filteredItems = filteredItems.filter(item => !item.allergens.includes(excludeAllergen));
    }
    if (menuIds && menuIds.length > 0) {
      filteredItems = filteredItems.filter(item =>
        item.menus.some(menu => menuIds.includes(menu.menu_id)),
      );
    }

    // Generate export based on format
    if (format === 'csv') {
      return generateCSV(filteredItems);
    }
    if (format === 'pdf') {
      return generateHTML(filteredItems, true);
    }
    return generateHTML(filteredItems, false);
  } catch (err) {
    logger.error('[Compliance Allergen Export] Error:', err);
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to export allergen overview',
        'SERVER_ERROR',
        500,
        err instanceof Error ? err.message : String(err),
      ),
      { status: 500 },
    );
  }
}

function generateCSV(items: any[]): NextResponse {
  const headers = ['Item Name', 'Type', 'Menus', ...AUSTRALIAN_ALLERGENS.map(a => a.displayName)];

  const rows = items.map(item => {
    const allergenColumns = AUSTRALIAN_ALLERGENS.map(allergen =>
      item.allergens.includes(allergen.code) ? 'Yes' : '',
    );
    const menuNames = item.menus.map((m: any) => m.menu_name).join('; ') || 'None';
    return [item.name, item.type, menuNames, ...allergenColumns];
  });

  const csvContent = [
    'Compliance Allergen Overview',
    '',
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="allergen_overview.csv"',
    },
  });
}

function generateHTML(items: any[], forPDF: boolean): NextResponse {
  // Build ingredient list for each item
  const itemsWithIngredients = items.map(item => {
    // Build map of ingredient name -> allergens it contributes to
    const ingredientAllergenMap: Record<string, string[]> = {};
    if (item.allergenSources) {
      Object.entries(item.allergenSources).forEach(([allergen, ingredients]) => {
        const ingredientList = Array.isArray(ingredients) ? ingredients : [];
        ingredientList.forEach((ingredientName: string) => {
          if (!ingredientAllergenMap[ingredientName]) {
            ingredientAllergenMap[ingredientName] = [];
          }
          if (!ingredientAllergenMap[ingredientName].includes(allergen)) {
            ingredientAllergenMap[ingredientName].push(allergen);
          }
        });
      });
    }
    const allIngredientNames = Object.keys(ingredientAllergenMap);
    return { ...item, ingredientNames: allIngredientNames };
  });

  // Format allergens as display names
  const formatAllergens = (allergens: string[]) => {
    if (!allergens || allergens.length === 0) return 'None';
    return allergens.map(code => getAllergenDisplayName(code)).join(', ');
  };

  // Generate table content
  const tableContent = `
    <style>
      .table-container {
        overflow-x: auto;
        margin-top: 32px;
      }
      
      table {
        width: 100%;
        border-collapse: collapse;
        background: rgba(26, 26, 26, 0.8);
        border-radius: 16px;
        overflow: hidden;
      }
      
      thead {
        background: linear-gradient(135deg, rgba(42, 42, 42, 0.9) 0%, rgba(42, 42, 42, 0.7) 100%);
      }
      
      th {
        padding: 16px 20px;
        text-align: left;
        font-weight: 600;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(42, 42, 42, 0.8);
        border-bottom: 2px solid rgba(41, 231, 205, 0.3);
      }
      
      tbody tr {
        border-bottom: 1px solid rgba(42, 42, 42, 0.6);
        transition: background-color 0.2s;
      }
      
      tbody tr:nth-child(even) {
        background: rgba(26, 26, 26, 0.4);
      }
      
      tbody tr:hover {
        background: rgba(41, 231, 205, 0.05);
      }
      
      td {
        padding: 16px 20px;
        border: 1px solid rgba(42, 42, 42, 0.6);
        color: rgba(255, 255, 255, 0.9);
        font-size: 14px;
        vertical-align: top;
      }
      
      .item-name {
        font-weight: 600;
        color: #ffffff;
      }
      
      .allergens-list {
        color: rgba(255, 255, 255, 0.9);
        line-height: 1.6;
      }
      
      .ingredients-list {
        color: rgba(255, 255, 255, 0.8);
        font-size: 13px;
        line-height: 1.6;
      }
      
      .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: rgba(255, 255, 255, 0.5);
      }
      
      .empty-state h3 {
        font-size: 20px;
        margin-bottom: 8px;
        color: rgba(255, 255, 255, 0.7);
      }
      
      @media print {
        table {
          background: #ffffff;
        }
        
        thead {
          background: #f5f5f5;
        }
        
        th {
          color: #000000;
          border-color: #cccccc;
        }
        
        tbody tr {
          border-color: #e0e0e0;
        }
        
        tbody tr:nth-child(even) {
          background: #f9f9f9;
        }
        
        td {
          color: #000000;
          border-color: #e0e0e0;
        }
        
        .item-name {
          color: #000000;
        }
        
        .allergens-list,
        .ingredients-list {
          color: #000000;
        }
        
        thead {
          display: table-header-group;
        }
        
        tbody tr {
          page-break-inside: avoid;
        }
      }
    </style>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Allergens</th>
            <th>From Ingredients</th>
          </tr>
        </thead>
        <tbody>
          ${
            itemsWithIngredients.length === 0
              ? '<tr><td colspan="3" class="empty-state"><h3>No Items Found</h3><p>No allergen data available for export.</p></td></tr>'
              : itemsWithIngredients
                  .map(
                    item => `
            <tr>
              <td>
                <div class="item-name">${escapeHtml(item.name || 'Unnamed ' + (item.type === 'recipe' ? 'Recipe' : 'Dish'))}</div>
              </td>
              <td class="allergens-list">${formatAllergens(item.allergens)}</td>
              <td class="ingredients-list">${
                item.ingredientNames.length > 0
                  ? item.ingredientNames.map((name: string) => escapeHtml(name)).join(', ')
                  : '—'
              }</td>
            </tr>
          `,
                  )
                  .join('')
          }
        </tbody>
      </table>
    </div>
  `;

  // Use shared template
  const htmlContent = generateExportTemplate({
    title: 'Allergen Overview',
    subtitle: 'Allergen Overview',
    content: tableContent,
    forPDF,
    totalItems: items.length,
  });

  return new NextResponse(htmlContent, {
    headers: {
      'Content-Type': 'text/html',
      'Content-Disposition': forPDF
        ? 'inline; filename="allergen_overview.html"'
        : 'inline; filename="allergen_overview.html"',
    },
  });
}
