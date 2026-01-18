/**
 * Allergen Filter Dropdown Component
 * Multi-select dropdown for filtering recipes by allergens
 */

'use client';

import { useRef, useEffect } from 'react';
import { ChevronDown, X, AlertTriangle } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { AUSTRALIAN_ALLERGENS } from '@/lib/allergens/australian-allergens';
import { AllergenBadge } from '@/components/ui/AllergenBadge';
import {
  Nut,
  Milk,
  Egg,
  Bean,
  Wheat,
  Fish,
  CircleDot,
  Flower,
  Circle,
  LucideIcon,
} from 'lucide-react';

// Icon mapping for allergens (same as AllergenBadge)
const ALLERGEN_ICONS: Record<string, LucideIcon> = {
  nuts: Nut,
  milk: Milk,
  eggs: Egg,
  soy: Bean,
  gluten: Wheat,
  fish: Fish,
  shellfish: Fish,
  sesame: CircleDot,
  lupin: Flower,
  sulphites: AlertTriangle,
  mustard: Circle,
};

interface AllergenFilterDropdownProps {
  label: string;
  selectedAllergens: string[];
  onAllergensChange: (allergens: string[]) => void;
  mode: 'exclude' | 'include';
  isOpen: boolean;
  onToggle: () => void;
  activeColor: string;
  activeBg: string;
}

export function AllergenFilterDropdown({
  label,
  selectedAllergens,
  onAllergensChange,
  mode,
  isOpen,
  onToggle,
  activeColor,
  activeBg,
}: AllergenFilterDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpen) {
          onToggle();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  const handleAllergenToggle = (allergenCode: string) => {
    const newSelection = selectedAllergens.includes(allergenCode)
      ? selectedAllergens.filter(a => a !== allergenCode)
      : [...selectedAllergens, allergenCode];
    onAllergensChange(newSelection);
  };

  const handleClearAll = () => {
    onAllergensChange([]);
  };

  const hasSelection = selectedAllergens.length > 0;

  return (
    <div className="tablet:w-auto relative w-full" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className={`tablet:w-auto flex w-full items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200 ${
          hasSelection
            ? `${activeColor} ${activeBg}`
            : 'border-[var(--border)] bg-[var(--background)]/80 text-[var(--foreground-secondary)] hover:border-[var(--border)] hover:bg-[var(--surface)]'
        }`}
      >
        <Icon icon={AlertTriangle} size="sm" className="text-current" aria-hidden={true} />
        <span className="truncate">
          {hasSelection ? `${selectedAllergens.length} selected` : label}
        </span>
        <Icon
          icon={ChevronDown}
          size="xs"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden={true}
        />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onToggle} aria-hidden={true} />
          <div className="absolute top-full left-0 z-50 mt-1.5 max-h-96 w-72 overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-xl">
            <div className="sticky top-0 border-b border-[var(--border)] bg-[var(--surface)] p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--foreground-secondary)]">
                  {mode === 'exclude' ? 'Exclude recipes with:' : 'Include recipes with:'}
                </span>
                {hasSelection && (
                  <button
                    onClick={handleClearAll}
                    className="flex items-center gap-1 rounded px-2 py-1 text-xs text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
                  >
                    <Icon icon={X} size="xs" aria-hidden={true} />
                    Clear
                  </button>
                )}
              </div>
            </div>
            <div className="p-1.5">
              {AUSTRALIAN_ALLERGENS.map(allergen => {
                const isSelected = selectedAllergens.includes(allergen.code);
                return (
                  <button
                    key={allergen.code}
                    onClick={() => handleAllergenToggle(allergen.code)}
                    className={`mb-1 flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors ${
                      isSelected
                        ? `${activeBg} ${activeColor}`
                        : 'text-[var(--foreground-secondary)] hover:bg-[var(--muted)]'
                    }`}
                  >
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                        isSelected
                          ? 'border-[var(--primary)] bg-[var(--primary)]/20'
                          : 'border-[var(--border)] bg-[var(--background)]'
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="h-3 w-3 text-[var(--primary)]"
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
                      )}
                    </div>
                    {allergen.icon && ALLERGEN_ICONS[allergen.icon] && (
                      <Icon
                        icon={ALLERGEN_ICONS[allergen.icon]}
                        size="sm"
                        className={
                          isSelected ? 'text-[var(--primary)]' : 'text-[var(--foreground-muted)]'
                        }
                        aria-hidden={true}
                      />
                    )}
                    <span className="flex-1">{allergen.displayName}</span>
                  </button>
                );
              })}
            </div>
            {hasSelection && (
              <div className="sticky bottom-0 border-t border-[var(--border)] bg-[var(--surface)] p-2">
                <div className="flex flex-wrap gap-1">
                  {selectedAllergens.map(code => (
                    <AllergenBadge key={code} allergenCode={code} size="sm" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
