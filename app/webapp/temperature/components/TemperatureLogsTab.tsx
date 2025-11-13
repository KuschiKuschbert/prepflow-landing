'use client';

import OptimizedImage from '@/components/OptimizedImage';
import { Icon } from '@/components/ui/Icon';
import { useCountryFormatting } from '@/hooks/useCountryFormatting';
import { useTranslation } from '@/lib/useTranslation';
import { Thermometer } from 'lucide-react';
import { useState } from 'react';
import { TemperatureEquipment, TemperatureLog } from '../types';
import { AddTemperatureLogForm } from './AddTemperatureLogForm';
import { EquipmentDetailDrawer } from './EquipmentDetailDrawer';
import { TemperatureFilters } from './TemperatureFilters';
import {
    formatDateString as formatDateStringUtil,
    formatTime as formatTimeUtil,
    getFoodSafetyStatus as getFoodSafetyStatusUtil,
    getStatusColor,
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
          <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-8 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
              <Icon icon={Thermometer} size="xl" className="text-[#29E7CD] animate-pulse" aria-hidden={true} />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white">
              {t('temperature.loading', 'Loading temperature logs...')}
            </h3>
            <p className="text-gray-400">
              {t('temperature.loadingDesc', 'Please wait while we fetch your temperature data')}
            </p>
          </div>
        ) : logs.length === 0 ? (
          <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-8 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
              <Icon icon={Thermometer} size="xl" className="text-[#29E7CD]" aria-hidden={true} />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white">
              {t('temperature.noLogs', 'No Temperature Logs')}
            </h3>
            <p className="text-gray-400">
              {t(
                'temperature.noLogsDesc',
                'Start logging temperatures to ensure food safety compliance',
              )}
            </p>
          </div>
        ) : (
          groupLogsByTimePeriod(logs).map(timeGroup => (
            <div key={timeGroup.period} className="space-y-4">
              {/* Time Period Header */}
              <div className="mb-6 flex items-center gap-4 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 shadow-lg">
                  <span className="text-2xl">{timeGroup.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">{timeGroup.label}</h3>
                  <p className="text-sm text-gray-400">
                    {timeGroup.logs.length} temperature reading
                    {timeGroup.logs.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Logs for this time period */}
              <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                {timeGroup.logs.map(log => {
                  const status = getTemperatureStatus(log.temperature_celsius, log.location || '');
                  const foodSafety = getFoodSafetyStatus(
                    log.temperature_celsius,
                    log.log_time,
                    log.log_date,
                    log.temperature_type,
                  );
                  const matchingEquipment = log.location
                    ? equipment.find(eq => eq.name === log.location || eq.location === log.location)
                    : null;
                  const isClickable = !!matchingEquipment;

                  return (
                    <div
                      key={log.id}
                      onClick={() => isClickable && handleLogClick(log)}
                      className={`group relative overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg transition-all duration-300 ${
                        isClickable
                          ? 'cursor-pointer hover:border-[#29E7CD]/30 hover:shadow-2xl'
                          : 'hover:border-[#29E7CD]/30 hover:shadow-2xl'
                      }`}
                    >
                      {/* Gradient accent */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#29E7CD]/5 to-[#D925C7]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                      <div className="relative">
                        <div className="mb-4 flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1 min-w-0">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10 shadow-lg">
                              <span className="text-2xl">{getTypeIcon(log.temperature_type)}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="mb-1 text-lg font-semibold text-white truncate">
                                {log.location || getTypeLabel(log.temperature_type)}
                              </h4>
                              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
                                <span>{formatDateString(log.log_date)}</span>
                                <span className="text-gray-600">•</span>
                                <span>{log.log_time}</span>
                                <span className="text-gray-600">•</span>
                                <span className="text-xs">{getTypeLabel(log.temperature_type)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex shrink-0 flex-col items-end gap-2">
                            <span className="text-3xl font-bold text-[#29E7CD]">
                              {log.temperature_celsius}°C
                            </span>
                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(status)}`}
                            >
                              {status === 'high'
                                ? '⚠️ High'
                                : status === 'low'
                                  ? '⚠️ Low'
                                  : '✅ Normal'}
                            </span>
                          </div>
                        </div>

                        {/* Additional Info */}
                        {(log.location || log.logged_by || log.notes) && (
                          <div className="mb-4 space-y-2 rounded-2xl bg-[#2a2a2a]/30 p-3">
                            {log.location && log.location !== getTypeLabel(log.temperature_type) && (
                              <div className="flex items-center gap-2 text-sm text-gray-300">
                                <span>📍</span>
                                <span>{log.location}</span>
                              </div>
                            )}
                            {log.logged_by && (
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span>👤</span>
                                <span>
                                  {t('temperature.loggedBy', 'Logged by')}: {log.logged_by}
                                </span>
                              </div>
                            )}
                            {log.notes && (
                              <p className="text-sm text-gray-300 leading-relaxed">{log.notes}</p>
                            )}
                          </div>
                        )}

                        {/* Food Safety Status (2-Hour/4-Hour Rule) */}
                        {foodSafety && (
                          <div
                            className={`mb-4 rounded-2xl border p-4 ${
                              foodSafety.status === 'safe'
                                ? 'bg-green-400/10 border-green-400/20'
                                : foodSafety.status === 'warning'
                                  ? 'bg-yellow-400/10 border-yellow-400/20'
                                  : 'bg-red-400/10 border-red-400/20'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-xl">{foodSafety.icon}</span>
                              <div className="flex-1">
                                <p
                                  className={`mb-1 text-sm font-semibold ${foodSafety.color}`}
                                >
                                  Queensland 2-Hour/4-Hour Rule
                                </p>
                                <p className={`text-xs ${foodSafety.color} leading-relaxed`}>
                                  {foodSafety.message}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {log.photo_url && (
                          <div className="mb-4 overflow-hidden rounded-2xl">
                            <OptimizedImage
                              src={log.photo_url}
                              alt="Temperature reading"
                              width={200}
                              height={200}
                              className="h-32 w-full rounded-2xl border border-[#2a2a2a] object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={e => e.stopPropagation()}
                            className="flex-1 rounded-xl bg-[#2a2a2a] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[#3a3a3a] hover:shadow-lg"
                          >
                            📷 {t('temperature.addPhoto', 'Add Photo')}
                          </button>
                          <button
                            onClick={e => e.stopPropagation()}
                            className="flex-1 rounded-xl bg-[#2a2a2a] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[#3a3a3a] hover:shadow-lg"
                          >
                            ✏️ {t('temperature.edit', 'Edit')}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
