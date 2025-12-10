/**
 * Zustand store for roster state management.
 * Manages shifts, templates, drag-and-drop state, and roster builder UI state.
 *
 * @module useRosterState
 */

'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  Shift,
  ShiftStatus,
  RosterTemplate,
  Employee,
  ShiftValidationWarning,
} from '../types';

interface RosterState {
  // Current week being viewed/edited
  currentWeekStart: Date;
  setCurrentWeekStart: (date: Date) => void;

  // Shifts state
  shifts: Shift[];
  setShifts: (shifts: Shift[]) => void;
  addShift: (shift: Shift) => void;
  updateShift: (shiftId: string, updates: Partial<Shift>) => void;
  removeShift: (shiftId: string) => void;
  getShiftsForDate: (date: Date) => Shift[];
  getShiftsForEmployee: (employeeId: string) => Shift[];

  // Draft mode
  isDraftMode: boolean;
  setIsDraftMode: (isDraft: boolean) => void;
  publishedShifts: Set<string>; // Set of published shift IDs
  publishShifts: (shiftIds: string[]) => void;
  unpublishShifts: (shiftIds: string[]) => void;

  // Templates state
  templates: RosterTemplate[];
  setTemplates: (templates: RosterTemplate[]) => void;
  selectedTemplateId: string | null;
  setSelectedTemplateId: (templateId: string | null) => void;

  // Drag and drop state
  draggedShift: Shift | null;
  setDraggedShift: (shift: Shift | null) => void;
  dropTarget: { employeeId: string; date: Date } | null;
  setDropTarget: (target: { employeeId: string; date: Date } | null) => void;

  // Validation warnings
  validationWarnings: ShiftValidationWarning[];
  setValidationWarnings: (warnings: ShiftValidationWarning[]) => void;
  addValidationWarning: (warning: ShiftValidationWarning) => void;
  removeValidationWarning: (shiftId: string) => void;
  clearValidationWarnings: () => void;

  // Employees state (for roster builder)
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
  selectedEmployeeId: string | null;
  setSelectedEmployeeId: (employeeId: string | null) => void;

  // UI state
  showTemplateManager: boolean;
  setShowTemplateManager: (show: boolean) => void;
  showShiftForm: boolean;
  setShowShiftForm: (show: boolean) => void;
  editingShiftId: string | null;
  setEditingShiftId: (shiftId: string | null) => void;

  // Filter state
  filterStatus: ShiftStatus | 'all';
  setFilterStatus: (status: ShiftStatus | 'all') => void;
  filterEmployeeId: string | null;
  setFilterEmployeeId: (employeeId: string | null) => void;

  // Reset state
  reset: () => void;
}

const initialState = {
  currentWeekStart: new Date(),
  shifts: [],
  isDraftMode: true,
  publishedShifts: new Set<string>(),
  templates: [],
  selectedTemplateId: null,
  draggedShift: null,
  dropTarget: null,
  validationWarnings: [],
  employees: [],
  selectedEmployeeId: null,
  showTemplateManager: false,
  showShiftForm: false,
  editingShiftId: null,
  filterStatus: 'all' as const,
  filterEmployeeId: null,
};

export const useRosterState = create<RosterState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Week navigation
      setCurrentWeekStart: (date: Date) => set({ currentWeekStart: date }),

      // Shifts management
      setShifts: (shifts: Shift[]) => set({ shifts }),
      addShift: (shift: Shift) =>
        set(state => ({
          shifts: [...state.shifts, shift],
        })),
      updateShift: (shiftId: string, updates: Partial<Shift>) =>
        set(state => ({
          shifts: state.shifts.map(shift =>
            shift.id === shiftId ? { ...shift, ...updates } : shift,
          ),
        })),
      removeShift: (shiftId: string) =>
        set(state => ({
          shifts: state.shifts.filter(shift => shift.id !== shiftId),
          publishedShifts: new Set([...state.publishedShifts].filter(id => id !== shiftId)),
        })),
      getShiftsForDate: (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return get().shifts.filter(shift => shift.shift_date === dateStr);
      },
      getShiftsForEmployee: (employeeId: string) => {
        return get().shifts.filter(shift => shift.employee_id === employeeId);
      },

      // Draft mode management
      setIsDraftMode: (isDraft: boolean) => set({ isDraftMode: isDraft }),
      publishShifts: (shiftIds: string[]) =>
        set(state => {
          const newPublished = new Set([...state.publishedShifts, ...shiftIds]);
          return {
            publishedShifts: newPublished,
            shifts: state.shifts.map(shift =>
              shiftIds.includes(shift.id)
                ? {
                    ...shift,
                    status: 'published' as ShiftStatus,
                    published_at: new Date().toISOString(),
                  }
                : shift,
            ),
          };
        }),
      unpublishShifts: (shiftIds: string[]) =>
        set(state => {
          const newPublished = new Set(
            [...state.publishedShifts].filter(id => !shiftIds.includes(id)),
          );
          return {
            publishedShifts: newPublished,
            shifts: state.shifts.map(shift =>
              shiftIds.includes(shift.id)
                ? { ...shift, status: 'draft' as ShiftStatus, published_at: null }
                : shift,
            ),
          };
        }),

      // Templates management
      setTemplates: (templates: RosterTemplate[]) => set({ templates }),
      setSelectedTemplateId: (templateId: string | null) => set({ selectedTemplateId: templateId }),

      // Drag and drop
      setDraggedShift: (shift: Shift | null) => set({ draggedShift: shift }),
      setDropTarget: (target: { employeeId: string; date: Date } | null) =>
        set({ dropTarget: target }),

      // Validation warnings
      setValidationWarnings: (warnings: ShiftValidationWarning[]) =>
        set({ validationWarnings: warnings }),
      addValidationWarning: (warning: ShiftValidationWarning) =>
        set(state => ({
          validationWarnings: [
            ...state.validationWarnings.filter(w => w.shiftId !== warning.shiftId),
            warning,
          ],
        })),
      removeValidationWarning: (shiftId: string) =>
        set(state => ({
          validationWarnings: state.validationWarnings.filter(w => w.shiftId !== shiftId),
        })),
      clearValidationWarnings: () => set({ validationWarnings: [] }),

      // Employees management
      setEmployees: (employees: Employee[]) => set({ employees }),
      setSelectedEmployeeId: (employeeId: string | null) => set({ selectedEmployeeId: employeeId }),

      // UI state
      setShowTemplateManager: (show: boolean) => set({ showTemplateManager: show }),
      setShowShiftForm: (show: boolean) => set({ showShiftForm: show }),
      setEditingShiftId: (shiftId: string | null) => set({ editingShiftId: shiftId }),

      // Filter state
      setFilterStatus: (status: ShiftStatus | 'all') => set({ filterStatus: status }),
      setFilterEmployeeId: (employeeId: string | null) => set({ filterEmployeeId: employeeId }),

      // Reset state
      reset: () => set(initialState),
    }),
    { name: 'RosterStore' },
  ),
);



