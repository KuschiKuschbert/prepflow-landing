'use client';

import React from 'react';
import { EmployeeFormData } from '../types';

interface EmployeeFormFieldsProps {
  formData: EmployeeFormData;
  onChange: (field: keyof EmployeeFormData, value: any) => void;
}

/**
 * Employee form fields component.
 *
 * @component
 * @param {Object} props - Component props
 * @param {EmployeeFormData} props.formData - Form data
 * @param {Function} props.onChange - Field change handler
 * @returns {JSX.Element} Rendered form fields
 */
export function EmployeeFormFields({ formData, onChange }: EmployeeFormFieldsProps) {
  return (
    <>
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
          Employee ID
        </label>
        <input
          type="text"
          value={formData.employee_id}
          onChange={e => onChange('employee_id', e.target.value)}
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
          placeholder="e.g., EMP001, STAFF-2024-001"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
          Full Name <span className="text-[var(--color-error)]">*</span>
        </label>
        <input
          type="text"
          value={formData.full_name}
          onChange={e => onChange('full_name', e.target.value)}
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
          Role/Position
        </label>
        <input
          type="text"
          value={formData.role}
          onChange={e => onChange('role', e.target.value)}
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
          placeholder="e.g., Head Chef, Line Cook, Food Handler"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
          Employment Start Date <span className="text-[var(--color-error)]">*</span>
        </label>
        <input
          type="date"
          value={formData.employment_start_date}
          onChange={e => onChange('employment_start_date', e.target.value)}
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
          Employment End Date
        </label>
        <input
          type="date"
          value={formData.employment_end_date}
          onChange={e => onChange('employment_end_date', e.target.value)}
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
          Status
        </label>
        <select
          value={formData.status}
          onChange={e => onChange('status', e.target.value as 'active' | 'inactive' | 'terminated')}
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="terminated">Terminated</option>
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
          Phone
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={e => onChange('phone', e.target.value)}
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={e => onChange('email', e.target.value)}
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
          Emergency Contact
        </label>
        <input
          type="text"
          value={formData.emergency_contact}
          onChange={e => onChange('emergency_contact', e.target.value)}
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
          placeholder="Name and phone number"
        />
      </div>
      <div className="desktop:col-span-2">
        <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={e => onChange('notes', e.target.value)}
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
          rows={3}
          placeholder="Additional notes about this employee"
        />
      </div>
    </>
  );
}
