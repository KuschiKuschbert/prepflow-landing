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

export function TimeInput({ label, value, onChange, error, disabled, onClearErrors }: TimeInputProps) {
  return (
    <FormField label={label} icon={Clock} error={error}>
      <input
        type="time"
        value={value}
        onChange={e => {
          onChange(e.target.value);
          onClearErrors?.();
        }}
        className={`w-full rounded-xl border bg-[#0a0a0a] px-4 py-3 text-white transition-colors ${
          error
            ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
            : 'border-[#2a2a2a] focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20'
        }`}
        disabled={disabled}
      />
    </FormField>
  );
}
