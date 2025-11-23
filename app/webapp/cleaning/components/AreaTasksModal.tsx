'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@/components/ui/Icon';
import { X, Plus, Edit2, Trash2, CheckCircle2, Circle, AlertTriangle } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { useConfirm } from '@/hooks/useConfirm';
import { useCleaningTasks } from '../hooks/useCleaningTasks';
import type { TaskWithCompletions } from '@/lib/cleaning/completion-logic';

interface CleaningArea {
  id: string;
  area_name: string;
  description?: string;
}

interface AreaTasksModalProps {
  isOpen: boolean;
  area: CleaningArea | null;
  onClose: () => void;
  onTaskUpdate: () => void;
  onCreateTask: (areaId: string) => void;
}

/**
 * Area Tasks Modal Component
 * Shows all tasks for a specific cleaning area with edit/delete capabilities
 */
export function AreaTasksModal({
  isOpen,
  area,
  onClose,
  onTaskUpdate,
  onCreateTask,
}: AreaTasksModalProps) {
  const { showError } = useNotification();
  const { showConfirm, ConfirmDialog } = useConfirm();
  const [tasks, setTasks] = useState<TaskWithCompletions[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    task_name: '',
    frequency_type: '',
  });

  // CRUD hook
  const { handleUpdateTask, handleDeleteTask } = useCleaningTasks({
    tasks,
    setTasks,
    onTaskUpdate,
  });

  // Fetch tasks for this area
  const fetchTasks = useCallback(async () => {
    if (!area?.id) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/cleaning-tasks?area_id=${area.id}`);
      const data = await response.json();

      if (data.success && data.data) {
        setTasks(data.data);
      } else {
        showError('Failed to load tasks');
      }
    } catch (error) {
      logger.error('Error fetching area tasks:', error);
      showError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [area?.id, showError]);

  useEffect(() => {
    if (isOpen && area) {
      fetchTasks();
    } else {
      setTasks([]);
      setEditingTaskId(null);
    }
  }, [isOpen, area, fetchTasks]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleEdit = (task: TaskWithCompletions) => {
    setEditingTaskId(task.id);
    setEditFormData({
      task_name: task.task_name || '',
      frequency_type: task.frequency_type || '',
    });
  };

  const handleSaveEdit = async (taskId: string) => {
    await handleUpdateTask(taskId, {
      task_name: editFormData.task_name,
      frequency_type: editFormData.frequency_type,
    });
    setEditingTaskId(null);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditFormData({ task_name: '', frequency_type: '' });
  };

  const handleDelete = async (taskId: string, taskName: string) => {
    const confirmed = await showConfirm({
      title: 'Delete Task?',
      message: `Delete "${taskName}"? This action can't be undone.`,
      variant: 'danger',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });

    if (!confirmed) return;

    await handleDeleteTask(taskId);
  };

  const formatFrequencyType = (frequency: string) => {
    const map: Record<string, string> = {
      daily: 'Daily',
      'bi-daily': 'Bi-Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      '3-monthly': 'Every 3 Months',
    };
    return map[frequency] || frequency;
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !area || !mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
      onClick={e => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="area-tasks-modal-title"
    >
      <div
        className="tablet:max-w-lg desktop:max-w-2xl tablet:mx-0 relative mx-2 mb-8 flex w-full max-w-full flex-col rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="tablet:flex-row tablet:items-center tablet:justify-between tablet:gap-0 tablet:p-5 flex flex-col gap-3 border-b border-[#2a2a2a] bg-[#1f1f1f] p-4">
          <div className="min-w-0 flex-1">
            <h2
              id="area-tasks-modal-title"
              className="tablet:text-xl desktop:text-2xl truncate text-lg font-bold text-white"
            >
              {area.area_name}
            </h2>
            {area.description && (
              <p className="tablet:text-sm mt-0.5 line-clamp-2 text-xs text-gray-400">
                {area.description}
              </p>
            )}
          </div>
          <div className="tablet:gap-3 flex shrink-0 items-center gap-2">
            <button
              onClick={() => onCreateTask(area.id)}
              className="tablet:gap-2 tablet:px-4 tablet:text-sm flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-3 py-2 text-xs font-semibold text-black transition-all duration-200 hover:shadow-lg"
            >
              <Icon icon={Plus} size="sm" aria-hidden={true} />
              <span className="tablet:inline hidden">Add Task</span>
              <span className="tablet:hidden">Add</span>
            </button>
            <button
              onClick={onClose}
              className="shrink-0 p-2 text-gray-400 transition-colors hover:text-white"
              aria-label="Close"
            >
              <Icon icon={X} size="md" className="tablet:size-lg" aria-hidden={true} />
            </button>
          </div>
        </div>

        {/* Content - Scrollable when there are many tasks */}
        <div className="tablet:p-5 tablet:max-h-[65vh] desktop:max-h-[70vh] max-h-[60vh] flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-400">Loading tasks...</div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="py-8 text-center">
              <div className="mb-3 flex justify-center">
                <div className="tablet:h-20 tablet:w-20 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#29E7CD]/20 to-[#D925C7]/20">
                  <Icon
                    icon={Circle}
                    size="lg"
                    className="tablet:size-xl text-[#29E7CD]"
                    aria-hidden={true}
                  />
                </div>
              </div>
              <h3 className="tablet:text-xl mb-1.5 text-lg font-semibold text-white">
                No tasks yet
              </h3>
              <p className="mb-4 text-gray-400">Create your first task for this area.</p>
              <button
                onClick={() => onCreateTask(area.id)}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
              >
                <Icon icon={Plus} size="sm" aria-hidden={true} />
                Create First Task
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className="tablet:p-4 rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-3 transition-all duration-200 hover:border-[#29E7CD]/30"
                >
                  {editingTaskId === task.id ? (
                    <div className="space-y-3">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-300">
                          Task Name
                        </label>
                        <input
                          type="text"
                          value={editFormData.task_name}
                          onChange={e =>
                            setEditFormData({ ...editFormData, task_name: e.target.value })
                          }
                          className="w-full rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] px-3 py-2 text-white placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                          placeholder="Task name"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-300">
                          Frequency
                        </label>
                        <select
                          value={editFormData.frequency_type}
                          onChange={e =>
                            setEditFormData({ ...editFormData, frequency_type: e.target.value })
                          }
                          className="w-full rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] px-3 py-2 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                        >
                          <option value="daily">Daily</option>
                          <option value="bi-daily">Bi-Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="3-monthly">Every 3 Months</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(task.id)}
                          className="flex-1 rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-2 text-sm font-semibold text-black transition-all duration-200 hover:shadow-lg"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="rounded-xl bg-[#2a2a2a] px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#3a3a3a]"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <h3 className="font-semibold text-white">{task.task_name}</h3>
                          {task.frequency_type && (
                            <span className="rounded-full bg-[#29E7CD]/10 px-2 py-0.5 text-xs text-[#29E7CD]">
                              {formatFrequencyType(task.frequency_type)}
                            </span>
                          )}
                        </div>
                        {task.description && (
                          <p className="text-sm text-gray-400">{task.description}</p>
                        )}
                        {task.equipment_id && task.temperature_equipment && (
                          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                            <span>Equipment:</span>
                            <span className="text-blue-400">
                              {(task.temperature_equipment as any)?.name}
                            </span>
                          </div>
                        )}
                        {task.section_id && task.kitchen_sections && (
                          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                            <span>Section:</span>
                            <span className="text-[#D925C7]">
                              {(task.kitchen_sections as any)?.section_name}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(task)}
                          className="rounded-lg bg-[#2a2a2a] p-2 text-gray-400 transition-colors hover:bg-[#3a3a3a] hover:text-[#29E7CD]"
                          title="Edit task"
                        >
                          <Icon icon={Edit2} size="sm" aria-hidden={true} />
                        </button>
                        <button
                          onClick={() => handleDelete(task.id, task.task_name || 'task')}
                          className="rounded-lg bg-[#2a2a2a] p-2 text-gray-400 transition-colors hover:bg-[#3a3a3a] hover:text-red-400"
                          title="Delete task"
                        >
                          <Icon icon={Trash2} size="sm" aria-hidden={true} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="tablet:px-5 tablet:py-3 border-t border-[#2a2a2a] bg-[#1f1f1f] px-4 py-2.5">
          <div className="tablet:text-sm flex items-center justify-between text-xs text-gray-500">
            <span>
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            </span>
            <span className="desktop:inline hidden">
              Press <kbd className="rounded bg-[#2a2a2a] px-2 py-1 text-xs">Esc</kbd> to close
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof window !== 'undefined' ? (
    <>
      {createPortal(modalContent, document.body)}
      {createPortal(<ConfirmDialog />, document.body)}
    </>
  ) : null;
}
