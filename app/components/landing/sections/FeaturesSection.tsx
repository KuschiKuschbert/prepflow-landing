'use client';

import { useTranslation } from '../../../../lib/useTranslation';
import { GlowCard } from '@/components/ui/GlowCard';
import { motion } from 'framer-motion';
import {
  LANDING_COLORS,
  LANDING_TYPOGRAPHY,
  LANDING_LAYOUT,
  getSectionClasses,
} from '@/lib/landing-styles';

export function FeaturesSection() {
  const { t } = useTranslation();

  const features = [
    {
      title: t('features.cogs.title', 'Know Your Real Costs'),
      description: t(
        'features.cogs.description',
        'Stop guessing. See exactly what each dish costs—ingredients, waste, labor. Updates live as you build recipes.',
      ),
      color: 'cyan' as const,
    },
    {
      title: t('features.pricing.title', 'Price with Confidence'),
      description: t(
        'features.pricing.description',
        'Hit your target margins every time. Get instant pricing recommendations that maximize profit without scaring customers away.',
      ),
      color: 'blue' as const,
    },
    {
      title: t('features.insights.title', 'Find Your Profit Stars'),
      description: t(
        'features.insights.description',
        "See which dishes make you money and which drain it. Chef's Kiss, Hidden Gems, Bargain Buckets—know what to feature, fix, or remove.",
      ),
      color: 'magenta' as const,
    },
  ];

  // Color classes using centralized constants (Tailwind requires full class names)
  const getColorClass = (color: 'cyan' | 'blue' | 'magenta') => {
    switch (color) {
      case 'cyan':
        return 'text-[#29E7CD]'; // LANDING_COLORS.primary
      case 'blue':
        return 'text-[#3B82F6]'; // LANDING_COLORS.secondary
      case 'magenta':
        return 'text-[#D925C7]'; // LANDING_COLORS.accent
    }
  };

  return (
    <section id="features" className={getSectionClasses({ padding: 'large' })}>
      <div
        className={`${LANDING_LAYOUT.container} tablet:gap-10 desktop:gap-12 large-desktop:gap-14 tablet:[grid-template-columns:repeat(auto-fit,minmax(300px,1fr))] desktop:[grid-template-columns:repeat(auto-fit,minmax(320px,1fr))] grid [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))] gap-12 xl:gap-16`}
      >
        {features.map((feature, index) => (
          <motion.div
            key={`feature-${index}-${feature.title}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <GlowCard glowColor={feature.color} className="p-8">
              <h3
                className={`${LANDING_TYPOGRAPHY['2xl']} mb-4 font-light ${getColorClass(feature.color)}`}
              >
                {feature.title}
              </h3>
              <p className={`${LANDING_TYPOGRAPHY.base} leading-relaxed text-gray-400`}>
                {feature.description}
              </p>
            </GlowCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
