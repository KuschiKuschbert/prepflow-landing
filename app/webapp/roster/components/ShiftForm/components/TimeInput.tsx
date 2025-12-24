'use client';

/**
 * Time input field component.
 */
import { FormField } from './FormField';
import { Clock } from 'lucide-react';

interface TimeInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  onClearErrors?: () => void;
}

export function TimeInput({
  label,
  value,
  onChange,
  error,
  disabled,
  onClearErrors,
}: TimeInputProps) {
  return (
    <FormField label={label} icon={Clock} error={error}>
      <input
        type="time"
        value={value}
        onChange={e => {
          onChange(e.target.value);
          onClearErrors?.();
        }}
        className={`w-full rounded-xl border bg-[var(--background)] px-4 py-3 text-[var(--foreground)] transition-colors ${
          error
            ? 'border-[var(--color-error)]/50 focus:border-[var(--color-error)] focus:ring-2 focus:ring-red-500/20'
            : 'border-[var(--border)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20'
        }`}
        disabled={disabled}
      />
    </FormField>
  );
}
