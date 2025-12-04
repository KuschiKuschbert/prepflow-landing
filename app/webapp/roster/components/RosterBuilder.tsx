/**
 * RosterBuilder Component
 * Main roster builder with drag-and-drop functionality using @dnd-kit.
 *
 * @component
 */

'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import { useRosterState } from '../hooks/useRosterState';
import { ShiftCard } from './ShiftCard';
import { BudgetWidget } from './BudgetWidget';
import { ShiftForm } from './ShiftForm';
import { EmployeeChipBar } from './EmployeeChipBar';
import { InlineTimeEntry } from './InlineTimeEntry';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Plus, Calendar, Users, AlertTriangle, Trash2, X } from 'lucide-react';
import { format, startOfWeek, addDays, eachDayOfInterval, getDay } from 'date-fns';
import type { Shift, Employee, ShiftValidationWarning } from '../types';
import { validateShift, createValidationWarnings } from '@/lib/services/compliance/validator';
import { useNotification } from '@/contexts/NotificationContext';
import { useConfirm } from '@/hooks/useConfirm';
import { logger } from '@/lib/logger';

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
  const { showConfirm, ConfirmDialog } = useConfirm();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
    setValidationWarnings,
    addValidationWarning,
    removeValidationWarning,
    isDraftMode,
    setIsDraftMode,
    publishShifts,
    draggedShift,
    setDraggedShift,
    dropTarget,
    setDropTarget,
    showShiftForm,
    setShowShiftForm,
    editingShiftId,
    setEditingShiftId,
  } = useRosterState();

  const [loading, setLoading] = useState(false);
  const [activeShiftId, setActiveShiftId] = useState<string | null>(null);
  const [formEmployeeId, setFormEmployeeId] = useState<string | undefined>(undefined);
  const [formDate, setFormDate] = useState<Date | undefined>(undefined);
  const [activeInlineEntry, setActiveInlineEntry] = useState<{
    employeeId: string;
    date: Date;
    cellPosition?: DOMRect;
  } | null>(null);

  // Initialize week start
  useEffect(() => {
    if (weekStartDate) {
      setCurrentWeekStart(startOfWeek(weekStartDate, { weekStartsOn: 0 }));
    }
  }, [weekStartDate, setCurrentWeekStart]);

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

  // Track sidebar collapsed state from localStorage
  useEffect(() => {
    const checkSidebarState = () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('sidebar-collapsed');
        setSidebarCollapsed(saved === 'true');
      }
    };
    checkSidebarState();

    // Listen for custom sidebar-toggle event (immediate update)
    const handleSidebarToggle = ((e: CustomEvent) => {
      setSidebarCollapsed(e.detail.collapsed);
    }) as EventListener;
    window.addEventListener('sidebar-toggle', handleSidebarToggle);

    // Listen for storage changes (when sidebar is toggled in another tab)
    window.addEventListener('storage', checkSidebarState);

    return () => {
      window.removeEventListener('sidebar-toggle', handleSidebarToggle);
      window.removeEventListener('storage', checkSidebarState);
    };
  }, []);

  // Refetch shifts when week changes
  useEffect(() => {
    const fetchShiftsForWeek = async () => {
      try {
        const weekEnd = addDays(currentWeekStart, 6);
        const weekStartStr = format(currentWeekStart, 'yyyy-MM-dd');
        const weekEndStr = format(weekEnd, 'yyyy-MM-dd');

        const response = await fetch(
          `/api/roster/shifts?start_date=${weekStartStr}&end_date=${weekEndStr}&status=all`,
        );
        const data = await response.json();
        if (data.success && data.shifts) {
          setShifts(data.shifts);
        }
      } catch (err) {
        logger.error('Failed to fetch shifts for week', err);
      }
    };

    // Only fetch if we have a valid week start (not initial mount with no weekStartDate)
    if (currentWeekStart) {
      fetchShiftsForWeek();
    }
  }, [currentWeekStart, setShifts]);

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts
      },
    }),
  );

  // Get week days
  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(currentWeekStart, { weekStartsOn: 0 });
    return eachDayOfInterval({
      start: weekStart,
      end: addDays(weekStart, 6),
    });
  }, [currentWeekStart]);

  // Get shifts for a specific day
  const getShiftsForDay = useCallback(
    (date: Date): Shift[] => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return shifts.filter(shift => shift.shift_date === dateStr);
    },
    [shifts],
  );

  // Get shifts for an employee on a specific day
  const getShiftsForEmployeeAndDay = useCallback(
    (employeeId: string, date: Date): Shift[] => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return shifts.filter(
        shift => shift.employee_id === employeeId && shift.shift_date === dateStr,
      );
    },
    [shifts],
  );

  // Validate shift and add warnings
  const validateAndWarn = useCallback(
    (shift: Shift, employee: Employee) => {
      const employeeShifts = shifts.filter(s => s.employee_id === employee.id && s.id !== shift.id);
      const complianceResult = validateShift(shift, employeeShifts, employee);
      const warnings = createValidationWarnings(complianceResult, shift.id);
      warnings.forEach(warning => addValidationWarning(warning));
    },
    [shifts, addValidationWarning],
  );

  // Handle drag start
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const shift = shifts.find(s => s.id === active.id);
      if (shift) {
        setDraggedShift(shift);
        setActiveShiftId(shift.id);
      }
    },
    [shifts, setDraggedShift],
  );

  // Handle drag end
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveShiftId(null);
      setDraggedShift(null);
      setDropTarget(null);

      if (!over || !draggedShift) {
        return;
      }

      // Get drop target data
      const dropData = over.data.current;
      if (!dropData || dropData.type !== 'roster-cell') {
        return;
      }

      const { employeeId, date } = dropData;

      // Update shift with new employee and date
      const newShiftDate = format(date, 'yyyy-MM-dd');
      const shiftDate = new Date(newShiftDate);
      const [startHour, startMin] = draggedShift.start_time.split('T')[1].split(':').map(Number);
      const [endHour, endMin] = draggedShift.end_time.split('T')[1].split(':').map(Number);

      const newStartTime = new Date(shiftDate);
      newStartTime.setHours(startHour, startMin, 0, 0);

      let newEndTime = new Date(shiftDate);
      newEndTime.setHours(endHour, endMin, 0, 0);

      // Handle shifts spanning midnight
      if (newEndTime < newStartTime) {
        newEndTime = addDays(newEndTime, 1);
      }

      const updatedShift: Shift = {
        ...draggedShift,
        employee_id: employeeId,
        shift_date: newShiftDate,
        start_time: newStartTime.toISOString(),
        end_time: newEndTime.toISOString(),
      };

      // Validate shift
      const employee = employees.find(e => e.id === employeeId);
      if (employee) {
        validateAndWarn(updatedShift, employee);
      }

      // Update shift in state
      updateShift(draggedShift.id, updatedShift);

      // TODO: Save to API
      showSuccess('Shift moved successfully');
    },
    [draggedShift, employees, updateShift, validateAndWarn, showSuccess],
  );

  // Handle drag over
  const handleDragOver = useCallback(
    (event: any) => {
      const { over } = event;
      if (over && over.data.current?.type === 'roster-cell') {
        setDropTarget(over.data.current);
      }
    },
    [setDropTarget],
  );

  // Publish draft shifts
  const handlePublish = useCallback(async () => {
    const draftShifts = shifts.filter(s => s.status === 'draft');
    if (draftShifts.length === 0) {
      showError('No draft shifts to publish');
      return;
    }

    setLoading(true);
    try {
      // TODO: Call API to publish shifts
      const shiftIds = draftShifts.map(s => s.id);
      publishShifts(shiftIds);
      showSuccess(`${draftShifts.length} shift(s) published successfully`);
    } catch (error) {
      showError('Failed to publish shifts');
      logger.error('Failed to publish shifts', error);
    } finally {
      setLoading(false);
    }
  }, [shifts, publishShifts, showSuccess, showError]);

  // Navigate weeks
  const navigateWeek = useCallback(
    (direction: 'prev' | 'next') => {
      const newDate = addDays(currentWeekStart, direction === 'next' ? 7 : -7);
      setCurrentWeekStart(newDate);
    },
    [currentWeekStart, setCurrentWeekStart],
  );

  // Handle create or update shift
  const handleCreateShift = useCallback(
    async (shiftData: Partial<Shift>) => {
      const isEdit = !!editingShiftId;

      if (!isEdit) {
        // Check shift limit before creating (not for edits)
        const dateStr = shiftData.shift_date!;
        const existingShifts = shifts.filter(
          s =>
            s.employee_id === shiftData.employee_id &&
            s.shift_date === dateStr &&
            s.id !== editingShiftId,
        );
        if (existingShifts.length >= 2) {
          showError('Maximum 2 shifts per day allowed');
          return;
        }
      }

      if (isEdit) {
        // Update existing shift
        const originalShift = shifts.find(s => s.id === editingShiftId);
        if (!originalShift) {
          showError('Shift not found');
          return;
        }

        // Optimistic update
        updateShift(editingShiftId, shiftData);

        try {
          const response = await fetch(`/api/roster/shifts/${editingShiftId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(shiftData),
          });

          const result = await response.json();

          if (response.ok && result.shift) {
            // Update with server response
            updateShift(editingShiftId, result.shift);
            showSuccess('Shift updated successfully');
            setShowShiftForm(false);
            setFormEmployeeId(undefined);
            setFormDate(undefined);
            setEditingShiftId(null);
          } else {
            // Revert on error
            updateShift(editingShiftId, originalShift);
            showError(result.error || result.message || 'Failed to update shift');
          }
        } catch (err) {
          // Revert on error
          updateShift(editingShiftId, originalShift);
          logger.error('Failed to update shift', err);
          showError('Failed to update shift. Please try again.');
        }
      } else {
        // Create new shift
        // Optimistic update
        const tempId = `temp-${Date.now()}`;
        const tempShift: Shift = {
          id: tempId,
          employee_id: shiftData.employee_id!,
          shift_date: shiftData.shift_date!,
          start_time: shiftData.start_time!,
          end_time: shiftData.end_time!,
          status: shiftData.status || 'draft',
          role: shiftData.role || null,
          break_duration_minutes: shiftData.break_duration_minutes || 0,
          notes: shiftData.notes || null,
          template_shift_id: shiftData.template_shift_id || null,
          published_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Add to state immediately
        addShift(tempShift);

        try {
          const response = await fetch('/api/roster/shifts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(shiftData),
          });

          const result = await response.json();

          if (response.ok && result.shift) {
            // Replace temp shift with real shift from server
            updateShift(tempId, result.shift);
            showSuccess('Shift created successfully');
            setShowShiftForm(false);
            setFormEmployeeId(undefined);
            setFormDate(undefined);
          } else {
            // Revert on error
            removeShift(tempId);
            showError(result.error || result.message || 'Failed to create shift');
          }
        } catch (err) {
          // Revert on error
          removeShift(tempId);
          logger.error('Failed to create shift', err);
          showError('Failed to create shift. Please try again.');
        }
      }
    },
    [
      addShift,
      updateShift,
      removeShift,
      showSuccess,
      showError,
      setShowShiftForm,
      shifts,
      editingShiftId,
      setEditingShiftId,
    ],
  );

  // Handle open form for new shift
  const handleOpenNewShiftForm = useCallback(
    (employeeId?: string, date?: Date) => {
      // Close any active inline entry
      setActiveInlineEntry(null);
      setFormEmployeeId(employeeId);
      setFormDate(date);
      setEditingShiftId(null);
      setShowShiftForm(true);
    },
    [setShowShiftForm, setEditingShiftId],
  );

  // Track which employees have been added to the roster (even without shifts yet)
  const [addedEmployeeIds, setAddedEmployeeIds] = useState<Set<string>>(new Set());

  // Handle employee chip click - add employee to roster (no modal)
  const handleEmployeeChipClick = useCallback((employeeId: string) => {
    // Add employee to the roster (they'll show up even without shifts)
    setAddedEmployeeIds(prev => new Set(prev).add(employeeId));
  }, []);

  // Get employees that should be shown in the roster (have shifts OR have been added)
  const employeesInRoster = useMemo(() => {
    const weekEnd = addDays(currentWeekStart, 6);
    const weekStartStr = format(currentWeekStart, 'yyyy-MM-dd');
    const weekEndStr = format(weekEnd, 'yyyy-MM-dd');

    // Get unique employee IDs that have shifts in this week
    const employeeIdsWithShifts = new Set(
      shifts
        .filter(shift => {
          const shiftDate = shift.shift_date;
          return shiftDate >= weekStartStr && shiftDate <= weekEndStr;
        })
        .map(shift => shift.employee_id),
    );

    // Return employees that have shifts OR have been added to roster
    return employees.filter(
      employee => employeeIdsWithShifts.has(employee.id) || addedEmployeeIds.has(employee.id),
    );
  }, [employees, shifts, currentWeekStart, addedEmployeeIds]);

  // Handle open form for editing shift
  const handleOpenEditShiftForm = useCallback(
    (shiftId: string) => {
      // Close any active inline entry
      setActiveInlineEntry(null);
      const shift = shifts.find(s => s.id === shiftId);
      if (shift) {
        setFormEmployeeId(shift.employee_id);
        setFormDate(new Date(shift.shift_date));
        setEditingShiftId(shiftId);
        setShowShiftForm(true);
      }
    },
    [shifts, setShowShiftForm, setEditingShiftId],
  );

  // Handle inline entry save
  const handleInlineEntrySave = useCallback(
    async (shiftData: Partial<Shift>) => {
      // Check shift limit before creating
      const dateStr = shiftData.shift_date!;
      const existingShifts = shifts.filter(
        s => s.employee_id === shiftData.employee_id && s.shift_date === dateStr,
      );
      if (existingShifts.length >= 2) {
        showError('Maximum 2 shifts per day allowed');
        return;
      }

      await handleCreateShift(shiftData);
      // Close inline entry after save
      setActiveInlineEntry(null);
    },
    [handleCreateShift, shifts, showError],
  );

  // Handle delete shift
  const handleDeleteShift = useCallback(
    async (shiftId: string) => {
      const shiftToDelete = shifts.find(s => s.id === shiftId);
      if (!shiftToDelete) return;

      // Optimistic update - remove immediately
      removeShift(shiftId);

      try {
        const response = await fetch(`/api/roster/shifts/${shiftId}`, {
          method: 'DELETE',
        });

        const result = await response.json();

        if (response.ok) {
          showSuccess('Shift deleted successfully');
          // Remove validation warnings for this shift
          removeValidationWarning(shiftId);
        } else {
          // Revert on error - add shift back
          addShift(shiftToDelete);
          showError(result.error || result.message || 'Failed to delete shift');
        }
      } catch (err) {
        // Revert on error - add shift back
        addShift(shiftToDelete);
        logger.error('Failed to delete shift', err);
        showError('Failed to delete shift. Please try again.');
      }
    },
    [shifts, removeShift, addShift, showSuccess, showError, removeValidationWarning],
  );

  // Handle delete employee from roster (delete all their shifts for current week)
  const handleDeleteEmployeeFromRoster = useCallback(
    async (employeeId: string) => {
      logger.dev('handleDeleteEmployeeFromRoster called for employee:', employeeId);
      const weekEnd = addDays(currentWeekStart, 6);
      const weekStartStr = format(currentWeekStart, 'yyyy-MM-dd');
      const weekEndStr = format(weekEnd, 'yyyy-MM-dd');

      // Find all shifts for this employee in the current week
      const employeeShifts = shifts.filter(shift => {
        const shiftDate = shift.shift_date;
        return (
          shift.employee_id === employeeId && shiftDate >= weekStartStr && shiftDate <= weekEndStr
        );
      });

      const employee = employees.find(e => e.id === employeeId);
      const employeeName = employee
        ? `${employee.first_name} ${employee.last_name}`
        : 'this employee';

      // Always show confirmation dialog
      logger.dev('Showing confirmation dialog for:', employeeName);
      const confirmed = await showConfirm({
        title: 'Remove Employee from Roster',
        message: `Are you sure you want to 86 ${employeeName} from this week's roster?${employeeShifts.length > 0 ? ` This will delete all ${employeeShifts.length} shift${employeeShifts.length > 1 ? 's' : ''} for this week's roster.` : ''} This action cannot be undone.`,
        variant: 'danger',
        confirmLabel: '86 Them',
        cancelLabel: 'Cancel',
      });
      logger.dev('Confirmation result:', confirmed);

      if (!confirmed) return;

      // If no shifts, just remove from addedEmployeeIds if present
      if (employeeShifts.length === 0) {
        if (addedEmployeeIds.has(employeeId)) {
          setAddedEmployeeIds(prev => {
            const next = new Set(prev);
            next.delete(employeeId);
            return next;
          });
          showSuccess(`${employeeName} removed from roster`);
        } else {
          showError('No shifts found for this employee in the current week');
        }
        return;
      }

      // Store original shifts for rollback
      const originalShifts = [...shifts];
      // Store whether employee was in addedEmployeeIds before removal
      const wasInAddedEmployees = addedEmployeeIds.has(employeeId);

      // Optimistic update - remove all shifts immediately
      employeeShifts.forEach(shift => {
        removeShift(shift.id);
        removeValidationWarning(shift.id);
      });

      // Remove from addedEmployeeIds if present
      if (wasInAddedEmployees) {
        setAddedEmployeeIds(prev => {
          const next = new Set(prev);
          next.delete(employeeId);
          return next;
        });
      }

      try {
        // Delete all shifts in parallel
        const deletePromises = employeeShifts.map(shift =>
          fetch(`/api/roster/shifts/${shift.id}`, {
            method: 'DELETE',
          }),
        );

        const responses = await Promise.all(deletePromises);
        const results = await Promise.all(responses.map(r => r.json()));

        // Check for errors
        const errors = results.filter((result, index) => !responses[index].ok);
        if (errors.length > 0) {
          // Revert on error - restore all shifts
          originalShifts.forEach(shift => addShift(shift));
          // Restore addedEmployeeIds if it was removed
          if (wasInAddedEmployees) {
            setAddedEmployeeIds(prev => new Set(prev).add(employeeId));
          }
          showError(`Failed to delete ${errors.length} shift${errors.length > 1 ? 's' : ''}`);
          return;
        }

        showSuccess(`${employeeName} removed from this week's roster`);
      } catch (err) {
        // Revert on error - restore all shifts
        originalShifts.forEach(shift => addShift(shift));
        // Restore addedEmployeeIds if it was removed
        if (wasInAddedEmployees) {
          setAddedEmployeeIds(prev => new Set(prev).add(employeeId));
        }
        logger.error('Failed to delete employee shifts', err);
        showError('Failed to remove employee from roster. Please try again.');
      }
    },
    [
      currentWeekStart,
      shifts,
      employees,
      addedEmployeeIds,
      removeShift,
      addShift,
      removeValidationWarning,
      showConfirm,
      showSuccess,
      showError,
    ],
  );

  // Handle inline entry cancel
  const handleInlineEntryCancel = useCallback(() => {
    setActiveInlineEntry(null);
  }, []);

  // Handle cell click for inline entry
  const handleCellClickForInline = useCallback(
    (employeeId: string, date: Date, cellPosition?: DOMRect) => {
      setActiveInlineEntry({ employeeId, date, cellPosition });
    },
    [],
  );

  // Handle delete all shifts for current week
  const handleDeleteAllShifts = useCallback(async () => {
    // Use all shifts (they're already filtered by the displayed week when fetched)
    // But also filter by displayed week to be safe
    const weekEnd = addDays(currentWeekStart, 6);
    const weekStartStr = format(currentWeekStart, 'yyyy-MM-dd');
    const weekEndStr = format(weekEnd, 'yyyy-MM-dd');

    // Filter shifts for current week
    const weekShifts = shifts.filter(shift => {
      const shiftDate = shift.shift_date;
      return shiftDate >= weekStartStr && shiftDate <= weekEndStr;
    });

    // If no shifts in current week, use all shifts (they might be from a different week)
    const shiftsToDelete = weekShifts.length > 0 ? weekShifts : shifts;

    if (shiftsToDelete.length === 0) {
      showError('No shifts found to delete');
      return;
    }

    const confirmed = await showConfirm({
      title: 'Delete All Shifts',
      message: `Are you sure you want to delete all ${shiftsToDelete.length} shift${shiftsToDelete.length > 1 ? 's' : ''}${weekShifts.length > 0 ? ' for this week' : ''}? This action cannot be undone.`,
      variant: 'danger',
      confirmLabel: 'Delete All',
      cancelLabel: 'Cancel',
    });

    if (!confirmed) return;

    // Store original shifts for rollback
    const originalShifts = [...shifts];

    // Optimistic update - remove all shifts immediately
    shiftsToDelete.forEach(shift => {
      removeShift(shift.id);
      removeValidationWarning(shift.id);
    });

    try {
      // Delete all shifts in parallel
      const deletePromises = shiftsToDelete.map(shift =>
        fetch(`/api/roster/shifts/${shift.id}`, {
          method: 'DELETE',
        }),
      );

      const responses = await Promise.all(deletePromises);
      const results = await Promise.all(responses.map(r => r.json()));

      // Check for errors
      const errors = results.filter((result, index) => !responses[index].ok);
      if (errors.length > 0) {
        // Revert on error - restore all shifts
        originalShifts.forEach(shift => addShift(shift));
        showError(`Failed to delete ${errors.length} shift${errors.length > 1 ? 's' : ''}`);
        return;
      }

      showSuccess(
        `Successfully deleted ${shiftsToDelete.length} shift${shiftsToDelete.length > 1 ? 's' : ''}`,
      );
    } catch (err) {
      // Revert on error - restore all shifts
      originalShifts.forEach(shift => addShift(shift));
      logger.error('Failed to delete all shifts', err);
      showError('Failed to delete shifts. Please try again.');
    }
  }, [
    currentWeekStart,
    shifts,
    removeShift,
    addShift,
    removeValidationWarning,
    showConfirm,
    showSuccess,
    showError,
  ]);

  // Handle close form
  const handleCloseForm = useCallback(() => {
    setShowShiftForm(false);
    setFormEmployeeId(undefined);
    setFormDate(undefined);
    setEditingShiftId(null);
  }, [setShowShiftForm, setEditingShiftId]);

  // Get editing shift if in edit mode
  const editingShift = useMemo(() => {
    if (editingShiftId) {
      return shifts.find(s => s.id === editingShiftId);
    }
    return undefined;
  }, [editingShiftId, shifts]);

  // Get shifts for current week
  const currentWeekShifts = useMemo(() => {
    const weekEnd = addDays(currentWeekStart, 6);
    const weekStartStr = format(currentWeekStart, 'yyyy-MM-dd');
    const weekEndStr = format(weekEnd, 'yyyy-MM-dd');
    const weekShifts = shifts.filter(shift => {
      const shiftDate = shift.shift_date;
      // Compare dates as strings (YYYY-MM-DD format)
      return shiftDate >= weekStartStr && shiftDate <= weekEndStr;
    });
    // Debug log (remove after testing)
    if (process.env.NODE_ENV === 'development') {
      logger.dev('Current week shifts calculation:', {
        currentWeekStart: format(currentWeekStart, 'yyyy-MM-dd'),
        weekStart: weekStartStr,
        weekEnd: weekEndStr,
        totalShifts: shifts.length,
        weekShifts: weekShifts.length,
        allShiftDates: shifts.map(s => ({ id: s.id, date: s.shift_date })),
        weekShiftDates: weekShifts.map(s => ({ id: s.id, date: s.shift_date })),
      });
    }
    return weekShifts;
  }, [currentWeekStart, shifts]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="tablet:flex-row tablet:items-center tablet:justify-between flex flex-col gap-4">
        <div>
          <h1 className="text-fluid-2xl font-bold text-white">Roster Builder</h1>
          <p className="text-gray-400">
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
          <Button variant="primary" onClick={() => handleOpenNewShiftForm()} size="sm">
            <Icon icon={Plus} size="sm" aria-hidden={true} />
            <span className="tablet:inline hidden">Add Shift</span>
            <span className="tablet:hidden">Add</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleDeleteAllShifts}
            size="sm"
            disabled={loading || shifts.length === 0}
            className="border-red-500/50 text-red-400 hover:border-red-500 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={
              currentWeekShifts.length > 0
                ? `Delete all ${currentWeekShifts.length} shift${currentWeekShifts.length > 1 ? 's' : ''} for this week`
                : shifts.length > 0
                  ? `${shifts.length} shift${shifts.length > 1 ? 's' : ''} loaded, but none in displayed week`
                  : 'No shifts to delete'
            }
          >
            <Icon icon={Trash2} size="sm" aria-hidden={true} />
            <span className="tablet:inline hidden">
              Delete All {shifts.length > 0 && `(${shifts.length})`}
            </span>
            <span className="tablet:hidden">
              Delete {shifts.length > 0 && `(${shifts.length})`}
            </span>
          </Button>
          {isDraftMode && (
            <Button variant="primary" onClick={handlePublish} disabled={loading} size="sm">
              <span className="tablet:inline hidden">Publish Shifts</span>
              <span className="tablet:hidden">Publish</span>
            </Button>
          )}
        </div>
      </div>

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
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          modifiers={[snapCenterToCursor]}
        >
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Header Row */}
              <div className="mb-2 grid grid-cols-8 gap-2">
                <div className="font-semibold text-gray-400">Employee</div>
                {weekDays.map(day => (
                  <div key={day.toISOString()} className="text-center">
                    <div className="font-semibold text-white">{format(day, 'EEE')}</div>
                    <div className="text-sm text-gray-400">{format(day, 'MMM d')}</div>
                  </div>
                ))}
              </div>

              {/* Employee Rows */}
              <div className="space-y-2">
                {employeesInRoster.map(employee => (
                  <RosterRow
                    key={employee.id}
                    employee={employee}
                    weekDays={weekDays}
                    shifts={getShiftsForEmployeeAndDay(employee.id, weekDays[0])}
                    getShiftsForDay={getShiftsForEmployeeAndDay}
                    validationWarnings={validationWarnings}
                    onAddShift={handleCellClickForInline}
                    activeInlineEntry={activeInlineEntry}
                    onInlineEntrySave={handleInlineEntrySave}
                    onInlineEntryCancel={handleInlineEntryCancel}
                    onDeleteShift={handleDeleteShift}
                    onEditShift={handleOpenEditShiftForm}
                    onDeleteEmployee={handleDeleteEmployeeFromRoster}
                  />
                ))}
              </div>
            </div>
          </div>
          <DragOverlay style={{ cursor: 'grabbing' }}>
            {activeShiftId
              ? (() => {
                  const draggedShiftData = shifts.find(s => s.id === activeShiftId);
                  if (!draggedShiftData) return null;
                  const shiftWarnings = validationWarnings.filter(
                    w => w.shiftId === draggedShiftData.id,
                  );
                  const employee = employees.find(e => e.id === draggedShiftData.employee_id);
                  return (
                    <ShiftCard
                      shift={draggedShiftData}
                      warnings={shiftWarnings}
                      isDragging={true}
                      employeeName={
                        employee ? `${employee.first_name} ${employee.last_name}` : undefined
                      }
                    />
                  );
                })()
              : null}
          </DragOverlay>
        </DndContext>
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

/**
 * RosterRow Component
 * Displays a row for a single employee with their shifts for the week.
 */
interface RosterRowProps {
  employee: Employee;
  weekDays: Date[];
  shifts: Shift[];
  getShiftsForDay: (employeeId: string, date: Date) => Shift[];
  validationWarnings: ShiftValidationWarning[];
  onAddShift?: (employeeId: string, date: Date, cellPosition?: DOMRect) => void;
  activeInlineEntry?: { employeeId: string; date: Date; cellPosition?: DOMRect } | null;
  onInlineEntrySave?: (shiftData: Partial<Shift>) => Promise<void>;
  onInlineEntryCancel?: () => void;
  onDeleteShift?: (shiftId: string) => void;
  onEditShift?: (shiftId: string) => void;
  onDeleteEmployee?: (employeeId: string) => void;
}

function RosterRow({
  employee,
  weekDays,
  getShiftsForDay,
  validationWarnings,
  onAddShift,
  activeInlineEntry,
  onInlineEntrySave,
  onInlineEntryCancel,
  onDeleteShift,
  onEditShift,
  onDeleteEmployee,
}: RosterRowProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `employee-${employee.id}`,
    data: {
      type: 'employee',
      employeeId: employee.id,
    },
  });

  return (
    <div className="grid grid-cols-8 gap-2">
      {/* Employee Name */}
      <div className="flex items-center">
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Icon icon={Users} size="sm" className="text-gray-400" aria-hidden={true} />
            <div>
              <div className="font-medium text-white">
                {employee.first_name} {employee.last_name}
              </div>
              <div className="text-xs text-gray-400">{employee.role}</div>
            </div>
          </div>
          {onDeleteEmployee && (
            <button
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                logger.dev('Delete button clicked for employee:', employee.id);
                try {
                  onDeleteEmployee(employee.id);
                } catch (err) {
                  logger.error('Error in handleDeleteEmployeeFromRoster:', err);
                }
              }}
              className="relative z-10 flex items-center justify-center rounded-full bg-red-500/20 p-1.5 text-red-400 opacity-60 transition-all hover:bg-red-500/30 hover:text-red-300 hover:opacity-100"
              aria-label={`Remove ${employee.first_name} ${employee.last_name} from this week's roster`}
            >
              <Icon icon={X} size="xs" aria-hidden={true} />
            </button>
          )}
        </div>
      </div>

      {/* Day Columns */}
      {weekDays.map(day => (
        <RosterCell
          key={`${employee.id}-${day.toISOString()}`}
          employeeId={employee.id}
          date={day}
          shifts={getShiftsForDay(employee.id, day)}
          validationWarnings={validationWarnings}
          isOver={isOver}
          onAddShift={onAddShift}
          activeInlineEntry={activeInlineEntry}
          onInlineEntrySave={onInlineEntrySave}
          onInlineEntryCancel={onInlineEntryCancel}
          onDeleteShift={onDeleteShift}
          onEditShift={onEditShift}
        />
      ))}
    </div>
  );
}

/**
 * RosterCell Component
 * Displays a cell for a specific employee and day, showing shifts.
 */
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

function RosterCell({
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
