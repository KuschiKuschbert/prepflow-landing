'use client';

import { GlowCard } from '@/components/ui/GlowCard';
import { Icon } from '@/components/ui/Icon';
import { LANDING_COLORS, LANDING_TYPOGRAPHY } from '@/lib/landing-styles';
import { useTranslation } from '@/lib/useTranslation';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Calendar,
  ClipboardList,
  Rocket,
  ShieldCheck,
  Users,
  Utensils,
} from 'lucide-react';
import Link from 'next/link';

export default function QuickActions() {
  const { t: _t } = useTranslation();

  const actions = [
    {
      title: 'Ingredients',
      description: 'Manage kitchen inventory',
      icon: Utensils,
      href: '/webapp/recipes#ingredients',
      color: 'from-[var(--primary)] to-[var(--accent)]',
      glowColor: LANDING_COLORS.primary,
    },
    {
      title: 'Recipes',
      description: 'Build & cost your dishes',
      icon: BookOpen,
      href: '/webapp/recipes',
      color: 'from-[var(--color-info)] to-[var(--primary)]',
      glowColor: LANDING_COLORS.secondary,
    },
    {
      title: 'Functions',
      description: 'Schedule events & bookings',
      icon: Calendar,
      href: '/webapp/functions',
      color: 'from-[var(--accent)] to-[var(--color-info)]',
      glowColor: LANDING_COLORS.accent,
    },
    {
      title: 'Customers',
      description: 'Manage guest profiles',
      icon: Users,
      href: '/webapp/customers',
      color: 'from-[#6366F1] to-[var(--accent)]',
      glowColor: '#6366F1',
    },
    {
      title: 'Prep Lists',
      description: 'Organize daily kitchen tasks',
      icon: ClipboardList,
      href: '/webapp/prep-lists',
      color: 'from-[#8B5CF6] to-[#6366F1]',
      glowColor: '#8B5CF6',
    },
    {
      title: 'Compliance',
      description: 'Food safety & temperatures',
      icon: ShieldCheck,
      href: '/webapp/compliance',
      color: 'from-[var(--color-warning)] to-[#EF4444]',
      glowColor: '#F59E0B',
    },
  ];

  return (
    <div className="desktop:mb-8 desktop:rounded-3xl desktop:p-6 glass-surface mb-6 rounded-2xl border border-[var(--border)]/30 p-4 shadow-lg">
      <div className="desktop:mb-6 mb-4">
        <h2
          className={`${LANDING_TYPOGRAPHY.xl} desktop:mb-2 desktop:${LANDING_TYPOGRAPHY['2xl']} mb-1 flex items-center gap-2 font-semibold text-[var(--foreground)]`}
        >
          <Icon icon={Rocket} size="md" className="text-[var(--primary)]" aria-hidden={true} />
          Quick Actions
        </h2>
        <p
          className={`${LANDING_TYPOGRAPHY.sm} desktop:${LANDING_TYPOGRAPHY.base} text-[var(--foreground-subtle)]`}
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
                className="group desktop:rounded-2xl desktop:p-6 glass-panel relative min-h-[44px] rounded-xl border border-[var(--border)]/30 p-3 transition-all duration-300 hover:border-[var(--primary)]/50 hover:shadow-[var(--primary)]/10 hover:shadow-xl active:scale-[0.98]"
              >
                {/* Subtle glow on hover */}
                <div className="desktop:rounded-2xl absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-[var(--primary)]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
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
                      className={`${LANDING_TYPOGRAPHY.xs} desktop:${LANDING_TYPOGRAPHY.sm} mt-0.5 text-[var(--foreground-subtle)]`}
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
