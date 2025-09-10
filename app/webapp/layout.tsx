'use client';

import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "../globals.css";
import { useTranslation } from "@/lib/useTranslation";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const inter = Inter({ subsets: ["latin"] });

export default function WebAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { t } = useTranslation();

  return (
    <div className={`${inter.className} bg-[#0a0a0a] text-white`}>
      <nav className="bg-[#1f1f1f] border-b border-[#2a2a2a]">
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Link href="/webapp" className="flex items-center space-x-2">
                  <Image
                    src="/images/prepflow-logo.png"
                    alt="PrepFlow Logo"
                    width={120}
                    height={40}
                    className="h-8 w-auto"
                    priority
                  />
                </Link>
                <ul className="flex space-x-4">
                  <li><Link href="/webapp" className="text-gray-300 hover:text-[#29E7CD] transition-colors">{t('nav.dashboard', 'Dashboard')}</Link></li>
                  <li><Link href="/webapp/ingredients" className="text-gray-300 hover:text-[#29E7CD] transition-colors">{t('nav.ingredients', 'Ingredients')}</Link></li>
                  <li><Link href="/webapp/recipes" className="text-gray-300 hover:text-[#29E7CD] transition-colors">{t('nav.recipes', 'Recipe Book')}</Link></li>
                  <li><Link href="/webapp/cogs" className="text-gray-300 hover:text-[#29E7CD] transition-colors">{t('nav.cogs', 'COGS')}</Link></li>
                  <li><Link href="/webapp/setup" className="text-gray-300 hover:text-[#29E7CD] transition-colors">{t('nav.setup', 'Setup')}</Link></li>
                </ul>
              </div>
              <div className="flex items-center space-x-4">
                <LanguageSwitcher className="mr-4" />
                <Link href="/" className="text-sm text-gray-400 hover:text-[#29E7CD] transition-colors">
                  {t('nav.backToLanding', 'Back to Landing')}
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Rail */}
          <div className="md:hidden">
            <div className="px-4 py-3 flex justify-between items-center">
              <Link href="/webapp" className="flex items-center">
                <Image
                  src="/images/prepflow-logo.png"
                  alt="PrepFlow Logo"
                  width={100}
                  height={32}
                  className="h-6 w-auto"
                  priority
                />
              </Link>
              <div className="flex items-center space-x-2">
                <LanguageSwitcher />
                <Link href="/" className="text-sm text-gray-400 hover:text-[#29E7CD] transition-colors">
                  {t('nav.backToLanding', 'Back to Landing')}
                </Link>
              </div>
            </div>
            <div className="border-t border-[#2a2a2a]">
              <div className="flex overflow-x-auto scrollbar-hide">
                <Link href="/webapp" className="flex-shrink-0 px-4 py-3 text-sm hover:text-[#29E7CD] transition-colors border-b-2 border-transparent hover:border-[#29E7CD]">
                  <div className="flex flex-col items-center space-y-1">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                      </svg>
                    </div>
                    <span className="text-xs">{t('nav.dashboard', 'Dashboard')}</span>
                  </div>
                </Link>
                <Link href="/webapp/ingredients" className="flex-shrink-0 px-4 py-3 text-sm hover:text-[#29E7CD] transition-colors border-b-2 border-transparent hover:border-[#29E7CD]">
                  <div className="flex flex-col items-center space-y-1">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <span className="text-xs">{t('nav.ingredients', 'Ingredients')}</span>
                  </div>
                </Link>
                <Link href="/webapp/recipes" className="flex-shrink-0 px-4 py-3 text-sm hover:text-[#29E7CD] transition-colors border-b-2 border-transparent hover:border-[#29E7CD]">
                  <div className="flex flex-col items-center space-y-1">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 0a1 1 0 100 2h.01a1 1 0 100-2H9zm2 0a1 1 0 100 2h.01a1 1 0 100-2h-.01z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <span className="text-xs">{t('nav.recipes', 'Recipe Book')}</span>
                  </div>
                </Link>
                <Link href="/webapp/cogs" className="flex-shrink-0 px-4 py-3 text-sm hover:text-[#29E7CD] transition-colors border-b-2 border-transparent hover:border-[#29E7CD]">
                  <div className="flex flex-col items-center space-y-1">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <span className="text-xs">{t('nav.cogs', 'COGS')}</span>
                  </div>
                </Link>
                <Link href="/webapp/setup" className="flex-shrink-0 px-4 py-3 text-sm hover:text-[#29E7CD] transition-colors border-b-2 border-transparent hover:border-[#29E7CD]">
                  <div className="flex flex-col items-center space-y-1">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <span className="text-xs">{t('nav.setup', 'Setup')}</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </nav>
      <main className="min-h-screen bg-[#0a0a0a]">
        {children}
      </main>
    </div>
  );
}
