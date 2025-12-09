/**
 * Hook for managing compliance form state and handlers.
 */

import { useState, useCallback } from 'react';
import type {
  ComplianceRecord,
  ComplianceRecordFormData,
  ComplianceType,
  ComplianceTypeFormData,
} from '../types';
import { handleAddComplianceRecord } from './useComplianceForms/recordHandlers';
import { handleAddComplianceType } from './useComplianceForms/typeHandlers';

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

const DEFAULT_RECORD_FORM: ComplianceRecordFormData = {
  compliance_type_id: '',
  document_name: '',
  issue_date: '',
  expiry_date: '',
  document_url: '',
  photo_url: '',
  notes: '',
  reminder_enabled: true,
  reminder_days_before: 30,
};
const DEFAULT_TYPE_FORM: ComplianceTypeFormData = {
  name: '',
  description: '',
  renewal_frequency_days: '',
};

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
  const [newRecord, setNewRecord] = useState<ComplianceRecordFormData>(DEFAULT_RECORD_FORM);
  const [newType, setNewType] = useState<ComplianceTypeFormData>(DEFAULT_TYPE_FORM);

  const resetRecordForm = useCallback(() => setNewRecord(DEFAULT_RECORD_FORM), []);
  const resetTypeForm = useCallback(() => setNewType(DEFAULT_TYPE_FORM), []);

  const handleAddRecord = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await handleAddComplianceRecord({
        newRecord,
        records,
        selectedType,
        selectedStatus,
        setRecords,
        setShowAddRecord,
        resetForm: resetRecordForm,
      });
    },
    [
      newRecord,
      records,
      selectedType,
      selectedStatus,
      setRecords,
      setShowAddRecord,
      resetRecordForm,
    ],
  );
  const handleAddType = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await handleAddComplianceType({
        newType,
        types,
        setTypes,
        setShowAddType,
        resetForm: resetTypeForm,
      });
    },
    [newType, types, setTypes, setShowAddType, resetTypeForm],
  );
  return { newRecord, setNewRecord, newType, setNewType, handleAddRecord, handleAddType };
}
