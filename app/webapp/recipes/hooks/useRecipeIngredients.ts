'use client';

import { supabase } from '@/lib/supabase';
import { useCallback } from 'react';
import { RecipeIngredientWithDetails } from '../types';

export function useRecipeIngredients(setError: (error: string) => void) {
  const fetchFromApi = useCallback(
    async (recipeId: string): Promise<RecipeIngredientWithDetails[] | null> => {
      const res = await fetch(`/api/recipes/${recipeId}/ingredients`, { cache: 'no-store' });
      if (!res.ok) return null;
      const json = await res.json();
      return (json?.items || []) as RecipeIngredientWithDetails[];
    },
    [],
  );

  const fetchFromClientJoin = useCallback(
    async (recipeId: string): Promise<RecipeIngredientWithDetails[]> => {
      const { data: ingredientsData, error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .select(
          'id, recipe_id, ingredient_id, quantity, unit, ingredients ( id, ingredient_name, cost_per_unit, unit, trim_peel_waste_percentage, yield_percentage )',
        )
        .eq('recipe_id', recipeId);

      if (ingredientsError) {
        console.error('❌ Error fetching recipe ingredients:', ingredientsError);
        setError(ingredientsError.message);
        return [];
      }

      let rows: any[] = ingredientsData || [];
      const needsLookup = rows.some(r => !r.ingredients);
      if (needsLookup && rows.length > 0) {
        const uniqueIds = Array.from(new Set(rows.map(r => r.ingredient_id).filter(Boolean)));
        if (uniqueIds.length > 0) {
          const { data: ingRows } = await supabase
            .from('ingredients')
            .select(
              'id, ingredient_name, cost_per_unit, unit, trim_peel_waste_percentage, yield_percentage',
            )
            .in('id', uniqueIds);
          const byId: Record<string, any> = {};
          (ingRows || []).forEach(ir => {
            byId[ir.id] = ir;
          });
          rows = rows.map(r => ({ ...r, ingredients: byId[r.ingredient_id] || r.ingredients }));
        }
      }
      return rows as unknown as RecipeIngredientWithDetails[];
    },
    [setError],
  );

  const fetchRecipeIngredients = useCallback(
    async (recipeId: string): Promise<RecipeIngredientWithDetails[]> => {
      try {
        if (process.env.NODE_ENV === 'development') {
          console.log('🔍 Fetching recipe ingredients for recipeId:', recipeId);
        }
        const fromApi = await fetchFromApi(recipeId);
        if (Array.isArray(fromApi)) {
          if (fromApi.length > 0) {
            return fromApi;
          }
          if (process.env.NODE_ENV === 'development') {
            console.warn(
              '⚠️ API returned zero ingredients for recipeId:',
              recipeId,
              '- falling back to client join',
            );
          }
        }

        const fromClient = await fetchFromClientJoin(recipeId);
        if (fromClient.length === 0 && process.env.NODE_ENV === 'development') {
          console.warn(
            '⚠️ No recipe_ingredients found for recipeId:',
            recipeId,
            '- verify this recipe was saved from COGS and has linked ingredients.',
          );
        }
        return fromClient;
      } catch (err) {
        console.error('❌ Exception fetching recipe ingredients:', err);
        setError('Failed to fetch recipe ingredients');
        return [];
      }
    },
    [fetchFromApi, fetchFromClientJoin, setError],
  );

  return { fetchRecipeIngredients };
}
