'use client';
import { Icon } from '@/components/ui/Icon';
import { logger } from '@/lib/logger';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Check, ChefHat, Shield, Star, Zap } from 'lucide-react';
import { useState } from 'react';

/**
 * CurbOSPricing component.
 * Renders the 4-tier pricing grid (Starter, Pro, Business, CurbOS Only).
 *
 * @returns {JSX.Element} The rendered pricing section.
 */
export function CurbOSPricing() {
  const { user } = useUser();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleSubscribe = async (tier: string) => {
    if (!user) {
      window.location.href = `/api/auth/login?returnTo=/pricing`;
      return;
    }

    setLoadingTier(tier);
    try {
      const response = await fetch('/api/billing/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
    } catch (error) {
      logger.error('Subscription error:', error);
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <section className="tablet:px-6 desktop:px-8 relative px-4">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="tablet:text-6xl font-sans text-4xl font-black tracking-tight text-white">
            PLANS FOR EVERY <span className="text-[#CCFF00]">KITCHEN</span>
          </h1>
          <p className="mt-4 text-xl text-gray-400">
            From single food trucks to multi-location enterprises.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="tablet:grid-cols-2 mt-16 grid grid-cols-1 gap-8 xl:grid-cols-4">
          {/* 1. Starter */}
          <div className="relative rounded-2xl border border-white/10 bg-[#111] p-8 shadow-xl transition-all hover:-translate-y-1 hover:border-white/20">
            <h3 className="flex items-center gap-2 text-lg font-bold text-white">
              <Icon icon={ChefHat} size="sm" className="text-gray-400" /> Starter
            </h3>
            <p className="mt-2 text-sm text-gray-400">Essential tools for small ops.</p>
            <div className="mt-6 flex items-baseline">
              <span className="text-3xl font-bold text-white">$29</span>
              <span className="ml-2 text-sm text-gray-400">/ month</span>
            </div>
            <button
              onClick={() => handleSubscribe('starter')}
              disabled={!!loadingTier}
              className="mt-8 block w-full rounded-lg border border-white/20 bg-transparent px-4 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-white/10 disabled:opacity-50"
            >
              {loadingTier === 'starter' ? 'Loading...' : 'Start Free Trial'}
            </button>
            <ul className="mt-8 space-y-4 text-sm text-gray-300">
              <li className="flex items-center">
                <Icon icon={Check} size="sm" className="mr-3 text-[#CCFF00]" /> Recipe Costing
              </li>
              <li className="flex items-center">
                <Icon icon={Check} size="sm" className="mr-3 text-[#CCFF00]" /> Inventory Basics
              </li>
              <li className="flex items-center">
                <Icon icon={Check} size="sm" className="mr-3 text-[#CCFF00]" /> 1 User
              </li>
            </ul>
          </div>

          {/* 2. Pro */}
          <div className="relative rounded-2xl border border-[#CCFF00]/30 bg-[#111] p-8 shadow-xl transition-all hover:-translate-y-1 hover:border-[#CCFF00]/50">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-[#CCFF00]/50 bg-[#CCFF00]/20 px-3 py-0.5 text-[10px] font-bold tracking-wide text-[#CCFF00] uppercase">
              Popular
            </div>
            <h3 className="flex items-center gap-2 text-lg font-bold text-white">
              <Icon icon={Star} size="sm" className="text-[#CCFF00]" /> Pro
            </h3>
            <p className="mt-2 text-sm text-gray-400">Growing businesses & cafes.</p>
            <div className="mt-6 flex items-baseline">
              <span className="text-3xl font-bold text-white">$49</span>
              <span className="ml-2 text-sm text-gray-400">/ month</span>
            </div>
            <button
              onClick={() => handleSubscribe('pro')}
              disabled={!!loadingTier}
              className="mt-8 block w-full rounded-lg bg-[#CCFF00] px-4 py-3 text-center text-sm font-bold text-black transition-transform hover:scale-105 disabled:scale-100 disabled:opacity-50"
            >
              {loadingTier === 'pro' ? 'Loading...' : 'Start Free Trial'}
            </button>
            <ul className="mt-8 space-y-4 text-sm text-gray-300">
              <li className="flex items-center">
                <Icon icon={Check} size="sm" className="mr-3 text-[#CCFF00]" /> Everything in
                Starter
              </li>
              <li className="flex items-center">
                <Icon icon={Check} size="sm" className="mr-3 text-[#CCFF00]" /> Advanced Reporting
              </li>
              <li className="flex items-center">
                <Icon icon={Check} size="sm" className="mr-3 text-[#CCFF00]" /> 5 Users
              </li>
              <li className="flex items-center">
                <Icon icon={Check} size="sm" className="mr-3 text-[#CCFF00]" /> Priority Support
              </li>
            </ul>
          </div>

          {/* 3. Business */}
          <div className="relative rounded-2xl border border-white/10 bg-[#111] p-8 shadow-xl transition-all hover:-translate-y-1 hover:border-white/20">
            <h3 className="flex items-center gap-2 text-lg font-bold text-white">
              <Icon icon={Shield} size="sm" className="text-purple-400" /> Business
            </h3>
            <p className="mt-2 text-sm text-gray-400">For multi-location ops.</p>
            <div className="mt-6 flex items-baseline">
              <span className="text-3xl font-bold text-white">$79</span>
              <span className="ml-2 text-sm text-gray-400">/ month</span>
            </div>
            <button
              onClick={() => handleSubscribe('business')}
              disabled={!!loadingTier}
              className="mt-8 block w-full rounded-lg border border-purple-500/50 bg-purple-500/10 px-4 py-3 text-center text-sm font-bold text-purple-300 transition-colors hover:bg-purple-500/20 disabled:opacity-50"
            >
              {loadingTier === 'business' ? 'Loading...' : 'Start Free Trial'}
            </button>
            <ul className="mt-8 space-y-4 text-sm text-gray-300">
              <li className="flex items-center">
                <Icon icon={Check} size="sm" className="mr-3 text-[#CCFF00]" /> Everything in Pro
              </li>
              <li className="flex items-center">
                <Icon icon={Check} size="sm" className="mr-3 text-[#CCFF00]" /> Unlimited Users
              </li>
              <li className="flex items-center">
                <Icon icon={Check} size="sm" className="mr-3 text-[#CCFF00]" /> Multi-Location
              </li>
              <li className="flex items-center">
                <Icon icon={Check} size="sm" className="mr-3 text-[#CCFF00]" /> API Access
              </li>
            </ul>
          </div>

          {/* 4. CurbOS Standalone */}
          <div className="relative rounded-2xl border-2 border-[#CCFF00] bg-[#000] p-8 shadow-[0_0_30px_-10px_rgba(204,255,0,0.2)] transition-all hover:-translate-y-1">
            <h3 className="flex items-center gap-2 text-lg font-bold text-[#CCFF00]">
              <Icon icon={Zap} size="sm" className="text-[#CCFF00]" /> CurbOS Only
            </h3>
            <p className="mt-2 text-sm text-gray-400">Just the Kitchen Display System.</p>
            <div className="mt-6 flex items-baseline">
              <span className="text-3xl font-bold text-white">$39</span>
              <span className="ml-2 text-sm text-gray-400">/ month</span>
            </div>
            <button
              onClick={() => handleSubscribe('curbos')}
              disabled={!!loadingTier}
              className="mt-8 block w-full rounded-lg bg-[#CCFF00] px-4 py-3 text-center text-sm font-bold text-black transition-transform hover:scale-105 disabled:scale-100 disabled:opacity-50"
            >
              {loadingTier === 'curbos' ? 'Loading...' : 'Get CurbOS KDS'}
            </button>
            <ul className="mt-8 space-y-4 text-sm text-gray-300">
              <li className="flex items-center">
                <Icon icon={Check} size="sm" className="mr-3 text-[#CCFF00]" /> Unlimited KDS
                Screens
              </li>
              <li className="flex items-center">
                <Icon icon={Check} size="sm" className="mr-3 text-[#CCFF00]" /> Real-time Sync
              </li>
              <li className="flex items-center">
                <Icon icon={Check} size="sm" className="mr-3 text-[#CCFF00]" /> Ticket Management
              </li>
              <li className="flex items-center">
                <Icon icon={Check} size="sm" className="mr-3 text-[#CCFF00]" /> All-Day Display Mode
              </li>
            </ul>
          </div>
        </div>

        {/* FAQ Link */}
        <div className="mt-16 text-center">
          <p className="text-gray-500">
            Questions about our plans?{' '}
            <a href="mailto:hello@prepflow.org" className="text-[#CCFF00] hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
