// PrepFlow - Hero CTA Component
// Extracted from HeroVariants.tsx to meet file size limits

'use client';

import React from 'react';

interface HeroCTAProps {
  t: (key: string, fallback?: string | any[]) => string | any[];
  handleEngagement?: (event: string) => void;
  variant: 'control' | 'variantA' | 'variantB' | 'variantC';
}

export function HeroCTA({ t, handleEngagement, variant }: HeroCTAProps) {
  const getPrimaryCTA = () => {
    switch (variant) {
      case 'variantA':
        return {
          text: t('hero.variantA.ctaPrimary', 'Get Sample Dashboard'),
          href: '#lead-magnet',
          gradient: 'from-[#D925C7] to-[#29E7CD]',
          shadow: 'hover:shadow-[#D925C7]/25',
        };
      case 'variantB':
        return {
          text: t('hero.variantB.ctaPrimary', 'Get Sample Dashboard'),
          href: '#lead-magnet',
          gradient: 'from-[#3B82F6] to-[#29E7CD]',
          shadow: 'hover:shadow-[#3B82F6]/25',
        };
      case 'variantC':
        return {
          text: t('hero.variantC.ctaPrimary', 'Get Sample Dashboard'),
          href: '#lead-magnet',
          gradient: 'from-[#29E7CD] to-[#D925C7]',
          shadow: 'hover:shadow-[#29E7CD]/25',
        };
      default:
        return {
          text: t('hero.ctaPrimary', 'Get PrepFlow Now - $29 AUD'),
          href: 'https://7495573591101.gumroad.com/l/prepflow',
          gradient: 'from-[#29E7CD] to-[#3B82F6]',
          shadow: 'hover:shadow-[#29E7CD]/25',
        };
    }
  };

  const getSecondaryCTA = () => {
    switch (variant) {
      case 'variantA':
        return {
          text: t('hero.variantA.ctaSecondary', 'Get Free Sample'),
          href: '#lead-magnet',
          borderHover: 'hover:border-[#D925C7] hover:text-[#D925C7]',
        };
      case 'variantB':
        return {
          text: t('hero.variantB.ctaSecondary', 'Try Sample Sheet'),
          href: '#lead-magnet',
          borderHover: 'hover:border-[#3B82F6] hover:text-[#3B82F6]',
        };
      case 'variantC':
        return {
          text: t('hero.variantC.ctaSecondary', 'Free Sample'),
          href: '#lead-magnet',
          borderHover: 'hover:border-[#29E7CD] hover:text-[#29E7CD]',
        };
      default:
        return {
          text: t('hero.ctaSecondary', 'Get Free Sample'),
          href: '#lead-magnet',
          borderHover: 'hover:border-[#29E7CD] hover:text-[#29E7CD]',
        };
    }
  };

  const getDisclaimer = () => {
    switch (variant) {
      case 'variantA':
        return t(
          'hero.variantA.disclaimer',
          'Built for Australian cafés and restaurants. No lock-in. 7-day refund policy.',
        );
      case 'variantB':
        return t(
          'hero.variantB.disclaimer',
          'Designed for Australian hospitality. Simple setup. 7-day refund guarantee.',
        );
      case 'variantC':
        return t(
          'hero.variantC.disclaimer',
          'For Australian cafés and restaurants. 7-day refund policy.',
        );
      default:
        return t(
          'hero.disclaimer',
          'Works for cafés, food trucks, small restaurants. No lock-in. 7-day refund policy. Results may vary based on your current menu and operations.',
        );
    }
  };

  const primary = getPrimaryCTA();
  const secondary = getSecondaryCTA();

  return (
    <div className="mt-10 flex flex-wrap items-center gap-4">
      <a
        href={primary.href}
        target={variant === 'control' ? '_blank' : undefined}
        rel={variant === 'control' ? 'noopener noreferrer' : undefined}
        className={`rounded-2xl bg-gradient-to-r ${primary.gradient} px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl ${primary.shadow}`}
        onClick={() => handleEngagement?.('hero_cta_click')}
      >
        {primary.text}
      </a>
      <a
        href={secondary.href}
        className={`rounded-2xl border border-gray-600 px-8 py-4 text-base font-semibold text-gray-300 transition-all duration-300 ${secondary.borderHover}`}
        onClick={() => handleEngagement?.('hero_demo_click')}
      >
        {secondary.text}
      </a>
      <p className="w-full text-sm text-gray-500">{getDisclaimer()}</p>
    </div>
  );
}
