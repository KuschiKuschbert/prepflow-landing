/**
 * ShiftForm Component
 * Form for creating and editing shifts in the roster builder.
 *
 * @component
 */

'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Clock, User, Briefcase, Coffee, FileText, X } from 'lucide-react';
import type { Shift, Employee } from '../types';

interface ShiftFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (shiftData: Partial<Shift>) => Promise<void>;
  employees: Employee[];
  employeeId?: string; // Pre-select employee
  date?: Date; // Pre-select date
  shift?: Shift; // For edit mode
  loading?: boolean;
}

/**
 * ShiftForm component for creating and editing shifts.
 *
 * @param {ShiftFormProps} props - Component props
 * @returns {JSX.Element} Rendered shift form
 */
export function ShiftForm({
  isOpen,
  onClose,
  onSave,
  employees,
  employeeId: preselectedEmployeeId,
  date: preselectedDate,
  shift: editingShift,
  loading = false,
}: ShiftFormProps) {
  const [formData, setFormData] = useState({
    employee_id: preselectedEmployeeId || editingShift?.employee_id || '',
    shift_date: preselectedDate
      ? format(preselectedDate, 'yyyy-MM-dd')
      : editingShift?.shift_date || format(new Date(), 'yyyy-MM-dd'),
    start_time: editingShift ? format(new Date(editingShift.start_time), 'HH:mm') : '09:00',
    end_time: editingShift ? format(new Date(editingShift.end_time), 'HH:mm') : '17:00',
    role: editingShift?.role || '',
    break_duration_minutes: editingShift?.break_duration_minutes || 0,
    notes: editingShift?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when preselected values change
  useEffect(() => {
    if (preselectedEmployeeId && !editingShift) {
      setFormData(prev => ({ ...prev, employee_id: preselectedEmployeeId }));
    }
  }, [preselectedEmployeeId, editingShift]);

  useEffect(() => {
    if (preselectedDate && !editingShift) {
      setFormData(prev => ({ ...prev, shift_date: format(preselectedDate, 'yyyy-MM-dd') }));
    }
  }, [preselectedDate, editingShift]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.employee_id) {
      newErrors.employee_id = 'Employee is required';
    }

    if (!formData.shift_date) {
      newErrors.shift_date = 'Date is required';
    }

    if (!formData.start_time) {
      newErrors.start_time = 'Start time is required';
    }

    if (!formData.end_time) {
      newErrors.end_time = 'End time is required';
    }

    // Validate time logic
    if (formData.start_time && formData.end_time) {
      const [startHour, startMin] = formData.start_time.split(':').map(Number);
      const [endHour, endMin] = formData.end_time.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      if (endMinutes <= startMinutes) {
        newErrors.end_time = 'End time must be after start time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Convert form data to shift format
    const shiftDate = new Date(formData.shift_date);
    const [startHour, startMin] = formData.start_time.split(':').map(Number);
    const [endHour, endMin] = formData.end_time.split(':').map(Number);

    const startTime = new Date(shiftDate);
    startTime.setHours(startHour, startMin, 0, 0);

    let endTime = new Date(shiftDate);
    endTime.setHours(endHour, endMin, 0, 0);

    // Handle shifts spanning midnight
    if (endTime < startTime) {
      endTime = new Date(endTime);
      endTime.setDate(endTime.getDate() + 1);
    }

    const shiftData: Partial<Shift> = {
      employee_id: formData.employee_id,
      shift_date: formData.shift_date,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      status: editingShift?.status || 'draft',
      role: formData.role || null,
      break_duration_minutes: formData.break_duration_minutes || 0,
      notes: formData.notes || null,
    };

    await onSave(shiftData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative z-50 my-auto w-full max-w-2xl rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-fluid-xl font-bold text-white">
            {editingShift ? 'Edit Shift' : 'Add Shift'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-[#2a2a2a]"
            aria-label="Close"
          >
            <Icon icon={X} size="md" className="text-gray-400" aria-hidden={true} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Employee Selection */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
              <Icon icon={User} size="sm" aria-hidden={true} />
              Employee *
            </label>
            <select
              value={formData.employee_id}
              onChange={e => {
                setFormData(prev => ({ ...prev, employee_id: e.target.value }));
                setErrors(prev => ({ ...prev, employee_id: '' }));
              }}
              className={`w-full rounded-xl border bg-[#0a0a0a] px-4 py-3 text-white transition-colors ${
                errors.employee_id
                  ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-[#2a2a2a] focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20'
              }`}
              disabled={loading}
            >
              <option value="">Select an employee</option>
              {employees.map(employee => (
                <option key={employee.id} value={employee.id}>
                  {employee.first_name} {employee.last_name} ({employee.role})
                </option>
              ))}
            </select>
            {errors.employee_id && (
              <p className="mt-1 text-xs text-red-400">{errors.employee_id}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
              <Icon icon={Clock} size="sm" aria-hidden={true} />
              Date *
            </label>
            <input
              type="date"
              value={formData.shift_date}
              onChange={e => {
                setFormData(prev => ({ ...prev, shift_date: e.target.value }));
                setErrors(prev => ({ ...prev, shift_date: '' }));
              }}
              className={`w-full rounded-xl border bg-[#0a0a0a] px-4 py-3 text-white transition-colors ${
                errors.shift_date
                  ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-[#2a2a2a] focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20'
              }`}
              disabled={loading}
            />
            {errors.shift_date && <p className="mt-1 text-xs text-red-400">{errors.shift_date}</p>}
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
                <Icon icon={Clock} size="sm" aria-hidden={true} />
                Start Time *
              </label>
              <input
                type="time"
                value={formData.start_time}
                onChange={e => {
                  setFormData(prev => ({ ...prev, start_time: e.target.value }));
                  setErrors(prev => ({ ...prev, start_time: '', end_time: '' }));
                }}
                className={`w-full rounded-xl border bg-[#0a0a0a] px-4 py-3 text-white transition-colors ${
                  errors.start_time
                    ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : 'border-[#2a2a2a] focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20'
                }`}
                disabled={loading}
              />
              {errors.start_time && (
                <p className="mt-1 text-xs text-red-400">{errors.start_time}</p>
              )}
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
                <Icon icon={Clock} size="sm" aria-hidden={true} />
                End Time *
              </label>
              <input
                type="time"
                value={formData.end_time}
                onChange={e => {
                  setFormData(prev => ({ ...prev, end_time: e.target.value }));
                  setErrors(prev => ({ ...prev, end_time: '' }));
                }}
                className={`w-full rounded-xl border bg-[#0a0a0a] px-4 py-3 text-white transition-colors ${
                  errors.end_time
                    ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : 'border-[#2a2a2a] focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20'
                }`}
                disabled={loading}
              />
              {errors.end_time && <p className="mt-1 text-xs text-red-400">{errors.end_time}</p>}
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
              <Icon icon={Briefcase} size="sm" aria-hidden={true} />
              Role (Optional)
            </label>
            <select
              value={formData.role}
              onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
              className="w-full rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-white transition-colors focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20"
              disabled={loading}
            >
              <option value="">No specific role</option>
              <option value="chef">Chef</option>
              <option value="cook">Cook</option>
              <option value="dishhand">Dishhand</option>
              <option value="barista">Barista</option>
              <option value="server">Server</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          {/* Break Duration */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
              <Icon icon={Coffee} size="sm" aria-hidden={true} />
              Break Duration (minutes)
            </label>
            <input
              type="number"
              min="0"
              max="480"
              value={formData.break_duration_minutes}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  break_duration_minutes: parseInt(e.target.value) || 0,
                }))
              }
              className="w-full rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-white transition-colors focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20"
              disabled={loading}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
              <Icon icon={FileText} size="sm" aria-hidden={true} />
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-white transition-colors focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20"
              disabled={loading}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Saving...' : editingShift ? 'Update Shift' : 'Create Shift'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
