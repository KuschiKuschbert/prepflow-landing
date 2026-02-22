'use client';

import { Button } from '@/components/ui/Button';
import { useState } from 'react';

interface CreateCustomerFormProps {
  initialData?: CreateCustomerData;
  submitLabel?: string;
  onSubmit: (data: CreateCustomerData) => Promise<void>;
  onCancel: () => void;
}

export interface CreateCustomerData {
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  address: string | null;
  notes: string | null;
}

const inputClasses =
  'w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition-colors';

const labelClasses = 'block text-sm font-medium text-[var(--foreground-secondary)] mb-1.5';

export function CreateCustomerForm({
  initialData,
  submitLabel = 'Add Customer',
  onSubmit,
  onCancel,
}: CreateCustomerFormProps) {
  const [formData, setFormData] = useState<CreateCustomerData>(
    initialData ?? {
      first_name: '',
      last_name: '',
      email: null,
      phone: null,
      company: null,
      address: null,
      notes: null,
    },
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.first_name || !formData.last_name) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create customer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error message */}
      {error && (
        <div className="rounded-xl border border-[var(--color-error)]/30 bg-[var(--color-error)]/10 p-3 text-sm text-[var(--color-error)]">
          {error}
        </div>
      )}
      {/* Name — 2 columns */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>
            First Name <span className="text-[var(--color-error)]">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Sarah"
            className={inputClasses}
            value={formData.first_name}
            onChange={e => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className={labelClasses}>
            Last Name <span className="text-[var(--color-error)]">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Mitchell"
            className={inputClasses}
            value={formData.last_name}
            onChange={e => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
            required
          />
        </div>
      </div>

      {/* Email & Phone — 2 columns */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Email</label>
          <input
            type="email"
            placeholder="email@example.com"
            className={inputClasses}
            value={formData.email || ''}
            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value || null }))}
          />
        </div>
        <div>
          <label className={labelClasses}>Phone</label>
          <input
            type="tel"
            placeholder="+61 400 000 000"
            className={inputClasses}
            value={formData.phone || ''}
            onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value || null }))}
          />
        </div>
      </div>

      {/* Company */}
      <div>
        <label className={labelClasses}>Company</label>
        <input
          type="text"
          placeholder="e.g., Grand Hotel"
          className={inputClasses}
          value={formData.company || ''}
          onChange={e => setFormData(prev => ({ ...prev, company: e.target.value || null }))}
        />
      </div>

      {/* Address */}
      <div>
        <label className={labelClasses}>Address</label>
        <input
          type="text"
          autoComplete="street-address"
          placeholder="e.g., 123 Main St, Brisbane"
          className={inputClasses}
          value={formData.address ?? ''}
          onChange={e => {
            const v = e.target.value;
            setFormData(prev => ({ ...prev, address: v === '' ? null : v }));
          }}
        />
      </div>

      {/* Notes */}
      <div>
        <label className={labelClasses}>Notes</label>
        <textarea
          rows={3}
          placeholder="Dietary preferences, special requirements, etc."
          className={inputClasses + ' resize-none'}
          value={formData.notes || ''}
          onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value || null }))}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-[var(--border)] pt-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          loading={isSubmitting}
          disabled={!formData.first_name || !formData.last_name}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
