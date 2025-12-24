'use client';

import { format, addDays } from 'date-fns';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Calendar, Plus, Trash2 } from 'lucide-react';

interface RosterHeaderProps {
  currentWeekStart: Date;
  navigateWeek: (direction: 'prev' | 'next') => void;
  onAddShift: () => void;
  onDeleteAll: () => void;
  shiftsCount: number;
  isDraftMode: boolean;
  onPublish: () => void;
  loading: boolean;
}

/**
 * Roster header component with navigation and actions
 */
export function RosterHeader({
  currentWeekStart,
  navigateWeek,
  onAddShift,
  onDeleteAll,
  shiftsCount,
  isDraftMode,
  onPublish,
  loading,
}: RosterHeaderProps) {
  return (
    <div className="tablet:flex-row tablet:items-center tablet:justify-between flex flex-col gap-4">
      <div>
        <h1 className="text-fluid-2xl font-bold text-[var(--foreground)]">Roster Builder</h1>
        <p className="text-[var(--foreground-muted)]">
          {format(currentWeekStart, 'MMM d')} -{' '}
          {format(addDays(currentWeekStart, 6), 'MMM d, yyyy')}
        </p>
      </div>
      <div className="tablet:gap-4 flex flex-wrap items-center gap-2">
        <Button variant="secondary" onClick={() => navigateWeek('prev')} size="sm">
          <Icon icon={Calendar} size="sm" aria-hidden={true} />
          <span className="tablet:inline hidden">Previous Week</span>
          <span className="tablet:hidden">Prev</span>
        </Button>
        <Button variant="secondary" onClick={() => navigateWeek('next')} size="sm">
          <span className="tablet:inline hidden">Next Week</span>
          <span className="tablet:hidden">Next</span>
          <Icon icon={Calendar} size="sm" aria-hidden={true} />
        </Button>
        <Button variant="primary" onClick={onAddShift} size="sm">
          <Icon icon={Plus} size="sm" aria-hidden={true} />
          <span className="tablet:inline hidden">Add Shift</span>
          <span className="tablet:hidden">Add</span>
        </Button>
        <Button
          variant="outline"
          onClick={onDeleteAll}
          size="sm"
          disabled={loading || shiftsCount === 0}
          className="border-[var(--color-error)]/50 text-[var(--color-error)] hover:border-[var(--color-error)] hover:bg-[var(--color-error)]/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={
            shiftsCount > 0
              ? `Delete all ${shiftsCount} shift${shiftsCount > 1 ? 's' : ''}`
              : 'No shifts to delete'
          }
        >
          <Icon icon={Trash2} size="sm" aria-hidden={true} />
          <span className="tablet:inline hidden">
            Delete All {shiftsCount > 0 && `(${shiftsCount})`}
          </span>
          <span className="tablet:hidden">Delete {shiftsCount > 0 && `(${shiftsCount})`}</span>
        </Button>
        {isDraftMode && (
          <Button variant="primary" onClick={onPublish} disabled={loading} size="sm">
            <span className="tablet:inline hidden">Publish Shifts</span>
            <span className="tablet:hidden">Publish</span>
          </Button>
        )}
      </div>
    </div>
  );
}
