'use client';

import { EmptyState as EmptyStateComponent } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/lib/useTranslation';
import { Share2 } from 'lucide-react';

interface EmptyStateProps {
  onShareClick: () => void;
}

export function EmptyState({ onShareClick }: EmptyStateProps) {
  const { t } = useTranslation();
  return (
    <EmptyStateComponent
      title={String(t('recipeSharing.noShares', 'No Recipe Shares'))}
      message={String(
        t('recipeSharing.noSharesDesc', 'Share your recipes with others as PDFs or links'),
      )}
      icon={Share2}
      actions={
        <Button onClick={onShareClick} variant="primary" landingStyle={true} glow={true}>
          {t('recipeSharing.shareFirstRecipe', 'Share Your First Recipe')}
        </Button>
      }
      useLandingStyles={true}
      variant="landing"
      animated={true}
    />
  );
}
