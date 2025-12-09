/**
 * Ticket Filters Component
 */

'use client';

import { Icon } from '@/components/ui/Icon';
import { Search } from 'lucide-react';

interface TicketFiltersProps {
  searchQuery: string;
  severityFilter: string;
  statusFilter: string;
  typeFilter: string;
  onSearchChange: (value: string) => void;
  onSeverityChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onTypeChange: (value: string) => void;
}

export function TicketFilters({
  searchQuery,
  severityFilter,
  statusFilter,
  typeFilter,
  onSearchChange,
  onSeverityChange,
  onStatusChange,
  onTypeChange,
}: TicketFiltersProps) {
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
          placeholder="Search tickets..."
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
          <option value="safety">Safety</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          value={statusFilter}
          onChange={e => onStatusChange(e.target.value)}
          className="rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] px-4 py-2 text-white focus:border-[#29E7CD] focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="investigating">Investigating</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <select
          value={typeFilter}
          onChange={e => onTypeChange(e.target.value)}
          className="rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] px-4 py-2 text-white focus:border-[#29E7CD] focus:outline-none"
        >
          <option value="all">All Types</option>
          <option value="bug">Bug</option>
          <option value="feature">Feature</option>
          <option value="question">Question</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>
  );
}
