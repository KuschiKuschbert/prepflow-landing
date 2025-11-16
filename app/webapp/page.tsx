'use client';

import { Suspense } from 'react';
import DashboardStatsClient from './components/DashboardStatsClient';
import QuickActions from './components/QuickActions';
import { PageHeader } from './components/static/PageHeader';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { DashboardSection } from '@/components/ui/DashboardSection';
import { LayoutDashboard } from 'lucide-react';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import KitchenOperations from './components/KitchenOperations';
import KitchenAlerts from './components/KitchenAlerts';
import ChefPerformanceInsights from './components/ChefPerformanceInsights';
import TemperatureStatus from './components/TemperatureStatus';
import MenuOverview from './components/MenuOverview';
import KitchenCharts from './components/KitchenCharts';

export default function WebAppDashboard() {
  // ErrorBoundary is already in app/webapp/layout.tsx wrapping all children
  return (
    <ResponsivePageContainer>
      <div className="tablet:py-6 min-h-screen overflow-x-hidden bg-transparent py-4">
        {/* Static Header - Renders Instantly */}
        <PageHeader
          title="Kitchen Management Dashboard"
          subtitle="Welcome back! Here's your kitchen overview"
          icon={LayoutDashboard}
        />

        {/* Static Quick Actions - Renders Instantly */}
        <QuickActions />

        {/* Dynamic Content - Loads After Initial Render */}
        <DashboardSection>
          <Suspense fallback={<PageSkeleton />}>
            <DashboardStatsClient />
          </Suspense>
        </DashboardSection>

        {/* Widget-Based Dashboard Layout */}
        <div className="tablet:space-y-8 space-y-6">
          {/* Row 1: Kitchen Operations + Menu Overview */}
          <div className="desktop:grid-cols-2 desktop:gap-8 grid grid-cols-1 gap-6">
            <Suspense fallback={<PageSkeleton />}>
              <KitchenOperations />
            </Suspense>
            <Suspense fallback={<PageSkeleton />}>
              <MenuOverview />
            </Suspense>
          </div>

          {/* Row 2: Kitchen Alerts + Temperature Status */}
          <div className="desktop:grid-cols-2 desktop:gap-8 grid grid-cols-1 gap-6">
            <Suspense fallback={<PageSkeleton />}>
              <KitchenAlerts />
            </Suspense>
            <Suspense fallback={<PageSkeleton />}>
              <TemperatureStatus />
            </Suspense>
          </div>

          {/* Row 3: Chef Performance Insights */}
          <div className="desktop:gap-8 grid grid-cols-1 gap-6">
            <Suspense fallback={<PageSkeleton />}>
              <ChefPerformanceInsights />
            </Suspense>
          </div>

          {/* Row 4: Kitchen Charts */}
          <Suspense fallback={<PageSkeleton />}>
            <KitchenCharts />
          </Suspense>
        </div>
      </div>
    </ResponsivePageContainer>
  );
}
