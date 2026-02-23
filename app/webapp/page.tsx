'use client';

import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { PageTipsCard } from '@/components/ui/PageTipsCard';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { PAGE_TIPS_CONFIG } from '@/lib/page-help/page-tips-content';
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

const UpcomingFunctionsWidget = dynamic(() => import('./components/UpcomingFunctionsWidget'), {
  ssr: false,
  loading: () => <PageSkeleton />,
});

const RecentActivity = dynamic(() => import('./components/RecentActivity'), {
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

        {PAGE_TIPS_CONFIG.dashboard && (
          <div className="mb-6">
            <PageTipsCard config={PAGE_TIPS_CONFIG.dashboard} />
          </div>
        )}

        {/* Static Quick Actions - Renders Instantly */}
        <QuickActions />

        {/* Unified Dashboard Grid */}
        <div className="tablet:gap-6 desktop:gap-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8">
          {/* Row 1: Immediate Dashboard Status (Stats & Targets) */}
          <div className="lg:col-span-2 xl:col-span-3">
            <Suspense fallback={<PageSkeleton />}>
              {mountStage >= 1 && <DashboardStatsClient />}
            </Suspense>
          </div>

          <div className="col-span-1 lg:col-span-1 xl:col-span-1">
            <Suspense fallback={null}>{mountStage >= 1 && <TargetProgressWidget />}</Suspense>
          </div>

          {/* Row 2: Critical Operations & Alerts (Functions, Alerts, Temp) */}
          <div className="col-span-1 md:col-span-2 xl:col-span-2">
            <Suspense fallback={null}>{mountStage >= 2 && <UpcomingFunctionsWidget />}</Suspense>
          </div>

          <div className="col-span-1 md:col-span-1 xl:col-span-1">
            <Suspense fallback={null}>{mountStage >= 3 && <KitchenAlerts />}</Suspense>
          </div>

          <div className="col-span-1 md:col-span-1 xl:col-span-1">
            <Suspense fallback={null}>{mountStage >= 3 && <TemperatureStatus />}</Suspense>
          </div>

          {/* Row 3: Daily Task Management (Kitchen Ops & Menu Overview) */}
          <div className="col-span-1 md:col-span-2 xl:col-span-2">
            <Suspense fallback={null}>{mountStage >= 2 && <KitchenOperations />}</Suspense>
          </div>

          <div className="col-span-1 md:col-span-2 xl:col-span-2">
            <Suspense fallback={null}>{mountStage >= 2 && <MenuOverview />}</Suspense>
          </div>

          {/* Row 4: Performance & History (Recent Activity & Insights) */}
          <div className="col-span-1 md:col-span-2 xl:col-span-2">
            <Suspense fallback={null}>{mountStage >= 4 && <RecentActivity />}</Suspense>
          </div>

          <div className="col-span-1 md:col-span-2 xl:col-span-2">
            <Suspense fallback={null}>{mountStage >= 4 && <ChefPerformanceInsights />}</Suspense>
          </div>

          {/* Row 5: Data Visualization (Full width Charts) */}
          <div className="col-span-1 mt-4 md:col-span-2 lg:col-span-3 xl:col-span-4">
            <Suspense fallback={null}>{mountStage >= 4 && <KitchenCharts />}</Suspense>
          </div>
        </div>
      </div>
    </ResponsivePageContainer>
  );
}
