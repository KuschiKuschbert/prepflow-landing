'use client';

/**
 * Empty state component for sections page.
 */

import { EmptyState } from '@/components/ui/EmptyState';
import { InlineHint } from '@/components/ui/InlineHint';
import { RescueNudge } from '@/components/ui/RescueNudge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useTranslation } from '@/lib/useTranslation';
import { UtensilsCrossed, Plus } from 'lucide-react';

interface SectionsEmptyStateProps {
  onAddClick: () => void;
}

export function SectionsEmptyState({ onAddClick }: SectionsEmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <RescueNudge pageKey="sections" guideId="menu-builder" guideStepIndex={0} />
      <EmptyState
        title={t('dishSections.noSections', 'No Kitchen Sections')}
        message={t(
          'dishSections.noSectionsDesc',
          'Create kitchen sections to organize your dishes for prep lists',
        )}
        icon={UtensilsCrossed}
        actions={
          <div className="flex flex-col items-center gap-3">
            <Button
              onClick={onAddClick}
              variant="primary"
              landingStyle={true}
              className="flex items-center gap-2"
            >
              <Icon icon={Plus} size="sm" aria-hidden />
              {t('dishSections.createFirstSection', 'Create Your First Section')}
            </Button>
            <InlineHint context="sections">
              Start here—create sections to organize dishes for prep lists
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
