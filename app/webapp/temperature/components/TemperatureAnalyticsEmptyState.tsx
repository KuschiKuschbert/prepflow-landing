'use client';

import { Icon } from '@/components/ui/Icon';
import { BarChart3, Sparkles } from 'lucide-react';

interface TemperatureAnalyticsEmptyStateProps {
  isGenerating: boolean;
  onGenerateSampleData: () => void;
}

export function TemperatureAnalyticsEmptyState({
  isGenerating,
  onGenerateSampleData,
}: TemperatureAnalyticsEmptyStateProps) {
  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-3xl border border-[#2a2a2a] bg-gradient-to-br from-[#1f1f1f] to-[#2a2a2a]/50 p-8 shadow-2xl">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 shadow-xl">
        <Icon icon={BarChart3} size="xl" className="text-[#29E7CD]" aria-hidden={true} />
      </div>
      <h3 className="mb-3 text-fluid-2xl font-bold text-white">No Temperature Data</h3>
      <p className="mb-6 max-w-md text-center text-fluid-base text-gray-400">
        Generate sample temperature logs to see analytics, charts, and insights for your equipment
      </p>
      <button
        onClick={onGenerateSampleData}
        disabled={isGenerating}
        className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-8 py-4 font-semibold text-black shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:hover:scale-100"
      >
        <Icon
          icon={Sparkles}
          size="lg"
          className="transition-transform duration-300 group-hover:rotate-12"
          aria-hidden={true}
        />
        <span>{isGenerating ? 'Generating Sample Data...' : 'Generate Sample Data'}</span>
        {!isGenerating && (
          <span className="text-sm opacity-75">(5 entries per equipment, last 2 weeks)</span>
        )}
      </button>
    </div>
  );
}
