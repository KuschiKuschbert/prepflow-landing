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
import type { Shift, ShiftValidationWarning } from '@/lib/types/roster';
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
          ? 'border-[var(--color-warning)]/40 bg-[var(--color-warning)]/5' // Draft: yellow border and subtle yellow background
          : 'border-[var(--primary)]/30 bg-[var(--surface)]' // Published: cyan border and solid background
      } ${hasErrors ? 'border-[var(--color-error)]/50 bg-[var(--color-error)]/10' : ''} ${hasWarnings ? 'border-[var(--color-warning)]/50 bg-[var(--color-warning)]/10' : ''} ${
        isDraggingState ? 'cursor-grabbing' : 'cursor-grab'
      } hover:border-[var(--primary)]/50 hover:shadow-lg`}
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
          className="absolute top-2 left-2 z-10 flex items-center justify-center rounded-full bg-[var(--color-error)]/20 p-1.5 text-[var(--color-error)] opacity-60 transition-all hover:bg-[var(--color-error)]/30 hover:text-red-300 hover:opacity-100"
          aria-label={`Delete shift ${format(startTime, 'HH:mm')} - ${format(endTime, 'HH:mm')}`}
        >
          <Icon icon={X} size="xs" aria-hidden={true} />
        </button>
      )}

      {/* Drag handle - always visible */}
      <div className="pointer-events-none absolute top-2 right-2 text-[var(--foreground-subtle)] opacity-60 transition-opacity group-hover:opacity-100">
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
        className="mb-1 flex w-full items-center gap-1.5 text-left transition-colors hover:text-[var(--primary)]"
      >
        <Icon icon={Clock} size="xs" className="text-[var(--primary)]" aria-hidden={true} />
        <span className="text-xs font-medium text-[var(--foreground)]">
          {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
        </span>
        <span className="text-[10px] text-[var(--foreground-muted)]">
          ({durationHours.toFixed(1)}h)
        </span>
      </button>

      {/* Employee name */}
      {employeeName && (
        <div className="mb-1 flex items-center gap-1.5">
          <Icon
            icon={User}
            size="xs"
            className="text-[var(--foreground-muted)]"
            aria-hidden={true}
          />
          <span className="text-xs text-[var(--foreground-secondary)]">{employeeName}</span>
        </div>
      )}

      {/* Role */}
      {shift.role && (
        <div className="mb-1">
          <span className="rounded-full bg-[var(--primary)]/10 px-1.5 py-0.5 text-[10px] text-[var(--primary)]">
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
                warning.severity === 'error'
                  ? 'text-[var(--color-error)]'
                  : 'text-[var(--color-warning)]'
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
