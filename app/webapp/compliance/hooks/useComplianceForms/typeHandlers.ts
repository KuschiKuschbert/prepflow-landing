/**
 * Type handlers for compliance forms
 */

import { logger } from '@/lib/logger';
import { cacheData } from '@/lib/cache/data-cache';
import type { ComplianceType, ComplianceTypeFormData } from '../../types';

interface HandleAddTypeParams {
  newType: ComplianceTypeFormData;
  types: ComplianceType[];
  setTypes: React.Dispatch<React.SetStateAction<ComplianceType[]>>;
  setShowAddType: React.Dispatch<React.SetStateAction<boolean>>;
  resetForm: () => void;
  showSuccess?: (message: string) => void;
  showError?: (message: string) => void;
}

/**
 * Handle adding a new compliance type
 *
 * @param {HandleAddTypeParams} params - Add type parameters
 * @returns {Promise<void>}
 */
export async function handleAddComplianceType({
  newType,
  types,
  setTypes,
  setShowAddType,
  resetForm,
  showSuccess,
  showError,
}: HandleAddTypeParams): Promise<void> {
  // Store original state for rollback
  const originalTypes = [...types];

  // Create temporary type for optimistic update
  const tempId = -Date.now(); // Negative number for temp ID
  const tempType: ComplianceType = {
    id: tempId,
    name: newType.name,
    description: newType.description,
    renewal_frequency_days: newType.renewal_frequency_days
      ? parseInt(newType.renewal_frequency_days)
      : null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Optimistically add to UI immediately
  const updatedTypes = [...types, tempType];
  setTypes(updatedTypes);
  resetForm();
  setShowAddType(false);

  try {
    const response = await fetch('/api/compliance-types', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newType,
        renewal_frequency_days: newType.renewal_frequency_days
          ? parseInt(newType.renewal_frequency_days)
          : null,
      }),
    });
    const data = await response.json();
    if (data.success && data.data) {
      // Replace temp type with real one from server
      setTypes(prev => prev.map(t => (t.id === tempId ? data.data : t)));
      cacheData('compliance_types', [data.data, ...originalTypes]);
      showSuccess?.('Compliance type added successfully');
    } else {
      // Rollback on error
      setTypes(originalTypes);
      setShowAddType(true);
      showError?.(data.message || data.error || 'Failed to add compliance type');
    }
  } catch (error) {
    // Rollback on error
    setTypes(originalTypes);
    setShowAddType(true);
    logger.error('Error adding type:', error);
    showError?.('Failed to add compliance type. Please check your connection and try again.');
  }
}
