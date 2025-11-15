'use client';

import { Icon } from '@/components/ui/Icon';
import { BookOpen, Package, Plus, Sparkles, Thermometer, Truck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface NewItemOption {
  href: string;
  label: string;
  icon: React.ReactNode;
  category: string;
}

const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

function NewButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Items that can be created - exclude dashboard, settings, setup
  const creatableItems: NewItemOption[] = [
    {
      href: '/webapp/temperature?action=new',
      label: 'Temp Log',
      icon: <Icon icon={Thermometer} size="sm" className="text-current" aria-hidden={true} />,
      category: 'Temperature',
    },
    {
      href: '/webapp/recipes#ingredients',
      label: 'Ingredient',
      icon: <Icon icon={Package} size="sm" className="text-current" aria-hidden={true} />,
      category: 'Ingredients',
    },
    {
      href: '/webapp/recipes?action=new',
      label: 'Recipe',
      icon: <Icon icon={BookOpen} size="sm" className="text-current" aria-hidden={true} />,
      category: 'Recipes',
    },
    {
      href: '/webapp/cleaning?action=new',
      label: 'Cleaning Task',
      icon: <Icon icon={Sparkles} size="sm" className="text-current" aria-hidden={true} />,
      category: 'Cleaning',
    },
    {
      href: '/webapp/suppliers?action=new',
      label: 'Supplier',
      icon: <Icon icon={Truck} size="sm" className="text-current" aria-hidden={true} />,
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
        <Icon icon={Plus} size="md" className="text-white" aria-hidden={true} />
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
                    // Mobile: Individual card styling
                    'border',
                    'border-[#2a2a2a]',
                    'bg-[#1f1f1f]',
                    'shadow-md',
                    // Desktop: Remove card styling
                    'lg:border-0',
                    'lg:bg-transparent',
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

export { NewButton };
