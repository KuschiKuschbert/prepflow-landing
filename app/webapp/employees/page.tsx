'use client';

import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { useState } from 'react';
import { EmployeeForm } from './components/EmployeeForm';
import { EmployeeList } from './components/EmployeeList';
import { EmployeesHeader } from './components/EmployeesHeader';
import { useEmployees } from './hooks/useEmployees';
import { Employee, EmployeeFormData } from './types';

export default function EmployeesPage() {
  const {
    employees,
    qualificationTypes,
    loading,
    selectedStatus,
    setSelectedStatus,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  } = useEmployees();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [newEmployee, setNewEmployee] = useState<EmployeeFormData>({
    employee_id: '',
    full_name: '',
    role: '',
    employment_start_date: new Date().toISOString().split('T')[0],
    employment_end_date: '',
    status: 'active',
    phone: '',
    email: '',
    emergency_contact: '',
    photo_url: '',
    notes: '',
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await addEmployee(newEmployee);
    if (result.success) {
      setNewEmployee({
        employee_id: '',
        full_name: '',
        role: '',
        employment_start_date: new Date().toISOString().split('T')[0],
        employment_end_date: '',
        status: 'active',
        phone: '',
        email: '',
        emergency_contact: '',
        photo_url: '',
        notes: '',
      });
      setShowAddForm(false);
    }
  };

  const handleUpdateSubmit = async (employee: Employee, updates: Partial<EmployeeFormData>) => {
    const result = await updateEmployee(employee, updates);
    if (result.success) {
      setEditingEmployee(null);
    }
  };

  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;
    const result = await deleteEmployee(employeeToDelete);
    if (result.success) {
      setShowDeleteConfirm(false);
      setEmployeeToDelete(null);
    }
  };

  if (loading) {
    return (
      <ResponsivePageContainer>
        <div className="tablet:py-6 min-h-screen bg-[var(--background)] py-4">
          <LoadingSkeleton variant="stats" height="64px" />
          <div className="adaptive-grid mt-8">
            <LoadingSkeleton variant="card" count={4} height="120px" />
          </div>
        </div>
      </ResponsivePageContainer>
    );
  }

  return (
    <ResponsivePageContainer>
      <div className="tablet:py-6 min-h-screen bg-transparent py-4">
        <EmployeesHeader
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          onAddEmployee={() => {
            setShowAddForm(true);
            setEditingEmployee(null);
          }}
        />

        {/* Add/Edit Form */}
        {(showAddForm || editingEmployee) && (
          <EmployeeForm
            employee={editingEmployee}
            formData={editingEmployee ? undefined : newEmployee}
            qualificationTypes={qualificationTypes}
            onChange={editingEmployee ? undefined : setNewEmployee}
            onSubmit={editingEmployee ? undefined : handleAddSubmit}
            onUpdate={editingEmployee ? handleUpdateSubmit : undefined}
            onCancel={() => {
              setShowAddForm(false);
              setEditingEmployee(null);
            }}
          />
        )}

        {/* Employee List */}
        <EmployeeList
          employees={employees}
          qualificationTypes={qualificationTypes}
          onEdit={setEditingEmployee}
          onDelete={handleDeleteClick}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title="Deactivate Employee"
          message={
            employeeToDelete
              ? `Are you sure you want to deactivate ${employeeToDelete.full_name}? This will mark them as terminated.`
              : ''
          }
          confirmLabel="Deactivate"
          cancelLabel="Cancel"
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setEmployeeToDelete(null);
          }}
          variant="warning"
        />
      </div>
    </ResponsivePageContainer>
  );
}
