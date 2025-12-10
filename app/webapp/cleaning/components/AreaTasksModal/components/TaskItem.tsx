/**
 * Task item component for area tasks modal
 */

import { Icon } from '@/components/ui/Icon';
import { Edit2, Trash2 } from 'lucide-react';
import type { TaskWithCompletions } from '@/lib/cleaning/completion-logic';

interface TaskItemProps {
  task: TaskWithCompletions;
  isEditing: boolean;
  editFormData: { task_name: string; frequency_type: string };
  onEditFormChange: (data: { task_name: string; frequency_type: string }) => void;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onDelete: () => void;
  formatFrequencyType: (frequency: string) => string;
}

export function TaskItem({
  task,
  isEditing,
  editFormData,
  onEditFormChange,
  onSave,
  onCancel,
  onEdit,
  onDelete,
  formatFrequencyType,
}: TaskItemProps) {
  if (isEditing) {
    return (
      <div className="tablet:p-4 rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-3 transition-all duration-200 hover:border-[#29E7CD]/30">
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Task Name</label>
            <input
              type="text"
              value={editFormData.task_name}
              onChange={e => onEditFormChange({ ...editFormData, task_name: e.target.value })}
              className="w-full rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] px-3 py-2 text-white placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              placeholder="Task name"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Frequency</label>
            <select
              value={editFormData.frequency_type}
              onChange={e => onEditFormChange({ ...editFormData, frequency_type: e.target.value })}
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
              onClick={onSave}
              className="flex-1 rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-2 text-sm font-semibold text-black transition-all duration-200 hover:shadow-lg"
            >
              Save
            </button>
            <button
              onClick={onCancel}
              className="rounded-xl bg-[#2a2a2a] px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#3a3a3a]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tablet:p-4 rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-3 transition-all duration-200 hover:border-[#29E7CD]/30">
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
          {task.description && <p className="text-sm text-gray-400">{task.description}</p>}
          {task.equipment_id && task.temperature_equipment && (
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <span>Equipment:</span>
              <span className="text-blue-400">{(task.temperature_equipment as any)?.name}</span>
            </div>
          )}
          {task.section_id && task.kitchen_sections && (
            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
              <span>Section:</span>
              <span className="text-[#D925C7]">{(task.kitchen_sections as any)?.section_name}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="rounded-lg bg-[#2a2a2a] p-2 text-gray-400 transition-colors hover:bg-[#3a3a3a] hover:text-[#29E7CD]"
            title="Edit task"
          >
            <Icon icon={Edit2} size="sm" aria-hidden={true} />
          </button>
          <button
            onClick={onDelete}
            className="rounded-lg bg-[#2a2a2a] p-2 text-gray-400 transition-colors hover:bg-[#3a3a3a] hover:text-red-400"
            title="Delete task"
          >
            <Icon icon={Trash2} size="sm" aria-hidden={true} />
          </button>
        </div>
      </div>
    </div>
  );
}



