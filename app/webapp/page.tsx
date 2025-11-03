import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import DashboardStatsClient from './components/DashboardStatsClient';
import QuickActions from './components/QuickActions';
import { PageHeader } from './components/static/PageHeader';

export default function WebAppDashboard() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-transparent p-4 sm:p-6">
        <div className="mx-auto max-w-7xl">
          {/* Static Header - Renders Instantly */}
          <PageHeader
            title="Kitchen Management Dashboard"
            subtitle="Welcome back! Here's your kitchen overview"
            icon="🏠"
          />

          {/* Static Quick Actions - Renders Instantly */}
          <QuickActions />

          {/* Dynamic Content - Loads After Initial Render */}
          <DashboardStatsClient />
        </div>
      </div>
    </ErrorBoundary>
  );
}
