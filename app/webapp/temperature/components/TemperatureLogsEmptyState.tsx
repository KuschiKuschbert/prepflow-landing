'use client';

import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
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
    <EmptyState
      title={String(t('temperature.noLogs', 'No Temperature Logs'))}
      message={
        canGenerateSample
          ? String(
              t(
                'temperature.noLogsDescWithGenerate',
                'Generate sample logs to get started, or add your first temperature log manually',
              ),
            )
          : String(
              t(
                'temperature.noLogsDesc',
                'Start logging temperatures to ensure food safety compliance',
              ),
            )
      }
      icon={Thermometer}
      actions={
        canGenerateSample ? (
          <Button
            onClick={onGenerateSampleData}
            disabled={isGenerating}
            variant="outline"
            landingStyle={true}
            className="group flex items-center gap-2"
            aria-label="Generate 5 sample logs per equipment (last 2 weeks)"
          >
            <Sparkles
              size={16}
              className="transition-transform duration-300 group-hover:rotate-12"
            />
            <span>{isGenerating ? 'Generating Sample Logs...' : 'Generate Sample Logs'}</span>
          </Button>
        ) : undefined
      }
      useLandingStyles={true}
      variant="landing"
      animated={true}
    />
  );
}
