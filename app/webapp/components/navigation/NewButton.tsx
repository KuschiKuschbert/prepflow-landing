'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

interface NewItemOption {
  href: string;
  label: string;
  icon: React.ReactNode;
  category: string;
}

const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export function NewButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Items that can be created - exclude dashboard, settings, setup
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

  return (
    <div className="relative w-full">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex',
          'w-full',
          'items-center',
          'justify-center',
          'gap-2',
          'rounded-lg',
          'px-4',
          'py-2.5',
          'min-h-[44px]',
          'bg-gradient-to-r',
          'from-[#29E7CD]',
          'to-[#D925C7]',
          'text-white',
          'font-medium',
          'text-sm',
          'transition-all',
          'duration-200',
          'hover:shadow-lg',
          'hover:scale-[1.02]',
          'active:scale-[0.98]',
          'focus:outline-none',
          'focus:ring-2',
          'focus:ring-[#29E7CD]',
          'focus:ring-offset-2',
          'focus:ring-offset-[#1f1f1f]',
        )}
        aria-label="Create new item"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span>New</span>
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className={cn(
            'absolute',
            'left-0',
            'top-full',
            'mt-2',
            'w-full',
            'rounded-2xl',
            'bg-[#1f1f1f]',
            'border',
            'border-[#2a2a2a]',
            'shadow-xl',
            'z-[60]',
            'overflow-hidden',
            'animate-fade-in-down',
            'duration-200',
          )}
          role="menu"
          aria-orientation="vertical"
        >
          <div className="p-2 lg:p-2">
            <div className="mb-2 px-3 py-1.5 text-xs font-semibold tracking-wider text-gray-400 uppercase">
              Create New
            </div>
            <div className="space-y-2 lg:space-y-1">
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
                    'px-4',
                    'py-3',
                    'lg:px-3',
                    'lg:py-2.5',
                    'text-left',
                    'text-sm',
                    'text-gray-300',
                    'bg-[#1f1f1f]',
                    'border',
                    'border-[#2a2a2a]',
                    'lg:border-0',
                    'lg:bg-transparent',
                    'shadow-md',
                    'lg:shadow-none',
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
    </div>
  );
}
