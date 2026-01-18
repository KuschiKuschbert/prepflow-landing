import { Icon } from '@/components/ui/Icon';
import {
    Activity,
    AlertTriangle,
    CreditCard,
    Database,
    MessageSquare,
    Users
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  systemHealth: 'healthy' | 'degraded' | 'down';
  recentErrors: number;
  totalDataRecords: number;
  criticalErrors: number;
  unresolvedTickets: number;
}

interface StatsGridProps {
  stats: DashboardStats | null;
  loading: boolean;
}

export function StatsGrid({ stats, loading }: StatsGridProps) {
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

  if (loading) {
    return (
      <div className="tablet:grid-cols-3 desktop:grid-cols-4 grid grid-cols-1 gap-4">
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
    );
  }

  return (
    <div className="tablet:grid-cols-3 desktop:grid-cols-4 grid grid-cols-1 gap-4">
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
  );
}
