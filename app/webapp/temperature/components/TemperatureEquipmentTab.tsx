'use client';

import { Icon } from '@/components/ui/Icon';
import { useNotification } from '@/contexts/NotificationContext';
import { useCountryFormatting } from '@/hooks/useCountryFormatting';
import { useTranslation } from '@/lib/useTranslation';
import { Grid3x3, Sparkles, Table2, Thermometer } from 'lucide-react';
import { useState } from 'react';
import { CreateEquipmentForm } from './CreateEquipmentForm';
import { EquipmentDetailDrawer } from './EquipmentDetailDrawer';
import { EquipmentItem } from './EquipmentItem';
import { EquipmentListTable } from './EquipmentListTable';

interface TemperatureEquipment {
  id: string;
  name: string;
  equipment_type: string;
  location: string | null;
  min_temp_celsius: number | null;
  max_temp_celsius: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface TemperatureEquipmentTabProps {
  equipment: TemperatureEquipment[];
  allLogs?: any[]; // Optional logs for last log date calculation
  quickTempLoading: Record<string, boolean>;
  onUpdateEquipment: (equipmentId: string, updates: Partial<TemperatureEquipment>) => Promise<void>;
  onCreateEquipment: (
    name: string,
    equipmentType: string,
    location: string | null,
    minTemp: number | null,
    maxTemp: number | null,
  ) => Promise<void>;
  onDeleteEquipment: (equipmentId: string) => Promise<void>;
  onQuickTempLog: (
    equipmentId: string,
    equipmentName: string,
    equipmentType: string,
  ) => Promise<void>;
  onRefreshLogs?: () => Promise<void>; // Callback to refresh logs without page reload
}

const temperatureTypes = [
  { value: 'fridge', label: 'Fridge', icon: '🧊' },
  { value: 'freezer', label: 'Freezer', icon: '❄️' },
  { value: 'food_cooking', label: 'Food Cooking', icon: '🔥' },
  { value: 'food_hot_holding', label: 'Food Hot Holding', icon: '🍲' },
  { value: 'food_cold_holding', label: 'Food Cold Holding', icon: '🥗' },
  { value: 'storage', label: 'Storage', icon: '📦' },
];

export default function TemperatureEquipmentTab({
  equipment,
  allLogs = [],
  quickTempLoading,
  onUpdateEquipment,
  onCreateEquipment,
  onDeleteEquipment,
  onQuickTempLog,
  onRefreshLogs,
}: TemperatureEquipmentTabProps) {
  const { t } = useTranslation();
  const { formatDate } = useCountryFormatting();
  const { showSuccess, showError } = useNotification();
  const [editingEquipment, setEditingEquipment] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<TemperatureEquipment | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isGenerating, setIsGenerating] = useState(false);
  const itemsPerPage = 20;
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    equipmentType: '',
    location: '',
    minTemp: null as number | null,
    maxTemp: null as number | null,
  });
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Calculate last log date for each equipment
  const getLastLogDate = (equipment: TemperatureEquipment): string | null => {
    const lastLogInfo = getLastLogInfo(equipment);
    return lastLogInfo ? lastLogInfo.date : null;
  };

  // Get last log info (date, temperature, and status)
  const getLastLogInfo = (equipment: TemperatureEquipment): {
    date: string;
    temperature: number;
    isInRange: boolean | null; // null if no thresholds set
  } | null => {
    // Match logs by location field matching equipment name OR equipment location
    const equipmentLogs = allLogs.filter(
      log => log.location === equipment.name || log.location === equipment.location,
    );
    if (equipmentLogs.length === 0) return null;

    // Sort by date and time, get the most recent
    const sortedLogs = equipmentLogs.sort((a, b) => {
      const dateA = new Date(`${a.log_date}T${a.log_time}`).getTime();
      const dateB = new Date(`${b.log_date}T${b.log_time}`).getTime();
      return dateB - dateA;
    });

    const lastLog = sortedLogs[0];
    if (!lastLog) return null;

    // Check if temperature is in range
    let isInRange: boolean | null = null;
    if (equipment.min_temp_celsius !== null && equipment.max_temp_celsius !== null) {
      isInRange =
        lastLog.temperature_celsius >= equipment.min_temp_celsius &&
        lastLog.temperature_celsius <= equipment.max_temp_celsius;
    } else if (equipment.min_temp_celsius !== null) {
      isInRange = lastLog.temperature_celsius >= equipment.min_temp_celsius;
    }

    return {
      date: lastLog.log_date,
      temperature: lastLog.temperature_celsius,
      isInRange,
    };
  };

  const handleEquipmentClick = (equipment: TemperatureEquipment) => {
    setSelectedEquipment(equipment);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedEquipment(null);
  };

  const getTypeIcon = (type: string) => {
    const typeInfo = temperatureTypes.find(t => t.value === type);
    return typeInfo?.icon || '🌡️';
  };

  const getTypeLabel = (type: string) => {
    const typeInfo = temperatureTypes.find(t => t.value === type);
    return typeInfo?.label || type;
  };

  const handleCreateEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onCreateEquipment(
        newEquipment.name,
        newEquipment.equipmentType,
        newEquipment.location || null,
        newEquipment.minTemp,
        newEquipment.maxTemp,
      );
      setNewEquipment({ name: '', equipmentType: '', location: '', minTemp: null, maxTemp: null });
      setShowCreateForm(false);
      // Reset to last page to show the new equipment
      const newTotalPages = Math.ceil((equipment.length + 1) / itemsPerPage);
      setCurrentPage(newTotalPages);
    } catch (error) {
      // Handle error gracefully
    }
  };

  const handleUpdateEquipment = async (
    equipmentId: string,
    updates: Partial<TemperatureEquipment>,
  ) => {
    try {
      await onUpdateEquipment(equipmentId, updates);
      setEditingEquipment(null);
    } catch (error) {
      // Handle error gracefully
    }
  };

  const handleDeleteEquipment = async (equipmentId: string) => {
    if (
      confirm(
        'Are you sure you want to delete this equipment? This will also delete all associated temperature logs.',
      )
    ) {
      try {
        await onDeleteEquipment(equipmentId);
        // Adjust page if current page becomes empty after deletion
        const newTotalPages = Math.ceil((equipment.length - 1) / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
      } catch (error) {
        // Handle error gracefully
      }
    }
  };

  const toggleEquipmentStatus = async (equipmentId: string, currentStatus: boolean) => {
    try {
      await onUpdateEquipment(equipmentId, { is_active: !currentStatus });
    } catch (error) {
      // Handle error gracefully
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, equipment.length);

  const handleGenerateSampleData = async () => {
    if (equipment.length === 0) {
      showError('Please add equipment first before generating sample logs');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/temperature-logs/generate-sample', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        showSuccess(
          `Successfully generated ${data.data.totalLogs} temperature log entries (5 per equipment, spread across last 2 weeks)`,
        );
        // Refresh logs without reloading the page to preserve tab state
        if (onRefreshLogs) {
          // Wait a moment for database to be ready
          await new Promise(resolve => setTimeout(resolve, 500));
          await onRefreshLogs();
          // The allLogs prop will be updated by the parent component, triggering re-render
        } else {
          // Fallback: reload but preserve tab via URL hash
          setTimeout(() => {
            window.location.hash = 'equipment';
            window.location.reload();
          }, 1500);
        }
      } else {
        showError(data.error || 'Failed to generate sample data');
      }
    } catch (error) {
      console.error('Error generating sample data:', error);
      showError('Failed to generate sample data. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            {t('temperature.equipment', 'Temperature Equipment')}
          </h2>
          <p className="mt-2 text-base text-gray-400">
            {t('temperature.equipmentDesc', 'Manage your temperature monitoring equipment')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center gap-2 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                viewMode === 'table'
                  ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Table View"
            >
              <Icon icon={Table2} size="sm" aria-hidden={true} />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                viewMode === 'cards'
                  ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Card View"
            >
              <Icon icon={Grid3x3} size="sm" aria-hidden={true} />
              <span className="hidden sm:inline">Cards</span>
            </button>
          </div>
          {/* Generate Sample Data Button */}
          {equipment.length > 0 && (
            <button
              onClick={handleGenerateSampleData}
              disabled={isGenerating}
              className="group flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border border-[#29E7CD]/30 bg-[#29E7CD]/10 px-4 py-2.5 text-sm font-semibold text-[#29E7CD] shadow-lg transition-all duration-300 hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/20 hover:shadow-xl disabled:opacity-50 disabled:hover:bg-[#29E7CD]/10"
              title="Generate 5 sample logs per equipment (last 2 weeks)"
            >
              <Icon
                icon={Sparkles}
                size="sm"
                className="transition-transform duration-300 group-hover:rotate-12"
                aria-hidden={true}
              />
              <span className="hidden sm:inline">
                {isGenerating ? 'Generating...' : 'Generate Sample Logs'}
              </span>
              <span className="sm:hidden">{isGenerating ? '...' : '📊'}</span>
            </button>
          )}
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="group flex min-h-[44px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <span className="text-lg">➕</span>
            <span>{t('temperature.addEquipment', 'Add Equipment')}</span>
          </button>
        </div>
      </div>

      {/* Create New Equipment Form */}
      <CreateEquipmentForm
        show={showCreateForm}
        temperatureTypes={temperatureTypes}
        newEquipment={newEquipment}
        setNewEquipment={setNewEquipment}
        onSubmit={handleCreateEquipment}
        onCancel={() => setShowCreateForm(false)}
      />

      {/* Equipment List */}
      {equipment.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-[#2a2a2a] bg-gradient-to-br from-[#1f1f1f] to-[#2a2a2a]/50 p-8 text-center shadow-2xl">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 shadow-xl">
            <Icon icon={Thermometer} size="xl" className="text-[#29E7CD]" aria-hidden={true} />
          </div>
          <h3 className="mb-3 text-2xl font-bold text-white">No Equipment Added</h3>
          <p className="mb-6 max-w-md text-base text-gray-400">
            Add temperature monitoring equipment to start tracking temperatures and ensure food safety compliance
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-8 py-4 font-semibold text-black shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <span className="text-xl">➕</span>
            <span>Add Your First Equipment</span>
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <EquipmentListTable
          equipment={equipment}
          editingId={editingEquipment}
          setEditingId={setEditingEquipment}
          temperatureTypes={temperatureTypes}
          quickTempLoading={quickTempLoading}
          onQuickTempLog={onQuickTempLog}
          onToggleStatus={toggleEquipmentStatus}
          onDelete={handleDeleteEquipment}
          onUpdate={(id, updates) => handleUpdateEquipment(id, updates)}
          onEquipmentClick={handleEquipmentClick}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={equipment.length}
          onPageChange={setCurrentPage}
          getLastLogDate={getLastLogDate}
          getLastLogInfo={getLastLogInfo}
          formatDate={formatDate}
        />
      ) : (
        <div className="space-y-4">
          {/* Pagination for cards */}
          {Math.ceil(equipment.length / itemsPerPage) > 1 && (
            <div className="flex items-center justify-between rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] px-6 py-4">
              <div className="text-sm text-gray-400">
                Showing {startIndex + 1} to {Math.min(endIndex, equipment.length)} of {equipment.length} equipment
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-400">
                  Page {currentPage} of {Math.ceil(equipment.length / itemsPerPage)}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(Math.ceil(equipment.length / itemsPerPage), p + 1))}
                  disabled={currentPage >= Math.ceil(equipment.length / itemsPerPage)}
                  className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
          {/* Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {equipment.slice(startIndex, endIndex).map(item => (
              <EquipmentItem
                key={item.id}
                item={item as any}
                editingId={editingEquipment}
                setEditingId={setEditingEquipment}
                temperatureTypes={temperatureTypes}
                quickTempLoading={quickTempLoading}
                onQuickTempLog={onQuickTempLog}
                onToggleStatus={toggleEquipmentStatus}
                onDelete={handleDeleteEquipment}
                onUpdate={(id, updates) => handleUpdateEquipment(id, updates)}
                onEquipmentClick={handleEquipmentClick}
                getLastLogInfo={getLastLogInfo}
                formatDate={formatDate}
              />
            ))}
          </div>
        </div>
      )}

      {/* Equipment Detail Drawer */}
      <EquipmentDetailDrawer
        equipment={selectedEquipment}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}

  };

  const toggleEquipmentStatus = async (equipmentId: string, currentStatus: boolean) => {
    try {
      await onUpdateEquipment(equipmentId, { is_active: !currentStatus });
    } catch (error) {
      // Handle error gracefully
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, equipment.length);

  const handleGenerateSampleData = async () => {
    if (equipment.length === 0) {
      showError('Please add equipment first before generating sample logs');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/temperature-logs/generate-sample', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        showSuccess(
          `Successfully generated ${data.data.totalLogs} temperature log entries (5 per equipment, spread across last 2 weeks)`,
        );
        // Refresh logs without reloading the page to preserve tab state
        if (onRefreshLogs) {
          // Wait a moment for database to be ready
          await new Promise(resolve => setTimeout(resolve, 500));
          await onRefreshLogs();
          // The allLogs prop will be updated by the parent component, triggering re-render
        } else {
          // Fallback: reload but preserve tab via URL hash
          setTimeout(() => {
            window.location.hash = 'equipment';
            window.location.reload();
          }, 1500);
        }
      } else {
        showError(data.error || 'Failed to generate sample data');
      }
    } catch (error) {
      console.error('Error generating sample data:', error);
      showError('Failed to generate sample data. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            {t('temperature.equipment', 'Temperature Equipment')}
          </h2>
          <p className="mt-2 text-base text-gray-400">
            {t('temperature.equipmentDesc', 'Manage your temperature monitoring equipment')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center gap-2 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                viewMode === 'table'
                  ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Table View"
            >
              <Icon icon={Table2} size="sm" aria-hidden={true} />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                viewMode === 'cards'
                  ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Card View"
            >
              <Icon icon={Grid3x3} size="sm" aria-hidden={true} />
              <span className="hidden sm:inline">Cards</span>
            </button>
          </div>
          {/* Generate Sample Data Button */}
          {equipment.length > 0 && (
            <button
              onClick={handleGenerateSampleData}
              disabled={isGenerating}
              className="group flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border border-[#29E7CD]/30 bg-[#29E7CD]/10 px-4 py-2.5 text-sm font-semibold text-[#29E7CD] shadow-lg transition-all duration-300 hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/20 hover:shadow-xl disabled:opacity-50 disabled:hover:bg-[#29E7CD]/10"
              title="Generate 5 sample logs per equipment (last 2 weeks)"
            >
              <Icon
                icon={Sparkles}
                size="sm"
                className="transition-transform duration-300 group-hover:rotate-12"
                aria-hidden={true}
              />
              <span className="hidden sm:inline">
                {isGenerating ? 'Generating...' : 'Generate Sample Logs'}
              </span>
              <span className="sm:hidden">{isGenerating ? '...' : '📊'}</span>
            </button>
          )}
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="group flex min-h-[44px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <span className="text-lg">➕</span>
            <span>{t('temperature.addEquipment', 'Add Equipment')}</span>
          </button>
        </div>
      </div>

      {/* Create New Equipment Form */}
      <CreateEquipmentForm
        show={showCreateForm}
        temperatureTypes={temperatureTypes}
        newEquipment={newEquipment}
        setNewEquipment={setNewEquipment}
        onSubmit={handleCreateEquipment}
        onCancel={() => setShowCreateForm(false)}
      />

      {/* Equipment List */}
      {equipment.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-[#2a2a2a] bg-gradient-to-br from-[#1f1f1f] to-[#2a2a2a]/50 p-8 text-center shadow-2xl">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 shadow-xl">
            <Icon icon={Thermometer} size="xl" className="text-[#29E7CD]" aria-hidden={true} />
          </div>
          <h3 className="mb-3 text-2xl font-bold text-white">No Equipment Added</h3>
          <p className="mb-6 max-w-md text-base text-gray-400">
            Add temperature monitoring equipment to start tracking temperatures and ensure food safety compliance
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-8 py-4 font-semibold text-black shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <span className="text-xl">➕</span>
            <span>Add Your First Equipment</span>
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <EquipmentListTable
          equipment={equipment}
          editingId={editingEquipment}
          setEditingId={setEditingEquipment}
          temperatureTypes={temperatureTypes}
          quickTempLoading={quickTempLoading}
          onQuickTempLog={onQuickTempLog}
          onToggleStatus={toggleEquipmentStatus}
          onDelete={handleDeleteEquipment}
          onUpdate={(id, updates) => handleUpdateEquipment(id, updates)}
          onEquipmentClick={handleEquipmentClick}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={equipment.length}
          onPageChange={setCurrentPage}
          getLastLogDate={getLastLogDate}
          getLastLogInfo={getLastLogInfo}
          formatDate={formatDate}
        />
      ) : (
        <div className="space-y-4">
          {/* Pagination for cards */}
          {Math.ceil(equipment.length / itemsPerPage) > 1 && (
            <div className="flex items-center justify-between rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] px-6 py-4">
              <div className="text-sm text-gray-400">
                Showing {startIndex + 1} to {Math.min(endIndex, equipment.length)} of {equipment.length} equipment
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-400">
                  Page {currentPage} of {Math.ceil(equipment.length / itemsPerPage)}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(Math.ceil(equipment.length / itemsPerPage), p + 1))}
                  disabled={currentPage >= Math.ceil(equipment.length / itemsPerPage)}
                  className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
          {/* Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {equipment.slice(startIndex, endIndex).map(item => (
              <EquipmentItem
                key={item.id}
                item={item as any}
                editingId={editingEquipment}
                setEditingId={setEditingEquipment}
                temperatureTypes={temperatureTypes}
                quickTempLoading={quickTempLoading}
                onQuickTempLog={onQuickTempLog}
                onToggleStatus={toggleEquipmentStatus}
                onDelete={handleDeleteEquipment}
                onUpdate={(id, updates) => handleUpdateEquipment(id, updates)}
                onEquipmentClick={handleEquipmentClick}
                getLastLogInfo={getLastLogInfo}
                formatDate={formatDate}
              />
            ))}
          </div>
        </div>
      )}

      {/* Equipment Detail Drawer */}
      <EquipmentDetailDrawer
        equipment={selectedEquipment}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}
