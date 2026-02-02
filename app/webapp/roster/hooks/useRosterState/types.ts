/**
 * Types for roster state.
 */
import { StoreApi } from 'zustand';
import type {
  Employee,
  RosterTemplate,
  Shift,
  ShiftStatus,
  ShiftValidationWarning,
} from '@/lib/types/roster';

export type RosterStoreSet = StoreApi<RosterState>['setState'];
export type RosterStoreGet = StoreApi<RosterState>['getState'];

export interface RosterState {
  currentWeekStart: Date;
  setCurrentWeekStart: (date: Date) => void;
  shifts: Shift[];
  setShifts: (shifts: Shift[]) => void;
  addShift: (shift: Shift) => void;
  updateShift: (shiftId: string, updates: Partial<Shift>) => void;
  removeShift: (shiftId: string) => void;
  getShiftsForDate: (date: Date) => Shift[];
  getShiftsForEmployee: (employeeId: string) => Shift[];
  isDraftMode: boolean;
  setIsDraftMode: (isDraft: boolean) => void;
  publishedShifts: Set<string>;
  publishShifts: (shiftIds: string[]) => void;
  unpublishShifts: (shiftIds: string[]) => void;
  templates: RosterTemplate[];
  setTemplates: (templates: RosterTemplate[]) => void;
  selectedTemplateId: string | null;
  setSelectedTemplateId: (templateId: string | null) => void;
  draggedShift: Shift | null;
  setDraggedShift: (shift: Shift | null) => void;
  dropTarget: { employeeId: string; date: Date } | null;
  setDropTarget: (target: { employeeId: string; date: Date } | null) => void;
  validationWarnings: ShiftValidationWarning[];
  setValidationWarnings: (warnings: ShiftValidationWarning[]) => void;
  addValidationWarning: (warning: ShiftValidationWarning) => void;
  removeValidationWarning: (shiftId: string) => void;
  clearValidationWarnings: () => void;
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
  selectedEmployeeId: string | null;
  setSelectedEmployeeId: (employeeId: string | null) => void;
  showTemplateManager: boolean;
  setShowTemplateManager: (show: boolean) => void;
  showShiftForm: boolean;
  setShowShiftForm: (show: boolean) => void;
  editingShiftId: string | null;
  setEditingShiftId: (shiftId: string | null) => void;
  filterStatus: ShiftStatus | 'all';
  setFilterStatus: (status: ShiftStatus | 'all') => void;
  filterEmployeeId: string | null;
  setFilterEmployeeId: (employeeId: string | null) => void;
  reset: () => void;
}
