'use client';

import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation } from '@/lib/useTranslation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import OptimizedImage from '../../../components/OptimizedImage';

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  category?: string;
}

interface ModernNavigationProps {
  className?: string;
}

export default function ModernNavigation({ className = '' }: ModernNavigationProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Navigation items organized by category
  const navigationItems: NavigationItem[] = [
    // Core Features
    {
      href: '/webapp',
      label: t('nav.dashboard', 'Dashboard') as string,
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
          />
        </svg>
      ),
      color: 'text-[#29E7CD]',
      category: 'core',
    },
    {
      href: '/webapp/ingredients',
      label: t('nav.ingredients', 'Ingredients') as string,
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
      color: 'text-[#29E7CD]',
      category: 'core',
    },
    {
      href: '/webapp/recipes',
      label: t('nav.recipes', 'Recipes') as string,
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
      color: 'text-[#3B82F6]',
      category: 'core',
    },
    {
      href: '/webapp/cogs',
      label: t('nav.cogs', 'COGS') as string,
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
      color: 'text-[#D925C7]',
      category: 'core',
    },
    {
      href: '/webapp/performance',
      label: t('nav.performance', 'Performance') as string,
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      color: 'text-[#29E7CD]',
      category: 'core',
    },
    // Operations
    {
      href: '/webapp/cleaning',
      label: t('nav.cleaning', 'Cleaning') as string,
      icon: <span className="text-sm">🧹</span>,
      color: 'text-[#29E7CD]',
      category: 'operations',
    },
    {
      href: '/webapp/temperature',
      label: t('nav.temperature', 'Temperature') as string,
      icon: <span className="text-sm">🌡️</span>,
      color: 'text-[#3B82F6]',
      category: 'operations',
    },
    {
      href: '/webapp/compliance',
      label: t('nav.compliance', 'Compliance') as string,
      icon: <span className="text-sm">📋</span>,
      color: 'text-[#D925C7]',
      category: 'operations',
    },
    {
      href: '/webapp/suppliers',
      label: t('nav.suppliers', 'Suppliers') as string,
      icon: <span className="text-sm">🚚</span>,
      color: 'text-[#29E7CD]',
      category: 'operations',
    },
    // Inventory
    {
      href: '/webapp/par-levels',
      label: t('nav.parLevels', 'Par Levels') as string,
      icon: <span className="text-sm">📦</span>,
      color: 'text-[#3B82F6]',
      category: 'inventory',
    },
    {
      href: '/webapp/order-lists',
      label: t('nav.orderLists', 'Order Lists') as string,
      icon: <span className="text-sm">📋</span>,
      color: 'text-[#D925C7]',
      category: 'inventory',
    },
    // Kitchen
    {
      href: '/webapp/dish-sections',
      label: t('nav.dishSections', 'Dish Sections') as string,
      icon: <span className="text-sm">🍽️</span>,
      color: 'text-[#29E7CD]',
      category: 'kitchen',
    },
    {
      href: '/webapp/prep-lists',
      label: t('nav.prepLists', 'Prep Lists') as string,
      icon: <span className="text-sm">📝</span>,
      color: 'text-[#3B82F6]',
      category: 'kitchen',
    },
    // Tools
    {
      href: '/webapp/ai-specials',
      label: t('nav.aiSpecials', 'AI Specials') as string,
      icon: <span className="text-sm">🤖</span>,
      color: 'text-[#29E7CD]',
      category: 'tools',
    },
    {
      href: '/webapp/setup',
      label: t('nav.setup', 'Setup') as string,
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      color: 'text-[#29E7CD]',
      category: 'tools',
    },
  ];

  // Filter items based on search query
  const filteredItems = navigationItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Group items by category
  const groupedItems = filteredItems.reduce(
    (acc, item) => {
      const category = item.category || 'other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, NavigationItem[]>,
  );

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) {
        switch (event.key) {
          case 'k':
            event.preventDefault();
            setIsSearchOpen(true);
            break;
          case 'b':
            event.preventDefault();
            setIsSidebarOpen(!isSidebarOpen);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen]);

  const isActive = (href: string) => {
    if (href === '/webapp') return pathname === '/webapp';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Compact Header */}
      <header className={`border-b border-[#2a2a2a] bg-[#1f1f1f] ${className}`}>
        <div className="flex items-center justify-between px-4 py-2">
          {/* Left: Logo + Menu Button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="rounded-lg p-1.5 transition-colors hover:bg-[#2a2a2a]/50"
              aria-label="Toggle navigation"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <Link href="/webapp" className="flex items-center">
              <OptimizedImage
                src="/images/prepflow-logo.png"
                alt="PrepFlow Logo"
                width={120}
                height={38}
                className="h-8 w-auto"
                priority={true}
              />
            </Link>
          </div>

          {/* Center: Breadcrumb */}
          <div className="hidden items-center space-x-2 text-sm text-gray-400 md:flex">
            <Link href="/webapp" className="transition-colors hover:text-[#29E7CD]">
              Dashboard
            </Link>
            {pathname !== '/webapp' && (
              <>
                <span>/</span>
                <span className="text-[#29E7CD]">
                  {navigationItems.find(item => isActive(item.href))?.label || 'Page'}
                </span>
              </>
            )}
          </div>

          {/* Right: Search + Actions */}
          <div className="flex items-center space-x-2">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden items-center space-x-2 rounded-lg bg-[#2a2a2a]/30 px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-[#2a2a2a]/50 sm:flex"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="hidden lg:inline">Search...</span>
              <kbd className="hidden rounded bg-[#2a2a2a] px-1 text-xs lg:inline">⌘K</kbd>
            </button>

            <LanguageSwitcher />

            <Link
              href="/"
              className="rounded-lg px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-[#2a2a2a]/30 hover:text-[#29E7CD]"
            >
              {t('nav.backToLanding', 'Landing')}
            </Link>
          </div>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-80 transform border-r border-[#2a2a2a] bg-[#1f1f1f] transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between border-b border-[#2a2a2a] p-4">
            <h2 className="text-lg font-semibold text-white">Navigation</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="rounded-lg p-1 transition-colors hover:bg-[#2a2a2a]/50"
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

          {/* Search */}
          <div className="border-b border-[#2a2a2a] p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search navigation..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/30 px-3 py-2 pl-10 text-white placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
              />
              <svg
                className="absolute top-2.5 left-3 h-4 w-4 text-gray-400"
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

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="mb-6">
                <h3 className="mb-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">
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
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`group flex items-center space-x-3 rounded-lg px-3 py-2 transition-all duration-200 ${
                        isActive(item.href)
                          ? 'border border-[#29E7CD]/20 bg-[#29E7CD]/10'
                          : 'hover:bg-[#2a2a2a]/50'
                      }`}
                    >
                      <span
                        className={`${isActive(item.href) ? item.color : 'group-hover: text-gray-400' + item.color.replace('text-', 'text-')}`}
                      >
                        {item.icon}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          isActive(item.href)
                            ? 'text-white'
                            : 'text-gray-300 group-hover:text-white'
                        }`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Footer */}
          <div className="border-t border-[#2a2a2a] p-4">
            <div className="text-center text-xs text-gray-500">
              Press <kbd className="rounded bg-[#2a2a2a] px-1">⌘B</kbd> to toggle sidebar
            </div>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsSearchOpen(false)}
        >
          <div className="flex items-start justify-center pt-20" onClick={e => e.stopPropagation()}>
            <div className="mx-4 w-full max-w-2xl">
              <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] shadow-xl">
                <div className="border-b border-[#2a2a2a] p-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search navigation..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/30 px-4 py-3 pl-12 text-lg text-white placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                      autoFocus
                    />
                    <svg
                      className="absolute top-3.5 left-4 h-5 w-5 text-gray-400"
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
                  {filteredItems.length > 0 ? (
                    <div className="space-y-1">
                      {filteredItems.map(item => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center space-x-3 rounded-lg px-3 py-2 transition-colors hover:bg-[#2a2a2a]/50"
                        >
                          <span className="text-gray-400">{item.icon}</span>
                          <span className="text-gray-300">{item.label}</span>
                          <span className="ml-auto text-xs text-gray-500">{item.category}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-gray-400">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
}
