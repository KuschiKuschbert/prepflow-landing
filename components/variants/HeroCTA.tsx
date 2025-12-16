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
          gradient: 'from-[var(--accent)] to-[var(--primary)]',
          shadow: 'hover:shadow-[#D925C7]/25',
        };
      case 'variantB':
        return {
          text: t('hero.variantB.ctaPrimary', 'Get Sample Dashboard'),
          href: '#lead-magnet',
          gradient: 'from-[var(--color-info)] to-[var(--primary)]',
          shadow: 'hover:shadow-[var(--color-info)]/25',
        };
      case 'variantC':
        return {
          text: t('hero.variantC.ctaPrimary', 'Get Sample Dashboard'),
          href: '#lead-magnet',
          gradient: 'from-[var(--primary)] to-[var(--accent)]',
          shadow: 'hover:shadow-[var(--primary)]/25',
        };
      default:
        return {
          text: t('hero.ctaPrimary', 'Get PrepFlow Now - $29 AUD'),
          href: 'https://7495573591101.gumroad.com/l/prepflow',
          gradient: 'from-[var(--primary)] to-[var(--color-info)]',
          shadow: 'hover:shadow-[var(--primary)]/25',
        };
    }
  };

  const getSecondaryCTA = () => {
    switch (variant) {
      case 'variantA':
        return {
          text: t('hero.variantA.ctaSecondary', 'Get Free Sample'),
          href: '#lead-magnet',
          borderHover: 'hover:border-[var(--accent)] hover:text-[var(--accent)]',
        };
      case 'variantB':
        return {
          text: t('hero.variantB.ctaSecondary', 'Try Sample Sheet'),
          href: '#lead-magnet',
          borderHover: 'hover:border-[var(--color-info)] hover:text-[var(--color-info)]',
        };
      case 'variantC':
        return {
          text: t('hero.variantC.ctaSecondary', 'Free Sample'),
          href: '#lead-magnet',
          borderHover: 'hover:border-[var(--primary)] hover:text-[var(--primary)]',
        };
      default:
        return {
          text: t('hero.ctaSecondary', 'Get Free Sample'),
          href: '#lead-magnet',
          borderHover: 'hover:border-[var(--primary)] hover:text-[var(--primary)]',
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
        className={`rounded-2xl bg-gradient-to-r ${primary.gradient} text-fluid-base px-8 py-4 font-semibold text-[var(--button-active-text)] shadow-lg transition-all duration-300 hover:shadow-xl ${primary.shadow}`}
        onClick={() => handleEngagement?.('hero_cta_click')}
      >
        {primary.text}
      </a>
      <a
        href={secondary.href}
        className={`text-fluid-base rounded-2xl border border-[var(--border)] px-8 py-4 font-semibold text-[var(--foreground-secondary)] transition-all duration-300 ${secondary.borderHover}`}
        onClick={() => handleEngagement?.('hero_demo_click')}
      >
        {secondary.text}
      </a>
      <p className="text-fluid-sm w-full text-[var(--foreground-subtle)]">{getDisclaimer()}</p>
    </div>
  );
}
