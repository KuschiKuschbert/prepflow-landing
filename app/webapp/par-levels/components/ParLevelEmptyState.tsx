'use client';

import { EmptyState } from '@/components/ui/EmptyState';
import { InlineHint } from '@/components/ui/InlineHint';
import { RescueNudge } from '@/components/ui/RescueNudge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useTranslation } from '@/lib/useTranslation';
import { Package2, Plus } from 'lucide-react';

interface ParLevelEmptyStateProps {
  onAdd: () => void;
}

export function ParLevelEmptyState({ onAdd }: ParLevelEmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <RescueNudge pageKey="par-levels" guideId="inventory-ordering" guideStepIndex={2} />
      <EmptyState
        title={t('parLevels.noParLevels', 'Your first par level is one click away')}
        message={t(
          'parLevels.noParLevelsDesc',
          '1 step to automated order lists. Set par levels so PrepFlow knows when to reorder.',
        )}
        icon={Package2}
        actions={
          <div className="flex flex-col items-center gap-3">
            <Button
              onClick={onAdd}
              variant="primary"
              landingStyle={true}
              className="flex items-center gap-2"
            >
              <Icon icon={Plus} size="sm" aria-hidden />
              {t('parLevels.addFirstParLevel', 'Add your first par level')}
            </Button>
            <InlineHint context="par-levels">
              Start here—set par levels for automated order lists
            </InlineHint>
          </div>
        }
        useLandingStyles={true}
        variant="landing"
        animated={true}
      />
    </div>
  );
}
