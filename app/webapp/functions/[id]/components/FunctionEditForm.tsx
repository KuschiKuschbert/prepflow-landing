'use client';

import type { AppFunction } from '@/app/api/functions/helpers/schemas';
import { Card } from '@/components/ui/Card';
import { TimeSelect } from '@/components/ui/TimeSelect';
import { useEffect, useRef } from 'react';

type CustomerOption = {
  id: string;
  first_name: string;
  last_name: string;
  company: string | null;
  address?: string | null;
};

interface FunctionEditFormProps {
  editData: Partial<AppFunction>;
  onEditChange: (data: Partial<AppFunction>) => void;
  customerOptions?: CustomerOption[];
}

const inputClasses =
  'w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition-colors';

const labelClasses = 'block text-sm font-medium text-[var(--foreground-secondary)] mb-1.5';

const FUNCTION_TYPES = [
  'Birthday',
  'Christmas Party',
  'Wedding',
  'Wake',
  'Kids Birthday',
  'Other',
] as const;

export function FunctionEditForm({
  editData,
  onEditChange,
  customerOptions = [],
}: FunctionEditFormProps) {
  const editDataRef = useRef(editData);
  editDataRef.current = editData;

  // Pre-set location from customer address when customer is assigned and location is empty
  useEffect(() => {
    const data = editDataRef.current;
    if (
      data.customer_id &&
      (!data.location || String(data.location).trim() === '') &&
      customerOptions.length > 0
    ) {
      const customer = customerOptions.find(c => c.id === data.customer_id);
      if (customer?.address?.trim()) {
        onEditChange({ ...data, location: customer.address!.trim() });
      }
    }
  }, [editData.customer_id, customerOptions, onEditChange]);

  return (
    <Card>
      <div className="space-y-4 p-6">
        <h3 className="text-base font-semibold text-[var(--foreground)]">Edit Event Details</h3>

        <div>
          <label className={labelClasses}>Event Name</label>
          <input
            type="text"
            className={inputClasses}
            value={editData.name || ''}
            onChange={e => onEditChange({ ...editData, name: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClasses}>Type</label>
          <select
            className={inputClasses}
            value={editData.type || 'Other'}
            onChange={e =>
              onEditChange({ ...editData, type: e.target.value as AppFunction['type'] })
            }
          >
            {FUNCTION_TYPES.map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {customerOptions.length > 0 && (
          <div>
            <label className={labelClasses}>Client</label>
            <select
              className={inputClasses}
              value={editData.customer_id || ''}
              onChange={e => onEditChange({ ...editData, customer_id: e.target.value || null })}
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

        <div>
          <label className={labelClasses}>Attendees (PAX)</label>
          <input
            type="number"
            min={0}
            className={inputClasses}
            value={editData.attendees || 0}
            onChange={e =>
              onEditChange({
                ...editData,
                attendees: parseInt(e.target.value) || 0,
              })
            }
          />
        </div>

        {/* Same-day toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onEditChange({ ...editData, same_day: !editData.same_day })}
            className="flex items-center justify-center transition-colors hover:text-[var(--primary)]"
          >
            {editData.same_day ? (
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
              <div className="h-5 w-5 rounded border border-[var(--border)] bg-[var(--background)]" />
            )}
          </button>
          <span className="text-sm text-[var(--foreground-secondary)]">Same day event</span>
        </div>

        {/* Date/Time editing */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Start Date</label>
            <input
              type="date"
              className={inputClasses}
              value={editData.start_date || ''}
              onChange={e => onEditChange({ ...editData, start_date: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClasses}>Start Time</label>
            <TimeSelect
              value={editData.start_time || ''}
              onChange={v => onEditChange({ ...editData, start_time: v || null })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {!editData.same_day && (
            <div>
              <label className={labelClasses}>End Date</label>
              <input
                type="date"
                className={inputClasses}
                value={editData.end_date || ''}
                min={editData.start_date || undefined}
                onChange={e => onEditChange({ ...editData, end_date: e.target.value || null })}
              />
            </div>
          )}
          <div>
            <label className={labelClasses}>End Time</label>
            <TimeSelect
              value={editData.end_time || ''}
              onChange={v => onEditChange({ ...editData, end_time: v || null })}
            />
          </div>
        </div>

        <div>
          <label className={labelClasses}>Location</label>
          <input
            type="text"
            autoComplete="street-address"
            placeholder="e.g., 123 Main St, Brisbane"
            className={inputClasses}
            value={editData.location ?? ''}
            onChange={e => {
              const v = e.target.value;
              onEditChange({ ...editData, location: v === '' ? null : v });
            }}
          />
        </div>

        <div>
          <label className={labelClasses}>Notes</label>
          <textarea
            rows={3}
            className={inputClasses + ' resize-none'}
            value={editData.notes || ''}
            onChange={e => onEditChange({ ...editData, notes: e.target.value || null })}
          />
        </div>
      </div>
    </Card>
  );
}
