// PrepFlow Workflow Preference System (localStorage-backed)

'use client';

import { useState, useEffect, useCallback } from 'react';

export type WorkflowType = 'daily-operations' | 'setup-planning-operations' | 'menu-first';

const STORAGE_KEY = 'prepflow-workflow';
const DEFAULT_WORKFLOW: WorkflowType = 'daily-operations';

const WORKFLOW_TYPES: WorkflowType[] = [
  'daily-operations',
  'setup-planning-operations',
  'menu-first',
];

function validateWorkflow(value: unknown): WorkflowType {
  if (typeof value === 'string' && WORKFLOW_TYPES.includes(value as WorkflowType)) {
    return value as WorkflowType;
  }
  return DEFAULT_WORKFLOW;
}

/**
 * Hook to manage workflow preference stored in localStorage.
 *
 * @returns {Object} Workflow preference hook
 * @returns {WorkflowType} returns.workflow - Current workflow type
 * @returns {Function} returns.setWorkflow - Function to update workflow preference
 *
 * @example
 * ```typescript
 * const { workflow, setWorkflow } = useWorkflowPreference();
 * setWorkflow('menu-first');
 * ```
 */
export function useWorkflowPreference() {
  const [workflow, setWorkflowState] = useState<WorkflowType>(() => {
    if (typeof window === 'undefined') return DEFAULT_WORKFLOW;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return validateWorkflow(stored);
      }
    } catch {
      // Invalid stored data, use defaults
    }
    return DEFAULT_WORKFLOW;
  });

  // Persist to localStorage on change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, workflow);
    } catch {
      // Storage quota exceeded or disabled, ignore
    }
  }, [workflow]);

  const setWorkflow = useCallback((newWorkflow: WorkflowType) => {
    setWorkflowState(validateWorkflow(newWorkflow));
  }, []);

  return {
    workflow,
    setWorkflow,
  };
}

/**
 * Get workflow display name.
 *
 * @param {WorkflowType} workflow - Workflow type
 * @returns {string} Display name for the workflow
 */
export function getWorkflowDisplayName(workflow: WorkflowType): string {
  switch (workflow) {
    case 'daily-operations':
      return 'Daily Operations';
    case 'setup-planning-operations':
      return 'Setup → Planning → Operations';
    case 'menu-first':
      return 'Menu-First';
    default:
      return 'Daily Operations';
  }
}

/**
 * Get workflow description.
 *
 * @param {WorkflowType} workflow - Workflow type
 * @returns {string} Description for the workflow
 */
export function getWorkflowDescription(workflow: WorkflowType): string {
  switch (workflow) {
    case 'daily-operations':
      return 'Organized by time of day: Morning Prep → Service → End of Day';
    case 'setup-planning-operations':
      return 'Organized by phase: Setup → Planning → Operations → Analysis';
    case 'menu-first':
      return 'Menu-focused: Menu & Recipes → Inventory → Operations';
    default:
      return 'Organized by time of day: Morning Prep → Service → End of Day';
  }
}
