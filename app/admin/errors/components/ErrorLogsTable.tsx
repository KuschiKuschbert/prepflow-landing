'use client';

import { Icon } from '@/components/ui/Icon';
import { AlertTriangle, CheckCircle, Clock, Eye, XCircle } from 'lucide-react';
import type { ErrorLog } from '../types';
import { SEVERITY_COLORS, STATUS_COLORS } from '../constants';

interface ErrorLogsTableProps {
  errors: ErrorLog[];
  updatingStatus: string | null;
  onStatusUpdate: (errorId: string, newStatus: string) => void;
  onViewDetails: (error: ErrorLog) => void;
}

export function ErrorLogsTable({
  errors,
  updatingStatus,
  onStatusUpdate,
  onViewDetails,
}: ErrorLogsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]">
      <table className="min-w-full divide-y divide-[#2a2a2a]">
        <thead className="sticky top-0 z-10 bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              Error
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              Severity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              Endpoint
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              Time
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-300 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2a2a2a] bg-[#1f1f1f]">
          {errors.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                No errors found
              </td>
            </tr>
          ) : (
            errors.map(error => (
              <tr
                key={error.id}
                className="cursor-pointer transition-colors hover:bg-[#2a2a2a]/20"
                onClick={() => onViewDetails(error)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Icon icon={AlertTriangle} size="sm" className="text-red-400" />
                    <div className="max-w-md">
                      <div className="truncate text-sm font-medium text-white">
                        {error.error_message}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${SEVERITY_COLORS[error.severity] || SEVERITY_COLORS.medium}`}
                  >
                    {error.severity}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[error.status] || STATUS_COLORS.new}`}
                  >
                    {error.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300 capitalize">{error.category}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{error.endpoint || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {new Date(error.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {error.status === 'new' && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onStatusUpdate(error.id, 'investigating');
                        }}
                        disabled={updatingStatus === error.id}
                        className="text-yellow-400 transition-colors hover:text-yellow-300 disabled:opacity-50"
                        title="Mark as Investigating"
                      >
                        <Icon icon={Clock} size="sm" />
                      </button>
                    )}
                    {error.status !== 'resolved' && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onStatusUpdate(error.id, 'resolved');
                        }}
                        disabled={updatingStatus === error.id}
                        className="text-green-400 transition-colors hover:text-green-300 disabled:opacity-50"
                        title="Mark as Resolved"
                      >
                        <Icon icon={CheckCircle} size="sm" />
                      </button>
                    )}
                    {error.status !== 'ignored' && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onStatusUpdate(error.id, 'ignored');
                        }}
                        disabled={updatingStatus === error.id}
                        className="text-gray-400 transition-colors hover:text-gray-300 disabled:opacity-50"
                        title="Ignore"
                      >
                        <Icon icon={XCircle} size="sm" />
                      </button>
                    )}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onViewDetails(error);
                      }}
                      className="text-[#29E7CD] transition-colors hover:text-[#29E7CD]/80"
                      title="View Details"
                    >
                      <Icon icon={Eye} size="sm" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
