'use client';
import { Icon } from '@/components/ui/Icon';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Check, Zap } from 'lucide-react';
import { useState } from 'react';

import { logger } from '@/lib/logger';

export function CurbOSPricing() {
  const { user, isLoading } = useUser();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const handleSubscribe = async (tier: string) => {
    if (!user) {
      window.location.href = `/api/auth/login?returnTo=/pricing`;
      return;
    }

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
    }
  };

  return (
    <section className="relative px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="font-sans text-4xl font-black tracking-tight text-white sm:text-6xl">
            POWER YOUR <span className="text-[#CCFF00]">KITCHEN</span>
          </h1>
          <p className="mt-4 text-xl text-gray-400">
            Choose the right tools for your culinary operation.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-8">
          {/* 1. PrepFlow Core (Gumroad) */}
          <div className="relative rounded-2xl border border-white/10 bg-[#111] p-8 shadow-2xl transition-transform hover:-translate-y-1">
            <h3 className="text-xl font-bold text-white">Menu Clarity Tool</h3>
            <p className="mt-2 text-sm text-gray-400">Perfect for standardized recipe costing.</p>
            <div className="mt-6 flex items-baseline">
              <span className="text-4xl font-bold text-white">$29</span>
              <span className="ml-2 text-sm text-gray-400">/ lifetime</span>
            </div>
            <a
              href="https://7495573591101.gumroad.com/l/prepflow"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 block w-full rounded-lg border border-white/20 bg-transparent px-4 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-white/10"
            >
              Get Template
            </a>
            <ul className="mt-8 space-y-4 text-sm text-gray-300">
              <li className="flex items-center">
                <Icon icon={Check} size="sm" className="mr-3 text-[#CCFF00]" /> Google Sheet
                Template
              </li>
              <li className="flex items-center">
                <Icon icon={Check} size="sm" className="mr-3 text-[#CCFF00]" /> Auto COGS & GP%
              </li>
              <li className="flex items-center">
                <Icon icon={Check} size="sm" className="mr-3 text-[#CCFF00]" /> Video Tutorials
              </li>
            </ul>
          </div>

          {/* 2. CurbOS Standalone (Business Tier - assumed) */}
          <div className="relative z-10 scale-105 transform rounded-2xl border-2 border-[#CCFF00] bg-[#111] p-8 shadow-[0_0_40px_-10px_rgba(204,255,0,0.3)]">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#CCFF00] px-4 py-1 text-xs font-bold tracking-wide text-black uppercase">
              Most Popular
            </div>
            <h3 className="text-xl font-bold text-[#CCFF00]">CurbOS KDS</h3>
            <p className="mt-2 text-sm text-gray-400">Complete Android Kitchen Display System.</p>
            <div className="mt-6 flex items-baseline">
              <span className="text-4xl font-bold text-white">$49</span>
              <span className="ml-2 text-sm text-gray-400">/ month</span>
            </div>
            <button
              onClick={() => handleSubscribe('curbos')}
              className="mt-8 block w-full rounded-lg bg-[#CCFF00] px-4 py-3 text-center text-sm font-bold text-black transition-transform hover:scale-105"
            >
              Start Free Trial
            </button>
            <p className="mt-2 text-center text-xs text-gray-500">
              7-day free trial, cancel anytime.
            </p>
            <ul className="mt-8 space-y-4 text-sm text-gray-300">
              <li className="flex items-center">
                <Icon icon={Zap} size="sm" className="mr-3 text-[#CCFF00]" /> Unlimited KDS Screens
              </li>
              <li className="flex items-center">
                <Icon icon={Zap} size="sm" className="mr-3 text-[#CCFF00]" /> Real-time Sync
              </li>
              <li className="flex items-center">
                <Icon icon={Zap} size="sm" className="mr-3 text-[#CCFF00]" /> Ticket Management
              </li>
              <li className="flex items-center">
                <Icon icon={Zap} size="sm" className="mr-3 text-[#CCFF00]" /> All-Day Display Mode
              </li>
            </ul>
          </div>

          {/* 3. Business Bundle */}
          <div className="relative rounded-2xl border border-white/10 bg-[#111] p-8 shadow-2xl transition-transform hover:-translate-y-1">
            <h3 className="text-xl font-bold text-white">Business Bundle</h3>
            <p className="mt-2 text-sm text-gray-400">Full stack operation control.</p>
            <div className="mt-6 flex items-baseline">
              <span className="text-4xl font-bold text-white">$79</span>
              <span className="ml-2 text-sm text-gray-400">/ month</span>
            </div>
            <button
              onClick={() => handleSubscribe('bundle')}
              className="mt-8 block w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-white/10"
            >
              Contact Sales
            </button>
            <ul className="mt-8 space-y-4 text-sm text-gray-300">
              <li className="flex items-center">
                <Icon icon={Check} size="sm" className="mr-3 text-[#CCFF00]" /> Everything in CurbOS
              </li>
              <li className="flex items-center">
                <Icon icon={Check} size="sm" className="mr-3 text-[#CCFF00]" /> Advanced Analytics
              </li>
              <li className="flex items-center">
                <Icon icon={Check} size="sm" className="mr-3 text-[#CCFF00]" /> Multi-Location
                Support
              </li>
              <li className="flex items-center">
                <Icon icon={Check} size="sm" className="mr-3 text-[#CCFF00]" /> Priority Support
              </li>
            </ul>
          </div>
        </div>

        {/* Comparison / FAQ Section Link */}
        <div className="mt-16 text-center">
          <p className="text-gray-500">
            Need a custom enterprise solution?{' '}
            <a href="mailto:hello@prepflow.org" className="text-[#CCFF00] hover:underline">
              Contact us
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
