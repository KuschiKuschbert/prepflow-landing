'use client';

import { Search } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

interface DrawerSearchButtonProps {
  onSearchClick: () => void;
}

export function DrawerSearchButton({ onSearchClick }: DrawerSearchButtonProps) {
  return (
    <div className="flex-shrink-0 border-b border-[#2a2a2a]/20 px-3 py-2">
      <button
        onClick={onSearchClick}
        className="flex w-full items-center space-x-2 rounded-lg border border-[#2a2a2a]/20 bg-[#2a2a2a]/15 px-3 py-2 text-left transition-colors hover:bg-[#2a2a2a]/30"
      >
        <Icon icon={Search} size="xs" className="text-gray-400" aria-hidden="true" />
        <span className="text-xs text-gray-400">Search...</span>
      </button>
    </div>
  );
}
