// Custom hooks for performance data with React Query
// Provides caching, optimistic updates, and error handling

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, invalidateQueries, handleQueryError } from '@/lib/react-query';

// Hook to fetch performance data
export function usePerformanceData() {
  return useQuery({
    queryKey: [...queryKeys.performanceData],
    queryFn: async () => {
      const response = await fetch('/api/performance');
      if (!response.ok) {
        throw new Error('Failed to fetch performance data');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

// Hook to fetch performance analytics
export function usePerformanceAnalytics() {
  return useQuery({
    queryKey: [...queryKeys.performanceAnalytics],
    queryFn: async () => {
      const response = await fetch('/api/performance/analytics');
      if (!response.ok) {
        throw new Error('Failed to fetch performance analytics');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

// Hook to import performance data
export function useImportPerformanceData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (importData: any) => {
      const response = await fetch('/api/performance/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(importData),
      });

      if (!response.ok) {
        throw new Error('Failed to import performance data');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate performance data cache
      invalidateQueries.performance();
    },
    onError: err => {
      const errorMessage = handleQueryError(err, [...queryKeys.performanceData]);
      console.error('Failed to import performance data:', errorMessage);
    },
  });
}

// Hook to update menu item performance
export function useUpdateMenuItemPerformance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const response = await fetch(`/api/performance/menu-items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update menu item performance');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate performance data cache
      invalidateQueries.performance();
    },
    onError: err => {
      const errorMessage = handleQueryError(err, [...queryKeys.performanceData]);
      console.error('Failed to update menu item performance:', errorMessage);
    },
  });
}

// Hook to add new menu item
export function useAddMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (menuItemData: any) => {
      const response = await fetch('/api/performance/menu-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(menuItemData),
      });

      if (!response.ok) {
        throw new Error('Failed to add menu item');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate performance data cache
      invalidateQueries.performance();
    },
    onError: err => {
      const errorMessage = handleQueryError(err, [...queryKeys.performanceData]);
      console.error('Failed to add menu item:', errorMessage);
    },
  });
}

// Hook to delete menu item
export function useDeleteMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/performance/menu-items/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete menu item');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate performance data cache
      invalidateQueries.performance();
    },
    onError: err => {
      const errorMessage = handleQueryError(err, [...queryKeys.performanceData]);
      console.error('Failed to delete menu item:', errorMessage);
    },
  });
}
