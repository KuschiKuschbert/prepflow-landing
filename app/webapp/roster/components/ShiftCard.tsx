/**
 * ShiftCard Component
 * Displays a single shift card with warnings and drag handle.
 *
 * @component
 */

'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Icon } from '@/components/ui/Icon';
import { AlertTriangle, Clock, User, GripVertical, X } from 'lucide-react';
import type { Shift, ShiftValidationWarning } from '../types';
import { format } from 'date-fns';

interface ShiftCardProps {
  shift: Shift;
  warnings?: ShiftValidationWarning[];
  isDragging?: boolean;
  employeeName?: string;
  onDelete?: (shiftId: string) => void;
  onEdit?: (shiftId: string) => void;
}

/**
 * ShiftCard component for displaying shift information in the roster builder.
 *
 * @param {ShiftCardProps} props - Component props
 * @returns {JSX.Element} Rendered shift card
 */
export function ShiftCard({
  shift,
  warnings = [],
  isDragging = false,
  employeeName,
  onDelete,
  onEdit,
}: ShiftCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: isDraggingState,
  } = useDraggable({
    id: shift.id,
    data: {
      type: 'shift',
      shift,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDraggingState ? 0 : 1, // Hide original card when dragging (DragOverlay shows it)
  };

  const startTime = new Date(shift.start_time);
  const endTime = new Date(shift.end_time);
  const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

  const hasErrors = warnings.some(w => w.severity === 'error');
  const hasWarnings = warnings.some(w => w.severity === 'warning');

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group relative rounded-xl border-2 p-2 transition-all ${
        shift.status === 'draft'
          ? 'border-yellow-500/40 bg-yellow-500/5' // Draft: yellow border and subtle yellow background
          : 'border-[#29E7CD]/30 bg-[#1f1f1f]' // Published: cyan border and solid background
      } ${hasErrors ? 'border-red-500/50 bg-red-500/10' : ''} ${hasWarnings ? 'border-yellow-500/50 bg-yellow-500/10' : ''} ${
        isDraggingState ? 'cursor-grabbing' : 'cursor-grab'
      } hover:border-[#29E7CD]/50 hover:shadow-lg`}
    >
      {/* Delete button - always visible but subtle */}
      {onDelete && (
        <button
          onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            onDelete(shift.id);
          }}
          onMouseDown={e => {
            e.stopPropagation(); // Prevent drag from starting
          }}
          className="absolute top-2 left-2 z-10 flex items-center justify-center rounded-full bg-red-500/20 p-1.5 text-red-400 opacity-60 transition-all hover:bg-red-500/30 hover:text-red-300 hover:opacity-100"
          aria-label={`Delete shift ${format(startTime, 'HH:mm')} - ${format(endTime, 'HH:mm')}`}
        >
          <Icon icon={X} size="xs" aria-hidden={true} />
        </button>
      )}

      {/* Drag handle - always visible */}
      <div className="pointer-events-none absolute top-2 right-2 text-gray-500 opacity-60 transition-opacity group-hover:opacity-100">
        <Icon icon={GripVertical} size="sm" aria-hidden={true} />
      </div>

      {/* Shift time - clickable to edit */}
      <button
        onClick={e => {
          if (onEdit) {
            e.stopPropagation();
            e.preventDefault();
            onEdit(shift.id);
          }
        }}
        onMouseDown={e => {
          if (onEdit) {
            e.stopPropagation(); // Prevent drag from starting when clicking to edit
          }
        }}
        className="mb-1 flex w-full items-center gap-1.5 text-left transition-colors hover:text-[#29E7CD]"
      >
        <Icon icon={Clock} size="xs" className="text-[#29E7CD]" aria-hidden={true} />
        <span className="text-xs font-medium text-white">
          {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
        </span>
        <span className="text-[10px] text-gray-400">({durationHours.toFixed(1)}h)</span>
      </button>

      {/* Employee name */}
      {employeeName && (
        <div className="mb-1 flex items-center gap-1.5">
          <Icon icon={User} size="xs" className="text-gray-400" aria-hidden={true} />
          <span className="text-xs text-gray-300">{employeeName}</span>
        </div>
      )}

      {/* Role */}
      {shift.role && (
        <div className="mb-1">
          <span className="rounded-full bg-[#29E7CD]/10 px-1.5 py-0.5 text-[10px] text-[#29E7CD]">
            {shift.role}
          </span>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="mt-2 space-y-1">
          {warnings.map((warning, index) => (
            <div
              key={index}
              className={`flex items-start gap-2 text-xs ${
                warning.severity === 'error' ? 'text-red-400' : 'text-yellow-400'
              }`}
            >
              <Icon icon={AlertTriangle} size="xs" aria-hidden={true} />
              <span>{warning.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
