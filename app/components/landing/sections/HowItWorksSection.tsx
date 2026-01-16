'use client';

import { GlowCard } from '@/components/ui/GlowCard';
import { LANDING_LAYOUT, LANDING_TYPOGRAPHY, getSectionClasses } from '@/lib/landing-styles';
import { motion } from 'framer-motion';
import { useTranslation } from '../../../../lib/useTranslation';

export function HowItWorksSection() {
  const { t } = useTranslation();

  const steps = [
    {
      number: 1,
      title: t('howItWorks.step1.title', 'Add Your Ingredients'),
      description: t(
        'howItWorks.step1.description',
        'Import from CSV or add manually. Track costs, suppliers, and stock. We handle unit conversions automatically.',
      ),
      color: 'cyan' as const,
    },
    {
      number: 2,
      title: t('howItWorks.step2.title', 'Build Recipes'),
      description: t(
        'howItWorks.step2.description',
        'Add ingredients to recipes. Watch costs calculate live. See food cost percentages as you build—no surprises.',
      ),
      color: 'blue' as const,
    },
    {
      number: 3,
      title: t('howItWorks.step3.title', 'Price & Profit'),
      description: t(
        'howItWorks.step3.description',
        'Get pricing recommendations. See which dishes make money. Track compliance. All in one place, no juggling systems.',
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
        <motion.h2
          className={`${LANDING_TYPOGRAPHY['5xl']} mb-16 text-center font-light tracking-tight text-white`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {t('howItWorks.title', 'How PrepFlow Works')}
        </motion.h2>
        <div className="tablet:gap-10 desktop:gap-12 large-desktop:gap-14 tablet:[grid-template-columns:repeat(auto-fit,minmax(300px,1fr))] desktop:[grid-template-columns:repeat(auto-fit,minmax(320px,1fr))] grid [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))] gap-12 xl:gap-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <GlowCard glowColor={step.color} className="p-8 text-center">
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
