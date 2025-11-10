import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import DashboardStatsClient from './components/DashboardStatsClient';
import QuickActions from './components/QuickActions';
import { PageHeader } from './components/static/PageHeader';
import { AdaptiveContainer } from './components/AdaptiveContainer';

export default function WebAppDashboard() {
  return (
    <ErrorBoundary>
      <AdaptiveContainer>
        <div className="min-h-screen overflow-x-hidden bg-transparent py-4 sm:py-6">
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
      </AdaptiveContainer>
    </ErrorBoundary>
  );
}
