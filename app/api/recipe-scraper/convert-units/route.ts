/**
 * Recipe Unit Conversion API
 * Converts all scraped recipes to Australian units (ml, l, gm, kg)
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { convertUnit, normalizeUnit, getUnitCategory } from '@/lib/unit-conversion';
import { RecipeIngredient, ScrapedRecipe } from '../../../../scripts/recipe-scraper/parsers/types';
import { STORAGE_PATH } from '../../../../scripts/recipe-scraper/config';
import { normalizeIngredient } from '../../../../scripts/recipe-scraper/parsers/schema-validator';
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import { promisify } from 'util';

const gzip = promisify(zlib.gzip);

// Dynamic import to handle potential import failures gracefully
async function loadJSONStorage() {
  try {
    const storageMod = await import('../../../../scripts/recipe-scraper/storage/json-storage');
    return storageMod.JSONStorage;
  } catch (importErr) {
    logger.error('[Recipe Unit Conversion API] Failed to import JSONStorage:', {
      error: importErr instanceof Error ? importErr.message : String(importErr),
    });
    throw new Error('Failed to load JSONStorage module');
  }
}

/**
 * Convert ingredient unit to Australian units
 * - Volume: cups, fl_oz, tsp, tbsp → ml (or l if >= 1000ml)
 * - Weight: oz, lb → g (or kg if >= 1000g)
 * - Keep: ml, l, g, kg, pc, box, pack, etc.
 */
function convertToAustralianUnit(
  quantity: number,
  unit: string,
): { quantity: number; unit: string; converted: boolean; reason?: string } {
  if (!unit) {
    return { quantity, unit: '', converted: false, reason: 'no unit' };
  }

  const normalized = normalizeUnit(unit);
  const category = getUnitCategory(normalized);

  // Debug: Log what we're trying to convert
  logger.dev('[Unit Conversion] Converting unit:', {
    original: unit,
    normalized,
    category,
    quantity,
  });

  // Already Australian units - no conversion needed
  const australianUnits = [
    'ml',
    'l',
    'gm',
    'g',
    'kg',
    'pc',
    'box',
    'pack',
    'bag',
    'bottle',
    'can',
    'bunch',
    'piece',
    'pieces',
  ];
  if (australianUnits.includes(normalized)) {
    // Convert gm to g for consistency
    if (normalized === 'gm') {
      return { quantity, unit: 'g', converted: true, reason: 'normalized gm to g' };
    }
    return { quantity, unit: normalized, converted: false, reason: 'already Australian unit' };
  }

  // Volume conversions to ml
  if (category === 'volume') {
    // Check if it's a volume unit that needs conversion
    const volumeUnitsToConvert = [
      'cup',
      'cups',
      'fl_oz',
      'tsp',
      'tbsp',
      'teaspoon',
      'teaspoons',
      'tablespoon',
      'tablespoons',
      'fluid ounce',
      'fluid ounces',
    ];

    if (volumeUnitsToConvert.includes(normalized)) {
      try {
        const result = convertUnit(quantity, normalized, 'ml');
        // Convert to liters if >= 1000ml
        if (result.value >= 1000) {
          const literResult = convertUnit(result.value, 'ml', 'l');
          logger.dev('[Unit Conversion] Volume conversion:', {
            original: `${quantity} ${unit}`,
            converted: `${literResult.value} l`,
          });
          return {
            quantity: Math.round(literResult.value * 100) / 100, // Round to 2 decimals
            unit: 'l',
            converted: true,
            reason: `converted ${normalized} to l`,
          };
        }
        logger.dev('[Unit Conversion] Volume conversion:', {
          original: `${quantity} ${unit}`,
          converted: `${result.value} ml`,
        });
        return {
          quantity: Math.round(result.value * 100) / 100, // Round to 2 decimals
          unit: 'ml',
          converted: true,
          reason: `converted ${normalized} to ml`,
        };
      } catch (error) {
        logger.warn('[Unit Conversion] Failed to convert volume unit:', {
          unit,
          normalized,
          error: error instanceof Error ? error.message : String(error),
        });
        return { quantity, unit: normalized, converted: false, reason: 'conversion failed' };
      }
    }
  }

  // Weight conversions to g
  if (category === 'weight') {
    // Check if it's a weight unit that needs conversion
    const weightUnitsToConvert = ['oz', 'ounce', 'ounces', 'lb', 'pound', 'pounds'];

    if (weightUnitsToConvert.includes(normalized)) {
      try {
        const result = convertUnit(quantity, normalized, 'g');
        // Convert to kg if >= 1000g
        if (result.value >= 1000) {
          const kgResult = convertUnit(result.value, 'g', 'kg');
          logger.dev('[Unit Conversion] Weight conversion:', {
            original: `${quantity} ${unit}`,
            converted: `${kgResult.value} kg`,
          });
          return {
            quantity: Math.round(kgResult.value * 100) / 100, // Round to 2 decimals
            unit: 'kg',
            converted: true,
            reason: `converted ${normalized} to kg`,
          };
        }
        logger.dev('[Unit Conversion] Weight conversion:', {
          original: `${quantity} ${unit}`,
          converted: `${result.value} g`,
        });
        return {
          quantity: Math.round(result.value * 100) / 100, // Round to 2 decimals
          unit: 'g',
          converted: true,
          reason: `converted ${normalized} to g`,
        };
      } catch (error) {
        logger.warn('[Unit Conversion] Failed to convert weight unit:', {
          unit,
          normalized,
          error: error instanceof Error ? error.message : String(error),
        });
        return { quantity, unit: normalized, converted: false, reason: 'conversion failed' };
      }
    }
  }

  // Unknown unit - log it for debugging
  logger.warn('[Unit Conversion] Unknown unit (not converted):', {
    original: unit,
    normalized,
    category,
    quantity,
  });
  return { quantity, unit: normalized, converted: false, reason: `unknown unit: ${normalized}` };
}

/**
 * Convert recipe ingredients to Australian units
 * Parses original_text if quantity/unit are missing, then converts
 */
function convertRecipeIngredients(ingredients: RecipeIngredient[]): {
  ingredients: RecipeIngredient[];
  convertedCount: number;
} {
  let convertedCount = 0;

  const converted = ingredients.map(ing => {
    // If ingredient already has quantity and unit, use them
    let quantity = ing.quantity;
    let unit = ing.unit;
    let parsedName = ing.name;

    // If missing quantity or unit, try to parse from original_text
    if ((!quantity || !unit) && ing.original_text) {
      const parsed = normalizeIngredient(ing.original_text);
      if (parsed.quantity && parsed.unit) {
        quantity = parsed.quantity;
        unit = parsed.unit;
        parsedName = parsed.name || ing.name;
      } else {
        // Try alternative parsing: look for common patterns like "2 cups", "1/2 cup", etc.
        const text = ing.original_text.toLowerCase();
        const fractionMatch = text.match(
          /^(\d+\/\d+|\d+\.\d+|\d+)\s*(cup|cups|tbsp|tablespoon|tablespoons|tsp|teaspoon|teaspoons|oz|ounce|ounces|lb|pound|pounds|g|gram|grams|kg|kilogram|kilograms|ml|milliliter|milliliters|l|liter|liters|litre|litres)\s*(.+)$/i,
        );
        if (fractionMatch) {
          const qtyStr = fractionMatch[1];
          // Parse fraction
          if (qtyStr.includes('/')) {
            const [num, den] = qtyStr.split('/').map(Number);
            quantity = num / den;
          } else {
            quantity = parseFloat(qtyStr);
          }
          unit = fractionMatch[2].toLowerCase();
          parsedName = fractionMatch[3].trim() || ing.name;
        } else {
          // Can't parse - skip this ingredient
          return ing;
        }
      }
    }

    // If still no quantity or unit, skip
    if (!quantity || !unit) {
      return ing;
    }

    // Convert to Australian units
    const result = convertToAustralianUnit(quantity, unit);
    if (result.converted) {
      convertedCount++;
      // Update original_text with converted values
      const newOriginalText = `${result.quantity} ${result.unit} ${parsedName}`.trim();
      return {
        ...ing,
        quantity: result.quantity,
        unit: result.unit,
        name: parsedName || ing.name,
        original_text: newOriginalText || ing.original_text,
      };
    }

    // No conversion needed, but ensure quantity/unit are set
    return {
      ...ing,
      quantity: quantity,
      unit: unit,
    };
  });

  return { ingredients: converted, convertedCount };
}

/**
 * Update an existing recipe file (bypasses duplicate check)
 */
async function updateRecipeFile(
  recipe: ScrapedRecipe,
  filePath: string,
  storagePath: string,
): Promise<void> {
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(storagePath, filePath);

  // Ensure directory exists
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Save recipe JSON with compression
  const jsonString = JSON.stringify(recipe, null, 2);
  const compressed = await gzip(Buffer.from(jsonString, 'utf-8'));
  fs.writeFileSync(fullPath, compressed);
}

/**
 * POST /api/recipe-scraper/convert-units
 * Convert all recipes to Australian units
 */
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    try {
      await requireAuth(request);
    } catch (authErr) {
      if (authErr instanceof NextResponse) {
        return authErr;
      }
      logger.error('[Recipe Unit Conversion API] Authentication error:', {
        error: authErr instanceof Error ? authErr.message : String(authErr),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
        { status: 401 },
      );
    }

    // Check for dry-run parameter
    const searchParams = request.nextUrl.searchParams;
    const dryRun = searchParams.get('dry') === '1';

    // Load JSONStorage
    let JSONStorageClass;
    try {
      JSONStorageClass = await loadJSONStorage();
    } catch (loadErr) {
      logger.error('[Recipe Unit Conversion API] Failed to load JSONStorage:', {
        error: loadErr instanceof Error ? loadErr.message : String(loadErr),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to load storage module', 'INTERNAL_ERROR', 500),
        { status: 500 },
      );
    }

    const storage = new JSONStorageClass();
    const allRecipes = storage.getAllRecipes();

    if (allRecipes.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No recipes found to convert',
        data: {
          totalRecipes: 0,
          convertedRecipes: 0,
          totalIngredientsConverted: 0,
          dryRun,
        },
      });
    }

    // Get storage path for direct file updates
    const storagePath = path.join(process.cwd(), STORAGE_PATH);

    let convertedRecipes = 0;
    let totalIngredientsConverted = 0;
    const errors: Array<{ recipeId: string; error: string }> = [];

    // Process recipes in parallel batches for maximum speed
    // Use concurrency limit to balance speed and file system I/O
    const CONCURRENCY_LIMIT = 10; // Process 10 recipes concurrently
    const batches: (typeof allRecipes)[] = [];

    // Split recipes into batches
    for (let i = 0; i < allRecipes.length; i += CONCURRENCY_LIMIT) {
      batches.push(allRecipes.slice(i, i + CONCURRENCY_LIMIT));
    }

    logger.info(
      `[Recipe Unit Conversion API] Processing ${allRecipes.length} recipes in ${batches.length} parallel batches (${CONCURRENCY_LIMIT} concurrent per batch)`,
    );

    // Process each batch in parallel
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      const batchStartTime = Date.now();

      // Process all recipes in batch concurrently
      const batchPromises = batch.map(async entry => {
        try {
          const recipe = await storage.loadRecipe(entry.file_path);
          if (!recipe || !recipe.ingredients || recipe.ingredients.length === 0) {
            return { converted: false, ingredientCount: 0 };
          }

          // Debug: Log first few ingredients to see their structure (only once)
          if (batchIndex === 0 && convertedRecipes === 0 && !dryRun) {
            logger.dev('[Recipe Unit Conversion API] Sample ingredient structure:', {
              firstIngredient: recipe.ingredients[0],
              totalIngredients: recipe.ingredients.length,
              hasQuantity: recipe.ingredients.filter(ing => ing.quantity).length,
              hasUnit: recipe.ingredients.filter(ing => ing.unit).length,
              hasOriginalText: recipe.ingredients.filter(ing => ing.original_text).length,
            });
          }

          const { ingredients, convertedCount } = convertRecipeIngredients(recipe.ingredients);

          if (convertedCount > 0) {
            if (!dryRun) {
              // Update recipe with converted ingredients
              const updatedRecipe: ScrapedRecipe = {
                ...recipe,
                ingredients,
                updated_at: new Date().toISOString(),
              };

              // Update recipe file directly (bypasses duplicate check)
              await updateRecipeFile(updatedRecipe, entry.file_path, storagePath);
            }

            return { converted: true, ingredientCount: convertedCount };
          }

          return { converted: false, ingredientCount: 0 };
        } catch (error) {
          logger.error(`[Recipe Unit Conversion API] Error converting recipe ${entry.id}:`, {
            error: error instanceof Error ? error.message : String(error),
          });
          errors.push({
            recipeId: entry.id,
            error: error instanceof Error ? error.message : String(error),
          });
          return { converted: false, ingredientCount: 0, error: true };
        }
      });

      // Wait for all recipes in batch to complete
      const batchResults = await Promise.all(batchPromises);

      // Aggregate results
      for (const result of batchResults) {
        if (result.converted) {
          convertedRecipes++;
          totalIngredientsConverted += result.ingredientCount;
        }
      }

      const batchTime = Date.now() - batchStartTime;
      logger.dev(
        `[Recipe Unit Conversion API] Batch ${batchIndex + 1}/${batches.length} completed: ${batchResults.filter(r => r.converted).length} recipes converted in ${batchTime}ms`,
      );
    }

    return NextResponse.json({
      success: true,
      message: dryRun
        ? `Dry run: Would convert ${convertedRecipes} recipes (${totalIngredientsConverted} ingredients)`
        : `Successfully converted ${convertedRecipes} recipes (${totalIngredientsConverted} ingredients)`,
      data: {
        totalRecipes: allRecipes.length,
        convertedRecipes,
        totalIngredientsConverted,
        errors: errors.length > 0 ? errors : undefined,
        dryRun,
      },
    });
  } catch (err) {
    logger.error('[Recipe Unit Conversion API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/recipe-scraper/convert-units', operation: 'POST' },
    });

    if (err instanceof NextResponse) {
      return err;
    }

    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to convert recipe units',
        'INTERNAL_ERROR',
        500,
        err instanceof Error ? err.message : String(err),
      ),
      { status: 500 },
    );
  }
}
