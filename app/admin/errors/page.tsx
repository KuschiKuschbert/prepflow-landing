'use client';

import { TablePagination } from '@/components/ui/TablePagination';
import { useState } from 'react';
import { ErrorDetailModal } from './components/ErrorDetailModal';
import { ErrorFilters } from './components/ErrorFilters';
import { ErrorLogsTable } from './components/ErrorLogsTable';
import { useErrorLogs } from './hooks/useErrorLogs';
import type { ErrorLog } from './types';
import { logger } from '@/lib/logger';

/**
 * Error logs page component for admin dashboard.
 * Manages error logs with filtering, pagination, and status updates.
 *
 * @component
 * @returns {JSX.Element} Error logs admin page
 */
export default function ErrorLogsPage() {
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  const {
    errors,
    loading,
    totalPages,
    total,
    severityCounts,
    statusCounts,
    updatingStatus,
    updateStatus,
    saveNotes,
  } = useErrorLogs({
    searchQuery,
    severityFilter,
    statusFilter,
    categoryFilter,
    page,
  });

  const handleFilterChange = (
    filterType: 'search' | 'severity' | 'status' | 'category',
    value: string,
  ) => {
    setPage(1);
    switch (filterType) {
      case 'search':
        setSearchQuery(value);
        break;
      case 'severity':
        setSeverityFilter(value);
        break;
      case 'status':
        setStatusFilter(value);
        break;
      case 'category':
        setCategoryFilter(value);
        break;
    }
  };

  const handleStatusUpdate = async (errorId: string, newStatus: string) => {
    try {
      const success = await updateStatus(errorId, newStatus);
      if (success && selectedError?.id === errorId) {
        setSelectedError(null);
      }
    } catch (err) {
      logger.error('[ErrorLogsPage] Error updating status:', {
        error: err instanceof Error ? err.message : String(err),
        errorId,
        newStatus,
      });
    }
  };

  const handleSaveNotes = async (errorId: string, notes: string) => {
    try {
      const updated = await saveNotes(errorId, notes);
      if (updated) {
        setSelectedError(updated);
      }
      return updated;
    } catch (err) {
      logger.error('[ErrorLogsPage] Error saving notes:', {
        error: err instanceof Error ? err.message : String(err),
        errorId,
      });
      return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Error Logs</h1>
        <p className="mt-2 text-gray-400">View and analyze system errors by severity</p>
      </div>

      {/* Filters */}
      <ErrorFilters
        searchQuery={searchQuery}
        severityFilter={severityFilter}
        statusFilter={statusFilter}
        categoryFilter={categoryFilter}
        severityCounts={severityCounts}
        statusCounts={statusCounts}
        onSearchChange={value => handleFilterChange('search', value)}
        onSeverityChange={value => handleFilterChange('severity', value)}
        onStatusChange={value => handleFilterChange('status', value)}
        onCategoryChange={value => handleFilterChange('category', value)}
      />

      {/* Errors Table */}
      {loading ? (
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 rounded bg-[#2a2a2a]"></div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <TablePagination
            page={page}
            totalPages={totalPages}
            total={total}
            onPageChange={setPage}
            className="mb-4"
          />
          <ErrorLogsTable
            errors={errors}
            updatingStatus={updatingStatus}
            onStatusUpdate={handleStatusUpdate}
            onViewDetails={setSelectedError}
          />
          <TablePagination
            page={page}
            totalPages={totalPages}
            total={total}
            onPageChange={setPage}
            className="mt-4"
          />
        </>
      )}

      {/* Error Detail Modal */}
      <ErrorDetailModal
        error={selectedError}
        updatingStatus={updatingStatus}
        onClose={() => setSelectedError(null)}
        onSaveNotes={handleSaveNotes}
      />
    </div>
  );
}
