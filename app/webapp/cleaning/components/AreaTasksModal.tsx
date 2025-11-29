'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNotification } from '@/contexts/NotificationContext';
import { useConfirm } from '@/hooks/useConfirm';
import { useCleaningTasks } from '../hooks/useCleaningTasks';
import { useAreaTasks } from './AreaTasksModal/hooks/useAreaTasks';
import { useTaskEditForm } from './AreaTasksModal/hooks/useTaskEditForm';
import { AreaTasksModalHeader } from './AreaTasksModal/components/AreaTasksModalHeader';
import { EmptyTasksState } from './AreaTasksModal/components/EmptyTasksState';
import { TaskItem } from './AreaTasksModal/components/TaskItem';
import { formatFrequencyType } from './AreaTasksModal/utils/formatFrequency';

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
  const { showConfirm, ConfirmDialog } = useConfirm();
  const { tasks, setTasks, loading } = useAreaTasks(area?.id, isOpen);
  const { editingTaskId, editFormData, setEditFormData, startEdit, cancelEdit, finishEdit } =
    useTaskEditForm();

  // CRUD hook
  const { handleUpdateTask, handleDeleteTask } = useCleaningTasks({
    tasks,
    setTasks,
    onTaskUpdate,
  });

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

  const handleSaveEdit = async (taskId: string) => {
    await handleUpdateTask(taskId, {
      task_name: editFormData.task_name,
      frequency_type: editFormData.frequency_type,
    });
    finishEdit();
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
      <div className="tablet:max-w-lg desktop:max-w-2xl tablet:mx-0 relative mx-2 mb-8 w-full max-w-full rounded-3xl bg-gradient-to-r from-[#29E7CD]/30 via-[#D925C7]/30 to-[#29E7CD]/30 p-[1px] shadow-xl">
        <div
          className="flex w-full flex-col rounded-3xl bg-[#1f1f1f]/95"
          onClick={e => e.stopPropagation()}
        >
          <AreaTasksModalHeader
            area={area}
            onClose={onClose}
            onCreateTask={() => onCreateTask(area.id)}
          />

          <div className="tablet:p-5 tablet:max-h-[65vh] desktop:max-h-[70vh] max-h-[60vh] flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-400">Loading tasks...</div>
              </div>
            ) : tasks.length === 0 ? (
              <EmptyTasksState onCreateTask={() => onCreateTask(area.id)} />
            ) : (
              <div className="space-y-2">
                {tasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    isEditing={editingTaskId === task.id}
                    editFormData={editFormData}
                    onEditFormChange={setEditFormData}
                    onSave={() => handleSaveEdit(task.id)}
                    onCancel={cancelEdit}
                    onEdit={() => startEdit(task)}
                    onDelete={() => handleDelete(task.id, task.task_name || 'task')}
                    formatFrequencyType={formatFrequencyType}
                  />
                ))}
              </div>
            )}
          </div>

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
    </div>
  );

  return typeof window !== 'undefined' ? (
    <>
      {createPortal(modalContent, document.body)}
      {createPortal(<ConfirmDialog />, document.body)}
    </>
  ) : null;
}
