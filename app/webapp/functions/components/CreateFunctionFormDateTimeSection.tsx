'use client';

import type { CreateFunctionData } from './CreateFunctionForm';

const inputClasses =
  'w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)] focus:outline-none transition-colors';

const labelClasses = 'block text-sm font-medium text-[var(--foreground-secondary)] mb-1.5';

interface CreateFunctionFormDateTimeSectionProps {
  formData: CreateFunctionData;
  setFormData: React.Dispatch<React.SetStateAction<CreateFunctionData>>;
  handleSameDayToggle: () => void;
}

export function CreateFunctionFormDateTimeSection({
  formData,
  setFormData,
  handleSameDayToggle,
}: CreateFunctionFormDateTimeSectionProps) {
  return (
    <>
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
    </>
  );
}
