import { Suspense } from 'react';
import DashboardStatsClient from './components/DashboardStatsClient';
import QuickActions from './components/QuickActions';
import { PageHeader } from './components/static/PageHeader';
import { AdaptiveContainer } from './components/AdaptiveContainer';
import { LayoutDashboard } from 'lucide-react';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';

export const dynamic = 'force-dynamic';

export default function WebAppDashboard() {
  // ErrorBoundary is already in app/webapp/layout.tsx wrapping all children
  // No need to wrap here - server components cannot directly use client components
  try {
    return (
      <AdaptiveContainer>
        <div className="min-h-screen overflow-x-hidden bg-transparent py-4 sm:py-6">
          {/* Static Header - Renders Instantly */}
          <PageHeader
            title="Kitchen Management Dashboard"
            subtitle="Welcome back! Here's your kitchen overview"
            icon={LayoutDashboard}
          />

          {/* Static Quick Actions - Renders Instantly */}
          <QuickActions />

          {/* Dynamic Content - Loads After Initial Render */}
          <Suspense fallback={<PageSkeleton />}>
            <DashboardStatsClient />
          </Suspense>
        </div>
      </AdaptiveContainer>
    );
  } catch (error) {
    // Log error for debugging in Vercel logs
    console.error('[WebAppDashboard] Server-side render error:', error);
    if (error instanceof Error) {
      console.error('[WebAppDashboard] Error message:', error.message);
      console.error('[WebAppDashboard] Error stack:', error.stack);
    }
    // Re-throw to let Next.js error handling take over
    throw error;
  }
}
