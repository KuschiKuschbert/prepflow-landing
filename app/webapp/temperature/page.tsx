'use client';

import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { useTemperatureWarnings } from '@/hooks/useTemperatureWarnings';
import { useState } from 'react';

import TemperatureEquipmentTab from './components/TemperatureEquipmentTab';
import TemperatureLogsTab from './components/TemperatureLogsTab';
import TemperatureAnalyticsTab from './components/TemperatureAnalyticsTab';
import { PageHeader } from './components/PageHeader';
import { TabNavigation } from './components/TabNavigation';
import { TemperatureLogsLoadingState } from './components/TemperatureLogsLoadingState';
import { useTemperaturePageData } from './hooks/useTemperaturePageData';
import { useTemperaturePageHandlers } from './hooks/useTemperaturePageHandlers';

function TemperatureLogsPageContent() {
  const [activeTab, setActiveTab] = useState<'logs' | 'equipment' | 'analytics'>('logs');

  const {
    logs,
    allLogs,
    equipment,
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
    pageSize,
    fetchAllLogs,
    fetchEquipment,
    queryClient,
  } = useTemperaturePageData(activeTab);

  const {
    quickTempLoading,
    newLog,
    setNewLog,
    showAddLog,
    setShowAddLog,
    handleAddLog,
    handleDeleteLog,
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
  });

  useTemperatureWarnings({ allLogs, equipment });

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
          <>
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
              onRefreshLogs={() => {}}
              isLoading={logsLoading}
            />
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-400">
                Page {page} of {totalPages} ({total} items)
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-lg bg-[#2a2a2a] px-3 py-2 text-sm text-white disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="rounded-lg bg-[#2a2a2a] px-3 py-2 text-sm text-white disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'equipment' && (
          <TemperatureEquipmentTab
            equipment={equipment}
            allLogs={allLogs}
            quickTempLoading={quickTempLoading}
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
              console.log('🔄 Refreshing analytics data after sample generation...');
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
      <TemperatureLogsPageContent />
    </ErrorBoundary>
  );
}
