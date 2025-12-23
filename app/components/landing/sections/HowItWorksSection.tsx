'use client';

import { useTranslation } from '../../../../lib/useTranslation';
import { GlowCard } from '@/components/ui/GlowCard';
import { motion } from 'framer-motion';
import { LANDING_TYPOGRAPHY, LANDING_LAYOUT, getSectionClasses } from '@/lib/landing-styles';

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
        return 'bg-[#29E7CD]/10 text-[#29E7CD] border border-[#29E7CD]/20'; // LANDING_COLORS.primary
      case 'blue':
        return 'bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20'; // LANDING_COLORS.secondary
      case 'magenta':
        return 'bg-[#D925C7]/10 text-[#D925C7] border border-[#D925C7]/20'; // LANDING_COLORS.accent
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
        <div className="grid gap-12 tablet:gap-10 desktop:gap-12 large-desktop:gap-14 xl:gap-16 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))] tablet:[grid-template-columns:repeat(auto-fit,minmax(300px,1fr))] desktop:[grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
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
