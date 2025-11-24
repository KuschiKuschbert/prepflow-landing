'use client';

import { Icon } from '@/components/ui/Icon';
import { GlowCard } from '@/components/ui/GlowCard';
import { useTranslation } from '@/lib/useTranslation';
import { LANDING_COLORS, LANDING_TYPOGRAPHY } from '@/lib/landing-styles';
import { BookOpen, DollarSign, Rocket, Settings, ThermometerSun, Utensils } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function QuickActions() {
  const { t } = useTranslation();

  const actions = [
    {
      title: 'Add Ingredient',
      description: 'Add new ingredients to your inventory',
      icon: Utensils,
      href: '/webapp/recipes#ingredients',
      color: 'from-[#29E7CD] to-[#D925C7]', // primary to accent
      glowColor: LANDING_COLORS.primary,
    },
    {
      title: 'Create Recipe',
      description: 'Build new recipes with cost calculation',
      icon: BookOpen,
      href: '/webapp/recipes',
      color: 'from-[#3B82F6] to-[#29E7CD]', // secondary to primary
      glowColor: LANDING_COLORS.secondary,
    },
    {
      title: 'Temperature Log',
      description: 'Log temperature readings for compliance',
      icon: ThermometerSun,
      href: '/webapp/temperature',
      color: 'from-[#F59E0B] to-[#EF4444]', // Keep non-landing colors for this
      glowColor: '#F59E0B',
    },
    {
      title: 'View Performance',
      description: 'Analyze menu profitability',
      icon: DollarSign,
      href: '/webapp/performance',
      color: 'from-[#D925C7] to-[#3B82F6]', // accent to secondary
      glowColor: LANDING_COLORS.accent,
    },
  ];

  return (
    <div className="desktop:mb-8 desktop:rounded-3xl desktop:p-6 mb-6 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg">
      <div className="desktop:mb-6 mb-4">
        <h2
          className={`${LANDING_TYPOGRAPHY.xl} desktop:mb-2 desktop:${LANDING_TYPOGRAPHY['2xl']} mb-1 flex items-center gap-2 font-semibold text-white`}
        >
          <Icon icon={Rocket} size="md" className="text-[#29E7CD]" aria-hidden={true} />
          Quick Actions
        </h2>
        <p className={`${LANDING_TYPOGRAPHY.sm} desktop:${LANDING_TYPOGRAPHY.base} text-gray-400`}>
          Get started with your kitchen management
        </p>
      </div>

      <div className="tablet:gap-4 tablet:[grid-template-columns:repeat(auto-fit,minmax(200px,1fr))] desktop:gap-4 desktop:[grid-template-columns:repeat(auto-fit,minmax(200px,1fr))] grid [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))] gap-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <GlowCard glowColor={action.glowColor} className="h-full">
              <Link
                href={action.href}
                className="group desktop:rounded-2xl desktop:p-6 min-h-[44px] rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-3 transition-all duration-200 hover:border-[#29E7CD]/50 hover:shadow-lg hover:shadow-[#29E7CD]/10 active:scale-[0.98]"
              >
                <div className="desktop:space-y-4 flex flex-col items-center space-y-2 text-center">
                  <div
                    className={`desktop:h-16 desktop:w-16 desktop:rounded-2xl h-10 w-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}
                  >
                    <Icon
                      icon={action.icon}
                      size="lg"
                      className="desktop:h-8 desktop:w-8 text-white"
                      aria-hidden={true}
                    />
                  </div>

                  <div>
                    <h3
                      className={`${LANDING_TYPOGRAPHY.sm} desktop:${LANDING_TYPOGRAPHY.lg} font-semibold text-white transition-colors duration-200 group-hover:text-[#29E7CD]`}
                    >
                      {action.title}
                    </h3>
                    <p
                      className={`${LANDING_TYPOGRAPHY.xs} desktop:${LANDING_TYPOGRAPHY.sm} mt-0.5 text-gray-400`}
                    >
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            </GlowCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
