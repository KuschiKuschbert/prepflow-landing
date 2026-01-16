'use client';

import { GlowCard } from '@/components/ui/GlowCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import {
    LANDING_LAYOUT,
    LANDING_TYPOGRAPHY,
    getSectionClasses,
    getStaggerDelay
} from '@/lib/landing-styles';
import { useTranslation } from '../../../../lib/useTranslation';

export function BenefitsSection() {
  const { t } = useTranslation();

  const benefits = [
    {
      title: t('benefits.profit.title', 'Stop Losing Money'),
      description: t(
        'benefits.profit.description',
        "Find the dishes bleeding profit and fix them. Or remove them. Your call—but now you'll know.",
      ),
      color: 'primary',
    },
    {
      title: t('benefits.time.title', 'No More 2 AM Excel'),
      description: t(
        'benefits.time.description',
        'Calculations happen automatically. No formulas to break. No spreadsheets to maintain. Just accurate costs, instantly.',
      ),
      color: 'secondary',
    },
    {
      title: t('benefits.confidence.title', 'Price Without Guessing'),
      description: t(
        'benefits.confidence.description',
        'Set your target margin. Get the price. No math, no stress, no "is this right?" moments.',
      ),
      color: 'accent',
    },
  ];

  /*
   * Helper to map our semantic color names to the specific glow colors expected by GlowCard
   * and Tailwind text classes.
   */
  const getColors = (color: string) => {
    switch(color) {
      case 'primary': return { glow: 'cyan', text: 'text-landing-primary' };
      case 'secondary': return { glow: 'blue', text: 'text-landing-secondary' };
      case 'accent': return { glow: 'magenta', text: 'text-landing-accent' };
      default: return { glow: 'blue', text: 'text-landing-secondary' };
    }
  };

  return (
    <section id="benefits" className={getSectionClasses({ padding: 'large' })}>
      <div className={LANDING_LAYOUT.container}>
        <ScrollReveal variant="fade-up">
          <h3
            className={`${LANDING_TYPOGRAPHY['4xl']} desktop:text-fluid-5xl mb-16 text-center font-light tracking-tight text-white`}
          >
            {t('benefits.title', 'What You Get')}
          </h3>
        </ScrollReveal>
        <div className="tablet:gap-10 desktop:gap-12 large-desktop:gap-14 tablet:[grid-template-columns:repeat(auto-fit,minmax(300px,1fr))] desktop:[grid-template-columns:repeat(auto-fit,minmax(320px,1fr))] grid [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))] gap-12 xl:gap-16">
          {benefits.map((benefit, index) => {
            const colors = getColors(benefit.color);
            return (
            <ScrollReveal
              key={`benefit-${index}-${benefit.title}`}
              variant="fade-up"
              delay={getStaggerDelay(index)}
            >
              <GlowCard glowColor={colors.glow as any} className="p-8">
                <h4
                  className={`${LANDING_TYPOGRAPHY.xl} mb-4 font-light ${colors.text}`}
                >
                  {benefit.title}
                </h4>
                <p className={`${LANDING_TYPOGRAPHY.base} leading-relaxed text-gray-400`}>
                  {benefit.description}
                </p>
              </GlowCard>
            </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
