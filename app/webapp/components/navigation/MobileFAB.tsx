'use client';

import { Icon } from '@/components/ui/Icon';
import { Calculator, Package, Plus, Search, UtensilsCrossed } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useScrollDirection } from '@/hooks/useScrollDirection';

interface MobileFABProps {
  onSearchClick?: () => void;
}

const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export function MobileFAB({ onSearchClick }: MobileFABProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { direction, isAtTop } = useScrollDirection();
  const [isVisible, setIsVisible] = useState(true);

  // Auto-hide FAB when bottom nav is hidden (scroll down)
  useEffect(() => {
    if (isAtTop) {
      setIsVisible(true);
    } else if (direction === 'down') {
      setIsVisible(false);
      setIsOpen(false); // Close menu when hiding
    } else if (direction === 'up') {
      setIsVisible(true);
    }
  }, [direction, isAtTop]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleCreateRecipe = () => {
    setIsOpen(false);
    router.push('/webapp/recipes?action=new');
  };

  const handleCreateIngredient = () => {
    setIsOpen(false);
    router.push('/webapp/recipes#ingredients');
  };

  const handleQuickSearch = () => {
    setIsOpen(false);
    if (onSearchClick) {
      onSearchClick();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 right-4 z-[70] desktop:hidden">
      {/* Quick Actions Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="mb-3 flex flex-col gap-2 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-2 shadow-2xl"
        >
          <button
            onClick={handleCreateRecipe}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-[#2a2a2a]/50"
            aria-label="Create Recipe"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-[#29E7CD]/20 to-[#D925C7]/20">
              <Icon icon={UtensilsCrossed} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">Create Recipe</span>
              <span className="text-xs text-gray-400">Add new dish</span>
            </div>
          </button>

          <button
            onClick={handleCreateIngredient}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-[#2a2a2a]/50"
            aria-label="Create Ingredient"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-[#29E7CD]/20 to-[#3B82F6]/20">
              <Icon icon={Package} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">Create Ingredient</span>
              <span className="text-xs text-gray-400">Add new item</span>
            </div>
          </button>

          <button
            onClick={handleQuickSearch}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-[#2a2a2a]/50"
            aria-label="Quick Search"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-[#29E7CD]/20 to-[#D925C7]/20">
              <Icon icon={Search} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">Quick Search</span>
              <span className="text-xs text-gray-400">Find anything</span>
            </div>
          </button>
        </div>
      )}

      {/* FAB Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#29E7CD] to-[#D925C7] shadow-lg transition-all duration-200',
          'hover:scale-110 hover:shadow-xl',
          'active:scale-95',
          isOpen && 'rotate-45',
        )}
        aria-label={isOpen ? 'Close quick actions' : 'Open quick actions'}
        aria-expanded={isOpen}
      >
        <Icon
          icon={Plus}
          size="lg"
          className="text-white transition-transform duration-200"
          aria-hidden={true}
        />
      </button>
    </div>
  );
}
