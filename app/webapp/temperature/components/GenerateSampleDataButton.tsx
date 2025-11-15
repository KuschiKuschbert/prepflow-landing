'use client';

import { Icon } from '@/components/ui/Icon';
import { Sparkles } from 'lucide-react';

interface GenerateSampleDataButtonProps {
  isGenerating: boolean;
  onGenerateSampleData: () => void;
  variant?: 'primary' | 'secondary';
}

export function GenerateSampleDataButton({
  isGenerating,
  onGenerateSampleData,
  variant = 'secondary',
}: GenerateSampleDataButtonProps) {
  if (variant === 'primary') {
    return (
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
    );
  }

  return (
    <div className="flex justify-center">
      <button
        onClick={onGenerateSampleData}
        disabled={isGenerating}
        className="group flex items-center gap-2 rounded-2xl border border-[#29E7CD]/30 bg-[#29E7CD]/10 px-6 py-3 text-sm font-semibold text-[#29E7CD] shadow-lg transition-all duration-300 hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/20 hover:shadow-xl disabled:opacity-50"
        title="Generate 5 sample logs per equipment (last 2 weeks)"
      >
        <Icon
          icon={Sparkles}
          size="sm"
          className="transition-transform duration-300 group-hover:rotate-12"
          aria-hidden={true}
        />
        <span>{isGenerating ? 'Generating Sample Data...' : 'Generate More Sample Logs'}</span>
        {!isGenerating && (
          <span className="text-xs opacity-75">(5 per equipment, last 2 weeks)</span>
        )}
      </button>
    </div>
  );
}
