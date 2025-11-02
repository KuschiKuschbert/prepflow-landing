import { createSupabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { cleanSampleIngredients } from '@/lib/sample-ingredients-clean';
import { cleanSampleSuppliers } from '@/lib/sample-suppliers-clean';
import { cleanSampleEquipment } from '@/lib/sample-equipment-clean';
import { cleanSampleCleaningAreas, cleanSampleCleaningTasks } from '@/lib/sample-cleaning-clean';
import { cleanSampleComplianceTypes } from '@/lib/sample-compliance-clean';
import { cleanSampleKitchenSections } from '@/lib/sample-sections-clean';
import { cleanSampleRecipes, recipeIngredientMappings } from '@/lib/sample-recipes-clean';

export async function POST(request: NextRequest) {
  // Prevent population in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      {
        error: 'Test data population is not allowed in production',
        message: 'This endpoint is only available in development mode',
      },
      { status: 403 },
    );
  }

  try {
    const supabaseAdmin = createSupabaseAdmin();

    const results = {
      cleaned: 0,
      populated: [] as Array<{ table: string; count: number }>,
      errors: [] as Array<{ table: string; error: string }>,
    };

    // Step 1: Clean up existing data (delete all records)
    console.log('🧹 Cleaning existing test data...');
    const tablesToClean = [
      'temperature_logs',
      'recipe_ingredients',
      'prep_list_items',
      'order_list_items',
      'compliance_records',
      'menu_dishes',
      'ingredients',
      'recipes',
      'temperature_equipment',
      'supplier_price_lists',
      'suppliers',
      'compliance_types',
      'kitchen_sections',
      'prep_lists',
      'order_lists',
      'cleaning_tasks',
      'cleaning_areas',
    ];

    for (const table of tablesToClean) {
      try {
        const { error } = await supabaseAdmin.from(table).delete().neq('id', '0');
        if (!error) {
          results.cleaned++;
        }
      } catch (err) {
        // Table might not exist, continue
      }
    }

    // Step 2: Populate Suppliers (needed for ingredients)
    console.log('🚚 Populating suppliers...');
    const { data: suppliersData, error: suppliersError } = await supabaseAdmin
      .from('suppliers')
      .insert(cleanSampleSuppliers)
      .select();

    if (suppliersError) {
      results.errors.push({ table: 'suppliers', error: suppliersError.message });
    } else {
      results.populated.push({ table: 'suppliers', count: suppliersData?.length || 0 });
    }

    // Step 3: Populate Ingredients
    console.log('🥕 Populating ingredients...');
    const { data: ingredientsData, error: ingredientsError } = await supabaseAdmin
      .from('ingredients')
      .insert(cleanSampleIngredients)
      .select();

    if (ingredientsError) {
      results.errors.push({ table: 'ingredients', error: ingredientsError.message });
    } else {
      results.populated.push({ table: 'ingredients', count: ingredientsData?.length || 0 });
    }

    // Step 4: Populate Recipes
    console.log('🍲 Populating recipes...');
    const { data: recipesData, error: recipesError } = await supabaseAdmin
      .from('recipes')
      .insert(cleanSampleRecipes)
      .select();

    if (recipesError) {
      results.errors.push({ table: 'recipes', error: recipesError.message });
    } else {
      results.populated.push({ table: 'recipes', count: recipesData?.length || 0 });

      // Step 5: Populate Recipe Ingredients (link recipes to ingredients)
      if (recipesData && ingredientsData) {
        console.log('🔗 Linking recipes to ingredients...');
        const recipeMap = new Map(recipesData.map(r => [r.name, r.id]));
        const ingredientMap = new Map(ingredientsData.map(i => [i.ingredient_name, i.id]));

        const recipeIngredientsToInsert: Array<{
          recipe_id: string;
          ingredient_id: string;
          quantity: number;
          unit: string;
        }> = [];

        for (const [recipeName, mappings] of Object.entries(recipeIngredientMappings)) {
          const recipeId = recipeMap.get(recipeName);
          if (!recipeId) continue;

          for (const mapping of mappings) {
            const ingredientId = ingredientMap.get(mapping.ingredient_name);
            if (!ingredientId) continue;

            recipeIngredientsToInsert.push({
              recipe_id: recipeId,
              ingredient_id: ingredientId,
              quantity: mapping.quantity,
              unit: mapping.unit,
            });
          }
        }

        if (recipeIngredientsToInsert.length > 0) {
          const { error: riError } = await supabaseAdmin
            .from('recipe_ingredients')
            .insert(recipeIngredientsToInsert);

          if (riError) {
            results.errors.push({ table: 'recipe_ingredients', error: riError.message });
          } else {
            results.populated.push({
              table: 'recipe_ingredients',
              count: recipeIngredientsToInsert.length,
            });
          }
        }
      }
    }

    // Step 6: Populate Temperature Equipment
    console.log('🌡️ Populating temperature equipment...');
    const { data: equipmentData, error: equipmentError } = await supabaseAdmin
      .from('temperature_equipment')
      .insert(cleanSampleEquipment)
      .select();

    if (equipmentError) {
      results.errors.push({ table: 'temperature_equipment', error: equipmentError.message });
    } else {
      results.populated.push({ table: 'temperature_equipment', count: equipmentData?.length || 0 });
    }

    // Step 7: Populate Cleaning Areas
    console.log('🧽 Populating cleaning areas...');
    const { data: cleaningAreasData, error: cleaningAreasError } = await supabaseAdmin
      .from('cleaning_areas')
      .insert(cleanSampleCleaningAreas)
      .select();

    if (cleaningAreasError) {
      results.errors.push({ table: 'cleaning_areas', error: cleaningAreasError.message });
    } else {
      results.populated.push({
        table: 'cleaning_areas',
        count: cleaningAreasData?.length || 0,
      });

      // Step 8: Populate Cleaning Tasks (link to areas)
      if (cleaningAreasData) {
        console.log('🧹 Populating cleaning tasks...');
        const areaMap = new Map(cleaningAreasData.map(a => [a.area_name, a.id]));

        const tasksToInsert = cleanSampleCleaningTasks.map(task => ({
          task_name: task.task_name,
          description: task.description,
          frequency: task.frequency,
          estimated_duration_minutes: task.estimated_duration_minutes,
          area_id: areaMap.get('Kitchen Floor'), // Link to first area for simplicity
        }));

        const { error: tasksError } = await supabaseAdmin
          .from('cleaning_tasks')
          .insert(tasksToInsert);

        if (tasksError) {
          results.errors.push({ table: 'cleaning_tasks', error: tasksError.message });
        } else {
          results.populated.push({ table: 'cleaning_tasks', count: tasksToInsert.length });
        }
      }
    }

    // Step 9: Populate Compliance Types
    console.log('📋 Populating compliance types...');
    const { data: complianceTypesData, error: complianceTypesError } = await supabaseAdmin
      .from('compliance_types')
      .insert(cleanSampleComplianceTypes)
      .select();

    if (complianceTypesError) {
      results.errors.push({ table: 'compliance_types', error: complianceTypesError.message });
    } else {
      results.populated.push({
        table: 'compliance_types',
        count: complianceTypesData?.length || 0,
      });
    }

    // Step 10: Populate Menu Dishes (link to recipes)
    if (recipesData && ingredientsData) {
      console.log('🍽️ Populating menu dishes...');
      const recipeMap = new Map(recipesData.map(r => [r.name, r.id]));

      const menuDishes = [
        {
          name: 'Beef Burger',
          recipe_id: recipeMap.get('Beef Burger'),
          selling_price: 18.5,
          number_sold: 45,
        },
        {
          name: 'Caesar Salad',
          recipe_id: recipeMap.get('Caesar Salad'),
          selling_price: 16.5,
          number_sold: 32,
        },
        {
          name: 'Pasta Carbonara',
          recipe_id: recipeMap.get('Pasta Carbonara'),
          selling_price: 22.5,
          number_sold: 28,
        },
        {
          name: 'Chicken Stir Fry',
          recipe_id: recipeMap.get('Chicken Stir Fry'),
          selling_price: 19.5,
          number_sold: 38,
        },
        {
          name: 'Fish and Chips',
          recipe_id: recipeMap.get('Fish and Chips'),
          selling_price: 24.5,
          number_sold: 42,
        },
        {
          name: 'Roast Chicken',
          recipe_id: recipeMap.get('Roast Chicken'),
          selling_price: 28.5,
          number_sold: 25,
        },
        {
          name: 'Vegetable Soup',
          recipe_id: recipeMap.get('Vegetable Soup'),
          selling_price: 14.5,
          number_sold: 20,
        },
        {
          name: 'Grilled Lamb Chops',
          recipe_id: recipeMap.get('Grilled Lamb Chops'),
          selling_price: 32.5,
          number_sold: 18,
        },
      ].filter(dish => dish.recipe_id); // Only include dishes with linked recipes

      if (menuDishes.length > 0) {
        const { data: menuDishesData, error: menuDishesError } = await supabaseAdmin
          .from('menu_dishes')
          .insert(menuDishes)
          .select();

        if (menuDishesError) {
          results.errors.push({ table: 'menu_dishes', error: menuDishesError.message });
        } else {
          results.populated.push({
            table: 'menu_dishes',
            count: menuDishesData?.length || 0,
          });
        }
      }
    }

    // Step 11: Populate Kitchen Sections
    console.log('🍽️ Populating kitchen sections...');
    const { data: sectionsData, error: sectionsError } = await supabaseAdmin
      .from('kitchen_sections')
      .insert(cleanSampleKitchenSections)
      .select();

    if (sectionsError) {
      results.errors.push({ table: 'kitchen_sections', error: sectionsError.message });
    } else {
      results.populated.push({
        table: 'kitchen_sections',
        count: sectionsData?.length || 0,
      });
    }

    const totalPopulated = results.populated.reduce((sum, item) => sum + item.count, 0);

    return NextResponse.json({
      success: true,
      message: `Successfully populated ${totalPopulated} records across ${results.populated.length} tables`,
      summary: {
        cleaned: results.cleaned,
        populated: totalPopulated,
        tables: results.populated.length,
        errors: results.errors.length,
      },
      results: {
        populated: results.populated,
        errors: results.errors.length > 0 ? results.errors : undefined,
      },
      nextSteps: ['Visit /webapp to see all populated data'],
    });
  } catch (err) {
    console.error('Error during test data population:', err);
    return NextResponse.json(
      {
        error: 'Internal server error during test data population',
        details: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
