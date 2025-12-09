/**
 * Record handlers for compliance forms
 */

import { logger } from '@/lib/logger';
import { cacheData } from '@/lib/cache/data-cache';
import type { ComplianceRecord, ComplianceRecordFormData } from '../../types';

interface HandleAddRecordParams {
  newRecord: ComplianceRecordFormData;
  records: ComplianceRecord[];
  selectedType: string;
  selectedStatus: string;
  setRecords: React.Dispatch<React.SetStateAction<ComplianceRecord[]>>;
  setShowAddRecord: React.Dispatch<React.SetStateAction<boolean>>;
  resetForm: () => void;
}

/**
 * Handle adding a new compliance record
 *
 * @param {HandleAddRecordParams} params - Add record parameters
 * @returns {Promise<void>}
 */
export async function handleAddComplianceRecord({
  newRecord,
  records,
  selectedType,
  selectedStatus,
  setRecords,
  setShowAddRecord,
  resetForm,
}: HandleAddRecordParams): Promise<void> {
  try {
    const response = await fetch('/api/compliance-records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newRecord,
        compliance_type_id: parseInt(newRecord.compliance_type_id),
        reminder_days_before: parseInt(newRecord.reminder_days_before.toString()),
      }),
    });
    const data = await response.json();
    if (data.success) {
      const updatedRecords = [data.data, ...records];
      setRecords(updatedRecords);
      if (selectedType === 'all' && selectedStatus === 'all') {
        cacheData('compliance_records', updatedRecords);
      }
      resetForm();
      setShowAddRecord(false);
    }
  } catch (error) {
    logger.error('Error adding record:', error);
  }
}
