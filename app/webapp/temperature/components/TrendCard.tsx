'use client';

import { Icon } from '@/components/ui/Icon';
import { useTranslation } from '@/lib/useTranslation';
import { ArrowDown, ArrowUp, Minus, TrendingDown, TrendingUp } from 'lucide-react';

interface TrendCardProps {
  direction: 'improving' | 'declining' | 'stable';
  percentageChange: number;
}

export function TrendCard({ direction, percentageChange }: TrendCardProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-lg">
      <div className="mb-3 flex items-center gap-2">
        {direction === 'improving' ? (
          <Icon icon={TrendingUp} size="sm" className="text-[var(--color-success)]" />
        ) : direction === 'declining' ? (
          <Icon icon={TrendingDown} size="sm" className="text-[var(--color-error)]" />
        ) : (
          <Icon icon={Minus} size="sm" className="text-[var(--foreground-muted)]" />
        )}
        <h3 className="text-sm font-semibold text-[var(--foreground)]">{t('temperature.trend', 'Trend')}</h3>
      </div>
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          {direction === 'improving' ? (
            <>
              <Icon icon={ArrowDown} size="xs" className="text-[var(--color-success)]" />
              <span className="text-xl font-bold text-[var(--color-success)]">
                {Math.abs(percentageChange)}%
              </span>
            </>
          ) : direction === 'declining' ? (
            <>
              <Icon icon={ArrowUp} size="xs" className="text-[var(--color-error)]" />
              <span className="text-xl font-bold text-[var(--color-error)]">{Math.abs(percentageChange)}%</span>
            </>
          ) : (
            <span className="text-xl font-bold text-[var(--foreground-muted)]">
              {t('temperature.stable', 'Stable')}
            </span>
          )}
        </div>
        <p className="text-xs text-[var(--foreground-muted)]">
          {direction === 'improving'
            ? t('temperature.improving', 'Improving')
            : direction === 'declining'
              ? t('temperature.declining', 'Declining')
              : ''}
        </p>
        <p className="text-xs text-[var(--foreground-subtle)]">{t('temperature.last7Days', 'vs prev 7d')}</p>
      </div>
    </div>
  );
}
