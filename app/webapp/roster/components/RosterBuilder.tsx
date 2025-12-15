/**
 * RosterBuilder Component
 * Main roster builder with drag-and-drop functionality using @dnd-kit.
 *
 * @component
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { startOfWeek, eachDayOfInterval, addDays } from 'date-fns';
import { useRosterState } from '../hooks/useRosterState';
import { BudgetWidget } from './BudgetWidget';
import { ShiftForm } from './ShiftForm';
import { EmployeeChipBar } from './EmployeeChipBar';
import { Icon } from '@/components/ui/Icon';
import { Users } from 'lucide-react';
import type { Shift, Employee } from '../types';
import { useNotification } from '@/contexts/NotificationContext';
import { useConfirm } from '@/hooks/useConfirm';
import { useRosterDragAndDrop } from './RosterBuilder/hooks/useRosterDragAndDrop';
import { useRosterShiftManagement } from './RosterBuilder/hooks/useRosterShiftManagement';
import { useRosterWeekNavigation } from './RosterBuilder/hooks/useRosterWeekNavigation';
import { useRosterSidebar } from './RosterBuilder/hooks/useRosterSidebar';
import { useRosterEmployees } from './RosterBuilder/hooks/useRosterEmployees';
import { useRosterBulkActions } from './RosterBuilder/hooks/useRosterBulkActions';
import { useRosterForm } from './RosterBuilder/hooks/useRosterForm';
import { RosterHeader } from './RosterBuilder/components/RosterHeader';
import { RosterGrid } from './RosterBuilder/components/RosterGrid';
import {
  getShiftsForEmployeeAndDay,
  getCurrentWeekShifts,
} from './RosterBuilder/utils/rosterHelpers';
import { createInlineEntrySaveHandler } from './RosterBuilder/helpers/handleInlineEntrySave';
import { createPublishHandler } from './RosterBuilder/helpers/handlePublish';

interface RosterBuilderProps {
  weekStartDate?: Date;
  employees?: Employee[];
  shifts?: Shift[];
}

/**
 * RosterBuilder component for building and managing staff rosters.
 *
 * @param {RosterBuilderProps} props - Component props
 * @returns {JSX.Element} Rendered roster builder
 */
export function RosterBuilder({
  weekStartDate,
  employees: initialEmployees = [],
  shifts: initialShifts = [],
}: RosterBuilderProps) {
  const { showError, showSuccess } = useNotification();
  const { ConfirmDialog } = useConfirm();
  const sidebarCollapsed = useRosterSidebar();

  const {
    currentWeekStart,
    setCurrentWeekStart,
    shifts,
    setShifts,
    addShift,
    updateShift,
    removeShift,
    employees,
    setEmployees,
    validationWarnings,
    addValidationWarning,
    removeValidationWarning,
    isDraftMode,
    publishShifts,
    draggedShift,
    setDraggedShift,
    setDropTarget,
    showShiftForm,
    setShowShiftForm,
    editingShiftId,
    setEditingShiftId,
  } = useRosterState();

  const [activeShiftId, setActiveShiftId] = useState<string | null>(null);
  const [formEmployeeId, setFormEmployeeId] = useState<string | undefined>(undefined);
  const [formDate, setFormDate] = useState<Date | undefined>(undefined);

  // Initialize employees and shifts
  useEffect(() => {
    if (initialEmployees.length > 0) {
      setEmployees(initialEmployees);
    }
  }, [initialEmployees, setEmployees]);

  useEffect(() => {
    if (initialShifts.length > 0) {
      setShifts(initialShifts);
    }
  }, [initialShifts, setShifts]);

  // Week navigation hook
  const { navigateWeek } = useRosterWeekNavigation({
    weekStartDate,
    currentWeekStart,
    setCurrentWeekStart,
    setShifts,
  });

  // Employees management hook
  const { employeesInRoster, addedEmployeeIds, setAddedEmployeeIds, handleEmployeeChipClick } =
    useRosterEmployees({
      employees,
      shifts,
      currentWeekStart,
    });

  // Form management hook
  const {
    activeInlineEntry,
    setActiveInlineEntry,
    handleOpenNewShiftForm,
    handleOpenEditShiftForm,
    handleCloseForm,
    handleCellClickForInline,
    handleInlineEntryCancel,
    editingShift,
  } = useRosterForm({
    shifts,
    editingShiftId,
    setShowShiftForm,
    setFormEmployeeId,
    setFormDate,
    setEditingShiftId,
  });

  // Shift management hook
  const { handleCreateShift, handleDeleteShift, loading, setLoading } = useRosterShiftManagement({
    shifts,
    currentWeekStart,
    addShift,
    updateShift,
    removeShift,
    setShowShiftForm,
    setFormEmployeeId,
    setFormDate,
    setEditingShiftId,
    editingShiftId,
    removeValidationWarning,
  });

  // Drag and drop hook
  const { handleDragStart, handleDragEnd, handleDragOver } = useRosterDragAndDrop({
    shifts,
    employees,
    draggedShift,
    setDraggedShift,
    setDropTarget,
    setActiveShiftId,
    updateShift,
    addValidationWarning,
  });

  // Bulk actions hook
  const { handleDeleteAllShifts, handleDeleteEmployeeFromRoster } = useRosterBulkActions({
    shifts,
    employees,
    currentWeekStart,
    removeShift,
    addShift,
    removeValidationWarning,
    addedEmployeeIds,
    setAddedEmployeeIds,
  });

  // Get week days
  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(currentWeekStart, { weekStartsOn: 0 });
    return eachDayOfInterval({
      start: weekStart,
      end: addDays(weekStart, 6),
    });
  }, [currentWeekStart]);

  // Get shifts for an employee on a specific day
  const getShiftsForEmployeeAndDayMemo = useMemo(
    () => (employeeId: string, date: Date) => getShiftsForEmployeeAndDay(shifts, employeeId, date),
    [shifts],
  );

  const handleInlineEntrySave = createInlineEntrySaveHandler(
    shifts,
    handleCreateShift,
    setActiveInlineEntry,
    showError,
  );
  const handlePublish = createPublishHandler(
    shifts,
    publishShifts,
    setLoading,
    showError,
    showSuccess,
  );

  const currentWeekShifts = getCurrentWeekShifts(shifts, currentWeekStart);

  return (
    <div className="space-y-6">
      {/* Header */}
      <RosterHeader
        currentWeekStart={currentWeekStart}
        navigateWeek={navigateWeek}
        onAddShift={() => handleOpenNewShiftForm()}
        onDeleteAll={handleDeleteAllShifts}
        shiftsCount={shifts.length}
        isDraftMode={isDraftMode}
        onPublish={handlePublish}
        loading={loading}
      />

      {/* Budget Widget - Floating in left corner (only show when there are shifts) */}
      {shifts.length > 0 && (
        <BudgetWidget shifts={shifts} employees={employees} sidebarCollapsed={sidebarCollapsed} />
      )}

      {/* Employee Chip Bar */}
      <EmployeeChipBar
        employees={employees}
        onEmployeeClick={handleEmployeeChipClick}
        currentWeekShifts={shifts}
        addedEmployeeIds={addedEmployeeIds}
      />

      {/* Empty State - Show when no employees in roster */}
      {employeesInRoster.length === 0 && (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f]/30 p-12">
          <Icon icon={Users} size="xl" className="mb-4 text-gray-500" aria-hidden={true} />
          <h3 className="mb-2 text-lg font-semibold text-white">No Shifts Scheduled</h3>
          <p className="mb-6 text-center text-sm text-gray-400">
            Click on an employee chip above to add them to the roster
          </p>
        </div>
      )}

      {/* Roster Grid - Show employees in roster */}
      {employeesInRoster.length > 0 && (
        <RosterGrid
          shifts={shifts}
          employees={employees}
          employeesInRoster={employeesInRoster}
          currentWeekStart={currentWeekStart}
          weekDays={weekDays}
          validationWarnings={validationWarnings}
          activeShiftId={activeShiftId}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          getShiftsForEmployeeAndDay={getShiftsForEmployeeAndDayMemo}
          onAddShift={handleCellClickForInline}
          activeInlineEntry={activeInlineEntry}
          onInlineEntrySave={handleInlineEntrySave}
          onInlineEntryCancel={handleInlineEntryCancel}
          onDeleteShift={handleDeleteShift}
          onEditShift={handleOpenEditShiftForm}
          onDeleteEmployee={handleDeleteEmployeeFromRoster}
        />
      )}

      {/* Shift Form Modal */}
      <ShiftForm
        isOpen={showShiftForm}
        onClose={handleCloseForm}
        onSave={handleCreateShift}
        employees={employees}
        employeeId={formEmployeeId}
        date={formDate}
        shift={editingShift}
        loading={loading}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog />
    </div>
  );
}
