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
import { logger } from '@/lib/logger';
import { Clock, User, Briefcase, Coffee, FileText, X } from 'lucide-react';
import type { Shift, Employee } from '@/lib/types/roster';
import { buildShiftDataFromForm } from './ShiftForm/helpers/buildShiftData';
import { validateShiftForm } from './ShiftForm/helpers/validateForm';
import { FormField } from './ShiftForm/components/FormField';
import { TimeInput } from './ShiftForm/components/TimeInput';

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
    const newErrors = validateShiftForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await onSave(buildShiftDataFromForm(formData, editingShift));
    } catch (error) {
      logger.error('[ShiftForm] Error saving shift:', {
        error: error instanceof Error ? error.message : String(error),
        editingShift: editingShift?.id,
      });
      // Optionally show a toast or alert to the user
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative z-50 my-auto w-full max-w-2xl rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-fluid-xl font-bold text-[var(--foreground)]">
            {editingShift ? 'Edit Shift' : 'Add Shift'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-[var(--muted)]"
            aria-label="Close"
          >
            <Icon
              icon={X}
              size="md"
              className="text-[var(--foreground-muted)]"
              aria-hidden={true}
            />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Employee Selection */}
          <FormField label="Employee *" icon={User} error={errors.employee_id}>
            <select
              value={formData.employee_id}
              onChange={e => {
                setFormData(prev => ({ ...prev, employee_id: e.target.value }));
                setErrors(prev => ({ ...prev, employee_id: '' }));
              }}
              className={`w-full rounded-xl border bg-[var(--background)] px-4 py-3 text-[var(--foreground)] transition-colors ${
                errors.employee_id
                  ? 'border-[var(--color-error)]/50 focus:border-[var(--color-error)] focus:ring-2 focus:ring-red-500/20'
                  : 'border-[var(--border)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20'
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
          </FormField>

          {/* Date */}
          <FormField label="Date *" icon={Clock} error={errors.shift_date}>
            <input
              type="date"
              value={formData.shift_date}
              onChange={e => {
                setFormData(prev => ({ ...prev, shift_date: e.target.value }));
                setErrors(prev => ({ ...prev, shift_date: '' }));
              }}
              className={`w-full rounded-xl border bg-[var(--background)] px-4 py-3 text-[var(--foreground)] transition-colors ${
                errors.shift_date
                  ? 'border-[var(--color-error)]/50 focus:border-[var(--color-error)] focus:ring-2 focus:ring-red-500/20'
                  : 'border-[var(--border)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20'
              }`}
              disabled={loading}
            />
          </FormField>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <TimeInput
              label="Start Time *"
              value={formData.start_time}
              onChange={value => {
                setFormData(prev => ({ ...prev, start_time: value }));
                setErrors(prev => ({ ...prev, start_time: '', end_time: '' }));
              }}
              error={errors.start_time}
              disabled={loading}
            />
            <TimeInput
              label="End Time *"
              value={formData.end_time}
              onChange={value => {
                setFormData(prev => ({ ...prev, end_time: value }));
                setErrors(prev => ({ ...prev, end_time: '' }));
              }}
              error={errors.end_time}
              disabled={loading}
            />
          </div>

          {/* Role */}
          <FormField label="Role (Optional)" icon={Briefcase}>
            <select
              value={formData.role}
              onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] transition-colors focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
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
          </FormField>

          {/* Break Duration */}
          <FormField label="Break Duration (minutes)" icon={Coffee}>
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
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] transition-colors focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
              disabled={loading}
            />
          </FormField>

          {/* Notes */}
          <FormField label="Notes (Optional)" icon={FileText}>
            <textarea
              value={formData.notes}
              onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] transition-colors focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
              disabled={loading}
            />
          </FormField>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Saving...' : editingShift ? 'Update Shift' : 'Create Shift'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
