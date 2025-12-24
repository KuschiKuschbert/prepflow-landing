'use client';

import { Icon } from '@/components/ui/Icon';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Category, FocusedIndex } from '../types';

interface NavigationSidebarProps {
  categories: Category[];
  activeHash: string;
  expandedCategories: Set<string>;
  focusedIndex: FocusedIndex | null;
  navRefs: React.MutableRefObject<Map<string, HTMLButtonElement>>;
  onNavClick: (hash: string) => void;
  onToggleCategory: (categoryId: string) => void;
  onKeyDown: (
    e: React.KeyboardEvent,
    categoryId: string,
    itemIndex: number,
    itemHash: string,
  ) => void;
}

/**
 * Navigation sidebar component
 */
export function NavigationSidebar({
  categories,
  activeHash,
  expandedCategories,
  focusedIndex,
  navRefs,
  onNavClick,
  onToggleCategory,
  onKeyDown,
}: NavigationSidebarProps) {
  return (
    <aside
      className="desktop:translate-x-0 desktop:translate-x-0 sticky top-[calc(var(--header-height-mobile)+var(--safe-area-inset-top)+1rem)] left-4 z-40 h-[calc(100vh-var(--header-height-mobile)-var(--safe-area-inset-top)-2rem)] w-64 -translate-x-full transform rounded-3xl bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 to-[var(--primary)]/20 p-[1px] transition-transform duration-200"
      role="navigation"
      aria-label="Settings navigation"
    >
      <div className="flex h-full flex-col rounded-3xl bg-[var(--surface)]">
        {/* Header */}
        <div className="rounded-t-3xl border-b border-[var(--border)] p-4">
          <h1 className="text-lg font-semibold text-[var(--foreground)]">Settings</h1>
          <p className="mt-0.5 text-xs text-[var(--foreground)]/60">
            Manage your account and preferences
          </p>
        </div>

        {/* Navigation */}
        <nav className="desktop:p-4 flex-1 overflow-y-auto p-3" aria-label="Settings categories">
          <div className="space-y-4">
            {categories.map(category => {
              const isExpanded = expandedCategories.has(category.id);
              const hasItems = category.items.length > 0;

              return (
                <div key={category.id} className="space-y-1">
                  {/* Category Header */}
                  <button
                    onClick={() => onToggleCategory(category.id)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wider text-[var(--foreground)]/60 uppercase transition-colors duration-200 hover:bg-[var(--surface)]/50 hover:text-[var(--foreground)]/80 focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                    aria-expanded={isExpanded}
                    aria-controls={`category-${category.id}`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        icon={category.icon}
                        size="xs"
                        className="text-[var(--foreground)]/60"
                      />
                      <span>{category.label}</span>
                    </div>
                    {hasItems && (
                      <Icon
                        icon={isExpanded ? ChevronUp : ChevronDown}
                        size="xs"
                        className="text-[var(--foreground)]/60 transition-transform duration-200"
                      />
                    )}
                  </button>

                  {/* Category Items */}
                  {isExpanded && hasItems && (
                    <ul
                      id={`category-${category.id}`}
                      className="space-y-1"
                      role="group"
                      aria-label={`${category.label} settings`}
                    >
                      {category.items.map((item, itemIndex) => {
                        const isActive = activeHash === item.hash;
                        const isFocused =
                          focusedIndex?.categoryId === category.id &&
                          focusedIndex?.itemIndex === itemIndex;
                        const itemKey = `${category.id}-${itemIndex}`;

                        return (
                          <li key={item.hash}>
                            <button
                              ref={el => {
                                if (el) {
                                  navRefs.current.set(itemKey, el);
                                } else {
                                  navRefs.current.delete(itemKey);
                                }
                              }}
                              onClick={() => onNavClick(item.hash)}
                              onKeyDown={e => onKeyDown(e, category.id, itemIndex, item.hash)}
                              className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 focus:ring-2 focus:ring-[var(--primary)] focus:outline-none ${
                                isActive
                                  ? 'border border-[var(--primary)]/30 bg-[var(--primary)]/10'
                                  : 'hover:scale-[1.02] hover:bg-[var(--surface)]/50'
                              }`}
                              aria-label={`${item.ariaLabel} - ${category.label} settings`}
                              aria-current={isActive ? 'page' : undefined}
                            >
                              <Icon
                                icon={item.icon}
                                size="sm"
                                className={`transition-colors duration-200 ${
                                  isActive ? 'text-[var(--primary)]' : 'text-[var(--foreground)]/60'
                                }`}
                              />
                              <span
                                className={`font-medium transition-colors duration-200 ${
                                  isActive
                                    ? 'text-[var(--foreground)]'
                                    : 'text-[var(--foreground)]/70 group-hover:text-[var(--foreground)]'
                                }`}
                              >
                                {item.label}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </nav>
      </div>
    </aside>
  );
}
