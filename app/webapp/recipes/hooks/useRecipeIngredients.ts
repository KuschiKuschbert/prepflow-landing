'use client';

import { supabase } from '@/lib/supabase';
import { useCallback } from 'react';
import { RecipeIngredientWithDetails } from '../types';

export function useRecipeIngredients(setError: (error: string) => void) {
  const fetchFromApi = useCallback(
    async (recipeId: string): Promise<RecipeIngredientWithDetails[] | null> => {
      const res = await fetch(`/api/recipes/${recipeId}/ingredients?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', Pragma: 'no-cache' },
      });
      if (!res.ok) return null;
      return ((await res.json())?.items || []) as RecipeIngredientWithDetails[];
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
      if (rows.some(r => !r.ingredients) && rows.length > 0) {
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
        const fromApi = await fetchFromApi(recipeId);
        if (Array.isArray(fromApi) && fromApi.length > 0) return fromApi;
        return await fetchFromClientJoin(recipeId);
      } catch (err) {
        console.error('❌ Exception fetching recipe ingredients:', err);
        setError('Failed to fetch recipe ingredients');
        return [];
      }
    },
    [fetchFromApi, fetchFromClientJoin, setError],
  );

  const fetchBatchRecipeIngredients = useCallback(
    async (recipeIds: string[]): Promise<Record<string, RecipeIngredientWithDetails[]>> => {
      if (recipeIds.length === 0) return {};
      try {
        console.log('[RecipeIngredients] Batch fetching for', recipeIds.length, 'recipe IDs');
        const startTime = Date.now();
        const response = await fetch('/api/recipes/ingredients/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipeIds }),
          cache: 'no-store',
        });
        const fetchDuration = Date.now() - startTime;

        if (!response.ok) {
          const errorText = await response.text();
          console.error('[RecipeIngredients] Batch fetch failed:', response.status, errorText);
          return {};
        }

        const data = await response.json();
        const items = data?.items || {};
        const duration = Date.now() - startTime;
        console.log('[RecipeIngredients] Batch fetch completed in', duration, 'ms, got', Object.keys(items).length, 'recipe groups');
        return items as Record<string, RecipeIngredientWithDetails[]>;
      } catch (err) {
        console.error('[RecipeIngredients] Batch fetch error:', err);
        return {};
      }
    },
    [],
  );

  return { fetchRecipeIngredients, fetchBatchRecipeIngredients };
}
