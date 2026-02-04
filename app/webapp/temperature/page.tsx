'use client';

import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { useTemperatureWarnings } from '@/hooks/useTemperatureWarnings';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { PageHeader } from './components/PageHeader';
import { TabNavigation } from './components/TabNavigation';
import { TemperatureLogsLoadingState } from './components/TemperatureLogsLoadingState';
import { useTemperaturePageData } from './hooks/useTemperaturePageData';
import { useTemperaturePageHandlers } from './hooks/useTemperaturePageHandlers';

// Lazy load temperature tabs to reduce initial bundle size (TemperatureAnalyticsTab uses Recharts)
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

import { logger } from '@/lib/logger';
function TemperatureLogsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'logs' | 'equipment' | 'analytics'>('logs');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    logs,
    allLogs,
    equipment,
    setEquipment,
    loading,
    analyticsLoading,
    logsLoading,
    selectedDate,
    setSelectedDate,
    selectedType,
    setSelectedType,
    page,
    setPage,
    total,
    totalPages,
    pageSize: _pageSize,
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

  useTemperatureWarnings({ allLogs, equipment });

  // Check for action=new query parameter and open add log form
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'new' && !showAddLog) {
      // Ensure logs tab is active
      setActiveTab('logs');
      // Open the add log form
      setShowAddLog(true);
      // Clean up URL by removing query parameter
      const newUrl = window.location.pathname;
      router.replace(newUrl);
    }
  }, [searchParams, showAddLog, setShowAddLog, router]);

  // Show loading state while fetching equipment
  if (loading) {
    return (
      <ResponsivePageContainer>
        <div className="tablet:py-6 tablet:pb-6 min-h-screen bg-transparent py-4 pb-24">
          <PageHeader />
          <TemperatureLogsLoadingState />
        </div>
      </ResponsivePageContainer>
    );
  }

  return (
    <ResponsivePageContainer>
      <div className="tablet:py-6 tablet:pb-6 min-h-screen bg-transparent py-4 pb-24">
        <PageHeader />

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
            allLogs={allLogs}
            equipment={equipment}
            isLoading={analyticsLoading}
            onRefreshLogs={() => {
              logger.dev('🔄 Refreshing analytics data after sample generation...');
              fetchAllLogs(1000, true).catch(() => {});
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
