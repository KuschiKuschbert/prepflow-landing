'use client';

import { useStaffActions } from './useStaffActions';
import { useStaffData } from './useStaffData';

export function useStaff() {
  const {
    staff,
    setStaff,
    qualificationTypes,
    loading,
    selectedStatus,
    setSelectedStatus,
    fetchStaff,
  } = useStaffData();

  const { addStaffMember, updateStaffMember, deleteStaffMember } = useStaffActions({
    staff,
    setStaff,
  });

  return {
    staff,
    qualificationTypes,
    loading,
    selectedStatus,
    setSelectedStatus,
    addStaffMember,
    updateStaffMember,
    deleteStaffMember,
    refreshStaff: fetchStaff,
  };
}
