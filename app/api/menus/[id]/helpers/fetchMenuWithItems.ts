import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { calculateRecipeSellingPrice } from '../../[id]/statistics/helpers/calculateRecipeSellingPrice';
import { calculateDishSellingPrice } from '../../[id]/statistics/helpers/calculateDishSellingPrice';
import { extractColumnName, logDetailedError } from './fetchMenuWithItems.helpers';
import { cacheRecommendedPrice } from '../items/[itemId]/helpers/cacheRecommendedPrice';

/**
 * Fetch menu with items.
 *
 * @param {string} menuId - Menu ID
 * @returns {Promise<Object>} Menu with items
 * @throws {Error} If menu not found
 */
export async function fetchMenuWithItems(menuId: string) {
  if (!supabaseAdmin) throw new Error('Database connection not available');

  // Fetch menu
  const { data: menu, error: menuError } = await supabaseAdmin
    .from('menus')
    .select('*')
    .eq('id', menuId)
    .single();

  if (menuError || !menu) {
    logDetailedError(menuError, 'Menu not found', menuId);
    throw ApiErrorHandler.createError('Menu not found', 'NOT_FOUND', 404, {
      message: 'The requested menu could not be found',
    });
  }

  // Fetch menu items with dishes and recipes
  // Progressive fallback: try with all columns, then without pricing, then without dietary/allergen, then without description
  let menuItems: any[] | null = null;
  let pricingError: any = null;
  let dietaryError: any = null;
  let descriptionError: any = null;

  // First try with all columns (pricing + dietary/allergen + description)
  const { data: itemsWithAll, error: allColumnsError } = await supabaseAdmin
    .from('menu_items')
    .select(
      `
      id,
      dish_id,
      recipe_id,
      category,
      position,
      actual_selling_price,
      recommended_selling_price,
      dishes (
        id,
        dish_name,
        description,
        selling_price,
        allergens,
        is_vegetarian,
        is_vegan,
        dietary_confidence,
        dietary_method
      ),
      recipes (
        id,
        name,
        description,
        yield,
        allergens,
        is_vegetarian,
        is_vegan,
        dietary_confidence,
        dietary_method
      )
    `,
    )
    .eq('menu_id', menuId)
    .order('category')
    .order('position');

  if (!allColumnsError && itemsWithAll) {
    menuItems = itemsWithAll;
  } else {
    // Check error type - check error code first, then message
    const errorCode = (allColumnsError as any)?.code;
    const errorMessage = allColumnsError?.message || '';
    const errorDetails = (allColumnsError as any)?.details || '';
    const errorHint = (allColumnsError as any)?.hint || '';
    const fullErrorText = `${errorMessage} ${errorDetails} ${errorHint}`.toLowerCase();

    // Log the full error for debugging
    logDetailedError(allColumnsError, 'Error fetching menu items, attempting fallback', menuId);

    // Check if it's a column not found error (code 42703)
    const isColumnNotFound = errorCode === '42703' || errorCode === 'COLUMN_NOT_FOUND';

    const isMissingPricingColumn =
      isColumnNotFound &&
      (fullErrorText.includes('actual_selling_price') ||
        fullErrorText.includes('recommended_selling_price') ||
        errorMessage.includes('actual_selling_price') ||
        errorMessage.includes('recommended_selling_price'));
    const isMissingDietaryColumn =
      isColumnNotFound &&
      (fullErrorText.includes('allergens') ||
        fullErrorText.includes('is_vegetarian') ||
        fullErrorText.includes('is_vegan') ||
        fullErrorText.includes('dietary_confidence') ||
        fullErrorText.includes('dietary_method') ||
        errorMessage.includes('allergens') ||
        errorMessage.includes('is_vegetarian') ||
        errorMessage.includes('is_vegan') ||
        errorMessage.includes('dietary_confidence') ||
        errorMessage.includes('dietary_method'));
    const isMissingDescriptionColumn =
      isColumnNotFound &&
      (fullErrorText.includes('description') || errorMessage.includes('description'));

    // Try without pricing columns (but with dietary/allergen)
    if (isMissingPricingColumn) {
      pricingError = allColumnsError;
      const columnName = extractColumnName(allColumnsError);
      logger.warn('[Menus API] Pricing columns not found, trying without them:', {
        error: errorMessage,
        columnName: columnName || 'unknown',
        context: { endpoint: '/api/menus/[id]', operation: 'GET', menuId },
      });

      const { data: itemsWithoutPricing, error: noPricingError } = await supabaseAdmin
        .from('menu_items')
        .select(
          `
          id,
          dish_id,
          recipe_id,
          category,
          position,
          dishes (
            id,
            dish_name,
            description,
            selling_price,
            allergens,
            is_vegetarian,
            is_vegan,
            dietary_confidence,
            dietary_method
          ),
          recipes (
            id,
            name,
            description,
            yield,
            allergens,
            is_vegetarian,
            is_vegan,
            dietary_confidence,
            dietary_method
          )
        `,
        )
        .eq('menu_id', menuId)
        .order('category')
        .order('position');

      if (!noPricingError && itemsWithoutPricing) {
        menuItems = itemsWithoutPricing;
      } else if (noPricingError) {
        // Check if the error is about missing dietary columns
        const noPricingErrorCode = (noPricingError as any)?.code;
        const noPricingErrorMessage = noPricingError.message || '';
        const noPricingErrorDetails = (noPricingError as any)?.details || '';
        const noPricingErrorHint = (noPricingError as any)?.hint || '';
        const noPricingFullErrorText =
          `${noPricingErrorMessage} ${noPricingErrorDetails} ${noPricingErrorHint}`.toLowerCase();
        const isColumnNotFoundInFallback =
          noPricingErrorCode === '42703' || noPricingErrorCode === 'COLUMN_NOT_FOUND';
        const isMissingDietaryInFallback =
          isColumnNotFoundInFallback &&
          (noPricingFullErrorText.includes('allergens') ||
            noPricingFullErrorText.includes('is_vegetarian') ||
            noPricingFullErrorText.includes('is_vegan') ||
            noPricingFullErrorText.includes('dietary_confidence') ||
            noPricingFullErrorText.includes('dietary_method') ||
            noPricingErrorMessage.includes('allergens') ||
            noPricingErrorMessage.includes('is_vegetarian') ||
            noPricingErrorMessage.includes('is_vegan') ||
            noPricingErrorMessage.includes('dietary_confidence') ||
            noPricingErrorMessage.includes('dietary_method'));

        const isMissingDescriptionInFallback =
          isColumnNotFoundInFallback &&
          (noPricingFullErrorText.includes('description') ||
            noPricingErrorMessage.includes('description'));

        if (isMissingDietaryInFallback || isMissingDescriptionInFallback) {
          // Try without dietary/allergen columns and/or description
          dietaryError = noPricingError;
          if (isMissingDescriptionInFallback) {
            descriptionError = noPricingError;
          }
          const columnName = extractColumnName(noPricingError);
          logger.warn(
            '[Menus API] Dietary/allergen/description columns not found, trying without them:',
            {
              error: noPricingErrorMessage,
              columnName: columnName || 'unknown',
              missingDietary: isMissingDietaryInFallback,
              missingDescription: isMissingDescriptionInFallback,
              context: { endpoint: '/api/menus/[id]', operation: 'GET', menuId },
            },
          );

          // Build query without dietary columns and description
          const { data: itemsMinimal, error: minimalError } = await supabaseAdmin
            .from('menu_items')
            .select(
              `
              id,
              dish_id,
              recipe_id,
              category,
              position,
              dishes (
                id,
                dish_name,
                selling_price
              ),
              recipes (
                id,
                name,
                yield
              )
            `,
            )
            .eq('menu_id', menuId)
            .order('category')
            .order('position');

          if (minimalError) {
            logDetailedError(
              minimalError,
              'Database error fetching menu items (minimal query failed)',
              menuId,
            );
            throw ApiErrorHandler.fromSupabaseError(minimalError, 500);
          }

          menuItems = itemsMinimal;
        } else {
          // Error but not about dietary columns - throw it
          logDetailedError(
            noPricingError,
            'Database error fetching menu items (no pricing fallback failed)',
            menuId,
          );
          throw ApiErrorHandler.fromSupabaseError(noPricingError, 500);
        }
      }
    } else if (isMissingDietaryColumn) {
      // Try without dietary/allergen columns (but with pricing)
      dietaryError = allColumnsError;
      const columnName = extractColumnName(allColumnsError);
      logger.warn('[Menus API] Dietary/allergen columns not found, trying without them:', {
        error: errorMessage,
        columnName: columnName || 'unknown',
        context: { endpoint: '/api/menus/[id]', operation: 'GET', menuId },
      });

      const { data: itemsWithoutDietary, error: noDietaryError } = await supabaseAdmin
        .from('menu_items')
        .select(
          `
          id,
          dish_id,
          recipe_id,
          category,
          position,
          actual_selling_price,
          recommended_selling_price,
          dishes (
            id,
            dish_name,
            description,
            selling_price
          ),
          recipes (
            id,
            name,
            description,
            yield
          )
        `,
        )
        .eq('menu_id', menuId)
        .order('category')
        .order('position');

      if (noDietaryError) {
        // Check if description is also missing
        const noDietaryErrorCode = (noDietaryError as any)?.code;
        const noDietaryErrorMessage = noDietaryError.message || '';
        const noDietaryErrorDetails = (noDietaryError as any)?.details || '';
        const noDietaryErrorHint = (noDietaryError as any)?.hint || '';
        const noDietaryFullErrorText =
          `${noDietaryErrorMessage} ${noDietaryErrorDetails} ${noDietaryErrorHint}`.toLowerCase();
        const isColumnNotFoundInDietaryFallback =
          noDietaryErrorCode === '42703' || noDietaryErrorCode === 'COLUMN_NOT_FOUND';
        const isMissingDescriptionInDietaryFallback =
          isColumnNotFoundInDietaryFallback &&
          (noDietaryFullErrorText.includes('description') ||
            noDietaryErrorMessage.includes('description'));

        if (isMissingDescriptionInDietaryFallback) {
          // Try without description too
          descriptionError = noDietaryError;
          const columnName = extractColumnName(noDietaryError);
          logger.warn('[Menus API] Description column also not found, trying without it:', {
            error: noDietaryErrorMessage,
            columnName: columnName || 'unknown',
            context: { endpoint: '/api/menus/[id]', operation: 'GET', menuId },
          });

          const { data: itemsWithoutDescription, error: noDescriptionError } = await supabaseAdmin
            .from('menu_items')
            .select(
              `
                id,
                dish_id,
                recipe_id,
                category,
                position,
                actual_selling_price,
                recommended_selling_price,
                dishes (
                  id,
                  dish_name,
                  selling_price
                ),
                recipes (
                  id,
                  recipe_name,
                  yield
                )
              `,
            )
            .eq('menu_id', menuId)
            .order('category')
            .order('position');

          if (noDescriptionError) {
            logDetailedError(
              noDescriptionError,
              'Database error fetching menu items (no description fallback failed)',
              menuId,
            );
            throw ApiErrorHandler.fromSupabaseError(noDescriptionError, 500);
          }

          menuItems = itemsWithoutDescription;
        } else {
          logDetailedError(
            noDietaryError,
            'Database error fetching menu items (no dietary fallback failed)',
            menuId,
          );
          throw ApiErrorHandler.fromSupabaseError(noDietaryError, 500);
        }
      } else {
        menuItems = itemsWithoutDietary;
      }
    } else {
      // Check if it's a column-not-found error for other columns (like category, position, etc.)
      // Try minimal query as last resort
      const unknownErrorCode = (allColumnsError as any)?.code;
      const isUnknownColumnNotFound =
        unknownErrorCode === '42703' || unknownErrorCode === 'COLUMN_NOT_FOUND';

      if (isUnknownColumnNotFound) {
        const columnName = extractColumnName(allColumnsError);
        logger.warn('[Menus API] Unknown column not found, trying minimal query:', {
          error: allColumnsError?.message,
          code: unknownErrorCode,
          columnName: columnName || 'unknown',
          context: { endpoint: '/api/menus/[id]', operation: 'GET', menuId },
        });

        const { data: itemsMinimal, error: minimalError } = await supabaseAdmin
          .from('menu_items')
          .select(
            `
            id,
            dish_id,
            recipe_id,
            dishes (
              id,
              dish_name,
              selling_price
            ),
            recipes (
              id,
              recipe_name,
              yield
            )
          `,
          )
          .eq('menu_id', menuId);

        if (minimalError) {
          // Final fallback: try without any relationships (just menu_items columns)
          logDetailedError(
            minimalError,
            'Database error fetching menu items (minimal query failed), trying without relationships',
            menuId,
          );

          const { data: itemsNoRelations, error: noRelationsError } = await supabaseAdmin
            .from('menu_items')
            .select('id, dish_id, recipe_id, category, position')
            .eq('menu_id', menuId)
            .order('category')
            .order('position');

          if (noRelationsError) {
            // Ultimate fallback: try with only essential columns (no ordering)
            const columnName = extractColumnName(noRelationsError);
            const isCategoryOrPositionMissing =
              columnName === 'category' ||
              columnName === 'position' ||
              noRelationsError.message?.includes('category') ||
              noRelationsError.message?.includes('position');

            if (isCategoryOrPositionMissing) {
              logger.warn(
                '[Menus API] Category/position columns missing, trying with only essential columns:',
                {
                  error: noRelationsError.message,
                  columnName: columnName || 'unknown',
                  context: { endpoint: '/api/menus/[id]', operation: 'GET', menuId },
                },
              );

              const { data: itemsEssential, error: essentialError } = await supabaseAdmin
                .from('menu_items')
                .select('id, dish_id, recipe_id')
                .eq('menu_id', menuId);

              if (essentialError) {
                logDetailedError(
                  essentialError,
                  'Database error fetching menu items (ultimate fallback with essential columns failed)',
                  menuId,
                );
                throw ApiErrorHandler.fromSupabaseError(essentialError, 500);
              }

              menuItems = itemsEssential || [];
            } else {
              logDetailedError(
                noRelationsError,
                'Database error fetching menu items (final fallback without relationships failed)',
                menuId,
              );
              throw ApiErrorHandler.fromSupabaseError(noRelationsError, 500);
            }
          } else {
            menuItems = itemsNoRelations || [];
          }
        } else {
          menuItems = itemsMinimal;
        }
      } else {
        // Unknown error that's not a column-not-found, throw it
        logDetailedError(
          allColumnsError,
          'Database error fetching menu items (unknown error)',
          menuId,
        );
        throw ApiErrorHandler.fromSupabaseError(allColumnsError, 500);
      }
    }
  }

  // Calculate recommended prices and aggregate allergens/dietary for items
  const itemsWithRecommendedPrices = await Promise.all(
    (menuItems || []).map(async (item: any) => {
      let recommendedPrice: number | null = null;

      // If pricing columns exist and recommended_selling_price already exists, use it
      if (item.recommended_selling_price != null && !pricingError) {
        recommendedPrice = item.recommended_selling_price;
      } else {
        // For dishes, calculate recommended price dynamically
        if (item.dish_id && item.dishes) {
          try {
            recommendedPrice = await calculateDishSellingPrice(item.dishes.id);
            // Cache the calculated price (non-blocking)
            if (recommendedPrice != null && recommendedPrice > 0) {
              cacheRecommendedPrice(menuId, item.id, item).catch(err => {
                logger.error('[Menus API] Failed to cache dish recommended price:', err);
              });
            }
          } catch (err) {
            logger.error('[Menus API] Error calculating dish selling price:', err);
            recommendedPrice = null;
          }
        }
        // For recipes, calculate recommended price per serving
        else if (item.recipe_id) {
          try {
            const fullRecipePrice = await calculateRecipeSellingPrice(item.recipe_id);
            // Divide by recipe yield to get per-serving price (matching frontend calculateRecipePrice logic)
            const recipeYield = item.recipes?.yield || 1;
            recommendedPrice = recipeYield > 0 ? fullRecipePrice / recipeYield : fullRecipePrice;
            // Cache the calculated price (non-blocking)
            if (recommendedPrice != null && recommendedPrice > 0) {
              cacheRecommendedPrice(menuId, item.id, item).catch(err => {
                logger.error('[Menus API] Failed to cache recipe recommended price:', err);
              });
            }
          } catch (err) {
            logger.error('[Menus API] Error calculating recipe selling price:', err);
            recommendedPrice = null;
          }
        }
      }

      // Aggregate allergens and dietary info if not already present
      // Only process if dietary columns are available (not in minimal fallback mode)
      let allergens: string[] = [];
      let isVegetarian: boolean | null = null;
      let isVegan: boolean | null = null;
      let dietaryConfidence: string | null = null;
      let dietaryMethod: string | null = null;

      // Helper function to normalize allergens from Supabase JSONB
      const normalizeAllergens = (allergenData: any, itemName?: string): string[] => {
        if (!allergenData) return [];
        if (Array.isArray(allergenData)) {
          // Filter out invalid values and ensure strings
          const validAllergens = allergenData.filter(
            (a): a is string => typeof a === 'string' && a.length > 0,
          );

          // Consolidate and validate against known allergen codes
          const {
            AUSTRALIAN_ALLERGENS,
            consolidateAllergens,
          } = require('@/lib/allergens/australian-allergens');
          const validCodes = AUSTRALIAN_ALLERGENS.map((a: { code: string }) => a.code);
          const consolidated = consolidateAllergens(validAllergens);
          const filtered = consolidated.filter((code: string) => validCodes.includes(code));

          // Log if we filtered out invalid codes
          if (validAllergens.length !== filtered.length && itemName) {
            logger.warn('[Menus API] Filtered out invalid allergen codes:', {
              itemName,
              original: validAllergens,
              filtered,
              removed: validAllergens.filter(c => !validCodes.includes(c)),
            });
          }

          return filtered;
        }
        // If it's not an array, return empty (shouldn't happen but handle gracefully)
        logger.warn('[Menus API] Allergens is not an array:', {
          type: typeof allergenData,
          value: allergenData,
          itemName,
        });
        return [];
      };

      // Only process dietary/allergen info if columns exist (not in minimal fallback)
      if (!dietaryError && (item.dish_id || item.recipe_id)) {
        if (item.dish_id && item.dishes) {
          // Aggregate allergens - prefer cached for performance, but validate against them
          const dishName = item.dishes.dish_name || 'Unknown Dish';
          const hasCachedAllergens =
            item.dishes.allergens !== undefined &&
            item.dishes.allergens !== null &&
            Array.isArray(item.dishes.allergens) &&
            item.dishes.allergens.length > 0;

          if (hasCachedAllergens) {
            // Use cached allergens (faster) but normalize them
            allergens = normalizeAllergens(item.dishes.allergens, dishName);
            logger.dev('[Menus API] Using cached dish allergens:', {
              dishName,
              allergens,
              dishId: item.dishes.id,
            });
          } else {
            // Only aggregate if no cached allergens exist
            try {
              const { aggregateDishAllergens } = await import(
                '@/lib/allergens/allergen-aggregation'
              );
              allergens = await aggregateDishAllergens(item.dishes.id, false); // Don't force
              logger.dev('[Menus API] Aggregated dish allergens:', {
                dishName,
                aggregated: allergens,
                dishId: item.dishes.id,
              });
            } catch (err) {
              logger.warn('[Menus API] Error aggregating dish allergens:', {
                error: err instanceof Error ? err.message : String(err),
                stack: err instanceof Error ? err.stack : undefined,
              });
              allergens = [];
            }
          }
          // Always trigger dietary recalculation to ensure fresh data
          // This fixes stale cached values (e.g., dishes incorrectly marked as vegan)
          try {
            const { aggregateDishDietaryStatus } = await import(
              '@/lib/dietary/dietary-aggregation'
            );
            const { consolidateAllergens } = await import('@/lib/allergens/australian-allergens');
            const dietaryResult = await aggregateDishDietaryStatus(item.dishes.id, false, true);
            if (dietaryResult) {
              // Runtime validation: check for conflict between vegan status and allergens
              let validatedIsVegan = dietaryResult.isVegan;
              const consolidatedAllergens = consolidateAllergens(allergens || []);
              if (validatedIsVegan === true) {
                const hasMilk = consolidatedAllergens.includes('milk');
                const hasEggs = consolidatedAllergens.includes('eggs');
                if (hasMilk || hasEggs) {
                  logger.warn(
                    '[Menus API] Runtime validation: dish vegan=true but allergens include milk/eggs',
                    {
                      dishId: item.dishes.id,
                      dishName,
                      allergens: consolidatedAllergens,
                      hasMilk,
                      hasEggs,
                    },
                  );
                  validatedIsVegan = false;
                }
              }

              // Use fresh recalculated values (with validation)
              logger.dev('[Menus API] Dish dietary recalculation result:', {
                dishId: item.dishes.id,
                dishName: dishName,
                isVegetarian: dietaryResult.isVegetarian,
                isVegan: validatedIsVegan,
                wasCorrected: validatedIsVegan !== dietaryResult.isVegan,
                confidence: dietaryResult.confidence,
                method: dietaryResult.method,
              });
              isVegetarian = dietaryResult.isVegetarian;
              isVegan = validatedIsVegan;
              dietaryConfidence = dietaryResult.confidence;
              dietaryMethod = dietaryResult.method;
            } else {
              // Fallback to cached values if recalculation fails
              // But still validate against allergens
              const { consolidateAllergens } = await import('@/lib/allergens/australian-allergens');
              let cachedIsVegan = null;
              if ('is_vegan' in item.dishes) {
                cachedIsVegan = item.dishes.is_vegan ?? null;
              }

              // Validate cached vegan status against allergens
              if (cachedIsVegan === true) {
                const consolidatedAllergens = consolidateAllergens(allergens || []);
                const hasMilk = consolidatedAllergens.includes('milk');
                const hasEggs = consolidatedAllergens.includes('eggs');
                if (hasMilk || hasEggs) {
                  logger.warn(
                    '[Menus API] Runtime validation: cached dish vegan=true but allergens include milk/eggs',
                    {
                      dishId: item.dishes.id,
                      dishName,
                      allergens: consolidatedAllergens,
                      hasMilk,
                      hasEggs,
                    },
                  );
                  cachedIsVegan = false;
                }
              }

              if ('is_vegetarian' in item.dishes) {
                isVegetarian = item.dishes.is_vegetarian ?? null;
              }
              isVegan = cachedIsVegan;
              if ('dietary_confidence' in item.dishes) {
                dietaryConfidence = item.dishes.dietary_confidence ?? null;
              }
              if ('dietary_method' in item.dishes) {
                dietaryMethod = item.dishes.dietary_method ?? null;
              }
            }
          } catch (err) {
            logger.warn(
              '[Menus API] Error recalculating dish dietary status, using cached values:',
              {
                dishId: item.dishes.id,
                error: err instanceof Error ? err.message : String(err),
              },
            );
            // Fallback to cached values, but validate against allergens
            const { consolidateAllergens } = await import('@/lib/allergens/australian-allergens');
            let cachedIsVegan = null;
            if ('is_vegan' in item.dishes) {
              cachedIsVegan = item.dishes.is_vegan ?? null;
            }

            // Validate cached vegan status against allergens
            if (cachedIsVegan === true) {
              const consolidatedAllergens = consolidateAllergens(allergens || []);
              const hasMilk = consolidatedAllergens.includes('milk');
              const hasEggs = consolidatedAllergens.includes('eggs');
              if (hasMilk || hasEggs) {
                logger.warn(
                  '[Menus API] Runtime validation: cached dish vegan=true but allergens include milk/eggs',
                  {
                    dishId: item.dishes.id,
                    dishName,
                    allergens: consolidatedAllergens,
                    hasMilk,
                    hasEggs,
                  },
                );
                cachedIsVegan = false;
              }
            }

            if ('is_vegetarian' in item.dishes) {
              isVegetarian = item.dishes.is_vegetarian ?? null;
            }
            isVegan = cachedIsVegan;
            if ('dietary_confidence' in item.dishes) {
              dietaryConfidence = item.dishes.dietary_confidence ?? null;
            }
            if ('dietary_method' in item.dishes) {
              dietaryMethod = item.dishes.dietary_method ?? null;
            }
          }
        } else if (item.recipe_id && item.recipes) {
          // Aggregate allergens - prefer cached for performance, but validate against them
          const recipeName = item.recipes.name || item.recipes.recipe_name || 'Unknown Recipe';
          const hasCachedAllergens =
            item.recipes.allergens !== undefined &&
            item.recipes.allergens !== null &&
            Array.isArray(item.recipes.allergens) &&
            item.recipes.allergens.length > 0;

          if (hasCachedAllergens) {
            // Use cached allergens (faster) but normalize them
            allergens = normalizeAllergens(item.recipes.allergens, recipeName);
            logger.dev('[Menus API] Using cached recipe allergens:', {
              recipeName,
              allergens,
              recipeId: item.recipes.id,
            });
          } else {
            // Only aggregate if no cached allergens exist
            try {
              const { aggregateRecipeAllergens } = await import(
                '@/lib/allergens/allergen-aggregation'
              );
              allergens = await aggregateRecipeAllergens(item.recipes.id, false); // Don't force
              logger.dev('[Menus API] Aggregated recipe allergens:', {
                recipeName,
                aggregated: allergens,
                recipeId: item.recipes.id,
              });
            } catch (err) {
              logger.warn('[Menus API] Error aggregating recipe allergens:', {
                error: err instanceof Error ? err.message : String(err),
                stack: err instanceof Error ? err.stack : undefined,
              });
              allergens = [];
            }
          }
          // Always trigger dietary recalculation to ensure fresh data
          // This fixes stale cached values (e.g., recipes incorrectly marked as vegan)
          try {
            const { aggregateRecipeDietaryStatus } = await import(
              '@/lib/dietary/dietary-aggregation'
            );
            const { consolidateAllergens } = await import('@/lib/allergens/australian-allergens');
            const dietaryResult = await aggregateRecipeDietaryStatus(item.recipes.id, false, true);
            if (dietaryResult) {
              // Runtime validation: check for conflict between vegan status and allergens
              let validatedIsVegan = dietaryResult.isVegan;
              const consolidatedAllergens = consolidateAllergens(allergens || []);
              if (validatedIsVegan === true) {
                const hasMilk = consolidatedAllergens.includes('milk');
                const hasEggs = consolidatedAllergens.includes('eggs');
                if (hasMilk || hasEggs) {
                  logger.warn(
                    '[Menus API] Runtime validation: recipe vegan=true but allergens include milk/eggs',
                    {
                      recipeId: item.recipes.id,
                      recipeName,
                      allergens: consolidatedAllergens,
                      hasMilk,
                      hasEggs,
                    },
                  );
                  validatedIsVegan = false;
                }
              }

              // Use fresh recalculated values (with validation)
              logger.dev('[Menus API] Recipe dietary recalculation result:', {
                recipeId: item.recipes.id,
                recipeName: recipeName,
                isVegetarian: dietaryResult.isVegetarian,
                isVegan: validatedIsVegan,
                wasCorrected: validatedIsVegan !== dietaryResult.isVegan,
                confidence: dietaryResult.confidence,
                method: dietaryResult.method,
              });
              isVegetarian = dietaryResult.isVegetarian;
              isVegan = validatedIsVegan;
              dietaryConfidence = dietaryResult.confidence;
              dietaryMethod = dietaryResult.method;
            } else {
              // Fallback to cached values if recalculation fails
              // But still validate against allergens
              const { consolidateAllergens } = await import('@/lib/allergens/australian-allergens');
              let cachedIsVegan = null;
              if ('is_vegan' in item.recipes) {
                cachedIsVegan = item.recipes.is_vegan ?? null;
              }

              // Validate cached vegan status against allergens
              if (cachedIsVegan === true) {
                const consolidatedAllergens = consolidateAllergens(allergens || []);
                const hasMilk = consolidatedAllergens.includes('milk');
                const hasEggs = consolidatedAllergens.includes('eggs');
                if (hasMilk || hasEggs) {
                  logger.warn(
                    '[Menus API] Runtime validation: cached recipe vegan=true but allergens include milk/eggs',
                    {
                      recipeId: item.recipes.id,
                      recipeName,
                      allergens: consolidatedAllergens,
                      hasMilk,
                      hasEggs,
                    },
                  );
                  cachedIsVegan = false;
                }
              }

              if ('is_vegetarian' in item.recipes) {
                isVegetarian = item.recipes.is_vegetarian ?? null;
              }
              isVegan = cachedIsVegan;
              if ('dietary_confidence' in item.recipes) {
                dietaryConfidence = item.recipes.dietary_confidence ?? null;
              }
              if ('dietary_method' in item.recipes) {
                dietaryMethod = item.recipes.dietary_method ?? null;
              }
            }
          } catch (err) {
            logger.warn(
              '[Menus API] Error recalculating recipe dietary status, using cached values:',
              {
                recipeId: item.recipes.id,
                error: err instanceof Error ? err.message : String(err),
              },
            );
            // Fallback to cached values, but validate against allergens
            const { consolidateAllergens } = await import('@/lib/allergens/australian-allergens');
            let cachedIsVegan = null;
            if ('is_vegan' in item.recipes) {
              cachedIsVegan = item.recipes.is_vegan ?? null;
            }

            // Validate cached vegan status against allergens
            if (cachedIsVegan === true) {
              const consolidatedAllergens = consolidateAllergens(allergens || []);
              const hasMilk = consolidatedAllergens.includes('milk');
              const hasEggs = consolidatedAllergens.includes('eggs');
              if (hasMilk || hasEggs) {
                logger.warn(
                  '[Menus API] Runtime validation: cached recipe vegan=true but allergens include milk/eggs',
                  {
                    recipeId: item.recipes.id,
                    recipeName,
                    allergens: consolidatedAllergens,
                    hasMilk,
                    hasEggs,
                  },
                );
                cachedIsVegan = false;
              }
            }

            if ('is_vegetarian' in item.recipes) {
              isVegetarian = item.recipes.is_vegetarian ?? null;
            }
            isVegan = cachedIsVegan;
            if ('dietary_confidence' in item.recipes) {
              dietaryConfidence = item.recipes.dietary_confidence ?? null;
            }
            if ('dietary_method' in item.recipes) {
              dietaryMethod = item.recipes.dietary_method ?? null;
            }
          }
        }
      }

      // Map recipe name from 'name' to 'recipe_name' for frontend compatibility
      if (item.recipes && item.recipes.name) {
        item.recipes.recipe_name = item.recipes.name;
      }

      // Final safety check: validate vegan status against allergens one more time
      // This catches any edge cases where validation might have been missed
      const { consolidateAllergens: finalConsolidateAllergens } = await import(
        '@/lib/allergens/australian-allergens'
      );
      const finalAllergens = finalConsolidateAllergens(allergens || []);
      let finalIsVegan = isVegan;
      if (finalIsVegan === true) {
        const hasMilk = finalAllergens.includes('milk');
        const hasEggs = finalAllergens.includes('eggs');
        if (hasMilk || hasEggs) {
          logger.warn('[Menus API] Final validation: vegan=true but allergens include milk/eggs', {
            itemId: item.id,
            itemName: item.dish_id
              ? item.dishes?.dish_name
              : item.recipes?.recipe_name || item.recipes?.name,
            allergens: finalAllergens,
            hasMilk,
            hasEggs,
          });
          finalIsVegan = false;
        }
      }

      const enrichedItem: any = {
        ...item,
        allergens: finalAllergens,
        is_vegetarian: isVegetarian,
        is_vegan: finalIsVegan,
        dietary_confidence: dietaryConfidence,
        dietary_method: dietaryMethod,
      };

      // Only add pricing fields if pricing columns exist (itemsWithPricing was successful)
      if (!pricingError) {
        enrichedItem.recommended_selling_price = recommendedPrice;
      }

      return enrichedItem;
    }),
  );

  return {
    ...menu,
    items: itemsWithRecommendedPrices,
  };
}
