'use client';

import React from 'react';
import LandingHeader from '../components/landing/LandingHeader';
import LandingFooter from '../components/landing/LandingFooter';
import LandingBackground from '../components/landing/LandingBackground';
import { CurbOSPricing } from '@/components/pricing/CurbOSPricing';

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#CCFF00] selection:text-black">
      <div className="fixed inset-0 -z-20 bg-[#0a0a0a]" />
      <LandingBackground />

      <LandingHeader />

      <div className="pt-32 pb-20">
        <CurbOSPricing />
      </div>

      <LandingFooter />
    </main>
  );
}
