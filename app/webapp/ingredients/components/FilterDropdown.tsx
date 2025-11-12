'use client';

interface FilterDropdownProps {
  label: string;
  icon: string;
  value: string;
  options: string[];
  isOpen: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
  activeColor: string;
  activeBg: string;
}

export function FilterDropdown({
  label,
  icon,
  value,
  options,
  isOpen,
  onToggle,
  onChange,
  activeColor,
  activeBg,
}: FilterDropdownProps) {
  return (
    <div className="relative w-full sm:w-auto">
      <button
        onClick={onToggle}
        className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 sm:w-auto ${
          value
            ? `${activeColor} ${activeBg}`
            : 'border-[#2a2a2a] bg-[#0a0a0a]/80 text-gray-300 hover:border-[#2a2a2a] hover:bg-[#1f1f1f]'
        }`}
      >
        <span>{icon}</span>
        <span className="truncate">{value || label}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onToggle} aria-hidden="true" />
          <div className="absolute top-full left-0 z-50 mt-2 max-h-60 w-64 overflow-y-auto rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] shadow-xl">
            <div className="p-2">
              <button
                onClick={() => {
                  onChange('');
                  onToggle();
                }}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  !value ? `${activeBg} ${activeColor}` : 'text-gray-300 hover:bg-[#2a2a2a]'
                }`}
              >
                All {label}s
              </button>
              {options.map(option => (
                <button
                  key={option}
                  onClick={() => {
                    onChange(option);
                    onToggle();
                  }}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    value === option
                      ? `${activeBg} ${activeColor}`
                      : 'text-gray-300 hover:bg-[#2a2a2a]'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}


