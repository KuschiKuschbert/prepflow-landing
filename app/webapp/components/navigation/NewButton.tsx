'use client';

import { Icon } from '@/components/ui/Icon';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDropdown } from '../hooks/useDropdown';
import { getCreatableItems } from './config/creatableItems';

const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

interface NewButtonProps {
  isCollapsed?: boolean;
}

/**
 * New button component for creating new items.
 * Displays dropdown menu with options to create recipes, ingredients, temperature logs, etc.
 * Positioned at top of sidebar (desktop) like Google Drive.
 *
 * @component
 * @param {NewButtonProps} props - Component props
 * @param {boolean} [props.isCollapsed=false] - Whether sidebar is collapsed
 * @returns {JSX.Element} New button component
 */
function NewButton({ isCollapsed = false }: NewButtonProps) {
  const router = useRouter();
  const { isOpen, setIsOpen, dropdownRef, triggerRef } = useDropdown(false);

  // Items that can be created
  const creatableItems = getCreatableItems();

  const handleItemClick = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  return (
    <div className="relative w-full">
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex',
          'w-full',
          'items-center',
          'justify-center',
          'gap-2',
          'rounded-lg',
          isCollapsed ? 'px-2 py-2.5' : 'px-4 py-2.5',
          'min-h-[44px]',
          'bg-gradient-to-r',
          'from-[var(--primary)]',
          'to-[var(--accent)]',
          'text-[var(--button-active-text)]',
          'font-medium',
          'text-sm',
          'transition-all',
          'duration-200',
          'hover:shadow-lg',
          'hover:scale-[1.02]',
          'active:scale-[0.98]',
          'focus:outline-none',
          'focus:ring-2',
          'focus:ring-[var(--primary)]',
          'focus:ring-offset-2',
          'focus:ring-offset-[var(--surface)]',
        )}
        aria-label="Create new item"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Icon
          icon={Plus}
          size="md"
          className="text-[var(--button-active-text)]"
          aria-hidden={true}
        />
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
            'bg-gradient-to-r',
            'from-[var(--primary)]/20',
            'via-[var(--tertiary)]/20',
            'via-[var(--accent)]/20',
            'to-[var(--primary)]/20',
            'p-[1px]',
            'shadow-xl',
            'z-[60]',
            'overflow-hidden',
            'animate-fade-in-down',
            'duration-200',
          )}
          role="menu"
          aria-orientation="vertical"
        >
          <div className="desktop:p-2 rounded-xl bg-[var(--surface)]/95 p-2">
            <div className="mb-2 px-3 py-1.5 text-xs font-semibold tracking-wider text-[var(--foreground)]/60 uppercase">
              Create New
            </div>
            <div className="desktop:space-y-1 space-y-2">
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
                    'desktop:px-3',
                    'desktop:py-2.5',
                    'text-left',
                    'text-sm',
                    'text-[var(--foreground)]/80',
                    // Mobile: Individual card styling
                    'border',
                    'border-[var(--border)]',
                    'bg-[var(--surface)]',
                    'shadow-md',
                    // Desktop: Remove card styling
                    'desktop:border-0',
                    'desktop:bg-transparent',
                    'desktop:shadow-none',
                    'transition-all',
                    'duration-200',
                    'hover:bg-[var(--muted)]/50',
                    index % 2 === 0
                      ? 'hover:text-[var(--primary)]'
                      : 'hover:text-[var(--tertiary)]',
                    'focus:outline-none',
                    'focus:bg-[var(--muted)]/50',
                    index % 2 === 0
                      ? 'focus:text-[var(--primary)]'
                      : 'focus:text-[var(--tertiary)]',
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
