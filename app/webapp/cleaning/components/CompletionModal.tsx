'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';
import { X, CheckCircle2, Circle } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import type { TaskWithCompletions } from '@/lib/cleaning/completion-logic';
import { getCompletionForDate } from '@/lib/cleaning/completion-logic';

interface CompletionModalProps {
  isOpen: boolean;
  task: TaskWithCompletions | null;
  date: string | null;
  onClose: () => void;
  onUpdate: () => void;
}

/**
 * Completion Modal Component
 * Shows task details and allows marking complete/incomplete with notes
 */
export function CompletionModal({ isOpen, task, date, onClose, onUpdate }: CompletionModalProps) {
  const { showSuccess, showError } = useNotification();
  const [notes, setNotes] = useState('');

  // Initialize notes when modal opens
  useEffect(() => {
    if (isOpen && task && date) {
      const completion = getCompletionForDate(task, date);
      setNotes(completion?.notes || '');
    }
  }, [isOpen, task, date]);

  if (!isOpen || !task || !date) return null;

  const completion = getCompletionForDate(task, date);
  const isCompleted = !!completion;

  const handleToggleCompletion = async () => {
    // Store original state for rollback
    const originalIsCompleted = isCompleted;
    const originalNotes = notes;
    const taskId = task.id;
    const completionDate = date;

    // Optimistically close modal and trigger update (parent handles optimistic UI)
    onClose();
    onUpdate(); // Trigger immediate refresh in parent (which has optimistic updates)

    try {
      const endpoint = originalIsCompleted
        ? `/api/cleaning-tasks/${taskId}/uncomplete`
        : `/api/cleaning-tasks/${taskId}/complete`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completion_date: completionDate,
          notes: originalNotes || null,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || 'Failed to update task');
      }

      showSuccess(originalIsCompleted ? 'Task marked as incomplete' : 'Task marked as complete');
      // Background refresh already triggered by onUpdate above
    } catch (error) {
      logger.error('Error toggling completion:', error);
      showError("Couldn't update that task, chef. Give it another go.");
      // Note: Modal is already closed, error is shown via notification
      // Parent's optimistic update will rollback when it receives the error state
    }
  };

  const dateObj = new Date(date);
  const dateFormatted = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 via-[var(--tertiary)]/20 to-[var(--primary)]/20 p-[1px] shadow-xl">
        <div className="rounded-3xl bg-[var(--surface)]/95 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--button-active-text)]">Task Details</h2>
            <button
              onClick={onClose}
              className="p-2 text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
              aria-label="Close"
            >
              <Icon icon={X} size="lg" aria-hidden={true} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm text-[var(--foreground-muted)]">Task</div>
              <div className="text-lg font-semibold text-[var(--foreground)]">{task.task_name}</div>
            </div>

            <div>
              <div className="text-sm text-[var(--foreground-muted)]">Date</div>
              <div className="text-lg text-[var(--foreground)]">{dateFormatted}</div>
            </div>

            {task.frequency_type && (
              <div>
                <div className="text-sm text-[var(--foreground-muted)]">Frequency</div>
                <div className="text-lg text-[var(--foreground)] capitalize">
                  {task.frequency_type}
                </div>
              </div>
            )}

            <div>
              <div className="mb-2 text-sm text-[var(--foreground-muted)]">Status</div>
              <div className="flex items-center gap-2">
                {isCompleted ? (
                  <>
                    <Icon
                      icon={CheckCircle2}
                      size="md"
                      className="text-[var(--color-success)]"
                      aria-hidden={true}
                    />
                    <span className="font-medium text-[var(--color-success)]">Completed</span>
                  </>
                ) : (
                  <>
                    <Icon
                      icon={Circle}
                      size="md"
                      className="text-[var(--foreground-subtle)]"
                      aria-hidden={true}
                    />
                    <span className="font-medium text-[var(--foreground-muted)]">Pending</span>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="Add notes about this task..."
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl bg-[var(--muted)] px-6 py-3 font-semibold text-[var(--foreground)] transition-all duration-200 hover:bg-[var(--surface-variant)]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleToggleCompletion}
                className={`rounded-2xl px-6 py-3 font-semibold transition-all duration-200 hover:shadow-xl ${
                  isCompleted
                    ? 'bg-[var(--muted)] text-[var(--button-active-text)] hover:bg-[var(--surface-variant)]'
                    : 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-[var(--button-active-text)]'
                }`}
              >
                {isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
