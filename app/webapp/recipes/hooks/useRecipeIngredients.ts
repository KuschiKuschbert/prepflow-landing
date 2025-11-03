'use client';

import { supabase } from '@/lib/supabase';
import { useCallback } from 'react';
import { RecipeIngredientWithDetails } from '../types';

export function useRecipeIngredients(setError: (error: string) => void) {
  const fetchRecipeIngredients = useCallback(
    async (recipeId: string): Promise<RecipeIngredientWithDetails[]> => {
      try {
        if (process.env.NODE_ENV === 'development') {
          console.log('🔍 Fetching recipe ingredients for recipeId:', recipeId);
        }

        const { data: ingredientsData, error: ingredientsError } = await supabase
          .from('recipe_ingredients')
          .select(
            `
          id,
          recipe_id,
          ingredient_id,
          quantity,
          unit,
          ingredients (
            id,
            ingredient_name,
            cost_per_unit,
            unit,
            trim_peel_waste_percentage,
            yield_percentage
          )
        `,
          )
          .eq('recipe_id', recipeId);

        if (ingredientsError) {
          console.error('❌ Error fetching recipe ingredients:', ingredientsError);
          setError(ingredientsError.message);
          return [];
        }

        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Recipe ingredients fetched:', ingredientsData?.length || 0, 'items');
          console.log('📦 Ingredients data structure:', JSON.stringify(ingredientsData, null, 2));
        }

        let rows: any[] = ingredientsData || [];

        // Fallback: If nested ingredients are missing (FK not detected), fetch details in batch
        const needsLookup = rows.some(r => !r.ingredients);
        if (needsLookup && rows.length > 0) {
          const uniqueIds = Array.from(new Set(rows.map(r => r.ingredient_id).filter(Boolean)));
          if (uniqueIds.length > 0) {
            const { data: ingRows, error: ingError } = await supabase
              .from('ingredients')
              .select(
                'id, ingredient_name, cost_per_unit, unit, trim_peel_waste_percentage, yield_percentage',
              )
              .in('id', uniqueIds);
            if (ingError) {
              console.warn('⚠️ Fallback ingredient lookup failed:', ingError);
            } else {
              const byId: Record<string, any> = {};
              (ingRows || []).forEach(ir => {
                byId[ir.id] = ir;
              });
              rows = rows.map(r => ({ ...r, ingredients: byId[r.ingredient_id] || r.ingredients }));
            }
          }
        }

        // Validate structure and log any issues
        rows.forEach((item: any, index: number) => {
          if (!item.ingredients) {
            console.warn(
              `⚠️ Recipe ingredient ${index} missing ingredients data after fallback:`,
              item,
            );
          } else if (!item.ingredients.ingredient_name) {
            console.warn(
              `⚠️ Recipe ingredient ${index} has ingredients object but missing ingredient_name:`,
              item,
            );
          }
        });

        return rows as unknown as RecipeIngredientWithDetails[];
      } catch (err) {
        console.error('❌ Exception fetching recipe ingredients:', err);
        setError('Failed to fetch recipe ingredients');
        return [];
      }
    },
    [setError],
  );

  return { fetchRecipeIngredients };
}
