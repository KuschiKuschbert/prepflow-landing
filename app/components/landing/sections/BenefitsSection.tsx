'use client';

import { GlowCard } from '@/components/ui/GlowCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import {
  LANDING_COLORS,
  LANDING_LAYOUT,
  LANDING_TYPOGRAPHY,
  getGlowColor,
  getSectionClasses,
  getStaggerDelay,
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
      color: LANDING_COLORS.primary,
    },
    {
      title: t('benefits.time.title', 'No More 2 AM Excel'),
      description: t(
        'benefits.time.description',
        'Calculations happen automatically. No formulas to break. No spreadsheets to maintain. Just accurate costs, instantly.',
      ),
      color: LANDING_COLORS.secondary,
    },
    {
      title: t('benefits.confidence.title', 'Price Without Guessing'),
      description: t(
        'benefits.confidence.description',
        'Set your target margin. Get the price. No math, no stress, no "is this right?" moments.',
      ),
      color: LANDING_COLORS.accent,
    },
  ];

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
          {benefits.map((benefit, index) => (
            <ScrollReveal
              key={`benefit-${index}-${benefit.title}`}
              variant="fade-up"
              delay={getStaggerDelay(index)}
            >
              <GlowCard glowColor={getGlowColor(benefit.color)} className="p-8">
                <h4
                  className={`${LANDING_TYPOGRAPHY.xl} mb-4 font-light ${benefit.color === LANDING_COLORS.primary ? 'text-[#29E7CD]' : benefit.color === LANDING_COLORS.secondary ? 'text-[#D925C7]' : 'text-[#3B82F6]'}`}
                >
                  {benefit.title}
                </h4>
                <p className={`${LANDING_TYPOGRAPHY.base} leading-relaxed text-gray-400`}>
                  {benefit.description}
                </p>
              </GlowCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
