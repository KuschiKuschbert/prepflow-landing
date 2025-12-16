'use client';
import { Icon } from '@/components/ui/Icon';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Edit,
  Power,
  PowerOff,
  QrCode,
  Trash2,
  LucideIcon,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { TemperatureEquipment } from '../types';
import { EquipmentListTableFilters } from './EquipmentListTableFilters';
import { EquipmentListTableMobileCards } from './EquipmentListTableMobileCards';
import { EquipmentListTableDesktop } from './EquipmentListTableDesktop';
import { TablePagination } from '@/components/ui/TablePagination';
import { getTypeIconComponent } from '../utils/temperatureUtils';
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
  onShowQRCode?: (equipment: TemperatureEquipment) => void;
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
  onShowQRCode,
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

  const getTypeIcon = (type: string): LucideIcon => getTypeIconComponent(type);
  const getTypeLabel = React.useCallback(
    (type: string) => temperatureTypes.find(t => t.value === type)?.label || type,
    [temperatureTypes],
  );

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
    if (filterType !== 'all')
      filtered = filtered.filter(item => item.equipment_type === filterType);

    // Apply status filter
    if (filterStatus !== 'all') {
      if (filterStatus === 'active') filtered = filtered.filter(item => item.is_active);
      else if (filterStatus === 'inactive') filtered = filtered.filter(item => !item.is_active);
      else if (filterStatus === 'inRange')
        filtered = filtered.filter(item => getLastLogInfo?.(item)?.isInRange === true);
      else if (filterStatus === 'outOfRange')
        filtered = filtered.filter(item => getLastLogInfo?.(item)?.isInRange === false);
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
        case 'lastLogDate': {
          const dateA = getLastLogDate?.(a);
          const dateB = getLastLogDate?.(b);
          if (!dateA && !dateB) comparison = 0;
          else if (!dateA) comparison = 1;
          else if (!dateB) comparison = -1;
          else comparison = new Date(dateA).getTime() - new Date(dateB).getTime();
          break;
        }
        case 'status': {
          const statusA = getLastLogInfo?.(a)?.isInRange;
          const statusB = getLastLogInfo?.(b)?.isInRange;
          if (statusA === statusB) comparison = 0;
          else if (statusA === null) comparison = 1;
          else if (statusB === null) comparison = -1;
          else comparison = statusA === true ? -1 : 1;
          break;
        }
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [
    equipment,
    searchQuery,
    filterType,
    filterStatus,
    sortField,
    sortDirection,
    getLastLogDate,
    getLastLogInfo,
    getTypeLabel,
  ]);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <Icon icon={ArrowUpDown} size="sm" className="text-[var(--foreground-subtle)]" />;
    return sortDirection === 'asc' ? (
      <Icon icon={ArrowUp} size="sm" className="text-[var(--primary)]" />
    ) : (
      <Icon icon={ArrowDown} size="sm" className="text-[var(--primary)]" />
    );
  };

  const totalPages = Math.ceil(filteredAndSortedEquipment.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredAndSortedEquipment.length);
  const paginatedEquipment = filteredAndSortedEquipment.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) onPageChange(1);
  }, [totalPages, currentPage, onPageChange]);

  const handleRowClick = (e: React.MouseEvent, item: TemperatureEquipment) => {
    if (
      (e.target as HTMLElement).closest('button') ||
      (e.target as HTMLElement).closest('form') ||
      editingId === item.id
    )
      return;
    if (onEquipmentClick) onEquipmentClick(item);
  };

  return (
    <div className="space-y-4">
      {/* Table Controls - Top */}
      <EquipmentListTableFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterType={filterType}
        onFilterTypeChange={setFilterType}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
        temperatureTypes={temperatureTypes}
        onPageChange={onPageChange}
      />

      {/* Results Count and Top Pagination */}
      <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-4">
        <div className="text-sm text-[var(--foreground-muted)]">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedEquipment.length)} of{' '}
          {filteredAndSortedEquipment.length} equipment
          {filteredAndSortedEquipment.length !== equipment.length &&
            ` (filtered from ${equipment.length})`}
        </div>
        <TablePagination
          page={currentPage}
          totalPages={totalPages}
          total={filteredAndSortedEquipment.length}
          onPageChange={onPageChange}
        />
      </div>

      {/* Desktop Table */}
      <EquipmentListTableDesktop
        paginatedEquipment={paginatedEquipment}
        editingId={editingId}
        setEditingId={setEditingId}
        temperatureTypes={temperatureTypes}
        quickTempLoading={quickTempLoading}
        onQuickTempLog={onQuickTempLog}
        onToggleStatus={onToggleStatus}
        onDelete={onDelete}
        onUpdate={onUpdate}
        onEquipmentClick={onEquipmentClick}
        onShowQRCode={onShowQRCode}
        getTypeIcon={getTypeIcon}
        getTypeLabel={getTypeLabel}
        getLastLogDate={getLastLogDate}
        getLastLogInfo={getLastLogInfo}
        formatDate={formatDate}
        handleRowClick={handleRowClick}
        handleSort={handleSort}
        getSortIcon={getSortIcon}
      />

      {/* Mobile Card Layout */}
      <EquipmentListTableMobileCards
        paginatedEquipment={paginatedEquipment}
        editingId={editingId}
        setEditingId={setEditingId}
        temperatureTypes={temperatureTypes}
        quickTempLoading={quickTempLoading}
        onQuickTempLog={onQuickTempLog}
        onToggleStatus={onToggleStatus}
        onDelete={onDelete}
        onUpdate={onUpdate}
        onEquipmentClick={onEquipmentClick}
        onShowQRCode={onShowQRCode}
        getTypeIcon={getTypeIcon}
        getTypeLabel={getTypeLabel}
        getLastLogInfo={getLastLogInfo}
        formatDate={formatDate}
      />

      {/* Pagination - Bottom */}
      <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-4">
        <div className="text-sm text-[var(--foreground-muted)]">
          Showing {startIndex + 1} to {endIndex} of {filteredAndSortedEquipment.length} equipment
          {filteredAndSortedEquipment.length !== equipment.length &&
            ` (filtered from ${equipment.length})`}
        </div>
        <TablePagination
          page={currentPage}
          totalPages={totalPages}
          total={filteredAndSortedEquipment.length}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
