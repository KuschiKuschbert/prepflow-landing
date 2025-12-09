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
      className="desktop:translate-x-0 desktop:translate-x-0 sticky top-[calc(var(--header-height-mobile)+var(--safe-area-inset-top)+1rem)] left-4 z-40 h-[calc(100vh-var(--header-height-mobile)-var(--safe-area-inset-top)-2rem)] w-64 -translate-x-full transform rounded-3xl bg-gradient-to-r from-[#29E7CD]/20 via-[#D925C7]/20 via-[#FF6B00]/20 to-[#29E7CD]/20 p-[1px] shadow-2xl shadow-[#29E7CD]/20 transition-transform duration-200"
      role="navigation"
      aria-label="Settings navigation"
    >
      <div className="flex h-full flex-col rounded-3xl bg-[#1f1f1f] backdrop-blur-xl">
        {/* Header */}
        <div className="rounded-t-3xl border-b border-[#2a2a2a] bg-gradient-to-r from-[#29E7CD]/10 via-[#FF6B00]/5 to-[#D925C7]/10 p-6">
          <h1 className="bg-gradient-to-r from-[#29E7CD] via-[#FF6B00] to-[#D925C7] bg-clip-text text-xl font-bold text-transparent">
            Settings
          </h1>
          <p className="mt-1 text-sm text-[#29E7CD]/70">Manage your account and preferences</p>
        </div>

        {/* Navigation */}
        <nav className="desktop:p-6 flex-1 overflow-y-auto p-4" aria-label="Settings categories">
          <div className="space-y-6">
            {categories.map(category => {
              const isExpanded = expandedCategories.has(category.id);
              const hasItems = category.items.length > 0;

              return (
                <div key={category.id} className="space-y-2">
                  {/* Category Header */}
                  <button
                    onClick={() => onToggleCategory(category.id)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold tracking-wider text-[#29E7CD]/60 uppercase transition-all duration-200 hover:bg-gradient-to-r hover:from-[#29E7CD]/10 hover:via-[#FF6B00]/5 hover:to-[#D925C7]/10 hover:text-[#29E7CD] hover:shadow-md hover:shadow-[#29E7CD]/10 focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                    aria-expanded={isExpanded}
                    aria-controls={`category-${category.id}`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        icon={category.icon}
                        size="xs"
                        className={isExpanded ? 'text-[#29E7CD]' : 'text-[#29E7CD]/60'}
                      />
                      <span className={isExpanded ? 'text-[#29E7CD]' : ''}>{category.label}</span>
                    </div>
                    {hasItems && (
                      <Icon
                        icon={isExpanded ? ChevronUp : ChevronDown}
                        size="xs"
                        className="text-[#29E7CD]/60 transition-transform duration-200"
                      />
                    )}
                  </button>

                  {/* Category Items */}
                  {isExpanded && hasItems && (
                    <ul
                      id={`category-${category.id}`}
                      className="space-y-2 pl-1"
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
                              className={`group relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition-all duration-200 focus:ring-2 focus:ring-[#29E7CD] focus:ring-offset-2 focus:ring-offset-transparent focus:outline-none ${
                                isActive
                                  ? 'border-l-2 border-[#29E7CD] bg-gradient-to-r from-[#29E7CD]/20 via-[#FF6B00]/10 to-[#D925C7]/20 text-[#29E7CD] shadow-lg shadow-[#29E7CD]/20'
                                  : 'text-[#29E7CD]/60 hover:scale-[1.02] hover:bg-gradient-to-r hover:from-[#29E7CD]/10 hover:via-[#FF6B00]/5 hover:to-[#D925C7]/10 hover:text-[#29E7CD] hover:shadow-md hover:shadow-[#29E7CD]/10'
                              }`}
                              aria-label={`${item.ariaLabel} - ${category.label} settings`}
                              aria-current={isActive ? 'page' : undefined}
                            >
                              <Icon
                                icon={item.icon}
                                size="sm"
                                className={`transition-colors duration-200 ${
                                  isActive
                                    ? 'text-[#29E7CD]'
                                    : 'text-[#29E7CD]/60 group-hover:text-[#29E7CD]'
                                }`}
                              />
                              <span
                                className={`font-medium transition-colors duration-200 ${
                                  isActive ? 'text-[#29E7CD]' : 'group-hover:text-[#29E7CD]'
                                }`}
                              >
                                {item.label}
                              </span>
                              {isActive && (
                                <div className="absolute right-2 h-2 w-2 animate-pulse rounded-full bg-gradient-to-r from-[#29E7CD] via-[#FF6B00] to-[#D925C7]" />
                              )}
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
