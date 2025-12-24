'use client';

import { Icon } from '@/components/ui/Icon';
import { Menu, X } from 'lucide-react';

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

/**
 * Mobile menu button component
 */
export function MobileMenuButton({ isOpen, onClick }: MobileMenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className="desktop:hidden fixed left-4 z-50 rounded-xl bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 to-[var(--primary)]/20 p-[1px] transition-all hover:shadow-lg focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
      style={{
        top: 'calc(var(--header-height-mobile) + var(--safe-area-inset-top) + 1rem)',
      }}
      aria-label="Toggle sidebar"
      aria-expanded={isOpen}
    >
      <div className="rounded-xl bg-[var(--surface)] p-2">
        <Icon icon={isOpen ? X : Menu} size="md" className="text-[var(--primary)]" />
      </div>
    </button>
  );
}
