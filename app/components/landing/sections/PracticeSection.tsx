'use client';

import { ScrollReveal } from '@/components/ui/ScrollReveal';
import {
  LANDING_LAYOUT,
  LANDING_TYPOGRAPHY,
  getSectionClasses,
  getStaggerDelay,
} from '@/lib/landing-styles';
import { useTranslation } from '../../../../lib/useTranslation';

export function PracticeSection() {
  const { t } = useTranslation();

  return (
    <section id="how-it-works-practice" className={getSectionClasses({ padding: 'medium' })}>
      <div className={LANDING_LAYOUT.container}>
        <div className="rounded-3xl border border-gray-700 bg-[#1f1f1f]/80 p-10 shadow-2xl backdrop-blur-sm">
          <div className="text-center">
            <ScrollReveal variant="fade-up">
              <h2
                className={`${LANDING_TYPOGRAPHY['3xl']} desktop:${LANDING_TYPOGRAPHY['4xl']} mb-6 font-bold tracking-tight text-white`}
              >
                {t('practice.title', 'Before vs After')}
              </h2>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" delay={0.1}>
              <p className={`${LANDING_TYPOGRAPHY.lg} mx-auto max-w-3xl text-gray-300`}>
                {t('practice.description', 'The difference between guessing and knowing.')}
              </p>
            </ScrollReveal>
            <div className="desktop:grid-cols-2 mt-8 grid gap-6">
              <ScrollReveal variant="fade-up" delay={getStaggerDelay(0, 0.2)}>
                <div className="rounded-2xl bg-[#2a2a2a]/50 p-6">
                  <h3
                    className={`${LANDING_TYPOGRAPHY.xl} text-landing-primary mb-3 font-semibold`}
                  >
                    {t('practice.before.title', 'Before PrepFlow')}
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• {t('practice.before.point1', 'Excel formulas break at 2 AM')}</li>
                    <li>• {t('practice.before.point2', 'Hours wasted on manual calculations')}</li>
                    <li>• {t('practice.before.point3', 'Guessing at costs and margins')}</li>
                    <li>• {t('practice.before.point4', 'Losing money without knowing why')}</li>
                  </ul>
                </div>
              </ScrollReveal>
              <ScrollReveal variant="fade-up" delay={getStaggerDelay(1, 0.2)}>
                <div className="rounded-2xl bg-[#2a2a2a]/50 p-6">
                  <h3 className={`${LANDING_TYPOGRAPHY.xl} text-landing-accent mb-3 font-semibold`}>
                    {t('practice.after.title', 'After PrepFlow')}
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• {t('practice.after.point1', 'Calculations happen automatically')}</li>
                    <li>• {t('practice.after.point2', 'See costs and margins instantly')}</li>
                    <li>• {t('practice.after.point3', 'Know which dishes make money')}</li>
                    <li>• {t('practice.after.point4', 'Price with confidence, not guesswork')}</li>
                  </ul>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
