'use client';

import { ExportButton, type ExportFormat } from '@/components/ui/ExportButton';
import { PrintButton } from '@/components/ui/PrintButton';
import { type TaskWithCompletions } from '@/lib/cleaning/completion-logic';
import { CleaningGrid } from './CleaningGrid';
import { CleaningStats } from './CleaningStats';
import { GridFilterBar } from './GridFilterBar';

interface CleaningScheduleProps {
  tasks: TaskWithCompletions[];
  statsDates: string[];
  startDate: Date;
  endDate: Date;
  gridFilter: 'today' | 'next2days' | 'week' | 'all';
  setGridFilter: (filter: 'today' | 'next2days' | 'week' | 'all') => void;
  exportLoading: ExportFormat | null;
  onPrint: () => void;
  onExport: (format: ExportFormat) => void;
  handleTaskUpdate: () => void;
  onCreateTask: () => void;
}

export function CleaningSchedule({
  tasks,
  statsDates,
  startDate,
  endDate,
  gridFilter,
  setGridFilter,
  exportLoading,
  onPrint,
  onExport,
  handleTaskUpdate,
  onCreateTask,
}: CleaningScheduleProps) {
  return (
    <div className="space-y-6">
      <div className="tablet:flex-row tablet:items-center tablet:justify-between flex flex-col gap-4">
        <CleaningStats tasks={tasks} dates={statsDates} />
        <div className="flex gap-2 print:hidden">
          <PrintButton onClick={onPrint} label="Print" disabled={tasks.length === 0} />
          <ExportButton
            onExport={onExport}
            loading={exportLoading}
            availableFormats={['csv', 'pdf', 'html']}
            label="Export"
            disabled={tasks.length === 0}
          />
        </div>
      </div>

      <GridFilterBar gridFilter={gridFilter} onFilterChange={setGridFilter} />

      <CleaningGrid
        tasks={tasks}
        startDate={startDate}
        endDate={endDate}
        filter={gridFilter}
        onTaskUpdate={handleTaskUpdate}
        onCreateTask={onCreateTask}
      />
    </div>
  );
}
