'use client';

import { useCountryFormatting } from '@/hooks/useCountryFormatting';
import { useTranslation } from '@/lib/useTranslation';
import { logger } from '@/lib/logger';
import { useState, useEffect } from 'react';
import { TemperatureEquipment, TemperatureLog } from '../types';
import { AddTemperatureLogForm } from './AddTemperatureLogForm';
import { EquipmentDetailDrawer } from './EquipmentDetailDrawer';
import { TemperatureFilters } from './TemperatureFilters';
import { TemperatureLogsLoadingState } from './TemperatureLogsLoadingState';
import { TemperatureLogsEmptyState } from './TemperatureLogsEmptyState';
import { TemperatureLogsTimePeriodHeader } from './TemperatureLogsTimePeriodHeader';
import { useSampleDataGeneration } from '../hooks/useSampleDataGeneration';
import { TemperatureLogCard } from './TemperatureLogCard';
import { ExportButton } from '@/components/ui/ExportButton';
import { PrintButton } from '@/components/ui/PrintButton';
import { useNotification } from '@/contexts/NotificationContext';
import { groupLogsByTimePeriod } from './utils';
import { getTypeLabel, temperatureTypesForSelect } from '../utils/temperatureUtils';
import { useTemperatureExport } from './TemperatureLogsTab/hooks/useTemperatureExport';
import { useEquipmentDrawer } from './TemperatureLogsTab/hooks/useEquipmentDrawer';
import { createFormatHelpers } from './TemperatureLogsTab/utils/formatHelpers';
import { convertEquipmentForFilters } from './TemperatureLogsTab/utils/equipmentFilters';
import type { TemperatureLogsTabProps } from './TemperatureLogsTab/types';

export default function TemperatureLogsTab({
  logs,
  equipment,
  selectedDate,
  setSelectedDate,
  selectedType,
  setSelectedType,
  showAddLog,
  setShowAddLog,
  newLog,
  setNewLog,
  onAddLog,
  onRefreshLogs,
  isLoading = false,
  allLogs = [],
}: TemperatureLogsTabProps) {
  const { t } = useTranslation();
  const { formatDate } = useCountryFormatting();
  const { showSuccess, showError } = useNotification();
  const [isMounted, setIsMounted] = useState(false);

  // Sample data generation for empty state
  const { isGenerating, handleGenerateSampleData } = useSampleDataGeneration({
    onRefreshLogs: async () => {
      if (onRefreshLogs) {
        try {
          await onRefreshLogs();
        } catch (error) {
          logger.error('[TemperatureLogsTab] Error refreshing logs:', {
            error: error instanceof Error ? error.message : String(error),
          });
          // Optionally show a toast or alert to the user
        }
      }
    },
  });

  // Export/print functionality
  const { exportLoading, handlePrint, handleExport } = useTemperatureExport({
    logs,
    allLogs,
    equipment,
    selectedDate,
  });

  // Equipment drawer management
  const { drawerEquipment, isDrawerOpen, handleLogClick, handleCloseDrawer } =
    useEquipmentDrawer(equipment);

  // Ensure consistent initial render between server and client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Debug logging
  useEffect(() => {
    if (isMounted) {
      logger.dev('[TemperatureLogsTab] State:', {
        isMounted,
        isLoading,
        logsCount: logs.length,
        hasLogs: logs.length > 0,
        logsSample: logs.slice(0, 2),
        renderingState: !isMounted
          ? 'loading (not mounted)'
          : isLoading
            ? 'loading (isLoading=true)'
            : logs.length === 0
              ? 'empty (no logs)'
              : 'logs (has logs)',
      });
    }
  }, [isMounted, isLoading, logs]);

  // Formatting helpers
  const formatHelpers = createFormatHelpers(formatDate, equipment);

  // Convert equipment IDs from string to number for TemperatureFilters component
  const equipmentForFilters = convertEquipmentForFilters(equipment);

  // Wrap t function to ensure it always returns a string
  const tString = (key: string, fallback: string): string => {
    const result = t(key, fallback);
    return Array.isArray(result) ? result.join(' ') : String(result);
  };

  return (
    <div className="space-y-6">
      {/* Filters, Export, and Add Button */}
      <div className="tablet:flex-row tablet:items-center tablet:justify-between flex flex-col gap-4">
        <TemperatureFilters
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          equipment={equipmentForFilters}
          temperatureTypes={temperatureTypesForSelect}
          onAddClick={() => setShowAddLog(true)}
          t={tString}
        />
        <div className="flex gap-2 print:hidden">
          <PrintButton
            onClick={handlePrint}
            label="Print"
            disabled={logs.length === 0 && allLogs.length === 0}
          />
          <ExportButton
            onExport={handleExport}
            loading={exportLoading}
            availableFormats={['csv', 'pdf', 'html']}
            label="Export"
            disabled={logs.length === 0 && allLogs.length === 0}
          />
        </div>
      </div>

      {/* Add Log Form */}
      <AddTemperatureLogForm
        show={showAddLog}
        setShow={setShowAddLog}
        newLog={newLog}
        setNewLog={setNewLog}
        onAddLog={onAddLog}
        equipment={equipmentForFilters}
        temperatureTypes={temperatureTypesForSelect}
      />

      {/* Logs List */}
      <div className="space-y-6">
        {!isMounted ? (
          <TemperatureLogsLoadingState />
        ) : isLoading ? (
          <TemperatureLogsLoadingState />
        ) : logs.length === 0 ? (
          <TemperatureLogsEmptyState
            equipmentCount={equipment.length}
            isGenerating={isGenerating}
            onGenerateSampleData={handleGenerateSampleData}
          />
        ) : (
          groupLogsByTimePeriod(logs).map(timeGroup => (
            <div key={timeGroup.period} className="space-y-4">
              <TemperatureLogsTimePeriodHeader
                period={timeGroup.period}
                icon={timeGroup.icon}
                label={timeGroup.label}
                logCount={timeGroup.logs.length}
              />

              {/* Logs for this time period */}
              <div className="tablet:grid-cols-1 large-desktop:grid-cols-2 grid gap-4">
                {timeGroup.logs.map(log => (
                  <TemperatureLogCard
                    key={log.id}
                    log={log}
                    equipment={equipment}
                    temperatureTypes={temperatureTypesForSelect}
                    formatDateString={formatHelpers.formatDateString}
                    getTemperatureStatus={formatHelpers.getTemperatureStatus}
                    getFoodSafetyStatus={formatHelpers.getFoodSafetyStatus}
                    getTypeIcon={formatHelpers.getTypeIcon}
                    getTypeLabel={getTypeLabel}
                    onLogClick={handleLogClick}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Equipment Detail Drawer */}
      <EquipmentDetailDrawer
        equipment={drawerEquipment!}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}
