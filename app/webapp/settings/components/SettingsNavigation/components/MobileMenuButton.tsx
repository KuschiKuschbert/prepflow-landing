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
      className="desktop:hidden fixed left-4 z-50 rounded-xl bg-gradient-to-r from-[#29E7CD]/20 via-[#D925C7]/20 via-[#FF6B00]/20 to-[#29E7CD]/20 p-[1px] shadow-lg shadow-[#29E7CD]/20 transition-all hover:shadow-xl hover:shadow-[#29E7CD]/30 focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
      style={{
        top: 'calc(var(--header-height-mobile) + var(--safe-area-inset-top) + 1rem)',
      }}
      aria-label="Toggle sidebar"
      aria-expanded={isOpen}
    >
      <div className="rounded-xl bg-[#1f1f1f] p-2">
        <Icon icon={isOpen ? X : Menu} size="md" className="text-[#29E7CD]" />
      </div>
    </button>
  );
}
