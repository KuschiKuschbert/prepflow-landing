/**
 * Task Name input field component
 */

import { Icon } from '@/components/ui/Icon';
import { Info } from 'lucide-react';

interface TaskNameFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: (value: string) => void;
  error?: string;
  inputRef: React.RefObject<HTMLInputElement>;
}

export function TaskNameField({ value, onChange, onBlur, error, inputRef }: TaskNameFieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-gray-300">
        Task Name <span className="text-red-400">*</span>
      </label>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={e => onBlur(e.target.value)}
        className={`w-full rounded-2xl border ${
          error ? 'border-red-500/50' : 'border-[#2a2a2a]'
        } bg-[#2a2a2a] px-4 py-2.5 text-white placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]`}
        placeholder="e.g., Clean kitchen floor"
        required
      />
      {error && (
        <p className="mt-1 text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
      {value && !error && (
        <p className="mt-1 text-xs text-gray-500">
          Great! This task will be added to your cleaning grid.
        </p>
      )}
    </div>
  );
}
