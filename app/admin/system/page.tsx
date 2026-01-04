'use client';

import { Icon } from '@/components/ui/Icon';
import { logger } from '@/lib/logger';
import { Activity, AlertTriangle, CheckCircle, Clock, Database, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  database: {
    connected: boolean;
    responseTime: number;
  };
  api: {
    averageResponseTime: number;
    errorRate: number;
  };
  uptime: number;
  recentErrors: number;
}

/**
 * System health page component for admin dashboard.
 * Displays system status, database connectivity, API performance, and uptime metrics.
 *
 * @component
 * @returns {JSX.Element} System health admin page
 */
export default function SystemHealthPage() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHealth() {
      setLoading(true);
      try {
        const response = await fetch('/api/admin/system/health');
        if (response.ok) {
          const data = await response.json();
          setHealth(data);
        }
      } catch (error) {
        logger.error('Failed to fetch system health:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-400 bg-green-500/10';
      case 'degraded':
        return 'text-yellow-400 bg-yellow-500/10';
      case 'down':
        return 'text-red-400 bg-red-500/10';
      default:
        return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return CheckCircle;
      case 'degraded':
        return AlertTriangle;
      case 'down':
        return XCircle;
      default:
        return Activity;
    }
  };

  if (loading && !health) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="mb-4 h-8 w-64 rounded bg-[#2a2a2a]"></div>
          <div className="h-96 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">System Health</h1>
        <p className="mt-2 text-gray-400">Monitor system performance and status</p>
      </div>

      {/* Overall Status */}
      {health && (
        <div className={`rounded-2xl border border-[#2a2a2a] p-6 ${getStatusColor(health.status)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Icon icon={getStatusIcon(health.status)} size="xl" />
              <div>
                <h2 className="text-2xl font-bold">System {health.status.toUpperCase()}</h2>
                <p className="text-sm opacity-80">
                  Last updated: {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="tablet:grid-cols-3 desktop:grid-cols-4 grid grid-cols-1 gap-4">
        {/* Database Status */}
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Database</h3>
            <Icon
              icon={Database}
              size="md"
              className={health?.database.connected ? 'text-green-400' : 'text-red-400'}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Status</span>
              <span className={health?.database.connected ? 'text-green-400' : 'text-red-400'}>
                {health?.database.connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Response Time</span>
              <span className="text-white">{health?.database.responseTime || 0}ms</span>
            </div>
          </div>
        </div>

        {/* API Performance */}
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">System Performance</h3>
            <Icon icon={Activity} size="md" className="text-[#29E7CD]" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Avg Response</span>
              <span className="text-white">{health?.api.averageResponseTime || 0}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Error Rate</span>
              <span
                className={health && health.api.errorRate > 5 ? 'text-red-400' : 'text-green-400'}
              >
                {health?.api.errorRate || 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Uptime */}
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Uptime</h3>
            <Icon icon={Clock} size="md" className="text-[#FF6B00]" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Uptime</span>
              <span className="text-white">
                {health?.uptime
                  ? `${Math.floor(health.uptime / 3600)}h ${Math.floor((health.uptime % 3600) / 60)}m`
                  : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Recent Errors</span>
              <span
                className={health && health.recentErrors > 0 ? 'text-red-400' : 'text-green-400'}
              >
                {health?.recentErrors || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
