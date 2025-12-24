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
  showSuccess?: (message: string) => void;
  showError?: (message: string) => void;
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
  showSuccess,
  showError,
}: HandleAddRecordParams): Promise<void> {
  // Store original state for rollback
  const originalRecords = [...records];

  // Create temporary record for optimistic update
  const tempId = -Date.now(); // Negative number for temp ID
  const tempRecord: ComplianceRecord = {
    id: tempId,
    compliance_type_id: parseInt(newRecord.compliance_type_id),
    document_name: newRecord.document_name,
    issue_date: newRecord.issue_date || null,
    expiry_date: newRecord.expiry_date || null,
    status: selectedStatus as 'active' | 'expired' | 'pending_renewal',
    document_url: newRecord.document_url || null,
    photo_url: newRecord.photo_url || null,
    notes: newRecord.notes || null,
    reminder_enabled: newRecord.reminder_enabled,
    reminder_days_before: parseInt(newRecord.reminder_days_before.toString()),
    compliance_types: {
      id: parseInt(newRecord.compliance_type_id),
      name: '',
      description: '',
      renewal_frequency_days: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Optimistically add to UI immediately
  const updatedRecords = [tempRecord, ...records];
  setRecords(updatedRecords);
  resetForm();
  setShowAddRecord(false);

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
    if (data.success && data.data) {
      // Replace temp record with real one from server
      setRecords(prev => prev.map(r => (r.id === tempId ? data.data : r)));
      if (selectedType === 'all' && selectedStatus === 'all') {
        cacheData('compliance_records', [data.data, ...originalRecords]);
      }
      showSuccess?.('Compliance record added successfully');
    } else {
      // Rollback on error
      setRecords(originalRecords);
      setShowAddRecord(true);
      showError?.(data.message || data.error || 'Failed to add compliance record');
    }
  } catch (error) {
    // Rollback on error
    setRecords(originalRecords);
    setShowAddRecord(true);
    logger.error('Error adding record:', error);
    showError?.('Failed to add compliance record. Please check your connection and try again.');
  }
}
