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
      className="rounded-lg border border-[#2a2a2a] bg-[#0a0a0a]/80 px-2.5 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-[#2a2a2a] hover:bg-[#1f1f1f] focus:border-[#29E7CD]/50 focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
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

