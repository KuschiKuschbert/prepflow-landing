'use client';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CreateFunctionFormProps {
  onSubmit: (data: CreateFunctionData) => Promise<void>;
  onCancel: () => void;
  customerOptions?: Array<{
    id: string;
    first_name: string;
    last_name: string;
    company: string | null;
    address?: string | null;
  }>;
}

export interface CreateFunctionData {
  name: string;
  type: 'Birthday' | 'Christmas Party' | 'Wedding' | 'Wake' | 'Kids Birthday' | 'Other';
  start_date: string;
  start_time: string | null;
  end_date: string | null;
  end_time: string | null;
  same_day: boolean;
  attendees: number;
  customer_id: string | null;
  location: string | null;
  notes: string | null;
}

const EVENT_TYPES = [
  { value: 'Birthday', label: 'Birthday' },
  { value: 'Christmas Party', label: 'Christmas Party' },
  { value: 'Wedding', label: 'Wedding' },
  { value: 'Wake', label: 'Wake' },
  { value: 'Kids Birthday', label: 'Kids Birthday' },
  { value: 'Other', label: 'Other' },
] as const;

const inputClasses =
  'w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition-colors';

const labelClasses = 'block text-sm font-medium text-[var(--foreground-secondary)] mb-1.5';

export function CreateFunctionForm({
  onSubmit,
  onCancel,
  customerOptions = [],
}: CreateFunctionFormProps) {
  const [formData, setFormData] = useState<CreateFunctionData>({
    name: '',
    type: 'Wedding',
    start_date: '',
    start_time: '10:00',
    end_date: null,
    end_time: '22:00',
    same_day: true,
    attendees: 50,
    customer_id: null,
    location: null,
    notes: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-set location from customer address when customer is assigned and location is empty
  useEffect(() => {
    if (
      formData.customer_id &&
      (!formData.location || String(formData.location).trim() === '') &&
      customerOptions.length > 0
    ) {
      const customer = customerOptions.find(c => c.id === formData.customer_id);
      if (customer?.address?.trim()) {
        setFormData(prev => ({ ...prev, location: customer.address!.trim() }));
      }
    }
  }, [formData.customer_id, customerOptions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.start_date) return;

    const submitData = { ...formData };
    if (submitData.same_day) {
      submitData.end_date = submitData.start_date;
    }
    if (submitData.location) {
      submitData.location = submitData.location.trim() || null;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(submitData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create function. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSameDayToggle = () => {
    setFormData(prev => ({
      ...prev,
      same_day: !prev.same_day,
      end_date: !prev.same_day ? null : prev.end_date,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-[var(--color-error)]/30 bg-[var(--color-error)]/10 p-3 text-sm text-[var(--color-error)]">
          {error}
        </div>
      )}

      {/* Event Name */}
      <div>
        <label className={labelClasses}>
          Event Name <span className="text-[var(--color-error)]">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g., Smith Wedding Reception"
          className={inputClasses}
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      {/* Event Type */}
      <div>
        <label className={labelClasses}>
          Event Type <span className="text-[var(--color-error)]">*</span>
        </label>
        <select
          className={inputClasses}
          value={formData.type}
          onChange={e =>
            setFormData(prev => ({
              ...prev,
              type: e.target.value as CreateFunctionData['type'],
            }))
          }
        >
          {EVENT_TYPES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Same Day Checkbox */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSameDayToggle}
          className="flex items-center justify-center transition-colors hover:text-[var(--primary)]"
          aria-label={`${formData.same_day ? 'Uncheck' : 'Check'} same day event`}
        >
          {formData.same_day ? (
            <svg
              className="h-5 w-5 text-[var(--primary)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <div className="h-5 w-5 rounded border border-[var(--border)] bg-[var(--background)] transition-colors hover:border-[var(--primary)]/50" />
          )}
        </button>
        <span className="text-sm text-[var(--foreground-secondary)]">Same day event</span>
      </div>

      {/* Date & Time Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>
            Start Date <span className="text-[var(--color-error)]">*</span>
          </label>
          <input
            type="date"
            className={inputClasses}
            value={formData.start_date}
            onChange={e => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className={labelClasses}>Start Time</label>
          <input
            type="time"
            className={inputClasses}
            value={formData.start_time || ''}
            onChange={e => setFormData(prev => ({ ...prev, start_time: e.target.value || null }))}
          />
        </div>
      </div>

      {/* End Date & Time (conditional on same_day) */}
      <div className="grid grid-cols-2 gap-4">
        {!formData.same_day && (
          <div>
            <label className={labelClasses}>
              End Date <span className="text-[var(--color-error)]">*</span>
            </label>
            <input
              type="date"
              className={inputClasses}
              value={formData.end_date || ''}
              min={formData.start_date || undefined}
              onChange={e => setFormData(prev => ({ ...prev, end_date: e.target.value || null }))}
              required={!formData.same_day}
            />
          </div>
        )}
        <div className={formData.same_day ? 'col-span-2 max-w-[calc(50%-0.5rem)]' : ''}>
          <label className={labelClasses}>End Time</label>
          <input
            type="time"
            className={inputClasses}
            value={formData.end_time || ''}
            onChange={e => setFormData(prev => ({ ...prev, end_time: e.target.value || null }))}
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className={labelClasses}>Location</label>
        <input
          type="text"
          autoComplete="street-address"
          placeholder="e.g., 123 Main St, Brisbane"
          className={inputClasses}
          value={formData.location ?? ''}
          onChange={e => {
            const v = e.target.value;
            setFormData(prev => ({ ...prev, location: v === '' ? null : v }));
          }}
        />
      </div>

      {/* Attendees */}
      <div>
        <label className={labelClasses}>Attendees (PAX)</label>
        <input
          type="number"
          min={0}
          className={inputClasses}
          value={formData.attendees}
          onChange={e =>
            setFormData(prev => ({
              ...prev,
              attendees: Math.max(0, parseInt(e.target.value) || 0),
            }))
          }
        />
      </div>

      {/* Client / Customer */}
      {customerOptions.length > 0 && (
        <div>
          <label className={labelClasses}>Client</label>
          <select
            className={inputClasses}
            value={formData.customer_id || ''}
            onChange={e => setFormData(prev => ({ ...prev, customer_id: e.target.value || null }))}
          >
            <option value="">No client assigned</option>
            {customerOptions.map(c => (
              <option key={c.id} value={c.id}>
                {c.first_name} {c.last_name}
                {c.company ? ` (${c.company})` : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Notes */}
      <div>
        <label className={labelClasses}>Notes</label>
        <textarea
          rows={3}
          placeholder="Add any special requirements or notes for this event"
          className={inputClasses + ' resize-none'}
          value={formData.notes || ''}
          onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value || null }))}
        />
      </div>

      {/* Info box */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--primary)]/5 p-4">
        <div className="flex items-start gap-3">
          <Icon
            icon={Calendar}
            size="md"
            className="mt-0.5 flex-shrink-0 text-[var(--primary)]"
            aria-hidden
          />
          <div>
            <p className="text-sm font-medium text-[var(--foreground)]">What happens next?</p>
            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
              Your event will be created and you can build out a detailed runsheet with times,
              activities, and meal services. You can link function menus to meal entries directly.
            </p>
          </div>
        </div>
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
          disabled={!formData.name || !formData.start_date}
        >
          Create Event
        </Button>
      </div>
    </form>
  );
}
