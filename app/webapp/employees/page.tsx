'use client';

import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { logger } from '@/lib/logger';
import { useCallback, useEffect, useState } from 'react';
import { Employee, EmployeeFormData, QualificationType } from './types';
import { EmployeeList } from './components/EmployeeList';
import { EmployeeForm } from './components/EmployeeForm';
import { Users } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [qualificationTypes, setQualificationTypes] = useState<QualificationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<
    'all' | 'active' | 'inactive' | 'terminated'
  >('active');
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

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      let url = '/api/employees';
      if (selectedStatus !== 'all') {
        url += `?status=${selectedStatus}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setEmployees(data.data);
      }
    } catch (error) {
      logger.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedStatus]);

  const fetchQualificationTypes = useCallback(async () => {
    try {
      const response = await fetch('/api/qualification-types?is_active=true');
      const data = await response.json();
      if (data.success) {
        setQualificationTypes(data.data);
      }
    } catch (error) {
      logger.error('Error fetching qualification types:', error);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
    fetchQualificationTypes();
  }, [fetchEmployees, fetchQualificationTypes]);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newEmployee,
          employment_end_date: newEmployee.employment_end_date || null,
          phone: newEmployee.phone || null,
          email: newEmployee.email || null,
          emergency_contact: newEmployee.emergency_contact || null,
          notes: newEmployee.notes || null,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setEmployees([data.data, ...employees]);
        setNewEmployee({
          full_name: '',
          role: '',
          employment_start_date: new Date().toISOString().split('T')[0],
          employment_end_date: '',
          status: 'active',
          phone: '',
          email: '',
          emergency_contact: '',
          notes: '',
        });
        setShowAddForm(false);
      }
    } catch (error) {
      logger.error('Error adding employee:', error);
    }
  };

  const handleUpdateEmployee = async (employee: Employee, updates: Partial<EmployeeFormData>) => {
    try {
      const response = await fetch(`/api/employees/${employee.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updates,
          employment_end_date: updates.employment_end_date || null,
          phone: updates.phone || null,
          email: updates.email || null,
          emergency_contact: updates.emergency_contact || null,
          notes: updates.notes || null,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setEmployees(employees.map(emp => (emp.id === employee.id ? data.data : emp)));
        setEditingEmployee(null);
      }
    } catch (error) {
      logger.error('Error updating employee:', error);
    }
  };

  const handleDeleteEmployee = async (employee: Employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteEmployee = async () => {
    if (!employeeToDelete) return;
    try {
      const response = await fetch(`/api/employees/${employeeToDelete.id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setEmployees(employees.filter(emp => emp.id !== employeeToDelete.id));
      }
    } catch (error) {
      logger.error('Error deleting employee:', error);
    } finally {
      setShowDeleteConfirm(false);
      setEmployeeToDelete(null);
    }
  };

  if (loading) {
    return (
      <ResponsivePageContainer>
        <div className="tablet:py-6 min-h-screen bg-[#0a0a0a] py-4">
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 flex items-center gap-2 text-4xl font-bold text-white">
            <Icon icon={Users} size="lg" aria-hidden={true} />
            Kitchen Staff & Food Handlers
          </h1>
          <p className="text-gray-400">
            Manage your kitchen staff and food handlers, track qualifications and certifications
          </p>
        </div>

        {/* Filters and Add Button */}
        <div className="tablet:flex-row tablet:items-center mb-6 flex flex-col items-start justify-between gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Filter by Status</label>
            <select
              value={selectedStatus}
              onChange={e =>
                setSelectedStatus(e.target.value as 'all' | 'active' | 'inactive' | 'terminated')
              }
              className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingEmployee(null);
            }}
            className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
          >
            ➕ Add Employee
          </button>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingEmployee) && (
          <EmployeeForm
            employee={editingEmployee}
            formData={editingEmployee ? undefined : newEmployee}
            qualificationTypes={qualificationTypes}
            onChange={editingEmployee ? undefined : setNewEmployee}
            onSubmit={editingEmployee ? undefined : handleAddEmployee}
            onUpdate={editingEmployee ? handleUpdateEmployee : undefined}
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
          onDelete={handleDeleteEmployee}
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
          onConfirm={confirmDeleteEmployee}
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
