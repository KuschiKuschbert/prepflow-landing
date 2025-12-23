'use client';

import { useEffect, useState } from 'react';
import { CopyButton } from '@/components/ui/CopyButton';
import type { ErrorLog } from '../types';
import { SEVERITY_COLORS, STATUS_COLORS } from '../constants';
import { formatErrorDetails } from '../utils';
import { logger } from '@/lib/logger';

interface ErrorDetailModalProps {
  error: ErrorLog | null;
  updatingStatus: string | null;
  onClose: () => void;
  onSaveNotes: (errorId: string, notes: string) => Promise<ErrorLog | null>;
}

/**
 * Error Detail Modal Component
 *
 * @component
 * @param {Object} props - Component props
 * @param {ErrorLog | null} props.error - Error log to display
 * @param {string | null} props.updatingStatus - ID of error being updated
 * @param {Function} props.onClose - Callback when modal is closed
 * @param {Function} props.onSaveNotes - Callback to save admin notes
 * @returns {JSX.Element} Error detail modal component
 */
export function ErrorDetailModal({
  error,
  updatingStatus,
  onClose,
  onSaveNotes,
}: ErrorDetailModalProps) {
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    if (error) {
      setAdminNotes(error.notes || '');
    }
  }, [error]);

  if (!error) return null;

  const handleSaveNotes = async () => {
    try {
      await onSaveNotes(error.id, adminNotes);
    } catch (err) {
      logger.error('[ErrorDetailModal] Error saving admin notes:', {
        error: err instanceof Error ? err.message : String(err),
        errorId: error.id,
      });
      // Error handling is done by parent component, but we log it here for debugging
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative z-50 mx-auto max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border-2 border-[#29E7CD]/30 bg-[#1f1f1f] p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with metadata badges and copy button */}
        <div className="mb-6 flex items-start justify-between border-b border-[#2a2a2a] pb-4">
          <div className="flex-1">
            <div className="mb-3 flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white">Error Details</h2>
              <CopyButton
                text={formatErrorDetails(error)}
                variant="icon"
                successMessage="Error details copied to clipboard"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${SEVERITY_COLORS[error.severity] || SEVERITY_COLORS.medium}`}
              >
                {error.severity}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[error.status] || STATUS_COLORS.new}`}
              >
                {error.status}
              </span>
              <span className="text-xs text-gray-400 capitalize">{error.category}</span>
              <span className="text-xs text-gray-500">
                {new Date(error.created_at).toLocaleString()}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-4 flex h-8 w-8 items-center justify-center rounded-full text-3xl leading-none text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Unified Error Details Code Block */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-400">Error Details</label>
            <div className="relative overflow-hidden rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] shadow-inner">
              {/* Copy button positioned in top-right corner */}
              <div className="absolute top-2 right-2 z-10" onClick={e => e.stopPropagation()}>
                <div className="rounded-lg bg-[#0a0a0a]/80 p-1 backdrop-blur-sm">
                  <CopyButton
                    text={formatErrorDetails(error)}
                    variant="icon"
                    size="sm"
                    successMessage="Copied"
                  />
                </div>
              </div>
              <pre className="max-h-[60vh] overflow-x-auto overflow-y-auto p-4 font-mono text-sm leading-relaxed break-words whitespace-pre-wrap text-gray-300">
                {formatErrorDetails(error)}
              </pre>
            </div>
          </div>

          {/* Admin Notes */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-400">Admin Notes</label>
            <textarea
              value={adminNotes}
              onChange={e => setAdminNotes(e.target.value)}
              placeholder="Add notes about this error..."
              className="min-h-[100px] w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] p-4 font-mono text-sm text-white placeholder-gray-500 focus:border-[#29E7CD] focus:outline-none"
            />
            <button
              onClick={handleSaveNotes}
              disabled={updatingStatus === error.id}
              className="mt-2 rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-2 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {updatingStatus === error.id ? 'Saving...' : 'Save Notes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
