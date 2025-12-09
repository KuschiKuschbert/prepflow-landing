'use client';

import { Icon } from '@/components/ui/Icon';
import { logger } from '@/lib/logger';
import {
  Activity,
  AlertTriangle,
  CreditCard,
  Database,
  MessageSquare,
  Shield,
  Users,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
  const { data: session } = useSession();
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

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers ?? 0,
      icon: Users,
      href: '/admin/users',
      color: 'text-[#29E7CD]',
      bgColor: 'bg-[#29E7CD]/10',
    },
    {
      title: 'Active Subscriptions',
      value: stats?.activeSubscriptions ?? 0,
      icon: CreditCard,
      href: '/admin/billing',
      color: 'text-[#D925C7]',
      bgColor: 'bg-[#D925C7]/10',
    },
    {
      title: 'System Health',
      value:
        stats?.systemHealth === 'healthy'
          ? 'Healthy'
          : stats?.systemHealth === 'degraded'
            ? 'Degraded'
            : 'Down',
      icon: Activity,
      href: '/admin/system',
      color:
        stats?.systemHealth === 'healthy'
          ? 'text-green-400'
          : stats?.systemHealth === 'degraded'
            ? 'text-yellow-400'
            : 'text-red-400',
      bgColor:
        stats?.systemHealth === 'healthy'
          ? 'bg-green-500/10'
          : stats?.systemHealth === 'degraded'
            ? 'bg-yellow-500/10'
            : 'bg-red-500/10',
    },
    {
      title: 'Critical Errors',
      value: stats?.criticalErrors ?? 0,
      icon: AlertTriangle,
      href: '/admin/errors?severity=safety&severity=critical&status=new&status=investigating',
      color: stats?.criticalErrors && stats.criticalErrors > 0 ? 'text-red-400' : 'text-gray-400',
      bgColor:
        stats?.criticalErrors && stats.criticalErrors > 0 ? 'bg-red-500/10' : 'bg-gray-500/10',
      badge: stats?.criticalErrors && stats.criticalErrors > 0 ? stats.criticalErrors : undefined,
    },
    {
      title: 'Unresolved Tickets',
      value: stats?.unresolvedTickets ?? 0,
      icon: MessageSquare,
      href: '/admin/support-tickets?status=open&status=investigating',
      color:
        stats?.unresolvedTickets && stats.unresolvedTickets > 0
          ? 'text-yellow-400'
          : 'text-gray-400',
      bgColor:
        stats?.unresolvedTickets && stats.unresolvedTickets > 0
          ? 'bg-yellow-500/10'
          : 'bg-gray-500/10',
      badge:
        stats?.unresolvedTickets && stats.unresolvedTickets > 0
          ? stats.unresolvedTickets
          : undefined,
    },
    {
      title: 'Recent Errors (24h)',
      value: stats?.recentErrors ?? 0,
      icon: AlertTriangle,
      href: '/admin/errors',
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
    },
    {
      title: 'Total Data Records',
      value: stats?.totalDataRecords ?? 0,
      icon: Database,
      href: '/admin/data',
      color: 'text-[#FF6B00]',
      bgColor: 'bg-[#FF6B00]/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="mt-2 text-gray-400">Welcome back, {session?.user?.email || 'Admin'}</p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="tablet:grid-cols-2 desktop:grid-cols-3 grid grid-cols-1 gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6"
            >
              <div className="mb-4 h-4 w-24 rounded bg-[#2a2a2a]"></div>
              <div className="h-8 w-16 rounded bg-[#2a2a2a]"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="tablet:grid-cols-2 desktop:grid-cols-3 grid grid-cols-1 gap-4">
          {statCards.map(card => (
            <Link
              key={card.title}
              href={card.href}
              className="group relative rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 transition-all hover:border-[#29E7CD]/30 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="mb-2 text-sm text-gray-400">{card.title}</p>
                  <p className={`text-3xl font-bold ${card.color}`}>
                    {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                  </p>
                </div>
                <div className={`rounded-lg p-3 ${card.bgColor} relative`}>
                  <Icon icon={card.icon} size="lg" className={card.color} />
                  {card.badge !== undefined && card.badge > 0 && (
                    <span className="absolute -top-2 -right-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
                      {card.badge}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Critical Alerts */}
      {stats && (stats.criticalErrors > 0 || stats.recentSafetyErrors.length > 0) && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
          <div className="mb-4 flex items-center gap-3">
            <Icon icon={Shield} size="lg" className="text-red-400" />
            <h2 className="text-xl font-bold text-red-400">Critical Safety Issues</h2>
          </div>
          {stats.criticalErrors > 0 && (
            <div className="mb-4">
              <p className="mb-2 text-white">
                <span className="font-bold text-red-400">{stats.criticalErrors}</span> critical
                errors require immediate attention
              </p>
              <Link
                href="/admin/errors?severity=safety&severity=critical&status=new&status=investigating"
                className="text-[#29E7CD] underline transition-colors hover:text-[#29E7CD]/80"
              >
                View Critical Errors →
              </Link>
            </div>
          )}
          {stats.recentSafetyErrors.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-gray-300">Recent Safety Issues:</p>
              <ul className="space-y-2">
                {stats.recentSafetyErrors.map(error => (
                  <li key={error.id} className="text-sm text-gray-300">
                    <Link
                      href={`/admin/errors?search=${encodeURIComponent(error.error_message.substring(0, 50))}`}
                      className="transition-colors hover:text-[#29E7CD]"
                    >
                      {error.error_message.substring(0, 100)}
                      {error.error_message.length > 100 ? '...' : ''}
                    </Link>
                    <span className="ml-2 text-gray-500">
                      {new Date(error.created_at).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
        <h2 className="mb-4 text-xl font-bold text-white">Quick Actions</h2>
        <div className="tablet:grid-cols-2 desktop:grid-cols-3 grid grid-cols-1 gap-3">
          <Link
            href="/admin/users"
            className="rounded-lg bg-[#2a2a2a] p-4 transition-colors hover:bg-[#2a2a2a]/80"
          >
            <h3 className="mb-1 font-semibold text-white">Manage Users</h3>
            <p className="text-sm text-gray-400">View and edit user accounts</p>
          </Link>
          <Link
            href="/admin/system"
            className="rounded-lg bg-[#2a2a2a] p-4 transition-colors hover:bg-[#2a2a2a]/80"
          >
            <h3 className="mb-1 font-semibold text-white">System Health</h3>
            <p className="text-sm text-gray-400">Monitor system performance</p>
          </Link>
          <Link
            href="/admin/errors"
            className="rounded-lg bg-[#2a2a2a] p-4 transition-colors hover:bg-[#2a2a2a]/80"
          >
            <h3 className="mb-1 font-semibold text-white">View Errors</h3>
            <p className="text-sm text-gray-400">Check recent error logs</p>
          </Link>
          <Link
            href="/admin/support-tickets"
            className="rounded-lg bg-[#2a2a2a] p-4 transition-colors hover:bg-[#2a2a2a]/80"
          >
            <h3 className="mb-1 font-semibold text-white">Support Tickets</h3>
            <p className="text-sm text-gray-400">Manage user-reported issues</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
