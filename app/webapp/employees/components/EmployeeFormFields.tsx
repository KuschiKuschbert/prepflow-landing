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
        <label className="mb-2 block text-sm font-medium text-gray-300">Employee ID</label>
        <input
          type="text"
          value={formData.employee_id}
          onChange={e => onChange('employee_id', e.target.value)}
          className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
          placeholder="e.g., EMP001, STAFF-2024-001"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Full Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={formData.full_name}
          onChange={e => onChange('full_name', e.target.value)}
          className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">Role/Position</label>
        <input
          type="text"
          value={formData.role}
          onChange={e => onChange('role', e.target.value)}
          className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
          placeholder="e.g., Head Chef, Line Cook, Food Handler"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Employment Start Date <span className="text-red-400">*</span>
        </label>
        <input
          type="date"
          value={formData.employment_start_date}
          onChange={e => onChange('employment_start_date', e.target.value)}
          className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Employment End Date
        </label>
        <input
          type="date"
          value={formData.employment_end_date}
          onChange={e => onChange('employment_end_date', e.target.value)}
          className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">Status</label>
        <select
          value={formData.status}
          onChange={e => onChange('status', e.target.value as 'active' | 'inactive' | 'terminated')}
          className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="terminated">Terminated</option>
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">Phone</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={e => onChange('phone', e.target.value)}
          className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={e => onChange('email', e.target.value)}
          className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">Emergency Contact</label>
        <input
          type="text"
          value={formData.emergency_contact}
          onChange={e => onChange('emergency_contact', e.target.value)}
          className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
          placeholder="Name and phone number"
        />
      </div>
      <div className="desktop:col-span-2">
        <label className="mb-2 block text-sm font-medium text-gray-300">Notes</label>
        <textarea
          value={formData.notes}
          onChange={e => onChange('notes', e.target.value)}
          className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
          rows={3}
          placeholder="Additional notes about this employee"
        />
      </div>
    </>
  );
}
