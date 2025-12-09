import { useRef, useCallback, useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { format } from 'date-fns';
import { Icon } from '@/components/ui/Icon';
import { Plus } from 'lucide-react';
import { InlineTimeEntry } from '../../InlineTimeEntry';
import { ShiftCard } from '../../ShiftCard';
import type { Shift, ShiftValidationWarning } from '../../../types';

interface RosterCellProps {
  employeeId: string;
  date: Date;
  shifts: Shift[];
  validationWarnings: ShiftValidationWarning[];
  isOver?: boolean;
  onAddShift?: (employeeId: string, date: Date, cellPosition?: DOMRect) => void;
  activeInlineEntry?: { employeeId: string; date: Date; cellPosition?: DOMRect } | null;
  onInlineEntrySave?: (shiftData: Partial<Shift>) => Promise<void>;
  onInlineEntryCancel?: () => void;
  onDeleteShift?: (shiftId: string) => void;
  onEditShift?: (shiftId: string) => void;
}

/**
 * RosterCell Component
 * Displays a cell for a specific employee and day, showing shifts.
 */
export function RosterCell({
  employeeId,
  date,
  shifts,
  validationWarnings,
  isOver,
  onAddShift,
  activeInlineEntry,
  onInlineEntrySave,
  onInlineEntryCancel,
  onDeleteShift,
  onEditShift,
}: RosterCellProps) {
  const cellRef = useRef<HTMLDivElement>(null);
  const { setNodeRef, isOver: isOverCell } = useDroppable({
    id: `cell-${employeeId}-${date.toISOString()}`,
    data: {
      type: 'roster-cell',
      employeeId,
      date,
    },
  });

  // Combine refs for both droppable and cell position
  const combinedRef = useCallback(
    (node: HTMLDivElement | null) => {
      setNodeRef(node);
      cellRef.current = node;
    },
    [setNodeRef],
  );

  const cellWarnings = validationWarnings.filter(w => shifts.some(s => s.id === w.shiftId));
  const isEmpty = shifts.length === 0;

  // Check if this cell is the active inline entry
  const isActiveInlineEntry = useMemo(() => {
    if (!activeInlineEntry) return false;
    return (
      activeInlineEntry.employeeId === employeeId &&
      format(activeInlineEntry.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  }, [activeInlineEntry, employeeId, date]);

  const handleClick = (e: React.MouseEvent) => {
    // Allow adding shifts even if cell already has shifts (for split shifts)
    // Only prevent if dragging over, already showing inline entry, or at max shifts (2)
    if (!isOverCell && !isActiveInlineEntry && shifts.length < 2 && onAddShift && cellRef.current) {
      e.stopPropagation();
      const cellRect = cellRef.current.getBoundingClientRect();
      onAddShift(employeeId, date, cellRect);
    }
  };

  return (
    <div
      ref={combinedRef}
      onClick={handleClick}
      className={`min-h-[100px] rounded-xl border-2 p-1.5 transition-all duration-200 ${
        isOverCell
          ? 'border-[#29E7CD] bg-[#29E7CD]/20 shadow-lg shadow-[#29E7CD]/20'
          : isActiveInlineEntry
            ? 'border-[#29E7CD] bg-[#29E7CD]/10'
            : 'border-[#2a2a2a] bg-[#1f1f1f]/30'
      } ${!isActiveInlineEntry ? 'cursor-pointer hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/5' : ''}`}
    >
      {isActiveInlineEntry && onInlineEntrySave && onInlineEntryCancel ? (
        <InlineTimeEntry
          employeeId={employeeId}
          date={date}
          onSave={onInlineEntrySave}
          onCancel={onInlineEntryCancel}
          cellPosition={
            activeInlineEntry?.cellPosition
              ? {
                  top: activeInlineEntry.cellPosition.top,
                  left: activeInlineEntry.cellPosition.left,
                  width: activeInlineEntry.cellPosition.width,
                  height: activeInlineEntry.cellPosition.height,
                }
              : undefined
          }
        />
      ) : isEmpty ? (
        // Empty cell - show "Add shift" button
        <div className="flex h-full items-center justify-center">
          <button
            onClick={e => {
              e.stopPropagation();
              if (onAddShift && cellRef.current) {
                const cellRect = cellRef.current.getBoundingClientRect();
                onAddShift(employeeId, date, cellRect);
              }
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#2a2a2a] bg-[#1f1f1f]/20 p-2 text-xs text-gray-400 transition-colors hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/5 hover:text-[#29E7CD]"
          >
            <Icon icon={Plus} size="sm" aria-hidden={true} />
            <span>Add shift</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {shifts.map(shift => {
            const shiftWarnings = validationWarnings.filter(w => w.shiftId === shift.id);
            return (
              <ShiftCard
                key={shift.id}
                shift={shift}
                warnings={shiftWarnings}
                onDelete={onDeleteShift}
                onEdit={onEditShift}
              />
            );
          })}
          {/* Show "Add shift" button when cell has shifts but less than 2 (for split shifts) */}
          {shifts.length < 2 && (
            <button
              onClick={e => {
                e.stopPropagation();
                if (onAddShift && cellRef.current) {
                  const cellRect = cellRef.current.getBoundingClientRect();
                  onAddShift(employeeId, date, cellRect);
                }
              }}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#2a2a2a] bg-[#1f1f1f]/20 p-2 text-xs text-gray-400 transition-colors hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/5 hover:text-[#29E7CD]"
            >
              <Icon icon={Plus} size="sm" aria-hidden={true} />
              <span>Add shift</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
