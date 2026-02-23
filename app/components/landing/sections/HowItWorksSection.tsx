'use client';

import { GlowCard } from '@/components/ui/GlowCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { LANDING_LAYOUT, LANDING_TYPOGRAPHY, getSectionClasses } from '@/lib/landing-styles';
import { motion } from 'framer-motion';
import { useTranslation } from '../../../../lib/useTranslation';

export function HowItWorksSection() {
  const { t } = useTranslation();
  const titleValue = t('howItWorks.title', 'Get Results in 3 Simple Steps');

  const GLOW_COLORS = {
    cyan: 'rgba(41, 231, 205, 0.15)',
    blue: 'rgba(59, 130, 246, 0.15)',
    magenta: 'rgba(217, 37, 199, 0.15)',
  } as const;

  // Fallbacks must match en-AU.ts to prevent hydration mismatch (server uses fallback until translations load).
  const steps = [
    {
      number: 1,
      title: t('howItWorks.step1.title', 'Set up (5–10 min)'),
      description: t(
        'howItWorks.step1.description',
        'Turn on GST, add ingredients, yields, and supplier costs.',
      ),
      color: 'cyan' as const,
    },
    {
      number: 2,
      title: t('howItWorks.step2.title', 'Import sales'),
      description: t(
        'howItWorks.step2.description',
        'Import your POS export on the Performance page to see profit rankings.',
      ),
      color: 'blue' as const,
    },
    {
      number: 3,
      title: t('howItWorks.step3.title', 'Decide & act'),
      description: t(
        'howItWorks.step3.description',
        'Dashboard ranks items by profit and popularity; fix pricing, portioning, or menu mix.',
      ),
      color: 'magenta' as const,
    },
  ];

  // Color classes using centralized constants (Tailwind requires full class names)
  const getColorClasses = (color: 'cyan' | 'blue' | 'magenta') => {
    switch (color) {
      case 'cyan':
        return 'bg-landing-primary/10 text-landing-primary border border-landing-primary/20';
      case 'blue':
        return 'bg-landing-secondary/10 text-landing-secondary border border-landing-secondary/20';
      case 'magenta':
        return 'bg-landing-accent/10 text-landing-accent border border-landing-accent/20';
    }
  };

  return (
    <section id="how-it-works" className={getSectionClasses({ padding: 'large' })}>
      <div className={LANDING_LAYOUT.container}>
        <ScrollReveal variant="fade-up" duration={0.6} className="mb-16 text-center">
          <h2 className={`${LANDING_TYPOGRAPHY['5xl']} font-light tracking-tight text-white`}>
            {titleValue}
          </h2>
        </ScrollReveal>
        <div className="tablet:gap-10 desktop:gap-12 large-desktop:gap-14 tablet:[grid-template-columns:repeat(auto-fit,minmax(300px,1fr))] desktop:[grid-template-columns:repeat(auto-fit,minmax(320px,1fr))] grid [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))] gap-12 xl:gap-16">
          {steps.map((step, index) => (
            <ScrollReveal key={step.number} variant="fade-up" delay={index * 0.15} duration={0.5}>
              <GlowCard glowColor={GLOW_COLORS[step.color]} className="p-8 text-center">
                <motion.div
                  className={`${LANDING_TYPOGRAPHY.xl} mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full font-light ${getColorClasses(step.color)}`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  {step.number}
                </motion.div>
                <h3 className={`${LANDING_TYPOGRAPHY['2xl']} mb-4 font-light text-white`}>
                  {step.title}
                </h3>
                <p className={`${LANDING_TYPOGRAPHY.base} leading-relaxed text-gray-400`}>
                  {step.description}
                </p>
              </GlowCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
