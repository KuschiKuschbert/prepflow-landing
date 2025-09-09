'use client';

import React from 'react';
import OptimizedImage from '../OptimizedImage';

interface HeroProps {
  t: (key: string, fallback?: string | any[]) => string | any[];
  handleEngagement?: (event: string) => void;
}

// Control Hero (Original)
export function ControlHero({ t, handleEngagement }: HeroProps) {
  return (
    <section id="hero" className="grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          <span className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent">
            {t('hero.title', 'Stop Guessing Your Menu\'s Profit')}
          </span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-300 md:text-xl">
          {t('hero.subtitle', 'See exactly which dishes make money and which eat your profit. Built from 20 years of real kitchen experience.')}
        </p>
        <ul className="mt-8 space-y-3 text-base text-gray-300">
          <Bullet><strong>Item Profit & Popularity</strong> — know what to promote, fix, or drop to raise gross profit</Bullet>
          <Bullet><strong>Recipe Builder</strong> — auto-calculate COGS, GP$, and GP% for every dish, instantly</Bullet>
          <Bullet><strong>Yield/Waste Aware</strong> — realistic ingredient costs — no fantasy margins</Bullet>
          <Bullet><strong>GST-Ready for AU</strong> — price confidently; avoid surprises</Bullet>
          <Bullet><strong>Menu Mix Intelligence</strong> — "Chef's Kiss / Hidden Gem / Bargain Bucket" categories to guide decisions</Bullet>
          <Bullet><strong>AI Method Generator</strong> — discover new cooking methods that could improve your margins and reduce waste</Bullet>
        </ul>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a 
            href="https://7495573591101.gumroad.com/l/prepflow"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#29E7CD]/25 transition-all duration-300"
            onClick={() => handleEngagement?.('hero_cta_click')}
          >
            {t('hero.ctaPrimary', 'Get PrepFlow Now - $29 AUD')}
          </a>
          <a 
            href="#lead-magnet" 
            className="rounded-2xl border border-gray-600 px-8 py-4 text-base font-semibold text-gray-300 hover:border-[#29E7CD] hover:text-[#29E7CD] transition-all duration-300"
            onClick={() => handleEngagement?.('hero_demo_click')}
          >
            {t('hero.ctaSecondary', 'Get Free Sample')}
          </a>
          <p className="w-full text-sm text-gray-500">{t('hero.disclaimer', 'Works for cafés, food trucks, small restaurants. No lock-in. 7-day refund policy. Results may vary based on your current menu and operations.')}</p>
        </div>
      </div>

      {/* PrepFlow Dashboard Screenshot */}
      <div className="relative">
        <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 blur-2xl" />
        <div className="rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-6 shadow-2xl">
          <div className="relative">
            <OptimizedImage 
              src="/images/dashboard-screenshot.png" 
              alt={String(t('hero.dashboardAlt', 'PrepFlow Dashboard showing COGS metrics, profit analysis, and item performance charts'))}
              width={800}
              height={500}
              className="w-full h-auto rounded-xl border border-gray-600"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
            />
            {/* Action Overlay */}
            <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
              <div className="text-center text-white">
                <div className="bg-[#29E7CD] text-black px-4 py-2 rounded-lg font-semibold mb-2">
                  Live GP% Dashboard
                </div>
                <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  View Dashboard
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <OptimizedImage 
              src="/images/settings-screenshot.png" 
              alt="PrepFlow Settings page with business configuration"
              width={200}
              height={96}
              className="h-24 w-full object-cover rounded-lg border border-gray-600"
              sizes="(max-width: 768px) 33vw, (max-width: 1200px) 16vw, 12vw"
            />
            <OptimizedImage 
              src="/images/recipe-screenshot.png" 
              alt="PrepFlow Recipe costing for Double Cheese Burger"
              width={200}
              height={96}
              className="h-24 w-full object-cover rounded-lg border border-gray-600"
              sizes="(max-width: 768px) 33vw, (max-width: 1200px) 16vw, 12vw"
            />
            <OptimizedImage 
              src="/images/stocklist-screenshot.png" 
              alt="PrepFlow Infinite Stock List with ingredient management"
              width={200}
              height={96}
              className="h-24 w-full object-cover rounded-lg border border-gray-600"
              sizes="(max-width: 768px) 33vw, (max-width: 1200px) 16vw, 12vw"
            />
          </div>
          <p className="mt-4 text-center text-sm text-gray-500">Dashboard · Settings · Recipe Costing · Stock Management</p>
        </div>
      </div>
    </section>
  );
}

// Variant A - Problem-Focused Hero
export function VariantAHero({ t, handleEngagement }: HeroProps) {
  return (
    <section id="hero" className="grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          <span className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent">
            {t('hero.variantA.title', 'Stop losing money on your menu.')}
          </span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-300 md:text-xl">
          {t('hero.variantA.subtitle', 'Most restaurants don\'t know which dishes are profitable. PrepFlow shows you exactly where your money is going — and how to fix it.')}
        </p>
        <ul className="mt-8 space-y-3 text-base text-gray-300">
          <Bullet><strong>{t('hero.variantA.bullet1.title', 'Stop the Bleeding')}</strong> — {t('hero.variantA.bullet1.description', 'identify which menu items are costing you money')}</Bullet>
          <Bullet><strong>{t('hero.variantA.bullet2.title', 'Real Cost Analysis')}</strong> — {t('hero.variantA.bullet2.description', 'see true ingredient costs including waste and yields')}</Bullet>
          <Bullet><strong>{t('hero.variantA.bullet3.title', 'Profit Optimization')}</strong> — {t('hero.variantA.bullet3.description', 'know which dishes to promote, fix, or remove')}</Bullet>
          <Bullet><strong>{t('hero.variantA.bullet4.title', 'GST Compliance')}</strong> — {t('hero.variantA.bullet4.description', 'price correctly for Australian tax requirements')}</Bullet>
          <Bullet><strong>{t('hero.variantA.bullet5.title', 'Smart Menu Decisions')}</strong> — {t('hero.variantA.bullet5.description', 'data-driven choices about your menu mix')}</Bullet>
          <Bullet><strong>{t('hero.variantA.bullet6.title', 'AI Kitchen Insights')}</strong> — {t('hero.variantA.bullet6.description', 'discover new methods to improve margins')}</Bullet>
        </ul>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a 
            href="#lead-magnet" 
            className="rounded-2xl bg-gradient-to-r from-[#D925C7] to-[#29E7CD] px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#D925C7]/25 transition-all duration-300"
            onClick={() => handleEngagement?.('hero_cta_click')}
          >
            {t('hero.variantA.ctaPrimary', 'Get Sample Dashboard')}
          </a>
          <a 
            href="#lead-magnet" 
            className="rounded-2xl border border-gray-600 px-8 py-4 text-base font-semibold text-gray-300 hover:border-[#D925C7] hover:text-[#D925C7] transition-all duration-300"
            onClick={() => handleEngagement?.('hero_demo_click')}
          >
            {t('hero.variantA.ctaSecondary', 'Get Free Sample')}
          </a>
          <p className="w-full text-sm text-gray-500">{t('hero.variantA.disclaimer', 'Built for Australian cafés and restaurants. No lock-in. 7-day refund policy.')}</p>
        </div>
      </div>

      {/* PrepFlow Dashboard Screenshot */}
      <div className="relative">
        <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-[#D925C7]/20 to-[#29E7CD]/20 blur-2xl" />
        <div className="rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-6 shadow-2xl">
          <div className="relative">
            <OptimizedImage 
              src="/images/dashboard-screenshot.png" 
              alt="PrepFlow Dashboard showing profit analysis and cost breakdown"
              width={800}
              height={500}
              className="w-full h-auto rounded-xl border border-gray-600"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
            />
            {/* Action Overlay */}
            <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
              <div className="text-center text-white">
                <div className="bg-[#D925C7] text-white px-4 py-2 rounded-lg font-semibold mb-2">
                  Profit Analysis Dashboard
                </div>
                <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  View Dashboard
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <OptimizedImage 
              src="/images/settings-screenshot.png" 
              alt="PrepFlow Settings page"
              width={200}
              height={96}
              className="h-24 w-full object-cover rounded-lg border border-gray-600"
              sizes="(max-width: 768px) 33vw, (max-width: 1200px) 16vw, 12vw"
            />
            <OptimizedImage 
              src="/images/recipe-screenshot.png" 
              alt="PrepFlow Recipe costing"
              width={200}
              height={96}
              className="h-24 w-full object-cover rounded-lg border border-gray-600"
              sizes="(max-width: 768px) 33vw, (max-width: 1200px) 16vw, 12vw"
            />
            <OptimizedImage 
              src="/images/stocklist-screenshot.png" 
              alt="PrepFlow Stock management"
              width={200}
              height={96}
              className="h-24 w-full object-cover rounded-lg border border-gray-600"
              sizes="(max-width: 768px) 33vw, (max-width: 1200px) 16vw, 12vw"
            />
          </div>
          <p className="mt-4 text-center text-sm text-gray-500">Profit Analysis · Recipe Costing · Stock Management</p>
        </div>
      </div>
    </section>
  );
}

// Variant B - Results-Focused Hero
export function VariantBHero({ t, handleEngagement }: HeroProps) {
  return (
    <section id="hero" className="grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          <span className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent">
            {t('hero.variantB.title', 'Turn your menu into a profit machine.')}
          </span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-300 md:text-xl">
          {t('hero.variantB.subtitle', 'Transform guesswork into data-driven decisions. PrepFlow gives you the insights to maximize every dollar on your menu.')}
        </p>
        <ul className="mt-8 space-y-3 text-base text-gray-300">
          <Bullet><strong>{t('hero.variantB.bullet1.title', 'Profit Maximization')}</strong> — {t('hero.variantB.bullet1.description', 'identify your highest-margin opportunities')}</Bullet>
          <Bullet><strong>{t('hero.variantB.bullet2.title', 'Cost Transparency')}</strong> — {t('hero.variantB.bullet2.description', 'see exactly what each dish costs to make')}</Bullet>
          <Bullet><strong>{t('hero.variantB.bullet3.title', 'Menu Optimization')}</strong> — {t('hero.variantB.bullet3.description', 'know which items to feature or remove')}</Bullet>
          <Bullet><strong>{t('hero.variantB.bullet4.title', 'Tax Compliance')}</strong> — {t('hero.variantB.bullet4.description', 'GST-ready pricing for Australian businesses')}</Bullet>
          <Bullet><strong>{t('hero.variantB.bullet5.title', 'Performance Tracking')}</strong> — {t('hero.variantB.bullet5.description', 'monitor which dishes drive your profit')}</Bullet>
          <Bullet><strong>{t('hero.variantB.bullet6.title', 'AI Optimization')}</strong> — {t('hero.variantB.bullet6.description', 'get suggestions to improve your margins')}</Bullet>
        </ul>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a 
            href="#lead-magnet" 
            className="rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#29E7CD] px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#3B82F6]/25 transition-all duration-300"
            onClick={() => handleEngagement?.('hero_cta_click')}
          >
            {t('hero.variantB.ctaPrimary', 'Get Sample Dashboard')}
          </a>
          <a 
            href="#lead-magnet" 
            className="rounded-2xl border border-gray-600 px-8 py-4 text-base font-semibold text-gray-300 hover:border-[#3B82F6] hover:text-[#3B82F6] transition-all duration-300"
            onClick={() => handleEngagement?.('hero_demo_click')}
          >
            {t('hero.variantB.ctaSecondary', 'Try Sample Sheet')}
          </a>
          <p className="w-full text-sm text-gray-500">{t('hero.variantB.disclaimer', 'Designed for Australian hospitality. Simple setup. 7-day refund guarantee.')}</p>
        </div>
      </div>

      {/* PrepFlow Dashboard Screenshot */}
      <div className="relative">
        <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-[#3B82F6]/20 to-[#29E7CD]/20 blur-2xl" />
        <div className="rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-6 shadow-2xl">
          <div className="relative">
            <OptimizedImage 
              src="/images/dashboard-screenshot.png" 
              alt="PrepFlow Dashboard showing profit optimization and performance metrics"
              width={800}
              height={500}
              className="w-full h-auto rounded-xl border border-gray-600"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
            />
            {/* Action Overlay */}
            <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
              <div className="text-center text-white">
                <div className="bg-[#3B82F6] text-white px-4 py-2 rounded-lg font-semibold mb-2">
                  Profit Optimization
                </div>
                <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  View Dashboard
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <OptimizedImage 
              src="/images/settings-screenshot.png" 
              alt="PrepFlow Settings"
              width={200}
              height={96}
              className="h-24 w-full object-cover rounded-lg border border-gray-600"
              sizes="(max-width: 768px) 33vw, (max-width: 1200px) 16vw, 12vw"
            />
            <OptimizedImage 
              src="/images/recipe-screenshot.png" 
              alt="PrepFlow Recipe analysis"
              width={200}
              height={96}
              className="h-24 w-full object-cover rounded-lg border border-gray-600"
              sizes="(max-width: 768px) 33vw, (max-width: 1200px) 16vw, 12vw"
            />
            <OptimizedImage 
              src="/images/stocklist-screenshot.png" 
              alt="PrepFlow Stock tracking"
              width={200}
              height={96}
              className="h-24 w-full object-cover rounded-lg border border-gray-600"
              sizes="(max-width: 768px) 33vw, (max-width: 1200px) 16vw, 12vw"
            />
          </div>
          <p className="mt-4 text-center text-sm text-gray-500">Profit Dashboard · Recipe Analysis · Stock Tracking</p>
        </div>
      </div>
    </section>
  );
}

// Variant C - Simple/Direct Hero
export function VariantCHero({ t, handleEngagement }: HeroProps) {
  return (
    <section id="hero" className="grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          <span className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] bg-clip-text text-transparent">
            {t('hero.variantC.title', 'Know your menu costs. Make more profit.')}
          </span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-300 md:text-xl">
          {t('hero.variantC.subtitle', 'PrepFlow shows you exactly what each dish costs and how much profit it makes. Simple Google Sheet. Real results.')}
        </p>
        <ul className="mt-8 space-y-3 text-base text-gray-300">
          <Bullet><strong>{t('hero.variantC.bullet1.title', 'Cost Breakdown')}</strong> — {t('hero.variantC.bullet1.description', 'see exactly what each dish costs to make')}</Bullet>
          <Bullet><strong>{t('hero.variantC.bullet2.title', 'Profit Calculation')}</strong> — {t('hero.variantC.bullet2.description', 'know your margin on every item')}</Bullet>
          <Bullet><strong>{t('hero.variantC.bullet3.title', 'Menu Decisions')}</strong> — {t('hero.variantC.bullet3.description', 'decide what to keep, change, or remove')}</Bullet>
          <Bullet><strong>{t('hero.variantC.bullet4.title', 'GST Ready')}</strong> — {t('hero.variantC.bullet4.description', 'Australian tax compliance built-in')}</Bullet>
          <Bullet><strong>{t('hero.variantC.bullet5.title', 'Easy Setup')}</strong> — {t('hero.variantC.bullet5.description', 'works in Google Sheets, no new software')}</Bullet>
          <Bullet><strong>{t('hero.variantC.bullet6.title', 'Smart Insights')}</strong> — {t('hero.variantC.bullet6.description', 'AI suggestions to improve your margins')}</Bullet>
        </ul>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a 
            href="#lead-magnet" 
            className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-[#29E7CD]/25 transition-all duration-300"
            onClick={() => handleEngagement?.('hero_cta_click')}
          >
            {t('hero.variantC.ctaPrimary', 'Get Sample Dashboard')}
          </a>
          <a 
            href="#lead-magnet" 
            className="rounded-2xl border border-gray-600 px-8 py-4 text-base font-semibold text-gray-300 hover:border-[#29E7CD] hover:text-[#29E7CD] transition-all duration-300"
            onClick={() => handleEngagement?.('hero_demo_click')}
          >
            {t('hero.variantC.ctaSecondary', 'Free Sample')}
          </a>
          <p className="w-full text-sm text-gray-500">{t('hero.variantC.disclaimer', 'For Australian cafés and restaurants. 7-day refund policy.')}</p>
        </div>
      </div>

      {/* PrepFlow Dashboard Screenshot */}
      <div className="relative">
        <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 blur-2xl" />
        <div className="rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 backdrop-blur-sm p-6 shadow-2xl">
          <div className="relative">
            <OptimizedImage 
              src="/images/dashboard-screenshot.png" 
              alt="PrepFlow Dashboard showing cost analysis and profit metrics"
              width={800}
              height={500}
              className="w-full h-auto rounded-xl border border-gray-600"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
            />
            {/* Action Overlay */}
            <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
              <div className="text-center text-white">
                <div className="bg-[#29E7CD] text-black px-4 py-2 rounded-lg font-semibold mb-2">
                  Cost Analysis Dashboard
                </div>
                <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  View Dashboard
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <OptimizedImage 
              src="/images/settings-screenshot.png" 
              alt="PrepFlow Settings"
              width={200}
              height={96}
              className="h-24 w-full object-cover rounded-lg border border-gray-600"
              sizes="(max-width: 768px) 33vw, (max-width: 1200px) 16vw, 12vw"
            />
            <OptimizedImage 
              src="/images/recipe-screenshot.png" 
              alt="PrepFlow Recipe costs"
              width={200}
              height={96}
              className="h-24 w-full object-cover rounded-lg border border-gray-600"
              sizes="(max-width: 768px) 33vw, (max-width: 1200px) 16vw, 12vw"
            />
            <OptimizedImage 
              src="/images/stocklist-screenshot.png" 
              alt="PrepFlow Stock list"
              width={200}
              height={96}
              className="h-24 w-full object-cover rounded-lg border border-gray-600"
              sizes="(max-width: 768px) 33vw, (max-width: 1200px) 16vw, 12vw"
            />
          </div>
          <p className="mt-4 text-center text-sm text-gray-500">Cost Analysis · Recipe Costs · Stock List</p>
        </div>
      </div>
    </section>
  );
}

// Helper component
function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-2 h-3 w-3 rounded-full bg-gradient-to-r from-[#29E7CD] to-[#D925C7]" />
      {children}
    </li>
  );
}
