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
  const [loading, setLoading] = useState(false);
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
    setLoading(true);

    try {
      const endpoint = isCompleted
        ? `/api/cleaning-tasks/${task.id}/uncomplete`
        : `/api/cleaning-tasks/${task.id}/complete`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completion_date: date,
          notes: notes || null,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || 'Failed to update task');
      }

      showSuccess(isCompleted ? 'Task marked as incomplete' : 'Task marked as complete');
      onUpdate();
      onClose();
    } catch (error) {
      logger.error('Error toggling completion:', error);
      showError('Failed to update task completion');
    } finally {
      setLoading(false);
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
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-r from-[#29E7CD]/30 via-[#D925C7]/30 to-[#29E7CD]/30 p-[1px] shadow-xl">
        <div className="rounded-3xl bg-[#1f1f1f]/95 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Task Details</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 transition-colors hover:text-white"
              aria-label="Close"
            >
              <Icon icon={X} size="lg" aria-hidden={true} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-400">Task</div>
              <div className="text-lg font-semibold text-white">{task.task_name}</div>
            </div>

            <div>
              <div className="text-sm text-gray-400">Date</div>
              <div className="text-lg text-white">{dateFormatted}</div>
            </div>

            {task.frequency_type && (
              <div>
                <div className="text-sm text-gray-400">Frequency</div>
                <div className="text-lg text-white capitalize">{task.frequency_type}</div>
              </div>
            )}

            <div>
              <div className="mb-2 text-sm text-gray-400">Status</div>
              <div className="flex items-center gap-2">
                {isCompleted ? (
                  <>
                    <Icon
                      icon={CheckCircle2}
                      size="md"
                      className="text-green-400"
                      aria-hidden={true}
                    />
                    <span className="font-medium text-green-400">Completed</span>
                  </>
                ) : (
                  <>
                    <Icon icon={Circle} size="md" className="text-gray-500" aria-hidden={true} />
                    <span className="font-medium text-gray-400">Pending</span>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Notes</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                placeholder="Add notes about this task..."
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl bg-[#2a2a2a] px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-[#3a3a3a]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleToggleCompletion}
                disabled={loading}
                className={`rounded-2xl px-6 py-3 font-semibold transition-all duration-200 hover:shadow-xl disabled:opacity-50 ${
                  isCompleted
                    ? 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'
                    : 'bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black'
                }`}
              >
                {loading ? 'Updating...' : isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
