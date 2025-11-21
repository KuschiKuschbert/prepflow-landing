'use client';

import { Icon } from '@/components/ui/Icon';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ReorderDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst: boolean;
  isLast: boolean;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
}

/**
 * Reorder dropdown component for menu items.
 *
 * @component
 * @param {ReorderDropdownProps} props - Component props
 * @returns {JSX.Element} Reorder dropdown
 */
export function ReorderDropdown({
  isOpen,
  onToggle,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  dropdownRef,
  buttonRef,
}: ReorderDropdownProps) {
  if (!onMoveUp && !onMoveDown) return null;

  return (
    <div ref={dropdownRef} className="relative">
      <button
        ref={buttonRef}
        onClick={e => {
          e.stopPropagation();
          onToggle();
        }}
        onMouseDown={e => e.stopPropagation()}
        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-[#29E7CD]"
        aria-label="Reorder options"
      >
        <Icon icon={ChevronDown} size="sm" />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 z-50 mt-1 min-w-[180px] rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] shadow-lg">
          <div className="p-2 text-xs font-medium tracking-wider text-gray-400 uppercase">
            Reorder
          </div>
          <div className="max-h-60 overflow-y-auto">
            {onMoveUp && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  onMoveUp();
                  onToggle();
                }}
                disabled={isFirst}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-white transition-colors hover:bg-[#2a2a2a] hover:text-[#29E7CD] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
              >
                <Icon icon={ChevronUp} size="sm" />
                <span>Move Up</span>
              </button>
            )}
            {onMoveDown && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  onMoveDown();
                  onToggle();
                }}
                disabled={isLast}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-white transition-colors hover:bg-[#2a2a2a] hover:text-[#29E7CD] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
              >
                <Icon icon={ChevronDown} size="sm" />
                <span>Move Down</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
