'use client';

import { ChevronDown, LucideIcon } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

interface FilterDropdownProps {
  label: string;
  icon: LucideIcon;
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
    <div className="relative w-full tablet:w-auto">
      <button
        onClick={onToggle}
        className={`flex w-full items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200 tablet:w-auto ${
          value
            ? `${activeColor} ${activeBg}`
            : 'border-[#2a2a2a] bg-[#0a0a0a]/80 text-gray-300 hover:border-[#2a2a2a] hover:bg-[#1f1f1f]'
        }`}
      >
        <Icon icon={icon} size="sm" className="text-current" aria-hidden={true} />
        <span className="truncate">{value || label}</span>
        <Icon icon={ChevronDown} size="xs" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden={true} />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onToggle} aria-hidden={true} />
          <div className="absolute top-full left-0 z-50 mt-1.5 max-h-60 w-56 overflow-y-auto rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] shadow-xl">
            <div className="p-1.5">
              <button
                onClick={() => {
                  onChange('');
                  onToggle();
                }}
                className={`w-full rounded-md px-2.5 py-1.5 text-left text-sm transition-colors ${
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
                  className={`w-full rounded-md px-2.5 py-1.5 text-left text-sm transition-colors ${
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
