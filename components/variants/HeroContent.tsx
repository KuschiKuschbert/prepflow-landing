// PrepFlow - Hero Content Component
// Extracted from HeroVariants.tsx to meet file size limits

'use client';

import React from 'react';

interface HeroContentProps {
  t: (key: string, fallback?: string | any[]) => string | any[];
  handleEngagement?: (event: string) => void;
  variant: 'control' | 'variantA' | 'variantB' | 'variantC';
  children?: React.ReactNode;
}

export function HeroContent({ t, handleEngagement, variant, children }: HeroContentProps) {
  const getTitle = () => {
    switch (variant) {
      case 'variantA':
        return t('hero.variantA.title', 'Stop losing money on your menu.');
      case 'variantB':
        return t('hero.variantB.title', 'Turn your menu into a profit machine.');
      case 'variantC':
        return t('hero.variantC.title', 'Know your menu costs. Make more profit.');
      default:
        return t('hero.title', "Stop Guessing Your Menu's Profit");
    }
  };

  const getSubtitle = () => {
    switch (variant) {
      case 'variantA':
        return t(
          'hero.variantA.subtitle',
          "Most restaurants don't know which dishes are profitable. PrepFlow shows you exactly where your money is going — and how to fix it.",
        );
      case 'variantB':
        return t(
          'hero.variantB.subtitle',
          'Transform guesswork into data-driven decisions. PrepFlow gives you the insights to maximize every dollar on your menu.',
        );
      case 'variantC':
        return t(
          'hero.variantC.subtitle',
          'PrepFlow shows you exactly what each dish costs and how much profit it makes. Simple Google Sheet. Real results.',
        );
      default:
        return t(
          'hero.subtitle',
          'See exactly which dishes make money and which eat your profit. Built from 20 years of real kitchen experience.',
        );
    }
  };

  return (
    <div>
      <h1 className="text-fluid-4xl tablet:text-fluid-4xl desktop:text-fluid-4xl font-extrabold tracking-tight">
        <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
          {getTitle()}
        </span>
      </h1>
      <p className="text-fluid-lg desktop:text-fluid-xl mt-6 leading-8 text-[var(--foreground-secondary)]">
        {getSubtitle()}
      </p>
      {children}
    </div>
  );
}

// Helper component
export function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-2 h-3 w-3 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]" />
      {children}
    </li>
  );
}
