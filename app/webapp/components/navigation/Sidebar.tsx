'use client';

import { prefetchRecipes } from '@/lib/cache/recipe-cache';
import Link from 'next/link';
import React, { RefObject } from 'react';

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
  const cn = (...classes: (string | undefined | null | false)[]) =>
    classes.filter(Boolean).join(' ');

  return (
    <aside
      id="app-sidebar"
      role="navigation"
      aria-label="Main"
      aria-hidden={!isOpen}
      ref={sidebarRef}
      className={cn(
        'fixed',
        'inset-y-0',
        'left-0',
        'z-50',
        'w-80',
        'transform',
        'border-r',
        'border-[#2a2a2a]',
        'bg-[#1f1f1f]',
        'transition-transform',
        'duration-300',
        'ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      <div className="flex h-full flex-col">
        <div
          className={cn(
            'flex',
            'items-center',
            'justify-between',
            'border-b',
            'border-[#2a2a2a]',
            'p-4',
          )}
        >
          <h2 id="sidebar-title" className="text-lg font-semibold text-white">
            Navigation
          </h2>
          <button
            aria-label="Close navigation"
            onClick={onClose}
            className={cn('rounded-lg', 'p-1', 'transition-colors', 'hover:bg-[#2a2a2a]/50')}
          >
            <svg
              className="h-5 w-5 text-gray-400"
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

        <div className={cn('border-b', 'border-[#2a2a2a]', 'p-4')}>
          <div className="text-xs text-gray-500">
            Press <kbd className="rounded bg-[#2a2a2a] px-1">⌘B</kbd> to toggle
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="mb-6">
              <h3
                className={cn(
                  'mb-3',
                  'text-xs',
                  'font-semibold',
                  'tracking-wider',
                  'text-gray-400',
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
                {items.map(item => (
                  <Link
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    onMouseEnter={() => {
                      // Prefetch recipes API when hovering over recipes link
                      if (item.href === '/webapp/recipes') {
                        prefetchRecipes();
                      }
                    }}
                    className={cn(
                      'group',
                      'flex',
                      'items-center',
                      'space-x-3',
                      'rounded-lg',
                      'px-3',
                      'py-2',
                      'transition-all',
                      'duration-200',
                      isActive(item.href)
                        ? 'border border-[#29E7CD]/20 bg-[#29E7CD]/10'
                        : 'hover:bg-[#2a2a2a]/50',
                    )}
                  >
                    <span className={cn(isActive(item.href) ? item.color : `text-gray-400`)}>
                      {item.icon}
                    </span>
                    <span
                      className={cn(
                        'text-sm',
                        'font-medium',
                        isActive(item.href) ? 'text-white' : 'text-gray-300 group-hover:text-white',
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
