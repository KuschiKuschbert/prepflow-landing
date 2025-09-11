// Custom hooks for dashboard data with React Query
// Provides caching, optimistic updates, and error handling

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, invalidateQueries, handleQueryError } from '@/lib/react-query';

// Hook to fetch dashboard stats
export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboardStats,
    queryFn: async () => {
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      return response.json();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (dashboard stats change frequently)
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });
}

// Hook to fetch recent activity
export function useRecentActivity() {
  return useQuery({
    queryKey: queryKeys.dashboardRecentActivity,
    queryFn: async () => {
      const response = await fetch('/api/dashboard/recent-activity');
      if (!response.ok) {
        throw new Error('Failed to fetch recent activity');
      }
      return response.json();
    },
    staleTime: 1 * 60 * 1000, // 1 minute (recent activity changes frequently)
    gcTime: 3 * 60 * 1000, // 3 minutes
    refetchInterval: 1 * 60 * 1000, // Refetch every minute
  });
}

// Hook to fetch dashboard overview
export function useDashboardOverview() {
  return useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/overview');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard overview');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

// Hook to refresh dashboard data
export function useRefreshDashboard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Trigger refetch of all dashboard queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats }),
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboardRecentActivity }),
        queryClient.invalidateQueries({ queryKey: ['dashboard', 'overview'] }),
      ]);
    },
    onError: (err) => {
      const errorMessage = handleQueryError(err, ['dashboard']);
      console.error('Failed to refresh dashboard:', errorMessage);
    },
  });
}

// Hook to get dashboard notifications
export function useDashboardNotifications() {
  return useQuery({
    queryKey: ['dashboard', 'notifications'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/notifications');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard notifications');
      }
      return response.json();
    },
    staleTime: 30 * 1000, // 30 seconds (notifications are time-sensitive)
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
}

// Hook to mark notification as read
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await fetch(`/api/dashboard/notifications/${notificationId}/read`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate notifications cache
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'notifications'] });
    },
    onError: (err) => {
      const errorMessage = handleQueryError(err, ['dashboard', 'notifications']);
      console.error('Failed to mark notification as read:', errorMessage);
    },
  });
}

// Hook to get dashboard quick actions
export function useDashboardQuickActions() {
  return useQuery({
    queryKey: ['dashboard', 'quick-actions'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/quick-actions');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard quick actions');
      }
      return response.json();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (quick actions don't change often)
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Hook to execute quick action
export function useExecuteQuickAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ actionId, params }: { actionId: string; params?: any }) => {
      const response = await fetch(`/api/dashboard/quick-actions/${actionId}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params || {}),
      });

      if (!response.ok) {
        throw new Error('Failed to execute quick action');
      }

      return response.json();
    },
    onSuccess: (data, { actionId }) => {
      // Invalidate relevant caches based on the action
      if (actionId.includes('ingredient')) {
        invalidateQueries.ingredients();
      } else if (actionId.includes('recipe')) {
        invalidateQueries.recipes();
      } else if (actionId.includes('temperature')) {
        invalidateQueries.temperature();
      } else if (actionId.includes('performance')) {
        invalidateQueries.performance();
      }
      
      // Always refresh dashboard stats after any action
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats });
    },
    onError: (err) => {
      const errorMessage = handleQueryError(err, ['dashboard', 'quick-actions']);
      console.error('Failed to execute quick action:', errorMessage);
    },
  });
}
