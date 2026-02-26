'use client';

import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { useTemperatureWarnings } from '@/hooks/useTemperatureWarnings';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { PageTipsCard } from '@/components/ui/PageTipsCard';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { PageHeader } from './components/PageHeader';
import { TabNavigation } from './components/TabNavigation';
import { TemperatureLogsLoadingState } from './components/TemperatureLogsLoadingState';
import { useTemperaturePageData } from './hooks/useTemperaturePageData';
import { PAGE_TIPS_CONFIG } from '@/lib/page-help/page-tips-content';
import { useTemperaturePageHandlers } from './hooks/useTemperaturePageHandlers';
import { logger } from '@/lib/logger';
import { markFirstDone } from '@/lib/page-help/first-done-storage';

// Lazy load temperature tabs to reduce initial bundle size
const TemperatureEquipmentTab = dynamic(() => import('./components/TemperatureEquipmentTab'), {
  ssr: false,
  loading: () => <PageSkeleton />,
});

const TemperatureLogsTab = dynamic(() => import('./components/TemperatureLogsTab'), {
  ssr: false,
  loading: () => <PageSkeleton />,
});

const TemperatureAnalyticsTab = dynamic(() => import('./components/TemperatureAnalyticsTab'), {
  ssr: false,
  loading: () => <PageSkeleton />,
});

function TemperatureLogsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'logs' | 'equipment' | 'analytics'>('logs');

  const {
    logs,
    allLogs,
    equipment,
    setEquipment,
    loading,
    logsLoading,
    selectedDate,
    setSelectedDate,
    selectedType,
    setSelectedType,
    page,
    setPage,
    total,
    totalPages,
    fetchAllLogs,
    fetchEquipment,
    queryClient,
  } = useTemperaturePageData(activeTab);

  const {
    newLog,
    setNewLog,
    showAddLog,
    setShowAddLog,
    handleAddLog,
    handleDeleteLog: _handleDeleteLog,
    handleQuickTempLog,
    handleUpdateEquipment,
    handleCreateEquipment,
    handleDeleteEquipment,
    handleRefreshLogs,
  } = useTemperaturePageHandlers({
    activeTab,
    fetchAllLogs,
    fetchEquipment,
    queryClient,
    equipment,
    setEquipment,
  });

  // Pass allLogs to warnings hook (now always []) - hook is a no-op until refactored
  useTemperatureWarnings({ allLogs, equipment });

  // Mark first done for InlineHint/RescueNudge when user creates equipment or logs
  useEffect(() => {
    if (equipment.length > 0) markFirstDone('temperature-equipment');
  }, [equipment.length]);

  useEffect(() => {
    if (logs.length > 0) markFirstDone('temperature-logs');
  }, [logs.length]);

  // Check for action=new query parameter and open add log form
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'new' && !showAddLog) {
      setActiveTab('logs');
      setShowAddLog(true);
      router.replace(window.location.pathname);
    }
  }, [searchParams, showAddLog, setShowAddLog, router]);

  if (loading) {
    return (
      <ResponsivePageContainer>
        <div className="tablet:py-16 desktop:py-20 min-h-screen bg-transparent py-12 pb-24">
          <PageHeader />
          <TemperatureLogsLoadingState />
        </div>
      </ResponsivePageContainer>
    );
  }

  return (
    <ResponsivePageContainer>
      <div className="tablet:py-16 desktop:py-20 min-h-screen bg-transparent py-12 pb-24">
        <PageHeader />

        {PAGE_TIPS_CONFIG.temperature && (
          <div className="mb-6">
            <PageTipsCard config={PAGE_TIPS_CONFIG.temperature} />
          </div>
        )}

        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'logs' && (
          <TemperatureLogsTab
            logs={logs}
            equipment={equipment}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            showAddLog={showAddLog}
            setShowAddLog={setShowAddLog}
            newLog={newLog}
            setNewLog={setNewLog}
            onAddLog={handleAddLog}
            onRefreshLogs={handleRefreshLogs}
            isLoading={logsLoading}
            allLogs={allLogs}
            page={page}
            totalPages={totalPages}
            total={total}
            onPageChange={setPage}
          />
        )}

        {activeTab === 'equipment' && (
          <TemperatureEquipmentTab
            equipment={equipment}
            allLogs={allLogs}
            onUpdateEquipment={handleUpdateEquipment}
            onCreateEquipment={handleCreateEquipment}
            onDeleteEquipment={handleDeleteEquipment}
            onQuickTempLog={handleQuickTempLog}
            onRefreshLogs={handleRefreshLogs}
          />
        )}

        {activeTab === 'analytics' && (
          <TemperatureAnalyticsTab
            equipment={equipment}
            isLoading={loading}
            onRefreshLogs={() => {
              logger.dev('[Temperature] Refreshing analytics data...');
              handleRefreshLogs();
            }}
          />
        )}
      </div>
    </ResponsivePageContainer>
  );
}

export default function TemperatureLogsPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageSkeleton />}>
        <TemperatureLogsPageContent />
      </Suspense>
    </ErrorBoundary>
  );
}
