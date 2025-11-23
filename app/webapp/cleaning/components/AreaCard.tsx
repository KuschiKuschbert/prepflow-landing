'use client';
import { memo, useCallback } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Sparkles, Trash2, Plus } from 'lucide-react';

interface CleaningArea {
  id: string;
  area_name: string;
  description?: string;
  cleaning_frequency?: string;
  is_active: boolean;
}

interface AreaCardProps {
  area: CleaningArea;
  onAddTask?: (areaId: string) => void;
  onViewTasks?: (areaId: string) => void;
  onDelete?: (areaId: string) => void;
}

function AreaCardComponent({ area, onAddTask, onViewTasks, onDelete }: AreaCardProps) {
  // Memoize handlers to prevent recreation on every render
  const handleCardClick = useCallback(() => {
    onViewTasks?.(area.id);
  }, [onViewTasks, area.id]);

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete?.(area.id);
    },
    [onDelete, area.id],
  );

  const handleAddTaskClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onAddTask?.(area.id);
    },
    [onAddTask, area.id],
  );

  return (
    <div
      className="group relative cursor-pointer rounded-3xl border-l-2 border-[#29E7CD]/30 bg-[#29E7CD]/2 p-6 transition-all duration-200 hover:bg-[#29E7CD]/5"
      onClick={handleCardClick}
      title="Click to view tasks for this area"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
          <Icon icon={Sparkles} size="md" className="text-[#29E7CD]" aria-hidden={true} />
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            area.is_active
              ? 'border border-green-400/20 bg-green-400/10 text-green-400'
              : 'border border-gray-400/20 bg-gray-400/10 text-gray-400'
          }`}
        >
          {area.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>
      <h3 className="mb-2 text-xl font-semibold text-white">{area.area_name}</h3>
      <p className="mb-4 line-clamp-2 text-sm text-gray-400">
        {area.description || 'No description provided'}
      </p>
      <div className="flex items-center justify-between">
        {area.cleaning_frequency && (
          <span className="text-xs text-gray-500">{area.cleaning_frequency}</span>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddTaskClick}
            className="flex items-center gap-1.5 rounded-lg bg-[#2a2a2a]/50 px-3 py-1.5 text-xs font-medium text-gray-300 transition-all duration-200 hover:bg-[#2a2a2a] hover:text-[#29E7CD]"
            title="Add task to this area"
          >
            <Icon icon={Plus} size="xs" aria-hidden={true} />
            Add Task
          </button>
          {onDelete && (
            <button
              onClick={handleDeleteClick}
              className="rounded-lg p-1.5 text-gray-500 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-400"
              title="Delete area"
              aria-label={`Delete ${area.area_name}`}
            >
              <Icon icon={Trash2} size="sm" aria-hidden={true} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders
// Only re-render if area data actually changed
export const AreaCard = memo(AreaCardComponent, (prevProps, nextProps) => {
  // Props are equal if area data is the same (callbacks are stable via useCallback)
  return (
    prevProps.area.id === nextProps.area.id &&
    prevProps.area.area_name === nextProps.area.area_name &&
    prevProps.area.description === nextProps.area.description &&
    prevProps.area.cleaning_frequency === nextProps.area.cleaning_frequency &&
    prevProps.area.is_active === nextProps.area.is_active
  );
});
