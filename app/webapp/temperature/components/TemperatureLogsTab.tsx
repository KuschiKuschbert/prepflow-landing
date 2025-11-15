'use client';

import { useCountryFormatting } from '@/hooks/useCountryFormatting';
import { useTranslation } from '@/lib/useTranslation';
import { useState } from 'react';
import { TemperatureEquipment, TemperatureLog } from '../types';
import { AddTemperatureLogForm } from './AddTemperatureLogForm';
import { EquipmentDetailDrawer } from './EquipmentDetailDrawer';
import { TemperatureFilters } from './TemperatureFilters';
import { TemperatureLogsLoadingState } from './TemperatureLogsLoadingState';
import { TemperatureLogsEmptyState } from './TemperatureLogsEmptyState';
import { TemperatureLogsTimePeriodHeader } from './TemperatureLogsTimePeriodHeader';
import { TemperatureLogCard } from './TemperatureLogCard';
import {
    formatDateString as formatDateStringUtil,
    formatTime as formatTimeUtil,
    getFoodSafetyStatus as getFoodSafetyStatusUtil,
    getTemperatureStatus as getTemperatureStatusUtil,
    groupLogsByTimePeriod,
} from './utils';

interface TemperatureLogsTabProps {
  logs: TemperatureLog[];
  equipment: TemperatureEquipment[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  showAddLog: boolean;
  setShowAddLog: (show: boolean) => void;
  newLog: any;
  setNewLog: (log: any) => void;
  onAddLog: (e: React.FormEvent) => void;
  onRefreshLogs: () => void;
  isLoading?: boolean;
}

const temperatureTypes = [
  { value: 'fridge', label: 'Fridge', icon: '🧊' },
  { value: 'freezer', label: 'Freezer', icon: '❄️' },
  { value: 'food_cooking', label: 'Food Cooking', icon: '🔥' },
  { value: 'food_hot_holding', label: 'Food Hot Holding', icon: '🍲' },
  { value: 'food_cold_holding', label: 'Food Cold Holding', icon: '🥗' },
  { value: 'storage', label: 'Storage', icon: '📦' },
];

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
}: TemperatureLogsTabProps) {
  const { t } = useTranslation();
  const { formatDate } = useCountryFormatting();
  const [drawerEquipment, setDrawerEquipment] = useState<TemperatureEquipment | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleLogClick = (log: TemperatureLog) => {
    if (log.location) {
      // Find equipment by matching location with equipment name OR equipment location
      const matchingEquipment = equipment.find(
        eq => eq.name === log.location || eq.location === log.location,
      );
      if (matchingEquipment) {
        setDrawerEquipment(matchingEquipment);
        setIsDrawerOpen(true);
      }
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setDrawerEquipment(null);
  };

  const formatTime = (timeString: string) => formatTimeUtil(timeString);
  const formatDateString = (dateString: string) => formatDateStringUtil(dateString, formatDate);
  const getTemperatureStatus = (temp: number, location: string) =>
    getTemperatureStatusUtil(temp, location, equipment);
  const getFoodSafetyStatus = (temp: number, logTime: string, logDate: string, type: string) =>
    getFoodSafetyStatusUtil(temp, logTime, logDate, type);
  const getTypeIcon = (type: string) => temperatureTypes.find(t => t.value === type)?.icon || '🌡️';
  const getTypeLabel = (type: string) =>
    temperatureTypes.find(t => t.value === type)?.label || type;

  // Convert equipment IDs from string to number for TemperatureFilters component
  const equipmentForFilters: Array<{ id?: number; name: string; equipment_type: string; is_active: boolean }> = equipment.map((eq) => {
    const parsedId = eq.id && !isNaN(parseInt(eq.id, 10)) ? parseInt(eq.id, 10) : undefined;
    return {
      id: parsedId,
      name: eq.name,
      equipment_type: eq.equipment_type,
      is_active: eq.is_active,
    };
  });

  // Wrap t function to ensure it always returns a string
  const tString = (key: string, fallback: string): string => {
    const result = t(key, fallback);
    return Array.isArray(result) ? result.join(' ') : String(result);
  };

  return (
    <div className="space-y-6">
      {/* Filters and Add Button */}
      <TemperatureFilters
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        equipment={equipmentForFilters}
        temperatureTypes={temperatureTypes}
        onAddClick={() => setShowAddLog(true)}
        t={tString}
      />

      {/* Add Log Form */}
      <AddTemperatureLogForm
        show={showAddLog}
        setShow={setShowAddLog}
        newLog={newLog}
        setNewLog={setNewLog}
        onAddLog={onAddLog}
        equipment={equipmentForFilters}
        temperatureTypes={temperatureTypes}
      />

      {/* Logs List */}
      <div className="space-y-6">
        {isLoading ? (
          <TemperatureLogsLoadingState />
        ) : logs.length === 0 ? (
          <TemperatureLogsEmptyState />
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
              <div className="grid gap-4 tablet:grid-cols-1 large-desktop:grid-cols-2">
                {timeGroup.logs.map(log => (
                  <TemperatureLogCard
                    key={log.id}
                    log={log}
                    equipment={equipment}
                    temperatureTypes={temperatureTypes}
                    formatDateString={formatDateString}
                    getTemperatureStatus={getTemperatureStatus}
                    getFoodSafetyStatus={getFoodSafetyStatus}
                    getTypeIcon={getTypeIcon}
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
        equipment={drawerEquipment}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}
