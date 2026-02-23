'use client';

import { EmptyState as EmptyStateComponent } from '@/components/ui/EmptyState';
import { InlineHint } from '@/components/ui/InlineHint';
import { RescueNudge } from '@/components/ui/RescueNudge';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/lib/useTranslation';
import { Share2 } from 'lucide-react';

interface EmptyStateProps {
  onShareClick: () => void;
}

export function EmptyState({ onShareClick }: EmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <RescueNudge pageKey="recipe-sharing" guideId="getting-started" guideStepIndex={0} />
      <EmptyStateComponent
        title={String(t('recipeSharing.noShares', 'No Recipe Shares'))}
        message={String(
          t('recipeSharing.noSharesDesc', 'Share your recipes with others as PDFs or links'),
        )}
        icon={Share2}
        actions={
          <div className="flex flex-col items-center gap-3">
            <Button onClick={onShareClick} variant="primary" landingStyle={true} glow={true}>
              {t('recipeSharing.shareFirstRecipe', 'Share Your First Recipe')}
            </Button>
            <InlineHint context="recipe-sharing">
              Start here—share recipes with others as PDFs or links
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
