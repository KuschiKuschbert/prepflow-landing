'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface NewItemOption {
  href: string;
  label: string;
  icon: React.ReactNode;
  category: string;
}

const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export function FloatingActionButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Only show on mobile
  const isMobile = useMediaQuery('(max-width: 767px)');

  // Items that can be created
  const creatableItems: NewItemOption[] = [
    {
      href: '/webapp/temperature?action=new',
      label: 'Temp Log',
      icon: <span className="text-sm">🌡️</span>,
      category: 'Temperature',
    },
    {
      href: '/webapp/ingredients?action=new',
      label: 'Ingredient',
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
      category: 'Ingredients',
    },
    {
      href: '/webapp/recipes?action=new',
      label: 'Recipe',
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      category: 'Recipes',
    },
    {
      href: '/webapp/cogs?action=new',
      label: 'COGS',
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
      category: 'COGS',
    },
    {
      href: '/webapp/cleaning?action=new',
      label: 'Cleaning Task',
      icon: <span className="text-sm">🧹</span>,
      category: 'Cleaning',
    },
    {
      href: '/webapp/suppliers?action=new',
      label: 'Supplier',
      icon: <span className="text-sm">🚚</span>,
      category: 'Suppliers',
    },
  ];

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
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

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleItemClick = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  // Don't render on desktop
  if (!isMobile) return null;

  return (
    <div
      className="fixed right-4 z-50 md:hidden"
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
            'bg-[#1f1f1f]',
            'border',
            'border-[#2a2a2a]',
            'shadow-xl',
            'overflow-hidden',
            'animate-fade-in-up',
            'duration-200',
          )}
          role="menu"
          aria-orientation="vertical"
        >
          <div className="p-2">
            <div className="mb-2 px-3 py-1.5 text-xs font-semibold tracking-wider text-gray-400 uppercase">
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
                    'text-gray-300',
                    'transition-all',
                    'duration-200',
                    'hover:bg-[#2a2a2a]',
                    'hover:text-[#29E7CD]',
                    'focus:outline-none',
                    'focus:bg-[#2a2a2a]',
                    'focus:text-[#29E7CD]',
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
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex',
          'items-center',
          'justify-center',
          'h-14',
          'w-14',
          'rounded-full',
          'bg-gradient-to-r',
          'from-[#29E7CD]',
          'to-[#D925C7]',
          'text-white',
          'shadow-lg',
          'transition-all',
          'duration-300',
          'ease-in-out',
          'hover:shadow-xl',
          'hover:scale-110',
          'active:scale-95',
          'focus:outline-none',
          'focus:ring-2',
          'focus:ring-[#29E7CD]',
          'focus:ring-offset-2',
          'focus:ring-offset-[#0a0a0a]',
          'touch-manipulation',
          isVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
        )}
        aria-label="Create new item"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
