'use client';

import { Inter } from 'next/font/google';
import Link from 'next/link';
import OptimizedImage from '../../components/OptimizedImage';
import { useState, useEffect, useRef } from 'react';
import '../globals.css';
import { useTranslation } from '@/lib/useTranslation';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { CountryProvider } from '../../contexts/CountryContext';
import { GlobalWarningProvider } from '../../contexts/GlobalWarningContext';
import ReactQueryProvider from '@/components/ReactQueryProvider';
import GlobalWarning from '@/components/GlobalWarning';

const inter = Inter({ subsets: ['latin'] });

export default function WebAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { t } = useTranslation();
  const [isRestaurantMenuOpen, setIsRestaurantMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRestaurantMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <CountryProvider>
      <GlobalWarningProvider>
        <div className={`${inter.className} bg-[#0a0a0a] text-white`}>
          <nav className="border-b border-[#2a2a2a] bg-[#1f1f1f]">
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="mx-auto max-w-7xl px-6 py-4">
                <div className="flex items-center justify-between">
                  {/* Logo */}
                  <Link href="/webapp" className="flex items-center space-x-3">
                    <OptimizedImage
                      src="/images/prepflow-logo.png"
                      alt="PrepFlow Logo"
                      width={140}
                      height={45}
                      className="h-9 w-auto"
                      priority={true}
                    />
                  </Link>

                  {/* Main Navigation */}
                  <div className="flex items-center space-x-8">
                    {/* Core Features */}
                    <div className="flex items-center space-x-6">
                      <Link
                        href="/webapp"
                        className="group flex items-center space-x-2 rounded-xl px-3 py-2 transition-all duration-200 hover:bg-[#2a2a2a]/50"
                      >
                        <svg
                          className="h-5 w-5 text-gray-400 transition-colors group-hover:text-[#29E7CD]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
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
                        <span className="font-medium text-gray-300 transition-colors group-hover:text-[#29E7CD]">
                          {t('nav.dashboard', 'Dashboard')}
                        </span>
                      </Link>

                      <Link
                        href="/webapp/ingredients"
                        className="group flex items-center space-x-2 rounded-xl px-3 py-2 transition-all duration-200 hover:bg-[#2a2a2a]/50"
                      >
                        <svg
                          className="h-5 w-5 text-gray-400 transition-colors group-hover:text-[#29E7CD]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                        <span className="font-medium text-gray-300 transition-colors group-hover:text-[#29E7CD]">
                          {t('nav.ingredients', 'Ingredients')}
                        </span>
                      </Link>

                      <Link
                        href="/webapp/recipes"
                        className="group flex items-center space-x-2 rounded-xl px-3 py-2 transition-all duration-200 hover:bg-[#2a2a2a]/50"
                      >
                        <svg
                          className="h-5 w-5 text-gray-400 transition-colors group-hover:text-[#3B82F6]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                        <span className="font-medium text-gray-300 transition-colors group-hover:text-[#3B82F6]">
                          {t('nav.recipes', 'Recipes')}
                        </span>
                      </Link>

                      <Link
                        href="/webapp/cogs"
                        className="group flex items-center space-x-2 rounded-xl px-3 py-2 transition-all duration-200 hover:bg-[#2a2a2a]/50"
                      >
                        <svg
                          className="h-5 w-5 text-gray-400 transition-colors group-hover:text-[#D925C7]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="font-medium text-gray-300 transition-colors group-hover:text-[#D925C7]">
                          {t('nav.cogs', 'COGS')}
                        </span>
                      </Link>

                      <Link
                        href="/webapp/performance"
                        className="group flex items-center space-x-2 rounded-xl px-3 py-2 transition-all duration-200 hover:bg-[#2a2a2a]/50"
                      >
                        <svg
                          className="h-5 w-5 text-gray-400 transition-colors group-hover:text-[#29E7CD]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                        <span className="font-medium text-gray-300 transition-colors group-hover:text-[#29E7CD]">
                          {t('nav.performance', 'Performance')}
                        </span>
                      </Link>
                    </div>

                    {/* Restaurant Management Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => setIsRestaurantMenuOpen(!isRestaurantMenuOpen)}
                        className="group flex items-center space-x-2 rounded-xl px-4 py-2 transition-all duration-200 hover:bg-[#2a2a2a]/50"
                      >
                        <svg
                          className="h-5 w-5 text-gray-400 transition-colors group-hover:text-[#29E7CD]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        <span className="font-medium text-gray-300 transition-colors group-hover:text-[#29E7CD]">
                          {t('nav.restaurant', 'Restaurant')}
                        </span>
                        <svg
                          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isRestaurantMenuOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {/* Dropdown Menu */}
                      {isRestaurantMenuOpen && (
                        <div className="absolute top-full left-0 z-50 mt-2 w-80 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] shadow-xl">
                          <div className="p-4">
                            <h3 className="mb-3 px-2 text-sm font-semibold tracking-wide text-gray-400 uppercase">
                              {t('nav.operations', 'Operations')}
                            </h3>
                            <div className="mb-4 grid grid-cols-2 gap-2">
                              <Link
                                href="/webapp/cleaning"
                                className="group flex items-center space-x-3 rounded-xl p-3 transition-all duration-200 hover:bg-[#2a2a2a]/50"
                              >
                                <span className="text-lg">🧹</span>
                                <span className="text-sm text-gray-300 transition-colors group-hover:text-[#29E7CD]">
                                  {t('nav.cleaning', 'Cleaning')}
                                </span>
                              </Link>
                              <Link
                                href="/webapp/temperature"
                                className="group flex items-center space-x-3 rounded-xl p-3 transition-all duration-200 hover:bg-[#2a2a2a]/50"
                              >
                                <span className="text-lg">🌡️</span>
                                <span className="text-sm text-gray-300 transition-colors group-hover:text-[#3B82F6]">
                                  {t('nav.temperature', 'Temperature')}
                                </span>
                              </Link>
                              <Link
                                href="/webapp/compliance"
                                className="group flex items-center space-x-3 rounded-xl p-3 transition-all duration-200 hover:bg-[#2a2a2a]/50"
                              >
                                <span className="text-lg">📋</span>
                                <span className="text-sm text-gray-300 transition-colors group-hover:text-[#D925C7]">
                                  {t('nav.compliance', 'Compliance')}
                                </span>
                              </Link>
                              <Link
                                href="/webapp/suppliers"
                                className="group flex items-center space-x-3 rounded-xl p-3 transition-all duration-200 hover:bg-[#2a2a2a]/50"
                              >
                                <span className="text-lg">🚚</span>
                                <span className="text-sm text-gray-300 transition-colors group-hover:text-[#29E7CD]">
                                  {t('nav.suppliers', 'Suppliers')}
                                </span>
                              </Link>
                            </div>

                            <h3 className="mb-3 px-2 text-sm font-semibold tracking-wide text-gray-400 uppercase">
                              {t('nav.inventory', 'Inventory')}
                            </h3>
                            <div className="mb-4 grid grid-cols-2 gap-2">
                              <Link
                                href="/webapp/par-levels"
                                className="group flex items-center space-x-3 rounded-xl p-3 transition-all duration-200 hover:bg-[#2a2a2a]/50"
                              >
                                <span className="text-lg">📦</span>
                                <span className="text-sm text-gray-300 transition-colors group-hover:text-[#3B82F6]">
                                  {t('nav.parLevels', 'Par Levels')}
                                </span>
                              </Link>
                              <Link
                                href="/webapp/order-lists"
                                className="group flex items-center space-x-3 rounded-xl p-3 transition-all duration-200 hover:bg-[#2a2a2a]/50"
                              >
                                <span className="text-lg">📋</span>
                                <span className="text-sm text-gray-300 transition-colors group-hover:text-[#D925C7]">
                                  {t('nav.orderLists', 'Order Lists')}
                                </span>
                              </Link>
                            </div>

                            <h3 className="mb-3 px-2 text-sm font-semibold tracking-wide text-gray-400 uppercase">
                              {t('nav.kitchen', 'Kitchen')}
                            </h3>
                            <div className="mb-4 grid grid-cols-2 gap-2">
                              <Link
                                href="/webapp/dish-sections"
                                className="group flex items-center space-x-3 rounded-xl p-3 transition-all duration-200 hover:bg-[#2a2a2a]/50"
                              >
                                <span className="text-lg">🍽️</span>
                                <span className="text-sm text-gray-300 transition-colors group-hover:text-[#29E7CD]">
                                  {t('nav.dishSections', 'Dish Sections')}
                                </span>
                              </Link>
                              <Link
                                href="/webapp/prep-lists"
                                className="group flex items-center space-x-3 rounded-xl p-3 transition-all duration-200 hover:bg-[#2a2a2a]/50"
                              >
                                <span className="text-lg">📝</span>
                                <span className="text-sm text-gray-300 transition-colors group-hover:text-[#3B82F6]">
                                  {t('nav.prepLists', 'Prep Lists')}
                                </span>
                              </Link>
                            </div>

                            <h3 className="mb-3 px-2 text-sm font-semibold tracking-wide text-gray-400 uppercase">
                              {t('nav.tools', 'Tools')}
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                              <Link
                                href="/webapp/ai-specials"
                                className="group flex items-center space-x-3 rounded-xl p-3 transition-all duration-200 hover:bg-[#2a2a2a]/50"
                              >
                                <span className="text-lg">🤖</span>
                                <span className="text-sm text-gray-300 transition-colors group-hover:text-[#29E7CD]">
                                  {t('nav.aiSpecials', 'AI Specials')}
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side Actions */}
                  <div className="flex items-center space-x-4">
                    <LanguageSwitcher />
                    <Link
                      href="/webapp/setup"
                      className="group flex items-center space-x-2 rounded-xl px-3 py-2 transition-all duration-200 hover:bg-[#2a2a2a]/50"
                    >
                      <svg
                        className="h-5 w-5 text-gray-400 transition-colors group-hover:text-[#29E7CD]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
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
                      <span className="font-medium text-gray-300 transition-colors group-hover:text-[#29E7CD]">
                        {t('nav.setup', 'Setup')}
                      </span>
                    </Link>
                    <Link
                      href="/"
                      className="rounded-xl px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-[#2a2a2a]/50 hover:text-[#29E7CD]"
                    >
                      {t('nav.backToLanding', 'Back to Landing')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <div className="flex items-center justify-between px-4 py-3">
                <Link href="/webapp" className="flex items-center">
                  <OptimizedImage
                    src="/images/prepflow-logo.png"
                    alt="PrepFlow Logo"
                    width={100}
                    height={32}
                    className="h-6 w-auto"
                    priority={true}
                  />
                </Link>
                <div className="flex items-center space-x-2">
                  <LanguageSwitcher />
                  <Link
                    href="/"
                    className="text-sm text-gray-400 transition-colors hover:text-[#29E7CD]"
                  >
                    {t('nav.backToLanding', 'Back to Landing')}
                  </Link>
                </div>
              </div>

              {/* Mobile Navigation Tabs */}
              <div className="border-t border-[#2a2a2a]">
                <div className="scrollbar-hide flex overflow-x-auto px-2">
                  {/* Core Features */}
                  <Link
                    href="/webapp"
                    className="flex-shrink-0 border-b-2 border-transparent px-3 py-3 text-sm transition-colors hover:border-[#29E7CD] hover:text-[#29E7CD]"
                  >
                    <div className="flex min-w-[60px] flex-col items-center space-y-1">
                      <div className="flex h-6 w-6 items-center justify-center">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                        </svg>
                      </div>
                      <span className="text-xs">{t('nav.dashboard', 'Dashboard')}</span>
                    </div>
                  </Link>

                  <Link
                    href="/webapp/ingredients"
                    className="flex-shrink-0 border-b-2 border-transparent px-3 py-3 text-sm transition-colors hover:border-[#29E7CD] hover:text-[#29E7CD]"
                  >
                    <div className="flex min-w-[60px] flex-col items-center space-y-1">
                      <div className="flex h-6 w-6 items-center justify-center">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-xs">{t('nav.ingredients', 'Ingredients')}</span>
                    </div>
                  </Link>

                  <Link
                    href="/webapp/recipes"
                    className="flex-shrink-0 border-b-2 border-transparent px-3 py-3 text-sm transition-colors hover:border-[#3B82F6] hover:text-[#3B82F6]"
                  >
                    <div className="flex min-w-[60px] flex-col items-center space-y-1">
                      <div className="flex h-6 w-6 items-center justify-center">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 0a1 1 0 100 2h.01a1 1 0 100-2H9zm2 0a1 1 0 100 2h.01a1 1 0 100-2h-.01z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-xs">{t('nav.recipes', 'Recipes')}</span>
                    </div>
                  </Link>

                  <Link
                    href="/webapp/cogs"
                    className="flex-shrink-0 border-b-2 border-transparent px-3 py-3 text-sm transition-colors hover:border-[#D925C7] hover:text-[#D925C7]"
                  >
                    <div className="flex min-w-[60px] flex-col items-center space-y-1">
                      <div className="flex h-6 w-6 items-center justify-center">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-xs">{t('nav.cogs', 'COGS')}</span>
                    </div>
                  </Link>

                  <Link
                    href="/webapp/performance"
                    className="flex-shrink-0 border-b-2 border-transparent px-3 py-3 text-sm transition-colors hover:border-[#29E7CD] hover:text-[#29E7CD]"
                  >
                    <div className="flex min-w-[60px] flex-col items-center space-y-1">
                      <div className="flex h-6 w-6 items-center justify-center">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-xs">{t('nav.performance', 'Performance')}</span>
                    </div>
                  </Link>

                  {/* Restaurant Management Button */}
                  <button
                    onClick={() => setIsRestaurantMenuOpen(!isRestaurantMenuOpen)}
                    className="flex-shrink-0 border-b-2 border-transparent px-3 py-3 text-sm transition-colors hover:border-[#29E7CD] hover:text-[#29E7CD]"
                  >
                    <div className="flex min-w-[60px] flex-col items-center space-y-1">
                      <div className="flex h-6 w-6 items-center justify-center">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-xs">{t('nav.restaurant', 'More')}</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Mobile Restaurant Menu */}
              {isRestaurantMenuOpen && (
                <div className="border-t border-[#2a2a2a] bg-[#1f1f1f]">
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        href="/webapp/cleaning"
                        className="group flex items-center space-x-3 rounded-xl p-3 transition-all duration-200 hover:bg-[#2a2a2a]/50"
                      >
                        <span className="text-lg">🧹</span>
                        <span className="text-sm text-gray-300 transition-colors group-hover:text-[#29E7CD]">
                          {t('nav.cleaning', 'Cleaning')}
                        </span>
                      </Link>
                      <Link
                        href="/webapp/temperature"
                        className="group flex items-center space-x-3 rounded-xl p-3 transition-all duration-200 hover:bg-[#2a2a2a]/50"
                      >
                        <span className="text-lg">🌡️</span>
                        <span className="text-sm text-gray-300 transition-colors group-hover:text-[#3B82F6]">
                          {t('nav.temperature', 'Temperature')}
                        </span>
                      </Link>
                      <Link
                        href="/webapp/compliance"
                        className="group flex items-center space-x-3 rounded-xl p-3 transition-all duration-200 hover:bg-[#2a2a2a]/50"
                      >
                        <span className="text-lg">📋</span>
                        <span className="text-sm text-gray-300 transition-colors group-hover:text-[#D925C7]">
                          {t('nav.compliance', 'Compliance')}
                        </span>
                      </Link>
                      <Link
                        href="/webapp/suppliers"
                        className="group flex items-center space-x-3 rounded-xl p-3 transition-all duration-200 hover:bg-[#2a2a2a]/50"
                      >
                        <span className="text-lg">🚚</span>
                        <span className="text-sm text-gray-300 transition-colors group-hover:text-[#29E7CD]">
                          {t('nav.suppliers', 'Suppliers')}
                        </span>
                      </Link>
                      <Link
                        href="/webapp/par-levels"
                        className="group flex items-center space-x-3 rounded-xl p-3 transition-all duration-200 hover:bg-[#2a2a2a]/50"
                      >
                        <span className="text-lg">📦</span>
                        <span className="text-sm text-gray-300 transition-colors group-hover:text-[#3B82F6]">
                          {t('nav.parLevels', 'Par Levels')}
                        </span>
                      </Link>
                      <Link
                        href="/webapp/order-lists"
                        className="group flex items-center space-x-3 rounded-xl p-3 transition-all duration-200 hover:bg-[#2a2a2a]/50"
                      >
                        <span className="text-lg">📋</span>
                        <span className="text-sm text-gray-300 transition-colors group-hover:text-[#D925C7]">
                          {t('nav.orderLists', 'Order Lists')}
                        </span>
                      </Link>
                      <Link
                        href="/webapp/dish-sections"
                        className="group flex items-center space-x-3 rounded-xl p-3 transition-all duration-200 hover:bg-[#2a2a2a]/50"
                      >
                        <span className="text-lg">🍽️</span>
                        <span className="text-sm text-gray-300 transition-colors group-hover:text-[#29E7CD]">
                          {t('nav.dishSections', 'Dish Sections')}
                        </span>
                      </Link>
                      <Link
                        href="/webapp/prep-lists"
                        className="group flex items-center space-x-3 rounded-xl p-3 transition-all duration-200 hover:bg-[#2a2a2a]/50"
                      >
                        <span className="text-lg">📝</span>
                        <span className="text-sm text-gray-300 transition-colors group-hover:text-[#3B82F6]">
                          {t('nav.prepLists', 'Prep Lists')}
                        </span>
                      </Link>
                      <Link
                        href="/webapp/ai-specials"
                        className="group flex items-center space-x-3 rounded-xl p-3 transition-all duration-200 hover:bg-[#2a2a2a]/50"
                      >
                        <span className="text-lg">🤖</span>
                        <span className="text-sm text-gray-300 transition-colors group-hover:text-[#29E7CD]">
                          {t('nav.aiSpecials', 'AI Specials')}
                        </span>
                      </Link>
                      <Link
                        href="/webapp/setup"
                        className="group flex items-center space-x-3 rounded-xl p-3 transition-all duration-200 hover:bg-[#2a2a2a]/50"
                      >
                        <span className="text-lg">⚙️</span>
                        <span className="text-sm text-gray-300 transition-colors group-hover:text-[#29E7CD]">
                          {t('nav.setup', 'Setup')}
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Global Warning System - Bar under navigation */}
          <GlobalWarning />

          <main className="min-h-screen bg-[#0a0a0a]">
            <ReactQueryProvider>{children}</ReactQueryProvider>
          </main>
        </div>
      </GlobalWarningProvider>
    </CountryProvider>
  );
}
