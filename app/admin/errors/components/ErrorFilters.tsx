'use client';

import { Icon } from '@/components/ui/Icon';
import { Search } from 'lucide-react';

interface ErrorFiltersProps {
  searchQuery: string;
  severityFilter: string;
  statusFilter: string;
  categoryFilter: string;
  severityCounts: Record<string, number>;
  statusCounts: Record<string, number>;
  onSearchChange: (value: string) => void;
  onSeverityChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

/**
 * Error Filters Component
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.searchQuery - Search query string
 * @param {string} props.severityFilter - Selected severity filter
 * @param {string} props.statusFilter - Selected status filter
 * @param {string} props.categoryFilter - Selected category filter
 * @param {Record<string, number>} props.severityCounts - Counts by severity
 * @param {Record<string, number>} props.statusCounts - Counts by status
 * @param {Function} props.onSearchChange - Callback when search changes
 * @param {Function} props.onSeverityChange - Callback when severity filter changes
 * @param {Function} props.onStatusChange - Callback when status filter changes
 * @param {Function} props.onCategoryChange - Callback when category filter changes
 * @returns {JSX.Element} Error filters component
 */
export function ErrorFilters({
  searchQuery,
  severityFilter,
  statusFilter,
  categoryFilter,
  severityCounts,
  statusCounts,
  onSearchChange,
  onSeverityChange,
  onStatusChange,
  onCategoryChange,
}: ErrorFiltersProps) {
  return (
    <div className="tablet:flex-row flex flex-col gap-4">
      <div className="relative flex-1">
        <Icon
          icon={Search}
          size="sm"
          className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search errors..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] py-2 pr-4 pl-10 text-white placeholder-gray-500 focus:border-[#29E7CD] focus:outline-none"
        />
      </div>
      <div className="flex gap-2">
        <select
          value={severityFilter}
          onChange={e => onSeverityChange(e.target.value)}
          className="rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] px-4 py-2 text-white focus:border-[#29E7CD] focus:outline-none"
        >
          <option value="all">All Severities</option>
          <option value="safety">Safety ({severityCounts.safety || 0})</option>
          <option value="critical">Critical ({severityCounts.critical || 0})</option>
          <option value="high">High ({severityCounts.high || 0})</option>
          <option value="medium">Medium ({severityCounts.medium || 0})</option>
          <option value="low">Low ({severityCounts.low || 0})</option>
        </select>
        <select
          value={statusFilter}
          onChange={e => onStatusChange(e.target.value)}
          className="rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] px-4 py-2 text-white focus:border-[#29E7CD] focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="new">New ({statusCounts.new || 0})</option>
          <option value="investigating">Investigating ({statusCounts.investigating || 0})</option>
          <option value="resolved">Resolved ({statusCounts.resolved || 0})</option>
          <option value="ignored">Ignored ({statusCounts.ignored || 0})</option>
        </select>
        <select
          value={categoryFilter}
          onChange={e => onCategoryChange(e.target.value)}
          className="rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] px-4 py-2 text-white focus:border-[#29E7CD] focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="security">Security</option>
          <option value="database">Database</option>
          <option value="api">API</option>
          <option value="client">Client</option>
          <option value="system">System</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>
  );
}
