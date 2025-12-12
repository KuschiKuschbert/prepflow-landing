/**
 * Hook for form validation logic
 */

import { useState } from 'react';

export function useFormValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };
    delete newErrors[field];

    switch (field) {
      case 'task_name':
        if (!value.trim()) {
          newErrors.task_name = 'Task name is required';
        } else if (value.trim().length < 3) {
          newErrors.task_name = 'Task name must be at least 3 characters';
        }
        break;
      case 'area_id':
        if (!value) {
          newErrors.area_id = 'Please select an area';
        }
        break;
      case 'frequency_type':
        if (!value) {
          newErrors.frequency_type = 'Please select a frequency';
        }
        break;
      case 'customDaysInterval':
        const days = parseInt(value, 10);
        if (isNaN(days) || days < 1 || days > 365) {
          newErrors.customDaysInterval = 'Days must be between 1 and 365';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { errors, setErrors, validateField };
}




