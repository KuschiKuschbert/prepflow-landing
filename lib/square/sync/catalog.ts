/**
 * Catalog/Menu Items Sync Service
 * Handles bidirectional synchronization between Square Catalog and PrepFlow Dishes
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` (Sync Operations section) for
 * detailed sync operation documentation and usage examples.
 */

import { SquareClient } from 'square';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { getSquareClient } from '../client';
import { getSquareConfig } from '../config';
import { getMappingBySquareId, getMappingByPrepFlowId, createAutoMapping, SquareMapping } from '../mappings';
import { logSyncOperation, SyncOperation } from '../sync-log';
import { ApiErrorHandler } from '@/lib/api-error-handler';

export interface SyncResult {
  success: boolean;
  synced: number;
  created: number;
  updated: number;
  errors: number;
  errorMessages?: string[];
  metadata?: Record<string, any>;
}

export interface Dish {
  id: string;
  dish_name: string;
  description?: string;
  selling_price: number;
  category?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Sync catalog items from Square to PrepFlow
 * Creates or updates dishes based on Square catalog items
 */
export async function syncCatalogFromSquare(
  userId: string,
  locationId?: string,
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
      throw new Error('Square client not available');
    }

    const config = await getSquareConfig(userId);
    if (!config) {
      throw new Error('Square configuration not found');
    }

    const targetLocationId = locationId || config.default_location_id;
    if (!targetLocationId) {
      throw new Error('Location ID is required for catalog sync');
    }

    // Fetch Square catalog items
    const catalogApi = client.catalogApi;
    const listResponse = await catalogApi.listCatalog(undefined, 'ITEM');

    if (!listResponse.result?.objects) {
      logger.warn('[Square Catalog Sync] No catalog items found in Square');
      result.success = true;
      return result;
    }

    const squareItems = listResponse.result.objects.filter(
      obj => obj.type === 'ITEM' && obj.itemData,
    );

    logger.dev('[Square Catalog Sync] Found Square items:', {
      count: squareItems.length,
      userId,
      locationId: targetLocationId,
    });

    // Process each Square item
    for (const squareItem of squareItems) {
      try {
        if (!squareItem.id || !squareItem.itemData) {
          continue;
        }

        const squareItemId = squareItem.id;
        const itemData = squareItem.itemData;

        // Check if mapping exists
        let mapping = await getMappingBySquareId(squareItemId, 'dish', userId, targetLocationId);

        // Map Square item to PrepFlow dish
        const dishData = mapSquareItemToDish(squareItem, targetLocationId);

        if (mapping) {
          // Update existing dish
          const { error: updateError } = await supabaseAdmin
            .from('dishes')
            .update({
              dish_name: dishData.dish_name,
              description: dishData.description,
              selling_price: dishData.selling_price,
              category: dishData.category,
              updated_at: new Date().toISOString(),
            })
            .eq('id', mapping.prepflow_id);

          if (updateError) {
            logger.error('[Square Catalog Sync] Error updating dish:', {
              error: updateError.message,
              dishId: mapping.prepflow_id,
              squareItemId,
            });
            result.errors++;
            result.errorMessages?.push(`Failed to update dish ${mapping.prepflow_id}: ${updateError.message}`);
            continue;
          }

          // Update mapping sync timestamp
          const { error: mappingUpdateError1 } = await supabaseAdmin
            .from('square_mappings')
            .update({
              last_synced_at: new Date().toISOString(),
              last_synced_from_square: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', mapping.id);

          if (mappingUpdateError1) {
            logger.warn('[Square Catalog Sync] Error updating mapping sync timestamp:', {
              error: mappingUpdateError1.message,
              mappingId: mapping.id,
            });
          }

          result.updated++;
          result.synced++;
        } else {
          // Create new dish
          const { data: newDish, error: createError } = await supabaseAdmin
            .from('dishes')
            .insert({
              dish_name: dishData.dish_name,
              description: dishData.description,
              selling_price: dishData.selling_price,
              category: dishData.category,
            })
            .select()
            .single();

          if (createError || !newDish) {
            logger.error('[Square Catalog Sync] Error creating dish:', {
              error: createError?.message,
              squareItemId,
            });
            result.errors++;
            result.errorMessages?.push(`Failed to create dish: ${createError?.message || 'Unknown error'}`);
            continue;
          }

          // Create mapping
          const newMapping = await createAutoMapping(
            newDish.id,
            squareItemId,
            'dish',
            userId,
            targetLocationId,
          );

          if (!newMapping) {
            logger.error('[Square Catalog Sync] Error creating mapping:', {
              dishId: newDish.id,
              squareItemId,
            });
            result.errors++;
            result.errorMessages?.push(`Failed to create mapping for dish ${newDish.id}`);
            continue;
          }

          result.created++;
          result.synced++;
        }

        // Log sync operation
        await logSyncOperation({
          user_id: userId,
          operation_type: 'sync_catalog',
          direction: 'square_to_prepflow',
          entity_type: 'dish',
          entity_id: mapping?.prepflow_id,
          square_id: squareItemId,
          status: 'success',
        });
      } catch (itemError: any) {
        logger.error('[Square Catalog Sync] Error processing Square item:', {
          error: itemError.message,
          squareItemId: squareItem.id,
        });
        result.errors++;
        result.errorMessages?.push(`Failed to process Square item ${squareItem.id}: ${itemError.message}`);

        await logSyncOperation({
          user_id: userId,
          operation_type: 'sync_catalog',
          direction: 'square_to_prepflow',
          entity_type: 'dish',
          square_id: squareItem.id,
          status: 'error',
          error_message: itemError.message,
          error_details: { stack: itemError.stack },
        });
      }
    }

    // Update last sync timestamp
    const { error: configUpdateError } = await supabaseAdmin
      .from('square_configurations')
      .update({
        last_menu_sync_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (configUpdateError) {
      logger.warn('[Square Catalog Sync] Error updating sync timestamp:', {
        error: configUpdateError.message,
        userId,
      });
    }

    result.success = result.errors === 0;
    return result;
  } catch (error: any) {
    logger.error('[Square Catalog Sync] Fatal error:', {
      error: error.message,
      userId,
      stack: error.stack,
    });

    result.errorMessages?.push(`Fatal error: ${error.message}`);

    await logSyncOperation({
      user_id: userId,
      operation_type: 'sync_catalog',
      direction: 'square_to_prepflow',
      status: 'error',
      error_message: error.message,
      error_details: { stack: error.stack },
    });

    return result;
  }
}

/**
 * Sync dishes from PrepFlow to Square
 * Creates or updates Square catalog items based on PrepFlow dishes
 */
export async function syncCatalogToSquare(
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
      throw new Error('Square client not available');
    }

    const config = await getSquareConfig(userId);
    if (!config) {
      throw new Error('Square configuration not found');
    }

    const targetLocationId = config.default_location_id;
    if (!targetLocationId) {
      throw new Error('Default location ID is required for catalog sync');
    }

    // Fetch PrepFlow dishes
    let query = supabaseAdmin.from('dishes').select('*');

    if (dishIds && dishIds.length > 0) {
      query = query.in('id', dishIds);
    }

    const { data: dishes, error: dishesError } = await query;

    if (dishesError) {
      logger.error('[Square Catalog Sync] Error fetching dishes:', {
        error: dishesError.message,
        code: (dishesError as any).code,
        userId,
      });
      throw ApiErrorHandler.createError(
        `Failed to fetch dishes: ${dishesError.message}`,
        'DATABASE_ERROR',
        500,
      );
    }

    if (!dishes || dishes.length === 0) {
      logger.warn('[Square Catalog Sync] No dishes found in PrepFlow');
      result.success = true;
      return result;
    }

    logger.dev('[Square Catalog Sync] Found PrepFlow dishes:', {
      count: dishes.length,
      userId,
      locationId: targetLocationId,
    });

    const catalogApi = client.catalogApi;

    // Process each dish
    for (const dish of dishes) {
      try {
        // Check if mapping exists
        let mapping = await getMappingByPrepFlowId(dish.id, 'dish', userId);

        // Map PrepFlow dish to Square catalog item
        const squareItemData = mapDishToSquareItem(dish);

        if (mapping) {
          // Update existing Square item
          const updateResponse = await catalogApi.upsertCatalogObject({
            idempotencyKey: `${dish.id}-${Date.now()}`,
            object: {
              type: 'ITEM',
              id: mapping.square_id,
              itemData: squareItemData.itemData,
            },
          });

          if (updateResponse.result?.catalogObject) {
          // Update mapping sync timestamp
          const { error: mappingUpdateError } = await supabaseAdmin
            .from('square_mappings')
            .update({
              last_synced_at: new Date().toISOString(),
              last_synced_to_square: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', mapping.id);

          if (mappingUpdateError) {
            logger.warn('[Square Catalog Sync] Error updating mapping sync timestamp:', {
              error: mappingUpdateError.message,
              mappingId: mapping.id,
            });
          }

            result.updated++;
            result.synced++;
          } else {
            throw new Error('Failed to update Square item');
          }
        } else {
          // Create new Square item
          const createResponse = await catalogApi.upsertCatalogObject({
            idempotencyKey: `${dish.id}-${Date.now()}`,
            object: {
              type: 'ITEM',
              itemData: squareItemData.itemData,
            },
          });

          if (createResponse.result?.catalogObject && createResponse.result.catalogObject.id) {
            const squareItemId = createResponse.result.catalogObject.id;

            // Create mapping
            const newMapping = await createAutoMapping(
              dish.id,
              squareItemId,
              'dish',
              userId,
              targetLocationId,
            );

            if (!newMapping) {
              logger.error('[Square Catalog Sync] Error creating mapping:', {
                dishId: dish.id,
                squareItemId,
              });
              result.errors++;
              result.errorMessages?.push(`Failed to create mapping for dish ${dish.id}`);
              continue;
            }

            result.created++;
            result.synced++;
          } else {
            throw new Error('Failed to create Square item');
          }
        }

        // Log sync operation
        await logSyncOperation({
          user_id: userId,
          operation_type: 'sync_catalog',
          direction: 'prepflow_to_square',
          entity_type: 'dish',
          entity_id: dish.id,
          square_id: mapping?.square_id,
          status: 'success',
        });
      } catch (dishError: any) {
        logger.error('[Square Catalog Sync] Error processing dish:', {
          error: dishError.message,
          dishId: dish.id,
        });
        result.errors++;
        result.errorMessages?.push(`Failed to process dish ${dish.id}: ${dishError.message}`);

        await logSyncOperation({
          user_id: userId,
          operation_type: 'sync_catalog',
          direction: 'prepflow_to_square',
          entity_type: 'dish',
          entity_id: dish.id,
          status: 'error',
          error_message: dishError.message,
          error_details: { stack: dishError.stack },
        });
      }
    }

    // Update last sync timestamp
    const { error: configUpdateError } = await supabaseAdmin
      .from('square_configurations')
      .update({
        last_menu_sync_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (configUpdateError) {
      logger.warn('[Square Catalog Sync] Error updating sync timestamp:', {
        error: configUpdateError.message,
        userId,
      });
    }

    result.success = result.errors === 0;
    return result;
  } catch (error: any) {
    logger.error('[Square Catalog Sync] Fatal error:', {
      error: error.message,
      userId,
      stack: error.stack,
    });

    result.errorMessages?.push(`Fatal error: ${error.message}`);

    await logSyncOperation({
      user_id: userId,
      operation_type: 'sync_catalog',
      direction: 'prepflow_to_square',
      status: 'error',
      error_message: error.message,
      error_details: { stack: error.stack },
    });

    return result;
  }
}

/**
 * Bidirectional catalog sync
 * Syncs both directions based on sync direction configuration
 */
export async function syncCatalogBidirectional(userId: string): Promise<SyncResult> {
  try {
    const config = await getSquareConfig(userId);
    if (!config) {
      throw new Error('Square configuration not found');
    }

    const syncDirection = config.auto_sync_direction || 'prepflow_to_square';

    if (syncDirection === 'bidirectional') {
      // Sync both directions
      const fromSquareResult = await syncCatalogFromSquare(userId);
      const toSquareResult = await syncCatalogToSquare(userId);

      return {
        success: fromSquareResult.success && toSquareResult.success,
        synced: fromSquareResult.synced + toSquareResult.synced,
        created: fromSquareResult.created + toSquareResult.created,
        updated: fromSquareResult.updated + toSquareResult.updated,
        errors: fromSquareResult.errors + toSquareResult.errors,
        errorMessages: [
          ...(fromSquareResult.errorMessages || []),
          ...(toSquareResult.errorMessages || []),
        ],
      };
    } else if (syncDirection === 'square_to_prepflow') {
      return await syncCatalogFromSquare(userId);
    } else {
      // Default: prepflow_to_square
      return await syncCatalogToSquare(userId);
    }
  } catch (error: any) {
    logger.error('[Square Catalog Sync] Bidirectional sync error:', {
      error: error.message,
      userId,
    });

    return {
      success: false,
      synced: 0,
      created: 0,
      updated: 0,
      errors: 1,
      errorMessages: [error.message],
    };
  }
}

/**
 * Map Square catalog item to PrepFlow dish
 */
function mapSquareItemToDish(squareItem: any, locationId: string): Dish {
  const itemData = squareItem.itemData;

  // Extract name (first variation name or item name)
  const name = itemData.name || 'Unnamed Item';

  // Extract description
  const description = itemData.descriptionHtml || itemData.descriptionPlaintext || undefined;

  // Extract price (from first variation or item)
  let price = 0;
  if (itemData.variations && itemData.variations.length > 0) {
    const firstVariation = itemData.variations[0];
    if (firstVariation.itemVariationData?.priceMoney) {
      const priceMoney = firstVariation.itemVariationData.priceMoney;
      price = (priceMoney.amount || 0) / 100; // Convert cents to dollars
    }
  }

  // Extract category (from category ID if available)
  let category: string | undefined;
  if (itemData.categoryId) {
    // Note: In a full implementation, we'd fetch the category name from Square
    // For now, we'll use a placeholder or extract from item name
    category = undefined; // TODO: Fetch category name from Square
  }

  return {
    id: '', // Will be set when creating dish
    dish_name: name,
    description,
    selling_price: price,
    category,
  };
}

/**
 * Map PrepFlow dish to Square catalog item
 */
function mapDishToSquareItem(dish: Dish): any {
  return {
    object: {
      type: 'ITEM',
      itemData: {
        name: dish.dish_name,
        descriptionHtml: dish.description || undefined,
        descriptionPlaintext: dish.description || undefined,
        variations: [
          {
            type: 'ITEM_VARIATION',
            itemVariationData: {
              name: dish.dish_name,
              pricingType: 'FIXED_PRICING',
              priceMoney: {
                amount: Math.round(dish.selling_price * 100), // Convert dollars to cents
                currency: 'AUD', // TODO: Make currency configurable
              },
            },
          },
        ],
        // TODO: Add category mapping if category exists
        // categoryId: dish.category ? getSquareCategoryId(dish.category) : undefined,
      },
    },
    itemData: {
      name: dish.dish_name,
      descriptionHtml: dish.description || undefined,
      descriptionPlaintext: dish.description || undefined,
      variations: [
        {
          type: 'ITEM_VARIATION',
          itemVariationData: {
            name: dish.dish_name,
            pricingType: 'FIXED_PRICING',
            priceMoney: {
              amount: Math.round(dish.selling_price * 100), // Convert dollars to cents
              currency: 'AUD', // TODO: Make currency configurable
            },
          },
        },
      ],
    },
  };
}
