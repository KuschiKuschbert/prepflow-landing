'use client';

import React, { useState, useEffect } from 'react';
import { Employee, EmployeeFormData, QualificationType } from '../types';
import { Award } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { EmployeePhotoUpload } from './EmployeePhotoUpload';
import { EmployeeFormFields } from './EmployeeFormFields';
import { useEmployeePhoto } from './hooks/useEmployeePhoto';

interface EmployeeFormProps {
  employee?: Employee | null;
  formData?: EmployeeFormData;
  qualificationTypes: QualificationType[];
  onChange?: (data: EmployeeFormData) => void;
  onSubmit?: (e: React.FormEvent) => void;
  onUpdate?: (employee: Employee, updates: Partial<EmployeeFormData>) => void;
  onCancel: () => void;
}

export function EmployeeForm({
  employee,
  formData: externalFormData,
  qualificationTypes,
  onChange,
  onSubmit,
  onUpdate,
  onCancel,
}: EmployeeFormProps) {
  const [formData, setFormData] = useState<EmployeeFormData>(
    employee
      ? {
          employee_id: employee.employee_id || '',
          full_name: employee.full_name,
          role: employee.role || '',
          employment_start_date: employee.employment_start_date,
          employment_end_date: employee.employment_end_date || '',
          status: employee.status,
          phone: employee.phone || '',
          email: employee.email || '',
          emergency_contact: employee.emergency_contact || '',
          photo_url: employee.photo_url || '',
          notes: employee.notes || '',
        }
      : externalFormData || {
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
        },
  );

  useEffect(() => {
    if (externalFormData) {
      setFormData(externalFormData);
    }
  }, [externalFormData]);

  const handleChange = (field: keyof EmployeeFormData, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    if (onChange) {
      onChange(updated);
    }
  };

  const { photoPreview, photoUploading, photoError, handlePhotoChange, handleRemovePhoto } =
    useEmployeePhoto({
      employeePhotoUrl: employee?.photo_url,
      employeeId: employee?.id,
      onPhotoUrlChange: (url: string) => handleChange('photo_url', url),
    });

  const handleViewCertificates = () => {
    // Scroll to qualifications section in the employee card
    // This will be handled by the parent component
    if (employee) {
      const element = document.getElementById(`employee-${employee.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (employee && onUpdate) {
      onUpdate(employee, formData);
    } else if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <div className="mb-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[var(--foreground)]">
          {employee ? 'Edit Employee' : 'Add New Employee'}
        </h3>
      </div>
      <form onSubmit={handleSubmit} className="desktop:grid-cols-2 grid grid-cols-1 gap-4">
        {/* Employee ID */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">Employee ID</label>
          <input
            type="text"
            value={formData.employee_id}
            onChange={e => handleChange('employee_id', e.target.value)}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="e.g., EMP001, STAFF-2024-001"
          />
        </div>

        {/* Photo Upload */}
        <EmployeePhotoUpload
          photoPreview={photoPreview}
          photoUploading={photoUploading}
          photoError={photoError}
          onPhotoChange={handlePhotoChange}
          onRemovePhoto={handleRemovePhoto}
        />

        {/* Form Fields */}
        <EmployeeFormFields formData={formData} onChange={handleChange} />

        {/* Certificates & Qualifications Button (only when editing) */}
        {employee && employee.employee_qualifications && (
          <div className="desktop:col-span-2">
            <button
              type="button"
              onClick={handleViewCertificates}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-6 py-3 font-medium text-[var(--primary)] transition-all duration-200 hover:bg-[var(--primary)]/20 hover:shadow-lg"
            >
              <Icon icon={Award} size="md" aria-hidden={true} />
              View Certificates & Qualifications ({employee.employee_qualifications.length})
            </button>
          </div>
        )}

        <div className="desktop:col-span-2 flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-6 py-3 font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]/80"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-xl"
          >
            {employee ? 'Update Employee' : 'Add Employee'}
          </button>
        </div>
      </form>
    </div>
  );
}
