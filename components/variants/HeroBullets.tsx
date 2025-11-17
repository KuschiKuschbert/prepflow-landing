// PrepFlow - Hero Bullets Component
// Extracted from HeroVariants.tsx to meet file size limits

'use client';

import React from 'react';
import { Bullet } from './HeroContent';

interface HeroBulletsProps {
  t: (key: string, fallback?: string | any[]) => string | any[];
  variant: 'control' | 'variantA' | 'variantB' | 'variantC';
}

export function HeroBullets({ t, variant }: HeroBulletsProps) {
  if (variant === 'control') {
    return (
      <ul className="text-fluid-base mt-8 space-y-3 text-gray-300">
        <Bullet>
          <strong>Item Profit & Popularity</strong> — know what to promote, fix, or drop to raise
          gross profit
        </Bullet>
        <Bullet>
          <strong>Recipe Builder</strong> — auto-calculate COGS, GP$, and GP% for every dish,
          instantly
        </Bullet>
        <Bullet>
          <strong>Yield/Waste Aware</strong> — realistic ingredient costs — no fantasy margins
        </Bullet>
        <Bullet>
          <strong>GST-Ready for AU</strong> — price confidently; avoid surprises
        </Bullet>
        <Bullet>
          <strong>Menu Mix Intelligence</strong> — &quot;Chef&apos;s Kiss / Hidden Gem / Bargain
          Bucket&quot; categories to guide decisions
        </Bullet>
        <Bullet>
          <strong>AI Method Generator</strong> — discover new cooking methods that could improve
          your margins and reduce waste
        </Bullet>
      </ul>
    );
  }

  if (variant === 'variantA') {
    return (
      <ul className="text-fluid-base mt-8 space-y-3 text-gray-300">
        <Bullet>
          <strong>{t('hero.variantA.bullet1.title', 'Stop the Bleeding')}</strong> —{' '}
          {t(
            'hero.variantA.bullet1.description',
            'identify which menu items are costing you money',
          )}
        </Bullet>
        <Bullet>
          <strong>{t('hero.variantA.bullet2.title', 'Real Cost Analysis')}</strong> —{' '}
          {t(
            'hero.variantA.bullet2.description',
            'see true ingredient costs including waste and yields',
          )}
        </Bullet>
        <Bullet>
          <strong>{t('hero.variantA.bullet3.title', 'Profit Optimization')}</strong> —{' '}
          {t('hero.variantA.bullet3.description', 'know which dishes to promote, fix, or remove')}
        </Bullet>
        <Bullet>
          <strong>{t('hero.variantA.bullet4.title', 'GST Compliance')}</strong> —{' '}
          {t(
            'hero.variantA.bullet4.description',
            'price correctly for Australian tax requirements',
          )}
        </Bullet>
        <Bullet>
          <strong>{t('hero.variantA.bullet5.title', 'Smart Menu Decisions')}</strong> —{' '}
          {t('hero.variantA.bullet5.description', 'data-driven choices about your menu mix')}
        </Bullet>
        <Bullet>
          <strong>{t('hero.variantA.bullet6.title', 'AI Kitchen Insights')}</strong> —{' '}
          {t('hero.variantA.bullet6.description', 'discover new methods to improve margins')}
        </Bullet>
      </ul>
    );
  }

  if (variant === 'variantB') {
    return (
      <ul className="text-fluid-base mt-8 space-y-3 text-gray-300">
        <Bullet>
          <strong>{t('hero.variantB.bullet1.title', 'Profit Maximization')}</strong> —{' '}
          {t('hero.variantB.bullet1.description', 'identify your highest-margin opportunities')}
        </Bullet>
        <Bullet>
          <strong>{t('hero.variantB.bullet2.title', 'Cost Transparency')}</strong> —{' '}
          {t('hero.variantB.bullet2.description', 'see exactly what each dish costs to make')}
        </Bullet>
        <Bullet>
          <strong>{t('hero.variantB.bullet3.title', 'Menu Optimization')}</strong> —{' '}
          {t('hero.variantB.bullet3.description', 'know which items to feature or remove')}
        </Bullet>
        <Bullet>
          <strong>{t('hero.variantB.bullet4.title', 'Tax Compliance')}</strong> —{' '}
          {t('hero.variantB.bullet4.description', 'GST-ready pricing for Australian businesses')}
        </Bullet>
        <Bullet>
          <strong>{t('hero.variantB.bullet5.title', 'Performance Tracking')}</strong> —{' '}
          {t('hero.variantB.bullet5.description', 'monitor which dishes drive your profit')}
        </Bullet>
        <Bullet>
          <strong>{t('hero.variantB.bullet6.title', 'AI Optimization')}</strong> —{' '}
          {t('hero.variantB.bullet6.description', 'get suggestions to improve your margins')}
        </Bullet>
      </ul>
    );
  }

  // variantC
  return (
    <ul className="text-fluid-base mt-8 space-y-3 text-gray-300">
      <Bullet>
        <strong>{t('hero.variantC.bullet1.title', 'Cost Breakdown')}</strong> —{' '}
        {t('hero.variantC.bullet1.description', 'see exactly what each dish costs to make')}
      </Bullet>
      <Bullet>
        <strong>{t('hero.variantC.bullet2.title', 'Profit Calculation')}</strong> —{' '}
        {t('hero.variantC.bullet2.description', 'know your margin on every item')}
      </Bullet>
      <Bullet>
        <strong>{t('hero.variantC.bullet3.title', 'Menu Decisions')}</strong> —{' '}
        {t('hero.variantC.bullet3.description', 'decide what to keep, change, or remove')}
      </Bullet>
      <Bullet>
        <strong>{t('hero.variantC.bullet4.title', 'GST Ready')}</strong> —{' '}
        {t('hero.variantC.bullet4.description', 'Australian tax compliance built-in')}
      </Bullet>
      <Bullet>
        <strong>{t('hero.variantC.bullet5.title', 'Easy Setup')}</strong> —{' '}
        {t('hero.variantC.bullet5.description', 'works in Google Sheets, no new software')}
      </Bullet>
      <Bullet>
        <strong>{t('hero.variantC.bullet6.title', 'Smart Insights')}</strong> —{' '}
        {t('hero.variantC.bullet6.description', 'AI suggestions to improve your margins')}
      </Bullet>
    </ul>
  );
}
