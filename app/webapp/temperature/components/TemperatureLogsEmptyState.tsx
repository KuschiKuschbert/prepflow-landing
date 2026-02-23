'use client';

import { EmptyState } from '@/components/ui/EmptyState';
import { InlineHint } from '@/components/ui/InlineHint';
import { RescueNudge } from '@/components/ui/RescueNudge';
import { Button } from '@/components/ui/Button';
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
    <div className="space-y-6">
      <RescueNudge pageKey="temperature-logs" guideId="compliance-safety" guideStepIndex={1} />
      <EmptyState
        title={String(t('temperature.noLogs', 'No Temperature Logs'))}
        message={
          canGenerateSample
            ? String(
                t(
                  'temperature.noLogsDescWithGenerate',
                  '1 step to compliance-ready logs. Generate sample data or add your first log manually.',
                ),
              )
            : String(
                t(
                  'temperature.noLogsDesc',
                  'Add equipment first, then log temperatures for food safety compliance.',
                ),
              )
        }
        icon={Thermometer}
        actions={
          canGenerateSample ? (
            <div className="flex flex-col items-center gap-3">
              <Button
                onClick={onGenerateSampleData}
                disabled={isGenerating}
                variant="outline"
                landingStyle={true}
                className="group flex items-center gap-2"
                aria-label="Generate 5 sample logs per equipment (last 2 weeks)"
              >
                <Icon
                  icon={Sparkles}
                  size="sm"
                  className="transition-transform duration-300 group-hover:rotate-12"
                  aria-hidden
                />
                <span>{isGenerating ? 'Generating Sample Logs...' : 'Generate Sample Logs'}</span>
              </Button>
              <InlineHint context="temperature-logs">
                Start here - generate sample logs or add your first log
              </InlineHint>
            </div>
          ) : null
        }
        useLandingStyles={true}
        variant="landing"
        animated={true}
      />
    </div>
  );
}
