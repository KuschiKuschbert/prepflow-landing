'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { BarChart3, Users, Activity, TrendingUp } from 'lucide-react';
import { logger } from '@/lib/logger';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalIngredients: number;
  totalRecipes: number;
  totalDishes: number;
  userActivity: {
    date: string;
    activeUsers: number;
  }[];
  featureUsage: {
    feature: string;
    usage: number;
  }[];
}

/**
 * Analytics page component for admin dashboard.
 * Displays user activity and feature usage metrics.
 *
 * @component
 * @returns {JSX.Element} Analytics page with stats and feature usage charts
 */
export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const response = await fetch('/api/admin/analytics');
        if (response.ok) {
          const data = await response.json();
          setAnalytics(data);
        }
      } catch (error) {
        logger.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
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
        <h1 className="text-3xl font-bold text-white">Usage Analytics</h1>
        <p className="mt-2 text-gray-400">User activity and feature usage metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="tablet:grid-cols-3 desktop:grid-cols-4 grid grid-cols-1 gap-4">
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Total Users</h3>
            <Icon icon={Users} size="md" className="text-[#29E7CD]" />
          </div>
          <p className="text-3xl font-bold text-white">{analytics?.totalUsers || 0}</p>
        </div>

        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Active Users</h3>
            <Icon icon={Activity} size="md" className="text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white">{analytics?.activeUsers || 0}</p>
        </div>

        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Total Ingredients</h3>
            <Icon icon={BarChart3} size="md" className="text-[#D925C7]" />
          </div>
          <p className="text-3xl font-bold text-white">{analytics?.totalIngredients || 0}</p>
        </div>

        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Total Recipes</h3>
            <Icon icon={TrendingUp} size="md" className="text-[#FF6B00]" />
          </div>
          <p className="text-3xl font-bold text-white">{analytics?.totalRecipes || 0}</p>
        </div>
      </div>

      {/* Feature Usage */}
      {analytics?.featureUsage && analytics.featureUsage.length > 0 && (
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
          <h2 className="mb-4 text-xl font-bold text-white">Feature Usage</h2>
          <div className="space-y-3">
            {analytics.featureUsage.map(feature => (
              <div key={feature.feature} className="flex items-center justify-between">
                <span className="text-gray-300">{feature.feature}</span>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-48 rounded-full bg-[#2a2a2a]">
                    <div
                      className="h-2 rounded-full bg-[#29E7CD]"
                      style={{
                        width: `${Math.min((feature.usage / (analytics.totalUsers || 1)) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <span className="w-16 text-right text-white">{feature.usage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
