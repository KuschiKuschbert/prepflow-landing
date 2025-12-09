/**
 * Hook for equipment maintenance form state
 */

import { useState } from 'react';
import type { EquipmentMaintenanceFormData } from '../../components/EquipmentMaintenanceForm';

const DEFAULT_FORM: EquipmentMaintenanceFormData = {
  equipment_name: '',
  equipment_type: '',
  maintenance_date: new Date().toISOString().split('T')[0],
  maintenance_type: '',
  service_provider: '',
  description: '',
  cost: '',
  next_maintenance_date: '',
  is_critical: false,
  performed_by: '',
  notes: '',
  photo_url: '',
};

/**
 * Hook for equipment maintenance form state
 *
 * @returns {Object} Form state and reset function
 */
export function useEquipmentForm() {
  const [newEquipment, setNewEquipment] = useState<EquipmentMaintenanceFormData>(DEFAULT_FORM);

  const resetForm = () => setNewEquipment(DEFAULT_FORM);

  return { newEquipment, setNewEquipment, resetForm };
}
