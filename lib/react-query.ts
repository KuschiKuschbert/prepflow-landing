// React Query Configuration for PrepFlow
// Provides caching, request deduplication, and optimistic updates

import { QueryClient } from '@tanstack/react-query';

// Create a client with optimized defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes by default
      staleTime: 5 * 60 * 1000,
      // Keep data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 3 times
      retry: 3,
      // Retry delay with exponential backoff
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus for fresh data
      refetchOnWindowFocus: true,
      // Don't refetch on reconnect by default
      refetchOnReconnect: false,
      // Don't refetch on mount if data is fresh
      refetchOnMount: 'always',
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
      // Retry delay for mutations
      retryDelay: 1000,
    },
  },
});

// Query keys for consistent caching
export const queryKeys = {
  // Ingredients
  ingredients: ['ingredients'] as const,
  ingredient: (id: string) => ['ingredients', id] as const,
  ingredientsByCategory: (category: string) => ['ingredients', 'category', category] as const,

  // Recipes
  recipes: ['recipes'] as const,
  recipe: (id: string) => ['recipes', id] as const,
  recipesByCategory: (category: string) => ['recipes', 'category', category] as const,

  // Temperature
  temperatureLogs: ['temperature', 'logs'] as const,
  temperatureEquipment: ['temperature', 'equipment'] as const,
  temperatureThresholds: ['temperature', 'thresholds'] as const,
  temperatureAnalytics: ['temperature', 'analytics'] as const,

  // Performance
  performanceData: ['performance'] as const,
  performanceAnalytics: ['performance', 'analytics'] as const,

  // User data
  userProfile: ['user', 'profile'] as const,
  userSettings: ['user', 'settings'] as const,
  userSubscription: ['user', 'subscription'] as const,

  // Dashboard
  dashboardStats: ['dashboard', 'stats'] as const,
  dashboardRecentActivity: ['dashboard', 'recent-activity'] as const,
};

// Cache invalidation helpers
export const invalidateQueries = {
  // Invalidate all ingredients queries
  ingredients: () => queryClient.invalidateQueries({ queryKey: queryKeys.ingredients }),

  // Invalidate specific ingredient
  ingredient: (id: string) => queryClient.invalidateQueries({ queryKey: queryKeys.ingredient(id) }),

  // Invalidate all recipes queries
  recipes: () => queryClient.invalidateQueries({ queryKey: queryKeys.recipes }),

  // Invalidate specific recipe
  recipe: (id: string) => queryClient.invalidateQueries({ queryKey: queryKeys.recipe(id) }),

  // Invalidate temperature data
  temperature: () => queryClient.invalidateQueries({ queryKey: ['temperature'] }),

  // Invalidate performance data
  performance: () => queryClient.invalidateQueries({ queryKey: queryKeys.performanceData }),

  // Invalidate user data
  user: () => queryClient.invalidateQueries({ queryKey: ['user'] }),

  // Invalidate dashboard data
  dashboard: () => queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
};

// Optimistic update helpers
export const optimisticUpdates = {
  // Optimistically update ingredient
  updateIngredient: (id: string, updates: any) => {
    queryClient.setQueryData(queryKeys.ingredient(id), (old: any) => ({
      ...old,
      ...updates,
    }));
  },

  // Optimistically update recipe
  updateRecipe: (id: string, updates: any) => {
    queryClient.setQueryData(queryKeys.recipe(id), (old: any) => ({
      ...old,
      ...updates,
    }));
  },

  // Optimistically add new ingredient
  addIngredient: (newIngredient: any) => {
    queryClient.setQueryData(queryKeys.ingredients, (old: any[]) => [
      ...(old || []),
      newIngredient,
    ]);
  },

  // Optimistically add new recipe
  addRecipe: (newRecipe: any) => {
    queryClient.setQueryData(queryKeys.recipes, (old: any[]) => [...(old || []), newRecipe]);
  },
};

// Prefetch helpers for better UX
export const prefetchQueries = {
  // Prefetch ingredients data
  ingredients: async () => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.ingredients,
      queryFn: async () => {
        const response = await fetch('/api/ingredients');
        if (!response.ok) throw new Error('Failed to fetch ingredients');
        return response.json();
      },
    });
  },

  // Prefetch recipes data
  recipes: async () => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.recipes,
      queryFn: async () => {
        const response = await fetch('/api/recipes');
        if (!response.ok) throw new Error('Failed to fetch recipes');
        return response.json();
      },
    });
  },

  // Prefetch temperature data
  temperature: async () => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.temperatureLogs,
      queryFn: async () => {
        const response = await fetch('/api/temperature-logs');
        if (!response.ok) throw new Error('Failed to fetch temperature logs');
        return response.json();
      },
    });
  },

  // Prefetch dashboard data
  dashboard: async () => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.dashboardStats,
      queryFn: async () => {
        const response = await fetch('/api/dashboard/stats');
        if (!response.ok) throw new Error('Failed to fetch dashboard stats');
        return response.json();
      },
    });
  },
};

// Background sync helpers
export const backgroundSync = {
  // Sync ingredients in background
  syncIngredients: () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.ingredients,
      refetchType: 'active',
    });
  },

  // Sync recipes in background
  syncRecipes: () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.recipes,
      refetchType: 'active',
    });
  },

  // Sync temperature data in background
  syncTemperature: () => {
    queryClient.invalidateQueries({
      queryKey: ['temperature'],
      refetchType: 'active',
    });
  },
};

// Error handling helpers
export const handleQueryError = (error: any, queryKey: string[]) => {
  console.error(`Query error for ${queryKey.join('.')}:`, error);

  // Track error in analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'query_error', {
      event_category: 'react_query',
      event_label: queryKey.join('.'),
      value: 1,
    });
  }

  // Return user-friendly error message
  if (error.message?.includes('Failed to fetch')) {
    return 'Network error. Please check your connection and try again.';
  }

  if (error.message?.includes('404')) {
    return 'Data not found. Please refresh the page.';
  }

  if (error.message?.includes('500')) {
    return 'Server error. Please try again later.';
  }

  return 'An unexpected error occurred. Please try again.';
};

// Cache management utilities
export const cacheUtils = {
  // Clear all cache
  clearAll: () => queryClient.clear(),

  // Clear specific cache
  clearByKey: (queryKey: string[]) => queryClient.removeQueries({ queryKey }),

  // Get cache size
  getCacheSize: () => queryClient.getQueryCache().getAll().length,

  // Get cache data
  getCacheData: (queryKey: string[]) => queryClient.getQueryData(queryKey),

  // Set cache data
  setCacheData: (queryKey: string[], data: any) => queryClient.setQueryData(queryKey, data),
};
