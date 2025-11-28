/**
 * Hook for handling task submission
 */

import { useNotification } from '@/contexts/NotificationContext';
import type { FrequencyType } from '@/lib/cleaning/frequency-calculator';
import { logger } from '@/lib/logger';
import { useState } from 'react';

interface FormData {
  task_name: string;
  frequency_type: FrequencyType | string;
  customDaysInterval: number;
  area_id: string;
  equipment_id: string;
  section_id: string;
  description: string;
}

interface UseTaskSubmissionProps {
  formData: FormData;
  preselectedAreaId?: string;
  onSuccess: () => void;
  onClose: () => void;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
  setErrors: (errors: Record<string, string>) => void;
  setShowAdvanced: (show: boolean) => void;
  setFrequencyManuallySet: (set: boolean) => void;
  taskNameInputRef: React.RefObject<HTMLInputElement | null>;
  validateField: (field: string, value: string) => boolean;
}

export function useTaskSubmission({
  formData,
  preselectedAreaId,
  onSuccess,
  onClose,
  setFormData,
  setErrors,
  setShowAdvanced,
  setFrequencyManuallySet,
  taskNameInputRef,
  validateField,
}: UseTaskSubmissionProps) {
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent, keepOpen = false) => {
    e.preventDefault();

    // Validate all required fields
    const isTaskNameValid = validateField('task_name', formData.task_name);
    const isAreaValid = validateField('area_id', formData.area_id);
    const isFrequencyValid = validateField('frequency_type', formData.frequency_type);

    if (!isTaskNameValid || !isAreaValid || !isFrequencyValid) {
      showError('Please fix the errors before submitting');
      return;
    }

    setLoading(true);

    // Convert custom-days to every-X-days format
    let frequencyType = formData.frequency_type;
    if (frequencyType === 'custom-days') {
      frequencyType = `every-${formData.customDaysInterval}-days` as FrequencyType;
    }

    try {
      const response = await fetch('/api/cleaning-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_name: formData.task_name.trim(),
          frequency_type: frequencyType,
          area_id: formData.area_id,
          equipment_id: formData.equipment_id || null,
          section_id: formData.section_id || null,
          description: formData.description?.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || 'Failed to create task');
      }

      showSuccess('Cleaning task created successfully');

      if (keepOpen) {
        // Reset form but keep area selected for "add another"
        setFormData(prev => ({
          task_name: '',
          frequency_type: 'daily',
          customDaysInterval: 3,
          area_id: prev.area_id,
          equipment_id: '',
          section_id: '',
          description: '',
        }));
        setErrors({});
        setFrequencyManuallySet(false);
        taskNameInputRef.current?.focus();
      } else {
        setFormData({
          task_name: '',
          frequency_type: 'daily',
          customDaysInterval: 3,
          area_id: preselectedAreaId || '',
          equipment_id: '',
          section_id: '',
          description: '',
        });
        setErrors({});
        setShowAdvanced(false);
        setFrequencyManuallySet(false);
        onSuccess();
        onClose();
      }
    } catch (error) {
      logger.error('Error creating task:', error);
      showError('Failed to create cleaning task');
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleSubmit };
}
