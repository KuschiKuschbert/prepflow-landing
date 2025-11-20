'use client';
import { useTranslation } from '@/lib/useTranslation';
import { Icon } from '@/components/ui/Icon';
import { Sparkles } from 'lucide-react';

interface CleaningArea {
  id: number;
  name: string;
  description: string;
  frequency_days: number;
  is_active: boolean;
}

interface AreaCardProps {
  area: CleaningArea;
}

export function AreaCard({ area }: AreaCardProps) {
  const { t } = useTranslation();
  return (
    <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg transition-all duration-200 hover:shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
          <Icon icon={Sparkles} size="md" className="text-[#29E7CD]" aria-hidden={true} />
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            area.is_active
              ? 'border border-green-400/20 bg-green-400/10 text-green-400'
              : 'border border-gray-400/20 bg-gray-400/10 text-gray-400'
          }`}
        >
          {area.is_active ? t('cleaning.active', 'Active') : t('cleaning.inactive', 'Inactive')}
        </span>
      </div>
      <h3 className="mb-2 text-xl font-semibold text-white">{area.name}</h3>
      <p className="mb-4 text-gray-400">
        {area.description || t('cleaning.noDescription', 'No description provided')}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {t('cleaning.everyDays', 'Every')} {area.frequency_days} {t('cleaning.days', 'days')}
        </span>
        <button className="text-[#29E7CD] transition-colors hover:text-[#29E7CD]/80">
          {t('cleaning.edit', 'Edit')}
        </button>
      </div>
    </div>
  );
}

