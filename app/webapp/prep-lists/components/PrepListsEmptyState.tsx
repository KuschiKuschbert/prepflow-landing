'use client';

/**
 * Empty state component for prep lists page.
 */

import { EmptyState } from '@/components/ui/EmptyState';
import { InlineHint } from '@/components/ui/InlineHint';
import { RescueNudge } from '@/components/ui/RescueNudge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useTranslation } from '@/lib/useTranslation';
import { ListChecks, Plus } from 'lucide-react';

interface PrepListsEmptyStateProps {
  onCreateClick: () => void;
}

export function PrepListsEmptyState({ onCreateClick }: PrepListsEmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <RescueNudge pageKey="prep-lists" guideId="prep-lists" guideStepIndex={0} />
      <EmptyState
        title={t('prepLists.noPrepLists', 'Your first prep list is one click away')}
        message={t(
          'prepLists.noPrepListsDesc',
          '1 step to organized kitchen prep. Create a prep list to plan what to make and when.',
        )}
        icon={ListChecks}
        actions={
          <div className="flex flex-col items-center gap-3">
            <Button
              onClick={onCreateClick}
              variant="primary"
              landingStyle={true}
              className="flex items-center gap-2"
            >
              <Icon icon={Plus} size="sm" aria-hidden />
              {t('prepLists.createFirstPrepList', 'Create your first prep list')}
            </Button>
            <InlineHint context="prep-lists">
              Start here—create a prep list to plan what to make and when
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
