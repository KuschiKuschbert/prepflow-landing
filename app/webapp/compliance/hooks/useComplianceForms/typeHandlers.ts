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
}: HandleAddTypeParams): Promise<void> {
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
    if (data.success) {
      const updatedTypes = [...types, data.data];
      setTypes(updatedTypes);
      cacheData('compliance_types', updatedTypes);
      resetForm();
      setShowAddType(false);
    }
  } catch (error) {
    logger.error('Error adding type:', error);
  }
}
