'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import OptimizedImage from '@/components/OptimizedImage';
import { useCountryFormatting } from '@/hooks/useCountryFormatting';
import { TemperatureLog, TemperatureEquipment } from '../types';
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

  // Helper functions
  const formatTime = (timeString: string) => formatTimeUtil(timeString);

  const formatDateString = (dateString: string) => formatDateStringUtil(dateString, formatDate);

  const getTemperatureStatus = (temp: number, location: string) =>
    getTemperatureStatusUtil(temp, location, equipment);

  const getFoodSafetyStatus = (temp: number, logTime: string, logDate: string, type: string) =>
    getFoodSafetyStatusUtil(temp, logTime, logDate, type);

  // getStatusColor imported

  const getTypeIcon = (type: string) => {
    const typeInfo = temperatureTypes.find(t => t.value === type);
    return typeInfo?.icon || '🌡️';
  };

  const getTypeLabel = (type: string) => {
    const typeInfo = temperatureTypes.find(t => t.value === type);
    return typeInfo?.label || type;
  };

  // groupLogsByTimePeriod imported

  return (
    <div className="space-y-6">
      {/* Filters and Add Button */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              {t('temperature.filterDate', 'Filter by Date')}
            </label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  const currentDate = new Date(selectedDate);
                  currentDate.setDate(currentDate.getDate() - 1);
                  setSelectedDate(currentDate.toISOString().split('T')[0]);
                }}
                className="flex items-center justify-center rounded-xl bg-[#2a2a2a] px-3 py-2 text-white transition-all duration-200 hover:bg-[#3a3a3a]"
                title="Previous day"
              >
                <span className="text-lg">←</span>
              </button>
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              />
              <button
                onClick={() => {
                  const currentDate = new Date(selectedDate);
                  currentDate.setDate(currentDate.getDate() + 1);
                  setSelectedDate(currentDate.toISOString().split('T')[0]);
                }}
                className="flex items-center justify-center rounded-xl bg-[#2a2a2a] px-3 py-2 text-white transition-all duration-200 hover:bg-[#3a3a3a]"
                title="Next day"
              >
                <span className="text-lg">→</span>
              </button>
              <button
                onClick={() => {
                  setSelectedDate(new Date().toISOString().split('T')[0]);
                }}
                className="rounded-xl bg-[#29E7CD]/10 px-3 py-2 text-sm font-medium text-[#29E7CD] transition-all duration-200 hover:bg-[#29E7CD]/20"
                title="Go to today"
              >
                Today
              </button>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              {t('temperature.filterEquipment', 'Filter by Equipment')}
            </label>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            >
              <option value="all">{t('temperature.allEquipment', 'All Equipment')}</option>

              {equipment
                .filter(eq => eq.is_active)
                .map(item => (
                  <option key={item.id} value={item.equipment_type}>
                    {getTypeIcon(item.equipment_type)} {item.name}
                  </option>
                ))}

              {temperatureTypes
                .filter(
                  type =>
                    type.value === 'food_cooking' ||
                    type.value === 'food_hot_holding' ||
                    type.value === 'food_cold_holding',
                )
                .map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <button
          onClick={() => setShowAddLog(true)}
          className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
        >
          ➕ {t('temperature.addLog', 'Add Temperature Log')}
        </button>
      </div>

      {/* Add Log Form */}
      {showAddLog && (
        <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg">
          <h3 className="mb-2 text-xl font-semibold text-white">
            {t('temperature.addNewLog', 'Add New Temperature Log')}
          </h3>
          <p className="mb-4 text-sm text-gray-400">
            💡 You can log multiple temperatures per day for the same equipment (e.g., morning and
            evening checks). There's a 5-minute cooling off period between entries for the same
            equipment.
          </p>
          <div className="mb-4 rounded-2xl border border-blue-400/20 bg-blue-400/10 p-4">
            <h4 className="mb-2 text-sm font-semibold text-blue-400">
              🍽️ Queensland 2-Hour/4-Hour Rule
            </h4>
            <div className="space-y-1 text-xs text-gray-300">
              <p>
                • <span className="text-green-400">0-2 hours</span> in danger zone (5°C-60°C): Can
                refrigerate for later use
              </p>
              <p>
                • <span className="text-yellow-400">2-4 hours</span> in danger zone: Must use
                immediately
              </p>
              <p>
                • <span className="text-red-400">4+ hours</span> in danger zone: Must discard
              </p>
            </div>
          </div>
          <form onSubmit={onAddLog} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                {t('temperature.date', 'Date')}
              </label>
              <input
                type="date"
                value={newLog.log_date}
                onChange={e => setNewLog({ ...newLog, log_date: e.target.value })}
                className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                {t('temperature.time', 'Time')}
              </label>
              <input
                type="time"
                value={newLog.log_time}
                onChange={e => setNewLog({ ...newLog, log_time: e.target.value })}
                className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                {t('temperature.equipment', 'Equipment')}
              </label>
              <select
                value={newLog.temperature_type}
                onChange={e => {
                  const selectedEquipment = equipment.find(
                    eq => eq.equipment_type === e.target.value,
                  );
                  setNewLog({
                    ...newLog,
                    temperature_type: e.target.value,
                    location: selectedEquipment?.name || '',
                  });
                }}
                className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                required
              >
                <option value="">{t('temperature.selectEquipment', 'Select Equipment')}</option>

                {equipment
                  .filter(eq => eq.is_active)
                  .map(item => (
                    <option key={item.id} value={item.equipment_type}>
                      {getTypeIcon(item.equipment_type)} {item.name} (
                      {getTypeLabel(item.equipment_type)})
                    </option>
                  ))}

                {temperatureTypes
                  .filter(
                    type =>
                      type.value === 'food_cooking' ||
                      type.value === 'food_hot_holding' ||
                      type.value === 'food_cold_holding',
                  )
                  .map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label} (Food Safety)
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                {t('temperature.temperature', 'Temperature (°C)')}
              </label>
              <input
                type="number"
                step="0.1"
                value={newLog.temperature_celsius}
                onChange={e => setNewLog({ ...newLog, temperature_celsius: e.target.value })}
                className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                placeholder="e.g., 3.5"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                {['food_cooking', 'food_hot_holding', 'food_cold_holding'].includes(
                  newLog.temperature_type,
                )
                  ? t('temperature.foodItem', 'Food Item')
                  : t('temperature.location', 'Location')}
              </label>
              <input
                type="text"
                value={newLog.location}
                onChange={e => setNewLog({ ...newLog, location: e.target.value })}
                className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                placeholder={
                  ['food_cooking', 'food_hot_holding', 'food_cold_holding'].includes(
                    newLog.temperature_type,
                  )
                    ? 'e.g., Chicken Curry, Soup Station 1, Salad Bar'
                    : 'e.g., Main Fridge, Freezer 1'
                }
                required={['food_cooking', 'food_hot_holding', 'food_cold_holding'].includes(
                  newLog.temperature_type,
                )}
              />
              {['food_cooking', 'food_hot_holding', 'food_cold_holding'].includes(
                newLog.temperature_type,
              ) && (
                <p className="mt-1 text-xs text-gray-400">
                  💡 Specify the exact food item for proper 2-hour/4-hour rule tracking
                </p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                {t('temperature.loggedBy', 'Logged By')}
              </label>
              <input
                type="text"
                value={newLog.logged_by}
                onChange={e => setNewLog({ ...newLog, logged_by: e.target.value })}
                className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                placeholder="Staff member name"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-300">
                {t('temperature.notes', 'Notes')}
              </label>
              <textarea
                value={newLog.notes}
                onChange={e => setNewLog({ ...newLog, notes: e.target.value })}
                className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                placeholder="Additional notes or observations"
                rows={3}
              />
            </div>
            <div className="flex space-x-4 md:col-span-2">
              <button
                type="submit"
                className="rounded-2xl bg-[#29E7CD] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
              >
                {t('temperature.save', 'Save Log')}
              </button>
              <button
                type="button"
                onClick={() => setShowAddLog(false)}
                className="rounded-2xl bg-[#2a2a2a] px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-[#3a3a3a]"
              >
                {t('temperature.cancel', 'Cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

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
