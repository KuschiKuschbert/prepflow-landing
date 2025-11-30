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
    <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-5 shadow-lg">
      <div className="mb-3 flex items-center gap-2">
        {direction === 'improving' ? (
          <Icon icon={TrendingUp} size="sm" className="text-green-400" />
        ) : direction === 'declining' ? (
          <Icon icon={TrendingDown} size="sm" className="text-red-400" />
        ) : (
          <Icon icon={Minus} size="sm" className="text-gray-400" />
        )}
        <h3 className="text-sm font-semibold text-white">{t('temperature.trend', 'Trend')}</h3>
      </div>
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          {direction === 'improving' ? (
            <>
              <Icon icon={ArrowDown} size="xs" className="text-green-400" />
              <span className="text-xl font-bold text-green-400">
                {Math.abs(percentageChange)}%
              </span>
            </>
          ) : direction === 'declining' ? (
            <>
              <Icon icon={ArrowUp} size="xs" className="text-red-400" />
              <span className="text-xl font-bold text-red-400">{Math.abs(percentageChange)}%</span>
            </>
          ) : (
            <span className="text-xl font-bold text-gray-400">
              {t('temperature.stable', 'Stable')}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400">
          {direction === 'improving'
            ? t('temperature.improving', 'Improving')
            : direction === 'declining'
              ? t('temperature.declining', 'Declining')
              : ''}
        </p>
        <p className="text-xs text-gray-500">{t('temperature.last7Days', 'vs prev 7d')}</p>
      </div>
    </div>
  );
}


