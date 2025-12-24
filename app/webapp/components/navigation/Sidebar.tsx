'use client';

import LanguageSwitcher from '@/components/LanguageSwitcher';
import { prefersReducedMotion } from '@/lib/arcadeGuards';
import { prefetchRoute } from '@/lib/cache/prefetch-config';
import Link from 'next/link';
import React, { RefObject, useCallback } from 'react';
import { LogoutButton } from '../LogoutButton';

interface SidebarProps {
  isOpen: boolean;
  sidebarRef: RefObject<HTMLDivElement | null>;
  grouped: Record<
    string,
    Array<{ href: string; label: string; icon: React.ReactNode; color: string }>
  >;
  isActive: (href: string) => boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, sidebarRef, grouped, isActive, onClose }: SidebarProps) {
  const cn = useCallback(
    (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' '),
    [],
  );

  // Click outside to close
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Element;

      // Don't close if clicking inside the sidebar
      if (sidebarRef.current?.contains(target)) {
        return;
      }

      // Don't close if clicking on modals or dialogs
      if (target.closest('[role="dialog"]') || target.closest('[aria-modal="true"]')) {
        return;
      }

      // Don't close if clicking on dropdowns or menus
      if (target.closest('[role="menu"]') || target.closest('[role="listbox"]')) {
        return;
      }

      // Close the sidebar
      onClose();
    };

    // Use mousedown instead of click to catch clicks before they bubble
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onClose, sidebarRef]);

  return (
    <aside
      id="app-sidebar"
      role="navigation"
      aria-label="Main"
      aria-hidden={!isOpen}
      {...(!isOpen && { inert: true })}
      ref={sidebarRef}
      className={cn(
        'fixed',
        'inset-y-0',
        'left-0',
        'z-[60]',
        'w-72',
        'desktop:w-80',
        'transform',
        'rounded-r-3xl',
        'bg-gradient-to-r',
        'from-[var(--primary)]/20',
        'via-[var(--accent)]/20',
        'to-[var(--primary)]/20',
        'p-[1px]',
        'transition-transform',
        'duration-300',
        'will-change-transform',
        'pt-[var(--header-height-mobile)]',
        'desktop:pt-[var(--header-height-desktop)]',
        isOpen ? 'translate-x-0' : '-translate-x-full',
      )}
      style={{
        transitionTimingFunction: 'var(--easing-emphasized)',
      }}
    >
      <div className="flex h-full flex-col overflow-y-auto rounded-r-3xl bg-[var(--surface)]">
        <div
          className={cn(
            'flex',
            'items-center',
            'justify-between',
            'border-b',
            'border-[var(--border)]',
            'p-3',
            'desktop:p-4',
          )}
        >
          <h2 id="sidebar-title" className="text-lg font-semibold text-[var(--foreground)]">
            Navigation
          </h2>
          <button
            aria-label="Close navigation"
            onClick={onClose}
            className={cn(
              'rounded-lg',
              'p-1',
              'min-h-[44px]',
              'min-w-[44px]',
              'transition-colors',
              'hover:bg-[var(--muted)]/50',
            )}
          >
            <svg
              className="h-5 w-5 text-[var(--foreground-muted)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className={cn('hidden', 'desktop:block', 'border-b', 'border-[var(--border)]', 'p-4')}>
          <div className="text-xs text-[var(--foreground-subtle)]">
            Press <kbd className="rounded bg-[var(--muted)] px-1">⌘B</kbd> to toggle
          </div>
        </div>

        <div className="desktop:p-4 flex-1 overflow-y-auto p-3">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="desktop:mb-6 mb-4">
              <h3
                className={cn(
                  'mb-2',
                  'desktop:mb-3',
                  'text-xs',
                  'font-semibold',
                  'tracking-wider',
                  'text-[var(--foreground-muted)]',
                  'uppercase',
                )}
              >
                {category === 'core' && 'Core Features'}
                {category === 'operations' && 'Operations'}
                {category === 'inventory' && 'Inventory'}
                {category === 'kitchen' && 'Kitchen'}
                {category === 'tools' && 'Tools'}
                {category === 'other' && 'Other'}
              </h3>
              <div className="space-y-1">
                {items.map((item, index) => {
                  const reducedMotion = prefersReducedMotion();
                  return (
                    <Link
                      aria-current={isActive(item.href) ? 'page' : undefined}
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      onMouseEnter={() => {
                        // Prefetch API endpoints when hovering over any link
                        prefetchRoute(item.href);
                      }}
                      className={cn(
                        'group',
                        'flex',
                        'items-center',
                        'space-x-4',
                        'rounded-lg',
                        'px-4',
                        'py-3',
                        'min-h-[44px]',
                        'transition-all',
                        'duration-200',
                        isActive(item.href)
                          ? 'border border-[var(--primary)]/30 bg-[var(--primary)]/10'
                          : 'hover:scale-[1.02] hover:bg-[var(--muted)]/50',
                      )}
                      style={{
                        transitionTimingFunction: 'var(--easing-standard)',
                        animation: reducedMotion
                          ? 'none'
                          : `fadeInUp 0.3s var(--easing-standard) forwards`,
                        animationDelay: reducedMotion ? '0ms' : `${index * 20}ms`,
                        opacity: reducedMotion ? 1 : 0,
                      }}
                    >
                      <span
                        className={cn(
                          isActive(item.href) ? item.color : `text-[var(--foreground-muted)]`,
                        )}
                      >
                        {item.icon}
                      </span>
                      <span
                        className={cn(
                          'text-sm',
                          'font-medium',
                          isActive(item.href)
                            ? 'text-[var(--foreground)]'
                            : 'text-[var(--foreground)]/80 group-hover:text-[var(--foreground)]',
                        )}
                      >
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile-only: Language and Logout */}
        <div className="desktop:hidden space-y-3 border-t border-[var(--border)] p-4">
          <div>
            <div className="mb-2 text-xs tracking-wider text-[var(--foreground-muted)] uppercase">
              Settings
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--foreground)]/80">Language</span>
                <LanguageSwitcher />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--foreground)]/80">Account</span>
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
