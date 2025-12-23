'use client';

import { DashboardSection } from '@/components/ui/DashboardSection';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { getUserFirstName } from '@/lib/user-name';
import { LayoutDashboard } from 'lucide-react';
import { useUser } from '@auth0/nextjs-auth0/client';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { PageHeader } from './components/static/PageHeader';

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
  const { user } = useUser();
  const displayName = getUserFirstName({
    name: user?.name,
    email: user?.email,
  });
  const subtitle = displayName
    ? `Welcome back, ${displayName}! Here's your kitchen overview`
    : "Welcome back! Here's your kitchen overview";

  return (
    <ResponsivePageContainer fullWidth={true}>
      <div className="tablet:px-6 tablet:py-6 desktop:px-8 large-desktop:px-12 min-h-screen overflow-x-hidden bg-transparent px-4 py-4 xl:px-16 2xl:px-20 mx-auto max-w-[1400px] large-desktop:max-w-[1400px] xl:max-w-[1400px] 2xl:max-w-[1600px]">
        {/* Static Header - Renders Instantly */}
        <PageHeader
          title="Kitchen Management Dashboard"
          subtitle={subtitle}
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

        {/* Widget-Based Dashboard Layout - Enhanced spacing for large screens */}
        <div className="space-y-6 tablet:space-y-8 desktop:space-y-10 large-desktop:space-y-12 xl:space-y-14 2xl:space-y-16">
          {/* Row 1: Kitchen Operations + Menu Overview */}
          <div className="grid grid-cols-1 gap-6 tablet:gap-8 desktop:grid-cols-2 desktop:gap-10 large-desktop:gap-12 xl:gap-14 2xl:gap-16">
            <Suspense fallback={<PageSkeleton />}>
              <KitchenOperations />
            </Suspense>
            <Suspense fallback={<PageSkeleton />}>
              <MenuOverview />
            </Suspense>
          </div>

          {/* Row 2: Kitchen Alerts + Temperature Status */}
          <div className="grid grid-cols-1 gap-6 tablet:gap-8 desktop:grid-cols-2 desktop:gap-10 large-desktop:gap-12 xl:gap-14 2xl:gap-16">
            <Suspense fallback={<PageSkeleton />}>
              <KitchenAlerts />
            </Suspense>
            <Suspense fallback={<PageSkeleton />}>
              <TemperatureStatus />
            </Suspense>
          </div>

          {/* Row 3: Chef Performance Insights */}
          <div className="grid grid-cols-1 gap-6 tablet:gap-8 desktop:gap-10 large-desktop:gap-12 xl:gap-14 2xl:gap-16">
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
