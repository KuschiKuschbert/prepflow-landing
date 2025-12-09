'use client';

import { Icon } from '@/components/ui/Icon';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { Package, Plus, UtensilsCrossed } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { memo, useEffect, useRef, useState } from 'react';

const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Floating action button component for mobile devices.
 * Provides quick access to create actions (Create Recipe, Create Ingredient).
 * Auto-hides when bottom navigation is hidden (scroll down).
 *
 * @component
 */
export const MobileFAB = memo(function MobileFAB() {
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

  if (!isVisible) return null;

  return (
    <div className="desktop:hidden fixed right-4 bottom-20 z-[70] landscape:bottom-16">
      {/* Quick Actions Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="mb-3 flex flex-col gap-2 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/95 p-2 shadow-2xl backdrop-blur-sm landscape:gap-1 landscape:p-1.5"
          style={{ animation: 'scaleIn 0.2s var(--easing-spring) forwards' }}
        >
          <button
            onClick={handleCreateRecipe}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-[#2a2a2a]/50 focus:outline-none active:scale-95 landscape:px-3 landscape:py-2"
            aria-label="Create Recipe"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#29E7CD]/30 bg-[#29E7CD]/10 landscape:h-8 landscape:w-8">
              <Icon
                icon={UtensilsCrossed}
                size="sm"
                className="text-[#29E7CD]"
                aria-hidden={true}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white landscape:text-xs">New Recipe</span>
              <span className="text-xs text-gray-400 landscape:text-[10px]">Create a dish</span>
            </div>
          </button>

          <button
            onClick={handleCreateIngredient}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-[#2a2a2a]/50 focus:outline-none active:scale-95 landscape:px-3 landscape:py-2"
            aria-label="Create Ingredient"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#3B82F6]/30 bg-[#3B82F6]/10 landscape:h-8 landscape:w-8">
              <Icon icon={Package} size="sm" className="text-[#3B82F6]" aria-hidden={true} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white landscape:text-xs">
                New Ingredient
              </span>
              <span className="text-xs text-gray-400 landscape:text-[10px]">Add an item</span>
            </div>
          </button>
        </div>
      )}

      {/* FAB Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200',
          'bg-gradient-to-r from-[#29E7CD] to-[#D925C7]',
          'hover:shadow-xl hover:shadow-[#29E7CD]/25',
          'active:scale-95',
          'focus:outline-none',
          'landscape:h-10 landscape:w-10',
        )}
        style={{
          willChange: 'transform',
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          transitionTimingFunction: 'var(--easing-spring)',
        }}
        aria-label={isOpen ? 'Close quick actions' : 'Open quick actions'}
        aria-expanded={isOpen}
      >
        <Icon
          icon={Plus}
          size="lg"
          className="text-white transition-transform duration-200 landscape:scale-75"
          aria-hidden={true}
        />
      </button>
    </div>
  );
});
