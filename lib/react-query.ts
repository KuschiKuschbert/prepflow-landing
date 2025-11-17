import { QueryClient } from '@tanstack/react-query';

import { logger } from '@/lib/logger';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: true,
      refetchOnReconnect: false,
      refetchOnMount: 'always',
    },
    mutations: { retry: 1, retryDelay: 1000 },
  },
});

export const queryKeys = {
  ingredients: ['ingredients'] as const,
  ingredient: (id: string) => ['ingredients', id] as const,
  ingredientsByCategory: (category: string) => ['ingredients', 'category', category] as const,
  recipes: ['recipes'] as const,
  recipe: (id: string) => ['recipes', id] as const,
  recipesByCategory: (category: string) => ['recipes', 'category', category] as const,
  temperatureLogs: ['temperature', 'logs'] as const,
  temperatureEquipment: ['temperature', 'equipment'] as const,
  temperatureThresholds: ['temperature', 'thresholds'] as const,
  temperatureAnalytics: ['temperature', 'analytics'] as const,
  performanceData: ['performance'] as const,
  performanceAnalytics: ['performance', 'analytics'] as const,
  userProfile: ['user', 'profile'] as const,
  userSettings: ['user', 'settings'] as const,
  userSubscription: ['user', 'subscription'] as const,
  dashboardStats: ['dashboard', 'stats'] as const,
  dashboardRecentActivity: ['dashboard', 'recent-activity'] as const,
};

export const invalidateQueries = {
  ingredients: () => queryClient.invalidateQueries({ queryKey: queryKeys.ingredients }),
  ingredient: (id: string) => queryClient.invalidateQueries({ queryKey: queryKeys.ingredient(id) }),
  recipes: () => queryClient.invalidateQueries({ queryKey: queryKeys.recipes }),
  recipe: (id: string) => queryClient.invalidateQueries({ queryKey: queryKeys.recipe(id) }),
  temperature: () => queryClient.invalidateQueries({ queryKey: ['temperature'] }),
  performance: () => queryClient.invalidateQueries({ queryKey: queryKeys.performanceData }),
  user: () => queryClient.invalidateQueries({ queryKey: ['user'] }),
  dashboard: () => queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
};

export const optimisticUpdates = {
  updateIngredient: (id: string, updates: any) =>
    queryClient.setQueryData(queryKeys.ingredient(id), (old: any) => ({ ...old, ...updates })),
  updateRecipe: (id: string, updates: any) =>
    queryClient.setQueryData(queryKeys.recipe(id), (old: any) => ({ ...old, ...updates })),
  addIngredient: (newIngredient: any) =>
    queryClient.setQueryData(queryKeys.ingredients, (old: any[]) => [
      ...(old || []),
      newIngredient,
    ]),
  addRecipe: (newRecipe: any) =>
    queryClient.setQueryData(queryKeys.recipes, (old: any[]) => [...(old || []), newRecipe]),
};

export const prefetchQueries = {
  ingredients: async () =>
    queryClient.prefetchQuery({
      queryKey: queryKeys.ingredients,
      queryFn: async () => {
        const response = await fetch('/api/ingredients');
        if (!response.ok) throw new Error('Failed to fetch ingredients');
        return response.json();
      },
    }),
  recipes: async () =>
    queryClient.prefetchQuery({
      queryKey: queryKeys.recipes,
      queryFn: async () => {
        const response = await fetch('/api/recipes');
        if (!response.ok) throw new Error('Failed to fetch recipes');
        return response.json();
      },
    }),
  temperature: async () =>
    queryClient.prefetchQuery({
      queryKey: queryKeys.temperatureLogs,
      queryFn: async () => {
        const response = await fetch('/api/temperature-logs');
        if (!response.ok) throw new Error('Failed to fetch temperature logs');
        return response.json();
      },
    }),
  dashboard: async () =>
    queryClient.prefetchQuery({
      queryKey: queryKeys.dashboardStats,
      queryFn: async () => {
        const response = await fetch('/api/dashboard/stats');
        if (!response.ok) throw new Error('Failed to fetch dashboard stats');
        return response.json();
      },
    }),
};

export const backgroundSync = {
  syncIngredients: () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.ingredients, refetchType: 'active' }),
  syncRecipes: () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.recipes, refetchType: 'active' }),
  syncTemperature: () =>
    queryClient.invalidateQueries({ queryKey: ['temperature'], refetchType: 'active' }),
};

export const handleQueryError = (error: any, queryKey: string[]) => {
  logger.error(`Query error for ${queryKey.join('.')}:`, error);
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'query_error', {
      event_category: 'react_query',
      event_label: queryKey.join('.'),
      value: 1,
    });
  }
  if (error.message?.includes('Failed to fetch'))
    return 'Network error. Please check your connection and try again.';
  if (error.message?.includes('404')) return 'Data not found. Please refresh the page.';
  if (error.message?.includes('500')) return 'Server error. Please try again later.';
  return 'An unexpected error occurred. Please try again.';
};

export const cacheUtils = {
  clearAll: () => queryClient.clear(),
  clearByKey: (queryKey: string[]) => queryClient.removeQueries({ queryKey }),
  getCacheSize: () => queryClient.getQueryCache().getAll().length,
  getCacheData: (queryKey: string[]) => queryClient.getQueryData(queryKey),
  setCacheData: (queryKey: string[], data: any) => queryClient.setQueryData(queryKey, data),
};
