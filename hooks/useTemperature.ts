// Custom hooks for temperature data with React Query
// Provides caching, optimistic updates, and error handling

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, invalidateQueries, handleQueryError } from '@/lib/react-query';

// Hook to fetch temperature logs
export function useTemperatureLogs() {
  return useQuery({
    queryKey: [...queryKeys.temperatureLogs],
    queryFn: async () => {
      const response = await fetch('/api/temperature-logs');
      if (!response.ok) {
        throw new Error('Failed to fetch temperature logs');
      }
      return response.json();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent updates for temperature data)
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

// Hook to fetch temperature equipment
export function useTemperatureEquipment() {
  return useQuery({
    queryKey: [...queryKeys.temperatureEquipment],
    queryFn: async () => {
      const response = await fetch('/api/temperature-equipment');
      if (!response.ok) {
        throw new Error('Failed to fetch temperature equipment');
      }
      return response.json();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (equipment doesn't change often)
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Hook to fetch temperature thresholds
export function useTemperatureThresholds() {
  return useQuery({
    queryKey: [...queryKeys.temperatureThresholds],
    queryFn: async () => {
      const response = await fetch('/api/temperature-thresholds');
      if (!response.ok) {
        throw new Error('Failed to fetch temperature thresholds');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

// Hook to fetch temperature analytics
export function useTemperatureAnalytics() {
  return useQuery({
    queryKey: [...queryKeys.temperatureAnalytics],
    queryFn: async () => {
      const response = await fetch('/api/temperature-analytics');
      if (!response.ok) {
        throw new Error('Failed to fetch temperature analytics');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

// Hook to add a temperature log
export function useAddTemperatureLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (logData: any) => {
      const response = await fetch('/api/temperature-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData),
      });

      if (!response.ok) {
        throw new Error('Failed to add temperature log');
      }

      return response.json();
    },
    onMutate: async newLog => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [...queryKeys.temperatureLogs] });

      // Snapshot the previous value
      const previousLogs = queryClient.getQueryData([...queryKeys.temperatureLogs]);

      // Optimistically update the cache
      queryClient.setQueryData([...queryKeys.temperatureLogs], (old: any[]) => [
        { ...newLog, id: `temp-${Date.now()}` },
        ...(old || []),
      ]);

      // Return a context object with the snapshotted value
      return { previousLogs };
    },
    onError: (err, newLog, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousLogs) {
        queryClient.setQueryData([...queryKeys.temperatureLogs], context.previousLogs);
      }

      // Handle error
      const errorMessage = handleQueryError(err, [...queryKeys.temperatureLogs]);
      console.error('Failed to add temperature log:', errorMessage);
    },
    onSettled: () => {
      // Always refetch after error or success
      invalidateQueries.temperature();
    },
  });
}

// Hook to update temperature equipment
export function useUpdateTemperatureEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const response = await fetch(`/api/temperature-equipment/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update temperature equipment');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate temperature equipment cache
      queryClient.invalidateQueries({ queryKey: [...queryKeys.temperatureEquipment] });
    },
    onError: err => {
      const errorMessage = handleQueryError(err, [...queryKeys.temperatureEquipment]);
      console.error('Failed to update temperature equipment:', errorMessage);
    },
  });
}

// Hook to create temperature threshold
export function useCreateTemperatureThreshold() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (thresholdData: any) => {
      const response = await fetch('/api/temperature-thresholds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(thresholdData),
      });

      if (!response.ok) {
        throw new Error('Failed to create temperature threshold');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate temperature thresholds cache
      queryClient.invalidateQueries({ queryKey: [...queryKeys.temperatureThresholds] });
    },
    onError: err => {
      const errorMessage = handleQueryError(err, [...queryKeys.temperatureThresholds]);
      console.error('Failed to create temperature threshold:', errorMessage);
    },
  });
}

// Hook to update temperature threshold
export function useUpdateTemperatureThreshold() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const response = await fetch(`/api/temperature-thresholds/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update temperature threshold');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate temperature thresholds cache
      queryClient.invalidateQueries({ queryKey: [...queryKeys.temperatureThresholds] });
    },
    onError: err => {
      const errorMessage = handleQueryError(err, [...queryKeys.temperatureThresholds]);
      console.error('Failed to update temperature threshold:', errorMessage);
    },
  });
}

// Hook to delete temperature threshold
export function useDeleteTemperatureThreshold() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/temperature-thresholds/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete temperature threshold');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate temperature thresholds cache
      queryClient.invalidateQueries({ queryKey: [...queryKeys.temperatureThresholds] });
    },
    onError: err => {
      const errorMessage = handleQueryError(err, [...queryKeys.temperatureThresholds]);
      console.error('Failed to delete temperature threshold:', errorMessage);
    },
  });
}
