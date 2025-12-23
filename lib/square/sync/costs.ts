/**
 * Food Cost Sync Service
 * Handles one-way synchronization of food costs from PrepFlow to Square Catalog Items
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` (Sync Operations section) for
 * detailed sync operation documentation and usage examples.
 */

import { SquareClient } from 'square';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { supabaseAdmin } from '@/lib/supabase';
import { getSquareClient } from '../client';
import { getSquareConfig } from '../config';
import { getMappingByPrepFlowId } from '../mappings';
import { logSyncOperation, SyncOperation } from '../sync-log';

export interface SyncResult {
  success: boolean;
  synced: number;
  created: number;
  updated: number;
  errors: number;
  errorMessages?: string[];
  metadata?: Record<string, any>;
}

export interface CostData {
  total_cost: number;
  food_cost_percent: number;
  gross_profit: number;
  gross_profit_margin: number;
  contributing_margin: number;
  contributing_margin_percent: number;
  last_updated: string;
}

/**
 * Calculate food cost for a dish
 * Uses the same logic as the dish cost API endpoint
 */
async function calculateDishFoodCost(dishId: string): Promise<CostData | null> {
  try {
    if (!supabaseAdmin) {
      logger.error('[Square Cost Sync] Database connection not available');
      return null;
    }

    // Fetch dish with recipes and ingredients
    const { data: dish, error: dishError } = await supabaseAdmin
      .from('dishes')
      .select('*')
      .eq('id', dishId)
      .single();

    if (dishError || !dish) {
      logger.error('[Square Cost Sync] Error fetching dish:', {
        error: dishError?.message,
        dishId,
      });
      return null;
    }

    let totalCost = 0;

    // Fetch dish recipes
    const { data: dishRecipes, error: dishRecipesError } = await supabaseAdmin
      .from('dish_recipes')
      .select(
        `
        quantity,
        recipes (
          id,
          recipe_name,
          recipe_ingredients (
            quantity,
            unit,
            ingredients (
              cost_per_unit,
              cost_per_unit_incl_trim,
              trim_peel_waste_percentage,
              yield_percentage,
              category
            )
          )
        )
      `,
      )
      .eq('dish_id', dishId);

    if (dishRecipesError) {
      logger.error('[Square Cost Sync] Error fetching dish recipes:', {
        error: dishRecipesError.message,
        dishId,
      });
    }

    // Calculate cost from recipes
    if (dishRecipes) {
      for (const dr of dishRecipes) {
        const recipe = dr.recipes as any;
        const recipeQuantity = parseFloat(dr.quantity) || 1;

        if (recipe?.recipe_ingredients) {
          for (const ri of recipe.recipe_ingredients) {
            const ingredient = ri.ingredients as any;
            if (ingredient) {
              const costPerUnit = ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
              const quantity = parseFloat(ri.quantity) || 0;
              const isConsumable = ingredient.category === 'Consumables';

              // For consumables: simple calculation (no waste/yield)
              if (isConsumable) {
                totalCost += quantity * costPerUnit * recipeQuantity;
                continue;
              }

              // For regular ingredients: apply waste/yield adjustments
              const wastePercent = ingredient.trim_peel_waste_percentage || 0;
              const yieldPercent = ingredient.yield_percentage || 100;

              let adjustedCost = quantity * costPerUnit * recipeQuantity;
              if (!ingredient.cost_per_unit_incl_trim && wastePercent > 0) {
                adjustedCost = adjustedCost / (1 - wastePercent / 100);
              }
              adjustedCost = adjustedCost / (yieldPercent / 100);

              totalCost += adjustedCost;
            }
          }
        }
      }
    }

    // Fetch dish ingredients
    const { data: dishIngredients, error: dishIngredientsError } = await supabaseAdmin
      .from('dish_ingredients')
      .select(
        `
        quantity,
        unit,
        ingredients (
          cost_per_unit,
          cost_per_unit_incl_trim,
          trim_peel_waste_percentage,
          yield_percentage,
          category
        )
      `,
      )
      .eq('dish_id', dishId);

    if (dishIngredientsError) {
      logger.error('[Square Cost Sync] Error fetching dish ingredients:', {
        error: dishIngredientsError.message,
        dishId,
      });
    }

    // Calculate cost from standalone ingredients
    if (dishIngredients) {
      for (const di of dishIngredients) {
        const ingredient = di.ingredients as any;
        if (ingredient) {
          const costPerUnit = ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
          const quantity = parseFloat(di.quantity) || 0;
          const isConsumable = ingredient.category === 'Consumables';

          // For consumables: simple calculation (no waste/yield)
          if (isConsumable) {
            totalCost += quantity * costPerUnit;
            continue;
          }

          // For regular ingredients: apply waste/yield adjustments
          const wastePercent = ingredient.trim_peel_waste_percentage || 0;
          const yieldPercent = ingredient.yield_percentage || 100;

          let adjustedCost = quantity * costPerUnit;
          if (!ingredient.cost_per_unit_incl_trim && wastePercent > 0) {
            adjustedCost = adjustedCost / (1 - wastePercent / 100);
          }
          adjustedCost = adjustedCost / (yieldPercent / 100);

          totalCost += adjustedCost;
        }
      }
    }

    const sellingPrice = parseFloat(dish.selling_price) || 0;
    const grossProfit = sellingPrice - totalCost;
    const grossProfitMargin = sellingPrice > 0 ? (grossProfit / sellingPrice) * 100 : 0;
    const foodCostPercent = sellingPrice > 0 ? (totalCost / sellingPrice) * 100 : 0;

    // Calculate contributing margin (Revenue excl GST - Food Cost)
    const gstRate = 0.1; // 10% GST for Australia
    const sellingPriceExclGST = sellingPrice / (1 + gstRate);
    const contributingMargin = sellingPriceExclGST - totalCost;
    const contributingMarginPercent =
      sellingPriceExclGST > 0 ? (contributingMargin / sellingPriceExclGST) * 100 : 0;

    return {
      total_cost: totalCost,
      food_cost_percent: foodCostPercent,
      gross_profit: grossProfit,
      gross_profit_margin: grossProfitMargin,
      contributing_margin: contributingMargin,
      contributing_margin_percent: contributingMarginPercent,
      last_updated: new Date().toISOString(),
    };
  } catch (error: any) {
    logger.error('[Square Cost Sync] Error calculating dish cost:', {
      error: error.message,
      dishId,
      stack: error.stack,
    });
    return null;
  }
}

/**
 * Update Square catalog item with cost data using custom attributes
 */
async function updateSquareItemCosts(
  client: SquareClient,
  squareItemId: string,
  costs: CostData,
): Promise<boolean> {
  try {
    const catalogApi = client.catalogApi;

    // Create custom attribute values for cost data
    const customAttributes = [
      {
        type: 'STRING',
        name: 'prepflow_total_cost',
        stringValue: costs.total_cost.toFixed(4),
      },
      {
        type: 'STRING',
        name: 'prepflow_food_cost_percent',
        stringValue: costs.food_cost_percent.toFixed(2),
      },
      {
        type: 'STRING',
        name: 'prepflow_gross_profit',
        stringValue: costs.gross_profit.toFixed(4),
      },
      {
        type: 'STRING',
        name: 'prepflow_gross_profit_margin',
        stringValue: costs.gross_profit_margin.toFixed(2),
      },
      {
        type: 'STRING',
        name: 'prepflow_contributing_margin',
        stringValue: costs.contributing_margin.toFixed(4),
      },
      {
        type: 'STRING',
        name: 'prepflow_contributing_margin_percent',
        stringValue: costs.contributing_margin_percent.toFixed(2),
      },
      {
        type: 'STRING',
        name: 'prepflow_cost_last_updated',
        stringValue: costs.last_updated,
      },
    ];

    // Update catalog object with custom attributes
    // Note: Square API requires updating the entire object, so we need to fetch first
    const getResponse = await catalogApi.retrieveCatalogObject(squareItemId, true);

    if (!getResponse.result?.object) {
      logger.error('[Square Cost Sync] Square catalog item not found:', { squareItemId });
      return false;
    }

    const existingObject = getResponse.result.object;
    const existingItemData = existingObject.itemData;

    if (!existingItemData) {
      logger.error('[Square Cost Sync] Square catalog item data not found:', { squareItemId });
      return false;
    }

    // Update with custom attributes
    const updateResponse = await catalogApi.upsertCatalogObject({
      idempotencyKey: `${squareItemId}-cost-${Date.now()}`,
      object: {
        type: 'ITEM',
        id: squareItemId,
        itemData: {
          ...existingItemData,
          customAttributeValues: customAttributes.reduce((acc, attr) => {
            acc[attr.name] = {
              type: attr.type,
              stringValue: attr.stringValue,
            };
            return acc;
          }, {} as Record<string, any>),
        },
      },
    });

    return !!updateResponse.result?.catalogObject;
  } catch (error: any) {
    logger.error('[Square Cost Sync] Error updating Square item costs:', {
      error: error.message,
      squareItemId,
      stack: error.stack,
    });
    return false;
  }
}

/**
 * Sync food costs from PrepFlow to Square
 * Calculates costs for dishes and updates Square catalog items with custom attributes
 */
export async function syncCostsToSquare(
  userId: string,
  dishIds?: string[],
): Promise<SyncResult> {
  const result: SyncResult = {
    success: false,
    synced: 0,
    created: 0,
    updated: 0,
    errors: 0,
    errorMessages: [],
  };

  try {
    const client = await getSquareClient(userId);
    if (!client) {
      logger.error('[Square Cost Sync] Square client not available for user:', { userId });
      result.errorMessages?.push('Square client not available');
      result.errors++;
      return result;
    }

    const config = await getSquareConfig(userId);
    if (!config) {
      logger.error('[Square Cost Sync] Square configuration not found for user:', { userId });
      result.errorMessages?.push('Square configuration not found');
      result.errors++;
      return result;
    }

    // Fetch PrepFlow dishes that have Square mappings
    let query = supabaseAdmin
      .from('dishes')
      .select(
        `
        *,
        square_mappings!inner (
          id,
          square_id,
          square_location_id
        )
      `,
      )
      .eq('square_mappings.entity_type', 'dish')
      .eq('square_mappings.user_id', userId);

    if (dishIds && dishIds.length > 0) {
      query = query.in('id', dishIds);
    }

    const { data: dishesWithMappings, error: dishesError } = await query;

    if (dishesError) {
      logger.error('[Square Cost Sync] Failed to fetch dishes:', {
        error: dishesError.message,
        userId,
      });
      result.errorMessages?.push(`Failed to fetch dishes: ${dishesError.message}`);
      result.errors++;
      return result;
    }

    if (!dishesWithMappings || dishesWithMappings.length === 0) {
      logger.warn('[Square Cost Sync] No dishes with Square mappings found');
      result.success = true;
      return result;
    }

    logger.dev('[Square Cost Sync] Found dishes with Square mappings:', {
      count: dishesWithMappings.length,
      userId,
    });

    // Process each dish
    for (const dishData of dishesWithMappings) {
      try {
        const dish = dishData as any;
        const mapping = dish.square_mappings?.[0];

        if (!mapping || !mapping.square_id) {
          logger.warn('[Square Cost Sync] No Square mapping found for dish:', {
            dishId: dish.id,
          });
          continue;
        }

        // Calculate food cost
        const costData = await calculateDishFoodCost(dish.id);

        if (!costData) {
          logger.error('[Square Cost Sync] Failed to calculate cost for dish:', {
            dishId: dish.id,
          });
          result.errors++;
          result.errorMessages?.push(`Failed to calculate cost for dish ${dish.id}`);
          continue;
        }

        // Update Square catalog item with cost data
        const updateSuccess = await updateSquareItemCosts(client, mapping.square_id, costData);

        if (!updateSuccess) {
          logger.error('[Square Cost Sync] Failed to update Square item costs:', {
            dishId: dish.id,
            squareItemId: mapping.square_id,
          });
          result.errors++;
          result.errorMessages?.push(
            `Failed to update Square item costs for dish ${dish.id}`,
          );
          continue;
        }

        // Log sync operation
        await logSyncOperation({
          user_id: userId,
          operation_type: 'sync_costs',
          direction: 'prepflow_to_square',
          entity_type: 'dish',
          entity_id: dish.id,
          square_id: mapping.square_id,
          status: 'success',
          sync_metadata: {
            total_cost: costData.total_cost,
            food_cost_percent: costData.food_cost_percent,
          },
        });

        result.updated++;
        result.synced++;
      } catch (dishError: any) {
        logger.error('[Square Cost Sync] Error processing dish:', {
          error: dishError.message,
          dishId: (dishData as any).id,
        });
        result.errors++;
        result.errorMessages?.push(
          `Failed to process dish ${(dishData as any).id}: ${dishError.message}`,
        );

        await logSyncOperation({
          user_id: userId,
          operation_type: 'sync_costs',
          direction: 'prepflow_to_square',
          entity_type: 'dish',
          entity_id: (dishData as any).id,
          status: 'error',
          error_message: dishError.message,
          error_details: { stack: dishError.stack },
        });
      }
    }

    result.success = result.errors === 0;
    result.metadata = {
      dishesProcessed: dishesWithMappings.length,
      costsSynced: result.synced,
    };

    return result;
  } catch (error: any) {
    logger.error('[Square Cost Sync] Fatal error:', {
      error: error.message,
      userId,
      stack: error.stack,
    });

    result.errorMessages?.push(`Fatal error: ${error.message}`);

    await logSyncOperation({
      user_id: userId,
      operation_type: 'sync_costs',
      direction: 'prepflow_to_square',
      status: 'error',
      error_message: error.message,
      error_details: { stack: error.stack },
    });

    return result;
  }
}
