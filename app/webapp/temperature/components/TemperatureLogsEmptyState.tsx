'use client';

import { Icon } from '@/components/ui/Icon';
import { useTranslation } from '@/lib/useTranslation';
import { Thermometer, Sparkles } from 'lucide-react';

interface TemperatureLogsEmptyStateProps {
  equipmentCount?: number;
  isGenerating?: boolean;
  onGenerateSampleData?: () => void;
}

export function TemperatureLogsEmptyState({
  equipmentCount = 0,
  isGenerating = false,
  onGenerateSampleData,
}: TemperatureLogsEmptyStateProps) {
  const { t } = useTranslation();
  const hasEquipment = equipmentCount > 0;
  const canGenerateSample = hasEquipment && onGenerateSampleData;

  return (
    <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-8 text-center shadow-lg">
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
        <Icon icon={Thermometer} size="xl" className="text-[#29E7CD]" aria-hidden={true} />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-white">
        {t('temperature.noLogs', 'No Temperature Logs')}
      </h3>
      <p className="mb-6 text-gray-400">
        {canGenerateSample
          ? t(
              'temperature.noLogsDescWithGenerate',
              'Generate sample logs to get started, or add your first temperature log manually',
            )
          : t(
              'temperature.noLogsDesc',
              'Start logging temperatures to ensure food safety compliance',
            )}
      </p>
      {canGenerateSample && (
        <button
          onClick={onGenerateSampleData}
          disabled={isGenerating}
          className="group mx-auto flex items-center gap-2 rounded-2xl border border-[#29E7CD]/30 bg-[#29E7CD]/10 px-6 py-3 text-sm font-semibold text-[#29E7CD] shadow-lg transition-all duration-300 hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/20 hover:shadow-xl disabled:opacity-50 disabled:hover:bg-[#29E7CD]/10"
          title="Generate 5 sample logs per equipment (last 2 weeks)"
        >
          <Icon
            icon={Sparkles}
            size="sm"
            className="transition-transform duration-300 group-hover:rotate-12"
            aria-hidden={true}
          />
          <span>{isGenerating ? 'Generating Sample Logs...' : 'Generate Sample Logs'}</span>
        </button>
      )}
    </div>
  );
}
