'use client';

import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
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
    <EmptyState
      title="No Temperature Data"
      message="Generate sample temperature logs to see analytics, charts, and insights for your equipment"
      icon={BarChart3}
      actions={
        <Button
          onClick={onGenerateSampleData}
          disabled={isGenerating}
          variant="primary"
          landingStyle={true}
          magnetic={true}
          glow={true}
          className="group flex items-center gap-3"
        >
          <Icon
            icon={Sparkles}
            size="md"
            className="transition-transform duration-300 group-hover:rotate-12"
            aria-hidden
          />
          <span>{isGenerating ? 'Generating Sample Data...' : 'Generate Sample Data'}</span>
          {!isGenerating && (
            <span className="text-sm opacity-75">(5 entries per equipment, last 2 weeks)</span>
          )}
        </Button>
      }
      useLandingStyles={true}
      variant="landing"
      animated={true}
    />
  );
}
