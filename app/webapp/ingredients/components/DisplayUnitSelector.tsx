'use client';

interface DisplayUnitSelectorProps {
  displayUnit: string;
  onDisplayUnitChange: (unit: string) => void;
}

export function DisplayUnitSelector({
  displayUnit,
  onDisplayUnitChange,
}: DisplayUnitSelectorProps) {
  return (
    <select
      value={displayUnit}
      onChange={e => onDisplayUnitChange(e.target.value)}
      className="rounded-lg border border-[var(--border)] bg-[var(--background)]/80 px-2.5 py-2 text-sm font-medium text-[var(--foreground-secondary)] transition-all duration-200 hover:border-[var(--border)] hover:bg-[var(--surface)] focus:border-[var(--primary)]/50 focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-none"
      title="Display unit"
    >
      <optgroup label="Weight">
        <option value="g">g</option>
        <option value="kg">kg</option>
        <option value="oz">oz</option>
        <option value="lb">lb</option>
      </optgroup>
      <optgroup label="Volume">
        <option value="ml">ml</option>
        <option value="l">L</option>
      </optgroup>
    </select>
  );
}
