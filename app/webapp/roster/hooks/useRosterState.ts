/**
 * Zustand store for roster state management.
 * Manages shifts, templates, drag-and-drop state, and roster builder UI state.
 *
 * @module useRosterState
 */

'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { RosterState } from './useRosterState/types';
import { initialState } from './useRosterState/initialState';
import { createShiftActions } from './useRosterState/helpers/shiftActions';
import { createDraftActions } from './useRosterState/helpers/draftActions';
import { createValidationActions } from './useRosterState/helpers/validationActions';
import { createUIActions } from './useRosterState/helpers/uiActions';
import { createEmployeeActions } from './useRosterState/helpers/employeeActions';
import { createTemplateActions } from './useRosterState/helpers/templateActions';
import { createDragDropActions } from './useRosterState/helpers/dragDropActions';
import { createWeekActions } from './useRosterState/helpers/weekActions';
import { createResetAction } from './useRosterState/helpers/resetAction';

export const useRosterState = create<RosterState>()(
  devtools(
    (set, get) => ({
      ...initialState,
      ...createWeekActions(set),
      ...createShiftActions(set, get),
      ...createDraftActions(set),
      ...createTemplateActions(set),
      ...createDragDropActions(set),
      ...createValidationActions(set),
      ...createEmployeeActions(set),
      ...createUIActions(set),
      reset: createResetAction(initialState, set),
    }),
    { name: 'RosterStore' },
  ),
);
