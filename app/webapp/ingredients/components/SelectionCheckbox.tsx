'use client';

interface SelectionCheckboxProps {
  isSelected: boolean;
  onToggle: () => void;
  ariaLabel: string;
}

/** A simple toggle checkbox component for selection state */
export function SelectionCheckbox({ isSelected, onToggle, ariaLabel }: SelectionCheckboxProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-center transition-colors hover:text-[var(--primary)]"
      aria-label={ariaLabel}
    >
      {isSelected ? (
        <svg
          className="h-4 w-4 text-[var(--primary)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <div className="h-4 w-4 rounded border border-[var(--border)] bg-[var(--background)] transition-colors hover:border-[var(--primary)]/50" />
      )}
    </button>
  );
}
