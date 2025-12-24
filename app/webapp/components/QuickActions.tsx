'use client';

import { GlowCard } from '@/components/ui/GlowCard';
import { Icon } from '@/components/ui/Icon';
import { LANDING_COLORS, LANDING_TYPOGRAPHY } from '@/lib/landing-styles';
import { useTranslation } from '@/lib/useTranslation';
import { motion } from 'framer-motion';
import { BookOpen, DollarSign, Rocket, ThermometerSun, Utensils } from 'lucide-react';
import Link from 'next/link';

export default function QuickActions() {
  const { t } = useTranslation();

  const actions = [
    {
      title: 'Add Ingredient',
      description: 'Add new ingredients to your inventory',
      icon: Utensils,
      href: '/webapp/recipes#ingredients', // Use final destination to avoid redirect hydration mismatch
      color: 'from-[var(--primary)] to-[var(--accent)]', // primary to accent
      glowColor: LANDING_COLORS.primary,
    },
    {
      title: 'Create Recipe',
      description: 'Build new recipes with cost calculation',
      icon: BookOpen,
      href: '/webapp/recipes', // Simplified to avoid hydration mismatch
      color: 'from-[var(--color-info)] to-[var(--primary)]', // secondary to primary
      glowColor: LANDING_COLORS.secondary,
    },
    {
      title: 'Temperature Log',
      description: 'Log temperature readings for compliance',
      icon: ThermometerSun,
      href: '/webapp/temperature', // Simplified to avoid hydration mismatch
      color: 'from-[var(--color-warning)] to-[#EF4444]', // Keep non-landing colors for this
      glowColor: '#F59E0B',
    },
    {
      title: 'View Performance',
      description: 'Analyze menu profitability',
      icon: DollarSign,
      href: '/webapp/performance',
      color: 'from-[var(--accent)] to-[var(--color-info)]', // accent to secondary
      glowColor: LANDING_COLORS.accent,
    },
  ];

  return (
    <div className="desktop:mb-8 desktop:rounded-3xl desktop:p-6 mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg">
      <div className="desktop:mb-6 mb-4">
        <h2
          className={`${LANDING_TYPOGRAPHY.xl} desktop:mb-2 desktop:${LANDING_TYPOGRAPHY['2xl']} mb-1 flex items-center gap-2 font-semibold text-[var(--foreground)]`}
        >
          <Icon icon={Rocket} size="md" className="text-[var(--primary)]" aria-hidden={true} />
          Quick Actions
        </h2>
        <p
          className={`${LANDING_TYPOGRAPHY.sm} desktop:${LANDING_TYPOGRAPHY.base} text-[var(--foreground)]/60`}
        >
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
                className="group desktop:rounded-2xl desktop:p-6 min-h-[44px] rounded-xl border border-[var(--border)] bg-[var(--surface)]/30 p-3 transition-all duration-200 hover:border-[var(--primary)]/50 hover:shadow-[var(--primary)]/10 hover:shadow-lg active:scale-[0.98]"
              >
                <div className="desktop:space-y-4 flex flex-col items-center space-y-2 text-center">
                  <div
                    className={`desktop:h-16 desktop:w-16 desktop:rounded-2xl h-10 w-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}
                  >
                    <Icon
                      icon={action.icon}
                      size="lg"
                      className="desktop:h-8 desktop:w-8 text-[var(--foreground)]"
                      aria-hidden={true}
                    />
                  </div>

                  <div>
                    <h3
                      className={`${LANDING_TYPOGRAPHY.sm} desktop:${LANDING_TYPOGRAPHY.lg} font-semibold text-[var(--foreground)] transition-colors duration-200 group-hover:text-[var(--primary)]`}
                    >
                      {action.title}
                    </h3>
                    <p
                      className={`${LANDING_TYPOGRAPHY.xs} desktop:${LANDING_TYPOGRAPHY.sm} mt-0.5 text-[var(--foreground)]/60`}
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
