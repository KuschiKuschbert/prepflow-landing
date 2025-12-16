/**
 * Task Name input field component
 */

interface TaskNameFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: (value: string) => void;
  error?: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export function TaskNameField({ value, onChange, onBlur, error, inputRef }: TaskNameFieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-[var(--foreground-secondary)]">
        Task Name <span className="text-[var(--color-error)]">*</span>
      </label>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={e => onBlur(e.target.value)}
        className={`w-full rounded-2xl border ${
          error ? 'border-[var(--color-error)]/50' : 'border-[var(--border)]'
        } bg-[var(--muted)] px-4 py-2.5 text-[var(--foreground)] placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]`}
        placeholder="e.g., Clean kitchen floor"
        required
      />
      {error && (
        <p className="mt-1 text-xs text-[var(--color-error)]" role="alert">
          {error}
        </p>
      )}
      {value && !error && (
        <p className="mt-1 text-xs text-[var(--foreground-subtle)]">
          Great! This task will be added to your cleaning grid.
        </p>
      )}
    </div>
  );
}
