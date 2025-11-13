'use client';

import { Icon } from '@/components/ui/Icon';
import { ArrowDown, ArrowUp, ArrowUpDown, Edit, Filter, Power, PowerOff, Search, Trash2, X } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { TemperatureEquipment } from '../types';

interface EquipmentListTableProps {
  equipment: TemperatureEquipment[];
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  temperatureTypes: Array<{ value: string; label: string; icon: string }>;
  quickTempLoading: Record<string, boolean>;
  onQuickTempLog: (id: string, name: string, type: string) => Promise<void>;
  onToggleStatus: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<TemperatureEquipment>) => void;
  onEquipmentClick?: (equipment: TemperatureEquipment) => void;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  getLastLogDate?: (equipment: TemperatureEquipment) => string | null;
  getLastLogInfo?: (equipment: TemperatureEquipment) => {
    date: string;
    temperature: number;
    isInRange: boolean | null;
  } | null;
  formatDate?: (date: Date) => string;
}

type SortField = 'name' | 'type' | 'location' | 'lastLogDate' | 'status';
type SortDirection = 'asc' | 'desc';

export function EquipmentListTable({
  equipment,
  editingId,
  setEditingId,
  temperatureTypes,
  quickTempLoading,
  onQuickTempLog,
  onToggleStatus,
  onDelete,
  onUpdate,
  onEquipmentClick,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
  getLastLogDate,
  getLastLogInfo,
  formatDate,
}: EquipmentListTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const getTypeIcon = (type: string) => temperatureTypes.find(t => t.value === type)?.icon || '🌡️';
  const getTypeLabel = (type: string) =>
    temperatureTypes.find(t => t.value === type)?.label || type;

  // Filter and sort equipment
  const filteredAndSortedEquipment = useMemo(() => {
    let filtered = [...equipment];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        item =>
          item.name.toLowerCase().includes(query) ||
          item.location?.toLowerCase().includes(query) ||
          getTypeLabel(item.equipment_type).toLowerCase().includes(query),
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.equipment_type === filterType);
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      if (filterStatus === 'active') {
        filtered = filtered.filter(item => item.is_active);
      } else if (filterStatus === 'inactive') {
        filtered = filtered.filter(item => !item.is_active);
      } else if (filterStatus === 'inRange') {
        filtered = filtered.filter(item => {
          const info = getLastLogInfo?.(item);
          return info?.isInRange === true;
        });
      } else if (filterStatus === 'outOfRange') {
        filtered = filtered.filter(item => {
          const info = getLastLogInfo?.(item);
          return info?.isInRange === false;
        });
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'type':
          comparison = getTypeLabel(a.equipment_type).localeCompare(getTypeLabel(b.equipment_type));
          break;
        case 'location':
          comparison = (a.location || '').localeCompare(b.location || '');
          break;
        case 'lastLogDate':
          const dateA = getLastLogDate?.(a);
          const dateB = getLastLogDate?.(b);
          if (!dateA && !dateB) comparison = 0;
          else if (!dateA) comparison = 1;
          else if (!dateB) comparison = -1;
          else comparison = new Date(dateA).getTime() - new Date(dateB).getTime();
          break;
        case 'status':
          const statusA = getLastLogInfo?.(a)?.isInRange;
          const statusB = getLastLogInfo?.(b)?.isInRange;
          if (statusA === statusB) comparison = 0;
          else if (statusA === null) comparison = 1;
          else if (statusB === null) comparison = -1;
          else if (statusA === true) comparison = -1;
          else comparison = 1;
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [equipment, searchQuery, filterType, filterStatus, sortField, sortDirection, getLastLogDate, getLastLogInfo]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <Icon icon={ArrowUpDown} size="sm" className="text-gray-500" />;
    }
    return sortDirection === 'asc' ? (
      <Icon icon={ArrowUp} size="sm" className="text-[#29E7CD]" />
    ) : (
      <Icon icon={ArrowDown} size="sm" className="text-[#29E7CD]" />
    );
  };

  const totalPages = Math.ceil(filteredAndSortedEquipment.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredAndSortedEquipment.length);
  const paginatedEquipment = filteredAndSortedEquipment.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      onPageChange(1);
    }
  }, [totalPages, currentPage, onPageChange]);

  const handleRowClick = (e: React.MouseEvent, item: TemperatureEquipment) => {
    // Don't open drawer if clicking on buttons or form
    if (
      (e.target as HTMLElement).closest('button') ||
      (e.target as HTMLElement).closest('form') ||
      editingId === item.id
    ) {
      return;
    }
    if (onEquipmentClick) {
      onEquipmentClick(item);
    }
  };

  return (
    <div className="space-y-4">
      {/* Table Controls - Top */}
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 space-y-4">
        {/* Search and Filter Toggle */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Icon icon={Search} size="sm" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search equipment, location, or type..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                onPageChange(1);
              }}
              className="w-full rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 transition-all focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  onPageChange(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <Icon icon={X} size="sm" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
              showFilters || filterType !== 'all' || filterStatus !== 'all'
                ? 'border-[#29E7CD] bg-[#29E7CD]/10 text-[#29E7CD]'
                : 'border-[#2a2a2a] bg-[#2a2a2a] text-gray-300 hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/10 hover:text-white'
            }`}
          >
            <Icon icon={Filter} size="sm" />
            Filters
            {(filterType !== 'all' || filterStatus !== 'all') && (
              <span className="ml-1 rounded-full bg-[#29E7CD] px-2 py-0.5 text-xs font-semibold text-black">
                {[filterType !== 'all' ? 1 : 0, filterStatus !== 'all' ? 1 : 0].reduce((a, b) => a + b, 0)}
              </span>
            )}
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#2a2a2a]">
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-400">Equipment Type</label>
              <select
                value={filterType}
                onChange={e => {
                  setFilterType(e.target.value);
                  onPageChange(1);
                }}
                className="w-full rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] px-3 py-2 text-sm text-white transition-all focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
              >
                <option value="all">All Types</option>
                {temperatureTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-400">Status</label>
              <select
                value={filterStatus}
                onChange={e => {
                  setFilterStatus(e.target.value);
                  onPageChange(1);
                }}
                className="w-full rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] px-3 py-2 text-sm text-white transition-all focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="inRange">In Range</option>
                <option value="outOfRange">Out of Range</option>
              </select>
            </div>
          </div>
        )}

        {/* Results Count and Pagination */}
        <div className="flex items-center justify-between pt-3 border-t border-[#2a2a2a]">
          <div className="text-sm text-gray-400">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedEquipment.length)} of {filteredAndSortedEquipment.length} equipment
            {filteredAndSortedEquipment.length !== equipment.length && ` (filtered from ${equipment.length})`}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[#2a2a2a] disabled:hover:bg-[#2a2a2a]"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    page =>
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1),
                  )
                  .map((page, index, array) => {
                    const showEllipsis = index > 0 && array[index - 1] !== page - 1;
                    return (
                      <React.Fragment key={`page-${page}-top`}>
                        {showEllipsis && (
                          <span className="px-2 text-gray-500">...</span>
                        )}
                        <button
                          onClick={() => onPageChange(page)}
                          className={`rounded-xl px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                            currentPage === page
                              ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  })}
              </div>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[#2a2a2a] disabled:hover:bg-[#2a2a2a]"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2a2a] bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20">
                <th className="px-6 py-4">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
                  >
                    Equipment
                    {getSortIcon('name')}
                  </button>
                </th>
                <th className="px-6 py-4">
                  <button
                    onClick={() => handleSort('type')}
                    className="flex items-center gap-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
                  >
                    Type
                    {getSortIcon('type')}
                  </button>
                </th>
                <th className="px-6 py-4">
                  <button
                    onClick={() => handleSort('location')}
                    className="flex items-center gap-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
                  >
                    Location
                    {getSortIcon('location')}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Temperature Range
                </th>
                <th className="px-6 py-4">
                  <button
                    onClick={() => handleSort('lastLogDate')}
                    className="flex items-center gap-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
                  >
                    Last Log Date
                    {getSortIcon('lastLogDate')}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Last Temperature
                </th>
                <th className="px-6 py-4">
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center gap-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
                  >
                    Status
                    {getSortIcon('status')}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {paginatedEquipment.map(item => (
                <React.Fragment key={item.id}>
                  <tr
                    onClick={e => handleRowClick(e, item)}
                    className={`group cursor-pointer transition-all duration-200 hover:bg-[#29E7CD]/5 ${
                      editingId === item.id ? 'bg-[#29E7CD]/10' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
                          <span className="text-xl">{getTypeIcon(item.equipment_type)}</span>
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-white group-hover:text-[#29E7CD] transition-colors">
                            {item.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-300">{getTypeLabel(item.equipment_type)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-400">{item.location || '—'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.min_temp_celsius !== null && item.max_temp_celsius !== null ? (
                        <span className="text-sm font-medium text-[#29E7CD]">
                          {item.min_temp_celsius}°C - {item.max_temp_celsius}°C
                        </span>
                      ) : item.min_temp_celsius !== null ? (
                        <span className="text-sm font-medium text-[#29E7CD]">≥{item.min_temp_celsius}°C</span>
                      ) : (
                        <span className="text-sm text-gray-500">Not set</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(() => {
                        const lastLogDate = getLastLogDate ? getLastLogDate(item) : null;
                        if (!lastLogDate) {
                          return <span className="text-sm text-gray-500">Never</span>;
                        }
                        if (formatDate) {
                          const date = new Date(lastLogDate);
                          return <span className="text-sm text-gray-300">{formatDate(date)}</span>;
                        }
                        return <span className="text-sm text-gray-300">{lastLogDate}</span>;
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(() => {
                        const lastLogInfo = getLastLogInfo ? getLastLogInfo(item) : null;
                        if (!lastLogInfo) {
                          return <span className="text-sm text-gray-500">—</span>;
                        }
                        return (
                          <span className="text-sm font-semibold text-gray-300">
                            {lastLogInfo.temperature.toFixed(1)}°C
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* Temperature Status */}
                      {(() => {
                        const lastLogInfo = getLastLogInfo ? getLastLogInfo(item) : null;
                        if (lastLogInfo && lastLogInfo.isInRange !== null) {
                          return (
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-2 w-2 rounded-full shadow-lg ${
                                  lastLogInfo.isInRange ? 'bg-green-500 animate-pulse' : 'bg-red-500 animate-pulse'
                                }`}
                              />
                              <span
                                className={`text-xs font-semibold ${
                                  lastLogInfo.isInRange ? 'text-green-400' : 'text-red-400'
                                }`}
                              >
                                {lastLogInfo.isInRange ? 'In Range' : 'Out of Range'}
                              </span>
                            </div>
                          );
                        }
                        return <span className="text-xs text-gray-500">—</span>;
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => onQuickTempLog(item.id, item.name, item.equipment_type)}
                          disabled={quickTempLoading[item.id] || !item.is_active}
                          className="rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-3 py-1.5 text-xs font-semibold text-black transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Quick Log
                        </button>
                        <button
                          onClick={() => onToggleStatus(item.id, item.is_active)}
                          className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] p-1.5 text-gray-400 transition-all duration-200 hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/10 hover:text-white"
                          title={item.is_active ? 'Deactivate' : 'Activate'}
                        >
                          <Icon
                            icon={item.is_active ? PowerOff : Power}
                            size="sm"
                            aria-hidden={true}
                          />
                        </button>
                        <button
                          onClick={() => setEditingId(editingId === item.id ? null : item.id)}
                          className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] p-1.5 text-gray-400 transition-all duration-200 hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/10 hover:text-white"
                          title="Edit"
                        >
                          <Icon icon={Edit} size="sm" aria-hidden={true} />
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="rounded-lg border border-red-500/30 bg-red-500/10 p-1.5 text-red-400 transition-all duration-200 hover:border-red-500/50 hover:bg-red-500/20"
                          title="Delete"
                        >
                          <Icon icon={Trash2} size="sm" aria-hidden={true} />
                        </button>
                      </div>
                    </td>
                  </tr>
                    {editingId === item.id && (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 bg-[#2a2a2a]/30">
                        <form
                          onSubmit={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            const formData = new FormData(e.currentTarget);
                            onUpdate(item.id, {
                              name: formData.get('name') as string,
                              equipment_type: formData.get('equipmentType') as string,
                              location: (formData.get('location') as string) || null,
                              min_temp_celsius: formData.get('minTemp')
                                ? parseFloat(formData.get('minTemp') as string)
                                : null,
                              max_temp_celsius: formData.get('maxTemp')
                                ? parseFloat(formData.get('maxTemp') as string)
                                : null,
                            });
                          }}
                          onClick={e => e.stopPropagation()}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                            <div>
                              <label className="mb-2 block text-xs font-medium text-gray-300">
                                Equipment Name
                              </label>
                              <input
                                type="text"
                                name="name"
                                defaultValue={item.name}
                                className="w-full rounded-xl border border-[#3a3a3a] bg-[#1f1f1f] px-3 py-2 text-sm text-white transition-all focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
                                required
                              />
                            </div>
                            <div>
                              <label className="mb-2 block text-xs font-medium text-gray-300">
                                Type
                              </label>
                              <select
                                name="equipmentType"
                                defaultValue={item.equipment_type}
                                className="w-full rounded-xl border border-[#3a3a3a] bg-[#1f1f1f] px-3 py-2 text-sm text-white transition-all focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
                                required
                              >
                                {temperatureTypes.map(type => (
                                  <option key={type.value} value={type.value}>
                                    {type.icon} {type.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="mb-2 block text-xs font-medium text-gray-300">
                                Location
                              </label>
                              <input
                                type="text"
                                name="location"
                                defaultValue={item.location || ''}
                                className="w-full rounded-xl border border-[#3a3a3a] bg-[#1f1f1f] px-3 py-2 text-sm text-white transition-all focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
                                placeholder="Optional"
                              />
                            </div>
                            <div>
                              <label className="mb-2 block text-xs font-medium text-gray-300">
                                Min Temp (°C)
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                name="minTemp"
                                defaultValue={item.min_temp_celsius || ''}
                                className="w-full rounded-xl border border-[#3a3a3a] bg-[#1f1f1f] px-3 py-2 text-sm text-white transition-all focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
                                placeholder="Optional"
                              />
                            </div>
                            <div>
                              <label className="mb-2 block text-xs font-medium text-gray-300">
                                Max Temp (°C)
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                name="maxTemp"
                                defaultValue={item.max_temp_celsius || ''}
                                className="w-full rounded-xl border border-[#3a3a3a] bg-[#1f1f1f] px-3 py-2 text-sm text-white transition-all focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
                                placeholder="Optional"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              className="rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-2 text-sm font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                            >
                              Update Equipment
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-[#3a3a3a] hover:text-white"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="block md:hidden space-y-4">
        {paginatedEquipment.map(item => (
          <div
            key={item.id}
            onClick={e => {
              if (!(e.target as HTMLElement).closest('button') && editingId !== item.id && onEquipmentClick) {
                onEquipmentClick(item);
              }
            }}
            className={`group relative overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg transition-all duration-300 ${
              editingId === item.id
                ? 'border-[#29E7CD] bg-[#29E7CD]/10'
                : onEquipmentClick
                  ? 'cursor-pointer hover:border-[#29E7CD]/30 hover:shadow-2xl'
                  : 'hover:border-[#29E7CD]/30 hover:shadow-2xl'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
                <span className="text-2xl">{getTypeIcon(item.equipment_type)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="mb-2 text-base font-semibold text-white">{item.name}</div>
                <div className="mb-2 text-sm text-gray-400">{getTypeLabel(item.equipment_type)}</div>
                {item.location && (
                  <div className="mb-2 text-xs text-gray-500">📍 {item.location}</div>
                )}
                <div className="mb-2 text-sm font-medium text-[#29E7CD]">
                  {item.min_temp_celsius !== null && item.max_temp_celsius !== null
                    ? `${item.min_temp_celsius}°C - ${item.max_temp_celsius}°C`
                    : item.min_temp_celsius !== null
                      ? `≥${item.min_temp_celsius}°C`
                      : 'Not set'}
                </div>
                {(() => {
                  const lastLogInfo = getLastLogInfo ? getLastLogInfo(item) : null;
                  if (lastLogInfo) {
                    const date = new Date(lastLogInfo.date);
                    const formattedDate = formatDate ? formatDate(date) : lastLogInfo.date;
                    return (
                      <div className="mb-2 space-y-1">
                        <div className="text-xs text-gray-400">
                          Last log: {formattedDate}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-300">
                            {lastLogInfo.temperature.toFixed(1)}°C
                          </span>
                          {lastLogInfo.isInRange !== null && (
                            <div className="flex items-center gap-1">
                              <div
                                className={`h-1.5 w-1.5 rounded-full ${
                                  lastLogInfo.isInRange ? 'bg-green-500' : 'bg-red-500'
                                }`}
                              />
                              <span
                                className={`text-xs font-semibold ${
                                  lastLogInfo.isInRange ? 'text-green-400' : 'text-red-400'
                                }`}
                              >
                                {lastLogInfo.isInRange ? 'In Range' : 'Out of Range'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div className="mb-2 text-xs text-gray-500">
                      Last log: Never
                    </div>
                  );
                })()}
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${item.is_active ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}
                  />
                  <span className={`text-xs font-semibold ${item.is_active ? 'text-green-400' : 'text-gray-400'}`}>
                    {item.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
            {editingId === item.id && (
              <div className="mt-4 rounded-2xl border-t border-[#2a2a2a] bg-[#2a2a2a]/30 pt-4">
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    const formData = new FormData(e.currentTarget);
                    onUpdate(item.id, {
                      name: formData.get('name') as string,
                      equipment_type: formData.get('equipmentType') as string,
                      location: (formData.get('location') as string) || null,
                      min_temp_celsius: formData.get('minTemp')
                        ? parseFloat(formData.get('minTemp') as string)
                        : null,
                      max_temp_celsius: formData.get('maxTemp')
                        ? parseFloat(formData.get('maxTemp') as string)
                        : null,
                    });
                  }}
                  onClick={e => e.stopPropagation()}
                  className="space-y-4"
                >
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-300">Equipment Name</label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={item.name}
                        className="w-full rounded-xl border border-[#3a3a3a] bg-[#1f1f1f] px-3 py-2 text-sm text-white transition-all focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-300">Type</label>
                      <select
                        name="equipmentType"
                        defaultValue={item.equipment_type}
                        className="w-full rounded-xl border border-[#3a3a3a] bg-[#1f1f1f] px-3 py-2 text-sm text-white transition-all focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
                        required
                      >
                        {temperatureTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.icon} {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-300">Min Temp</label>
                        <input
                          type="number"
                          step="0.1"
                          name="minTemp"
                          defaultValue={item.min_temp_celsius || ''}
                          className="w-full rounded-xl border border-[#3a3a3a] bg-[#1f1f1f] px-3 py-2 text-sm text-white transition-all focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
                          placeholder="Optional"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-300">Max Temp</label>
                        <input
                          type="number"
                          step="0.1"
                          name="maxTemp"
                          defaultValue={item.max_temp_celsius || ''}
                          className="w-full rounded-xl border border-[#3a3a3a] bg-[#1f1f1f] px-3 py-2 text-sm text-white transition-all focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
                          placeholder="Optional"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-2 text-sm font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-[#3a3a3a]"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-2" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => onQuickTempLog(item.id, item.name, item.equipment_type)}
                disabled={quickTempLoading[item.id] || !item.is_active}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-3 py-2 text-xs font-semibold text-black transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Quick Log
              </button>
              <button
                onClick={() => onToggleStatus(item.id, item.is_active)}
                className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] p-2 text-gray-400 transition-all duration-200 hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/10 hover:text-white"
              >
                <Icon icon={item.is_active ? PowerOff : Power} size="sm" aria-hidden={true} />
              </button>
              <button
                onClick={() => setEditingId(editingId === item.id ? null : item.id)}
                className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] p-2 text-gray-400 transition-all duration-200 hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/10 hover:text-white"
              >
                <Icon icon={Edit} size="sm" aria-hidden={true} />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-red-400 transition-all duration-200 hover:border-red-500/50 hover:bg-red-500/20"
              >
                <Icon icon={Trash2} size="sm" aria-hidden={true} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination - Bottom */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] px-6 py-4">
          <div className="text-sm text-gray-400">
            Showing {startIndex + 1} to {endIndex} of {filteredAndSortedEquipment.length} equipment
            {filteredAndSortedEquipment.length !== equipment.length && ` (filtered from ${equipment.length})`}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[#2a2a2a] disabled:hover:bg-[#2a2a2a]"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  return (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  );
                })
                .map((page, index, array) => {
                  const showEllipsisBefore = index > 0 && array[index - 1] < page - 1;
                  return (
                    <React.Fragment key={`page-${page}-bottom`}>
                      {showEllipsisBefore && (
                        <span className="px-2 text-sm text-gray-500">...</span>
                      )}
                      <button
                        onClick={() => onPageChange(page)}
                        className={`min-w-[40px] rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black'
                            : 'border border-[#2a2a2a] bg-[#2a2a2a] text-gray-300 hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/10 hover:text-white'
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                })}
            </div>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[#2a2a2a] disabled:hover:bg-[#2a2a2a]"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
