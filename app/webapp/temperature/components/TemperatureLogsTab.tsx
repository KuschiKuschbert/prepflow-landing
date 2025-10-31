'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import OptimizedImage from '@/components/OptimizedImage';
import { useCountryFormatting } from '@/hooks/useCountryFormatting';
import { TemperatureLog, TemperatureEquipment } from '../types';
import { TemperatureFilters } from './TemperatureFilters';
import { AddTemperatureLogForm } from './AddTemperatureLogForm';
import {
  formatTime as formatTimeUtil,
  formatDateString as formatDateStringUtil,
  getTemperatureStatus as getTemperatureStatusUtil,
  getFoodSafetyStatus as getFoodSafetyStatusUtil,
  getStatusColor,
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
}: TemperatureLogsTabProps) {
  const { t } = useTranslation();
  const { formatDate } = useCountryFormatting();

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
  const equipmentForFilters = equipment.map(eq => ({
    id: eq.id ? parseInt(eq.id, 10) : undefined,
    name: eq.name,
    equipment_type: eq.equipment_type,
    is_active: eq.is_active,
  }));

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
        {logs.length === 0 ? (
          <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-8 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
              <span className="text-4xl">🌡️</span>
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
              <div className="mb-4 flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
                  <span className="text-xl">{timeGroup.icon}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{timeGroup.label}</h3>
                  <p className="text-sm text-gray-400">
                    {timeGroup.logs.length} temperature reading
                    {timeGroup.logs.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Logs for this time period */}
              <div className="space-y-3">
                {timeGroup.logs.map(log => {
                  const status = getTemperatureStatus(log.temperature_celsius, log.location || '');
                  const foodSafety = getFoodSafetyStatus(
                    log.temperature_celsius,
                    log.log_time,
                    log.log_date,
                    log.temperature_type,
                  );
                  return (
                    <div
                      key={log.id}
                      className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg transition-all duration-200 hover:shadow-xl"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
                            <span className="text-lg">{getTypeIcon(log.temperature_type)}</span>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-white">
                              {log.location || getTypeLabel(log.temperature_type)}
                            </h4>
                            <div className="flex items-center space-x-2">
                              <p className="text-sm text-gray-400">{log.log_time}</p>
                              <span className="text-xs text-gray-500">•</span>
                              <p className="text-xs text-gray-500">
                                {getTypeLabel(log.temperature_type)}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span
                            className={`rounded-full border px-2 py-1 text-xs font-medium ${getStatusColor(status)}`}
                          >
                            {status === 'high'
                              ? '⚠️ High'
                              : status === 'low'
                                ? '⚠️ Low'
                                : '✅ Normal'}
                          </span>
                          <span className="text-xl font-bold text-[#29E7CD]">
                            {log.temperature_celsius}°C
                          </span>
                        </div>
                      </div>

                      {log.location && log.location !== getTypeLabel(log.temperature_type) && (
                        <p className="mb-2 text-sm text-gray-300">📍 {log.location}</p>
                      )}
                      {log.logged_by && (
                        <p className="mb-2 text-xs text-gray-400">
                          👤 {t('temperature.loggedBy', 'Logged by')}: {log.logged_by}
                        </p>
                      )}
                      {log.notes && <p className="mb-3 text-sm text-gray-300">{log.notes}</p>}

                      {/* Food Safety Status (2-Hour/4-Hour Rule) */}
                      {foodSafety && (
                        <div
                          className={`mb-3 rounded-xl border p-3 ${foodSafety.color.replace('text-', 'bg-').replace('-400', '-400/10')} border-${foodSafety.color.replace('text-', '').replace('-400', '-400/20')}`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{foodSafety.icon}</span>
                            <div>
                              <p className={`text-sm font-medium ${foodSafety.color}`}>
                                Queensland 2-Hour/4-Hour Rule
                              </p>
                              <p className={`text-xs ${foodSafety.color}`}>{foodSafety.message}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {log.photo_url && (
                        <div className="mb-3">
                          <OptimizedImage
                            src={log.photo_url}
                            alt="Temperature reading"
                            width={96}
                            height={96}
                            className="h-24 w-24 rounded-xl border border-[#2a2a2a] object-cover"
                          />
                        </div>
                      )}

                      <div className="flex space-x-3">
                        <button className="rounded-lg bg-[#2a2a2a] px-3 py-1 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#3a3a3a]">
                          📷 {t('temperature.addPhoto', 'Add Photo')}
                        </button>
                        <button className="rounded-lg bg-[#2a2a2a] px-3 py-1 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#3a3a3a]">
                          ✏️ {t('temperature.edit', 'Edit')}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
