'use client';

import { prefetchRoute } from '@/lib/cache/prefetch-config';
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import { useNavigationTracking } from '@/hooks/useNavigationTracking';

interface SearchModalProps {
  isOpen: boolean;
  query: string;
  onChange: (v: string) => void;
  onClose: () => void;
  filtered: Array<{ href: string; label: string; icon: React.ReactNode; category?: string }>;
}

/**
 * Search modal component for navigation search.
 * Provides full-screen search interface with keyboard shortcuts (⌘K).
 * Includes focus trap for accessibility and aria-live regions for screen readers.
 *
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {string} props.query - Current search query
 * @param {Function} props.onChange - Callback when search query changes
 * @param {Function} props.onClose - Callback when modal is closed
 * @param {Array} props.filtered - Filtered navigation items matching the query
 * @returns {JSX.Element} Search modal component
 *
 * @example
 * ```tsx
 * <SearchModal
 *   isOpen={isSearchOpen}
 *   query={searchQuery}
 *   onChange={setSearchQuery}
 *   onClose={() => setIsSearchOpen(false)}
 *   filtered={filteredItems}
 * />
 * ```
 */
export function SearchModal({ isOpen, query, onChange, onClose, filtered }: SearchModalProps) {
  const { trackNavigation } = useNavigationTracking();
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus trap implementation
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Store trigger element (the element that opened the modal)
      triggerRef.current = document.activeElement as HTMLElement;

      // Get all focusable elements within the modal
      const getFocusableElements = (): HTMLElement[] => {
        if (!modalRef.current) return [];
        return Array.from(
          modalRef.current.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        ) as HTMLElement[];
      };

      const focusableElements = getFocusableElements();
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Focus first element (input)
      if (inputRef.current) {
        inputRef.current.focus();
      } else if (firstElement) {
        firstElement.focus();
      }

      // Handle Tab key to trap focus
      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        if (e.shiftKey) {
          // Shift + Tab (backwards)
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab (forwards)
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      document.addEventListener('keydown', handleTab);

      return () => {
        document.removeEventListener('keydown', handleTab);
        // Return focus to trigger element when modal closes
        if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
          triggerRef.current.focus();
        }
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div
      ref={modalRef}
      id="search-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
      className="fixed inset-0 z-[75] bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={e => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <div
        className="desktop:pt-[calc(var(--header-height-desktop)+var(--safe-area-inset-top)+1rem)] flex items-start justify-center pt-[calc(var(--header-height-mobile)+var(--safe-area-inset-top)+1rem)]"
        onClick={e => e.stopPropagation()}
        onTouchStart={e => e.stopPropagation()}
      >
        <div className="mx-4 w-full max-w-2xl">
          <div className="rounded-2xl bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 via-[var(--tertiary)]/20 to-[var(--primary)]/20 p-[1px] shadow-xl">
            <div className="rounded-2xl bg-[var(--surface)]/95">
              <div className="desktop:p-4 border-b border-[var(--border)] p-3">
                <div className="relative">
                  <h2 id="search-modal-title" className="sr-only">
                    Search navigation
                  </h2>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search navigation&hellip;"
                    value={query}
                    onChange={e => onChange(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 px-4 py-3 pl-12 text-lg text-[var(--foreground)] placeholder-[var(--foreground)]/50 focus:border-transparent focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                    autoFocus
                    aria-label="Search navigation"
                  />
                  <svg
                    className="absolute top-3.5 left-4 h-5 w-5 text-[var(--foreground)]/50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto p-4">
                <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
                  {filtered.length > 0
                    ? `${filtered.length} result${filtered.length === 1 ? '' : 's'} found`
                    : query
                      ? `No results found for ${query}`
                      : 'Start typing to search'}
                </div>
                {filtered.length > 0 ? (
                  <div className="space-y-1" role="listbox" aria-label="Search results">
                    {filtered.map(item => (
                      <Link
                        role="option"
                        aria-label={`Go to ${item.label}${item.category ? ` in ${item.category}` : ''}`}
                        key={item.href}
                        href={item.href}
                        onClick={() => {
                          trackNavigation(item.href);
                          onClose();
                        }}
                        onMouseEnter={() => prefetchRoute(item.href)}
                        className="flex items-center space-x-3 rounded-lg px-3 py-2 transition-colors hover:bg-[var(--muted)]/50 focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--surface)] focus:outline-none"
                      >
                        <span className="text-[var(--foreground)]/60">{item.icon}</span>
                        <span className="text-[var(--foreground)]/80">{item.label}</span>
                        <span className="ml-auto text-xs text-[var(--foreground)]/50">
                          {item.category}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div
                    className="py-8 text-center text-[var(--foreground)]/50"
                    role="status"
                    aria-live="polite"
                  >
                    No results found for &quot;{query}&quot;
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
