/**
 * Initial state for roster store.
 */
export const initialState = {
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
