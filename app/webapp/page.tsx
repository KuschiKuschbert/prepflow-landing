'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { PageHeader } from './components/static/PageHeader';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { DashboardSection } from '@/components/ui/DashboardSection';
import { LayoutDashboard } from 'lucide-react';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';

// Static imports - needed immediately
import QuickActions from './components/QuickActions';

// Dynamic imports - lazy load heavy dashboard components
const DashboardStatsClient = dynamic(() => import('./components/DashboardStatsClient'), {
  ssr: false,
  loading: () => <PageSkeleton />,
});

const KitchenOperations = dynamic(() => import('./components/KitchenOperations'), {
  ssr: false,
  loading: () => <PageSkeleton />,
});

const MenuOverview = dynamic(() => import('./components/MenuOverview'), {
  ssr: false,
  loading: () => <PageSkeleton />,
});

const KitchenAlerts = dynamic(() => import('./components/KitchenAlerts'), {
  ssr: false,
  loading: () => <PageSkeleton />,
});

const TemperatureStatus = dynamic(() => import('./components/TemperatureStatus'), {
  ssr: false,
  loading: () => <PageSkeleton />,
});

const ChefPerformanceInsights = dynamic(() => import('./components/ChefPerformanceInsights'), {
  ssr: false,
  loading: () => <PageSkeleton />,
});

const KitchenCharts = dynamic(() => import('./components/KitchenCharts'), {
  ssr: false,
  loading: () => null, // Charts are non-critical, no loading state
});

export default function WebAppDashboard() {
  // ErrorBoundary is already in app/webapp/layout.tsx wrapping all children
  return (
    <ResponsivePageContainer fullWidth={true}>
      <div className="tablet:px-6 tablet:py-6 desktop:px-8 large-desktop:px-12 min-h-screen overflow-x-hidden bg-transparent px-4 py-4 xl:px-16 2xl:px-20">
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
          <Suspense fallback={null}>
            <KitchenCharts />
          </Suspense>
        </div>
      </div>
    </ResponsivePageContainer>
  );
}
