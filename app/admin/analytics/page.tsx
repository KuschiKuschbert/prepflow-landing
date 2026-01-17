'use client';

import { AnalyticsStatsGrid } from './components/AnalyticsStatsGrid';
import { FeatureUsageList } from './components/FeatureUsageList';
import { useAnalyticsData } from './hooks/useAnalyticsData';

/**
 * Analytics page component for admin dashboard.
 * Displays user activity and feature usage metrics.
 *
 * @component
 * @returns {JSX.Element} Analytics page with stats and feature usage charts
 */
export default function AnalyticsPage() {
  const { analytics, loading } = useAnalyticsData();

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

      <AnalyticsStatsGrid data={analytics} />

      <FeatureUsageList data={analytics} />
    </div>
  );
}
