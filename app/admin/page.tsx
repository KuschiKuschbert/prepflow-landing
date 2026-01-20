'use client';

import { logger } from '@/lib/logger';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';
import { CriticalAlerts } from './components/dashboard/CriticalAlerts';
import { QuickActions } from './components/dashboard/QuickActions';
import { StatsGrid } from './components/dashboard/StatsGrid';

interface SafetyError {
  id: string;
  error_message: string;
  severity: string;
  status: string;
  created_at: string;
}

interface DashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  systemHealth: 'healthy' | 'degraded' | 'down';
  recentErrors: number;
  totalDataRecords: number;
  criticalErrors: number;
  unresolvedTickets: number;
  recentSafetyErrors: SafetyError[];
}

/**
 * Admin dashboard page component.
 * Displays system overview with stats, health status, and quick navigation.
 *
 * @component
 * @returns {JSX.Element} Admin dashboard page
 */
export default function AdminDashboard() {
  const { user } = useUser();
  const { stats, loading } = useAdminStats();

  return (
    <div className="space-y-6">
      <DashboardHeader userEmail={user?.email} />

      {/* Stats Grid */}
      <StatsGrid stats={stats} loading={loading} />

      {/* Critical Alerts */}
      {stats && (
        <CriticalAlerts
          criticalErrors={stats.criticalErrors}
          recentSafetyErrors={stats.recentSafetyErrors}
        />
      )}

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}

function DashboardHeader({ userEmail }: { userEmail?: string | null }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
      <p className="mt-2 text-gray-400">Welcome back, {userEmail || 'Admin'}</p>
    </div>
  );
}

function useAdminStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/dashboard/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        logger.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading };
}
