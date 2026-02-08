'use client';

import { Icon } from '@/components/ui/Icon';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDropdown } from '../hooks/useDropdown';
import { getCreatableItems } from './config/creatableItems';

const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export function FloatingActionButton() {
  const router = useRouter();
  const { isOpen, setIsOpen, dropdownRef, triggerRef } = useDropdown(false);
  const [isVisible, setIsVisible] = useState(true);
  const [_lastScrollY, setLastScrollY] = useState(0);

  // Only show on mobile
  const isMobile = useMediaQuery('(max-width: 767px)');

  // Items that can be created
  const creatableItems = getCreatableItems();

  // Scroll detection - hide on scroll down, show on scroll up
  useEffect(() => {
    if (!isMobile) return;

    let ticking = false;
    let currentLastScrollY = 0;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Show FAB if scrolling up or at top
          if (currentScrollY < currentLastScrollY || currentScrollY < 10) {
            setIsVisible(true);
          } else if (currentScrollY > currentLastScrollY && currentScrollY > 50) {
            // Hide FAB if scrolling down past 50px
            setIsVisible(false);
          }

          currentLastScrollY = currentScrollY;
          setLastScrollY(currentScrollY);
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  const handleItemClick = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  // Don't render on desktop
  if (!isMobile) return null;

  return (
    <div
      className="desktop:hidden fixed right-4 z-50"
      style={{
        bottom: 'calc(64px + 1rem + env(safe-area-inset-bottom, 0px))',
      }}
    >
      {/* Dropdown Menu - positioned above FAB */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={cn(
            'absolute',
            'bottom-full',
            'right-0',
            'mb-2',
            'w-64',
            'rounded-2xl',
            'bg-[var(--surface)]',
            'border',
            'border-[var(--border)]',
            'shadow-xl',
            'overflow-hidden',
            'animate-fade-in-up',
            'duration-200',
          )}
          role="menu"
          aria-orientation="vertical"
        >
          <div className="p-2">
            <div className="mb-2 px-3 py-1.5 text-xs font-semibold tracking-wider text-[var(--foreground-muted)] uppercase">
              Create New
            </div>
            <div className="max-h-[60vh] space-y-1 overflow-y-auto">
              {creatableItems.map((item, index) => (
                <button
                  key={item.href}
                  onClick={() => handleItemClick(item.href)}
                  className={cn(
                    'flex',
                    'w-full',
                    'items-center',
                    'gap-3',
                    'rounded-xl',
                    'px-3',
                    'py-2.5',
                    'text-left',
                    'text-sm',
                    'text-[var(--foreground-secondary)]',
                    'transition-all',
                    'duration-200',
                    'hover:bg-[var(--muted)]/50',
                    'hover:text-[var(--primary)]',
                    'focus:outline-none',
                    'focus:bg-[var(--muted)]/50',
                    'focus:text-[var(--primary)]',
                    'active:scale-95',
                  )}
                  role="menuitem"
                  style={{
                    animationDelay: `${index * 30}ms`,
                  }}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="flex-1 font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex',
          'items-center',
          'justify-center',
          'h-14',
          'w-14',
          'rounded-full',
          'bg-gradient-to-r',
          'from-[var(--primary)]',
          'to-[var(--accent)]',
          'text-[var(--foreground)]',
          'shadow-lg',
          'transition-all',
          'duration-300',
          'ease-in-out',
          'hover:shadow-xl',
          'hover:scale-110',
          'active:scale-95',
          'focus:outline-none',
          'focus:ring-2',
          'focus:ring-[var(--primary)]',
          'focus:ring-offset-2',
          'focus:ring-offset-[var(--background)]',
          'touch-manipulation',
          isVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
        )}
        aria-label="Create new item"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Icon icon={Plus} size="lg" className="text-[var(--foreground)]" aria-hidden={true} />
      </button>
    </div>
  );
}
