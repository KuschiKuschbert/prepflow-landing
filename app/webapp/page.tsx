'use client';

import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { getUserFirstName } from '@/lib/user-name';
import { useUser } from '@auth0/nextjs-auth0/client';
import { LayoutDashboard } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import { PageHeader } from './components/static/PageHeader';

// Static imports - needed immediately
import QuickActions from './components/QuickActions';
import { TargetProgressWidget } from './components/TargetProgressWidget';

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
  // Staggered hydration state - mounting widgets in sequence to reduce TBT
  // OPTIMIZATION: Start at stage 1 to render stats immediately
  const [mountStage, setMountStage] = useState(1);

  useEffect(() => {
    // Stage 2: Operations & Menus (very short delay)
    const t1 = setTimeout(() => setMountStage(2), 50);

    // Stage 3: Alerts & Temp
    const t2 = setTimeout(() => setMountStage(3), 150);

    // Stage 4: Insights & Charts
    const t3 = setTimeout(() => setMountStage(4), 300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

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
      <div className="tablet:px-6 tablet:py-6 desktop:px-8 large-desktop:px-12 large-desktop:max-w-[1400px] mx-auto min-h-screen max-w-[1400px] overflow-x-hidden bg-transparent py-4 xl:max-w-[1400px] xl:px-16 2xl:max-w-[1600px] 2xl:px-20">
        {/* Static Header - Renders Instantly */}
        <PageHeader
          title="Kitchen Management Dashboard"
          subtitle={subtitle}
          icon={LayoutDashboard}
        />

        {/* Static Quick Actions - Renders Instantly */}
        <QuickActions />

        {/* Dynamic Content - Loads After Initial Render */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <Suspense fallback={<PageSkeleton />}>
              {mountStage >= 1 && <DashboardStatsClient />}
            </Suspense>
          </div>
          <div className="lg:col-span-1">
            <Suspense fallback={<PageSkeleton />}>
              {mountStage >= 1 && <TargetProgressWidget />}
            </Suspense>
          </div>
        </div>

        {/* Widget-Based Dashboard Layout - Enhanced spacing for large screens */}
        <div className="tablet:space-y-8 desktop:space-y-10 large-desktop:space-y-12 space-y-6 xl:space-y-14 2xl:space-y-16">
          {/* Row 1: Kitchen Operations + Menu Overview */}
          <div className="tablet:gap-8 desktop:grid-cols-2 desktop:gap-10 large-desktop:gap-12 grid grid-cols-1 gap-6 xl:gap-14 2xl:gap-16">
            <Suspense fallback={<PageSkeleton />}>
              {mountStage >= 2 ? <KitchenOperations /> : <PageSkeleton />}
            </Suspense>
            <Suspense fallback={<PageSkeleton />}>
              {mountStage >= 2 ? <MenuOverview /> : <PageSkeleton />}
            </Suspense>
          </div>

          {/* Row 2: Kitchen Alerts + Temperature Status */}
          <div className="tablet:gap-8 desktop:grid-cols-2 desktop:gap-10 large-desktop:gap-12 grid grid-cols-1 gap-6 xl:gap-14 2xl:gap-16">
            <Suspense fallback={<PageSkeleton />}>
              {mountStage >= 3 ? <KitchenAlerts /> : <PageSkeleton />}
            </Suspense>
            <Suspense fallback={<PageSkeleton />}>
              {mountStage >= 3 ? <TemperatureStatus /> : <PageSkeleton />}
            </Suspense>
          </div>

          {/* Row 3: Chef Performance Insights */}
          <div className="tablet:gap-8 desktop:gap-10 large-desktop:gap-12 grid grid-cols-1 gap-6 xl:gap-14 2xl:gap-16">
            <Suspense fallback={<PageSkeleton />}>
              {mountStage >= 4 ? <ChefPerformanceInsights /> : <PageSkeleton />}
            </Suspense>
          </div>

          {/* Row 4: Kitchen Charts */}
          <Suspense fallback={null}>{mountStage >= 4 && <KitchenCharts />}</Suspense>
        </div>
      </div>
    </ResponsivePageContainer>
  );
}
