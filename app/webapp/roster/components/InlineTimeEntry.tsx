/**
 * InlineTimeEntry Component
 * Minimal inline form for entering shift times directly in a roster cell.
 *
 * @component
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Clock, X, Save } from 'lucide-react';
import type { Shift } from '@/lib/types/roster';
import { calculatePopoverPosition } from './InlineTimeEntry/helpers/calculatePopoverPosition';
import { buildShiftData } from './InlineTimeEntry/helpers/buildShiftData';
import { logger } from '@/lib/logger';

interface InlineTimeEntryProps {
  employeeId: string;
  date: Date;
  onSave: (shiftData: Partial<Shift>) => Promise<void>;
  onCancel: () => void;
  cellPosition?: { top: number; left: number; width: number; height: number };
  defaultStartTime?: string;
  defaultEndTime?: string;
}

/**
 * InlineTimeEntry component for quick shift time entry in roster cells.
 *
 * @param {InlineTimeEntryProps} props - Component props
 * @returns {JSX.Element} Rendered inline time entry form
 */
export function InlineTimeEntry({
  employeeId,
  date,
  onSave,
  onCancel,
  cellPosition,
  defaultStartTime = '09:00',
  defaultEndTime = '17:00',
}: InlineTimeEntryProps) {
  const [startTime, setStartTime] = useState(defaultStartTime);
  const [endTime, setEndTime] = useState(defaultEndTime);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const startTimeRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [popoverPosition, setPopoverPosition] = useState<{ top: number; left: number } | null>(
    null,
  );

  useEffect(() => {
    setPopoverPosition(calculatePopoverPosition(cellPosition));
  }, [cellPosition]);

  // Auto-focus on start time input when component mounts
  useEffect(() => {
    if (popoverPosition) {
      startTimeRef.current?.focus();
    }
  }, [popoverPosition]);

  // Handle Escape key to cancel
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onCancel]);

  const validateTimes = (): boolean => {
    if (!startTime || !endTime) {
      setError('Both start and end times are required');
      return false;
    }

    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (endMinutes <= startMinutes) {
      setError('End time must be after start time');
      return false;
    }

    setError(null);
    return true;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateTimes()) {
      return;
    }

    setSaving(true);
    try {
      await onSave(buildShiftData(employeeId, date, startTime, endTime));
    } catch (err) {
      logger.error('[InlineTimeEntry.tsx] Error in catch block:', {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      });

      setError('Failed to save shift');
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSave(e);
    }
  };

  if (!popoverPosition) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[79] bg-black/40 backdrop-blur-sm"
        onClick={e => {
          e.stopPropagation();
          onCancel();
        }}
        aria-hidden={true}
      />

      {/* Popover */}
      <div
        ref={popoverRef}
        className="fixed z-[80] w-80 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-xl"
        style={{
          top: `${popoverPosition.top}px`,
          left: `${popoverPosition.left}px`,
        }}
        onClick={e => e.stopPropagation()}
      >
        <form onSubmit={handleSave} className="space-y-3" onKeyDown={handleKeyDown}>
          {/* Time Inputs */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="sr-only">Start time</label>
              <div className="relative">
                <Icon
                  icon={Clock}
                  size="xs"
                  className="absolute top-1/2 left-2 -translate-y-1/2 text-[var(--foreground-muted)]"
                  aria-hidden={true}
                />
                <input
                  ref={startTimeRef}
                  type="time"
                  value={startTime}
                  onChange={e => {
                    setStartTime(e.target.value);
                    setError(null);
                  }}
                  className={`w-full rounded-lg border bg-[var(--background)] py-1.5 pr-2 pl-8 text-sm text-[var(--foreground)] ${
                    error
                      ? 'border-[var(--color-error)]/50 focus:border-[var(--color-error)] focus:ring-2 focus:ring-red-500/20'
                      : 'border-[var(--border)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20'
                  }`}
                  disabled={saving}
                />
              </div>
            </div>
            <span className="text-[var(--foreground-muted)]">-</span>
            <div className="flex-1">
              <label className="sr-only">End time</label>
              <div className="relative">
                <Icon
                  icon={Clock}
                  size="xs"
                  className="absolute top-1/2 left-2 -translate-y-1/2 text-[var(--foreground-muted)]"
                  aria-hidden={true}
                />
                <input
                  type="time"
                  value={endTime}
                  onChange={e => {
                    setEndTime(e.target.value);
                    setError(null);
                  }}
                  className={`w-full rounded-lg border bg-[var(--background)] py-1.5 pr-2 pl-8 text-sm text-[var(--foreground)] ${
                    error
                      ? 'border-[var(--color-error)]/50 focus:border-[var(--color-error)] focus:ring-2 focus:ring-red-500/20'
                      : 'border-[var(--border)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20'
                  }`}
                  disabled={saving}
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && <p className="text-xs text-[var(--color-error)]">{error}</p>}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                onCancel();
              }}
              className="rounded-lg p-1.5 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              aria-label="Cancel"
              disabled={saving}
            >
              <Icon icon={X} size="sm" aria-hidden={true} />
            </button>
            <button
              type="submit"
              className="flex items-center gap-1 rounded-lg bg-[var(--primary)]/20 px-3 py-1.5 text-xs font-medium text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/30 disabled:opacity-50"
              disabled={saving}
            >
              <Icon icon={Save} size="xs" aria-hidden={true} />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
