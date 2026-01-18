/**
 * Hook for managing create task form state and logic
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import type { FrequencyType } from '@/lib/cleaning/frequency-calculator';

interface FormData {
  task_name: string;
  frequency_type: FrequencyType | string;
  customDaysInterval: number;
  area_id: string;
  equipment_id: string;
  section_id: string;
  description: string;
  assigned_to_employee_id: string;
}

export function useCreateTaskForm(preselectedAreaId?: string) {
  const [frequencyManuallySet, setFrequencyManuallySet] = useState(false);
  const taskNameInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    task_name: '',
    frequency_type: 'daily',
    customDaysInterval: 3,
    area_id: preselectedAreaId || '',
    equipment_id: '',
    section_id: '',
    description: '',
    assigned_to_employee_id: '',
  });

  // Frequency recommendations based on task name
  const suggestedFrequency = useMemo(() => {
    const taskNameLower = formData.task_name.toLowerCase();
    if (
      taskNameLower.includes('floor') ||
      taskNameLower.includes('wipe') ||
      taskNameLower.includes('surface')
    ) {
      return 'daily';
    }
    if (taskNameLower.includes('deep') || taskNameLower.includes('thorough')) {
      return 'weekly';
    }
    if (taskNameLower.includes('seal') || taskNameLower.includes('filter')) {
      return 'weekly';
    }
    return null;
  }, [formData.task_name]);

  // Auto-apply suggested frequency when task name changes
  useEffect(() => {
    if (suggestedFrequency && !frequencyManuallySet && formData.task_name.length > 3) {
      setFormData(prev => ({ ...prev, frequency_type: suggestedFrequency }));
    }
  }, [suggestedFrequency, formData.task_name, frequencyManuallySet]);

  // Form completion progress
  const formProgress = useMemo(() => {
    const requiredFields = [
      formData.task_name.trim().length >= 3,
      !!formData.area_id,
      !!formData.frequency_type,
    ];
    const completed = requiredFields.filter(Boolean).length;
    return { completed, total: requiredFields.length };
  }, [formData.task_name, formData.area_id, formData.frequency_type]);

  const isFormValid =
    formData.task_name.trim().length >= 3 && formData.area_id && formData.frequency_type;

  return {
    formData,
    setFormData,
    frequencyManuallySet,
    setFrequencyManuallySet,
    taskNameInputRef,
    suggestedFrequency,
    formProgress,
    isFormValid,
  };
}
