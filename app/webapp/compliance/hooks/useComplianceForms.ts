/**
 * Hook for managing compliance form state and handlers.
 */

import { useState, useCallback } from 'react';
import { logger } from '@/lib/logger';
import { cacheData } from '@/lib/cache/data-cache';
import type {
  ComplianceRecord,
  ComplianceRecordFormData,
  ComplianceType,
  ComplianceTypeFormData,
} from '../types';

interface UseComplianceFormsProps {
  types: ComplianceType[];
  records: ComplianceRecord[];
  selectedType: string;
  selectedStatus: string;
  setTypes: React.Dispatch<React.SetStateAction<ComplianceType[]>>;
  setRecords: React.Dispatch<React.SetStateAction<ComplianceRecord[]>>;
  setShowAddRecord: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAddType: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useComplianceForms({
  types,
  records,
  selectedType,
  selectedStatus,
  setTypes,
  setRecords,
  setShowAddRecord,
  setShowAddType,
}: UseComplianceFormsProps) {
  const [newRecord, setNewRecord] = useState<ComplianceRecordFormData>({
    compliance_type_id: '',
    document_name: '',
    issue_date: '',
    expiry_date: '',
    document_url: '',
    photo_url: '',
    notes: '',
    reminder_enabled: true,
    reminder_days_before: 30,
  });

  const [newType, setNewType] = useState<ComplianceTypeFormData>({
    name: '',
    description: '',
    renewal_frequency_days: '',
  });

  const handleAddRecord = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
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
          setNewRecord({
            compliance_type_id: '',
            document_name: '',
            issue_date: '',
            expiry_date: '',
            document_url: '',
            photo_url: '',
            notes: '',
            reminder_enabled: true,
            reminder_days_before: 30,
          });
          setShowAddRecord(false);
        }
      } catch (error) {
        logger.error('Error adding record:', error);
      }
    },
    [newRecord, records, selectedType, selectedStatus, setRecords, setShowAddRecord],
  );

  const handleAddType = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
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
          setNewType({ name: '', description: '', renewal_frequency_days: '' });
          setShowAddType(false);
        }
      } catch (error) {
        logger.error('Error adding type:', error);
      }
    },
    [newType, types, setTypes, setShowAddType],
  );

  return {
    newRecord,
    setNewRecord,
    newType,
    setNewType,
    handleAddRecord,
    handleAddType,
  };
}
