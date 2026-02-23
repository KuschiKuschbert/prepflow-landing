'use client';

import { EmptyState } from '@/components/ui/EmptyState';
import { InlineHint } from '@/components/ui/InlineHint';
import { RescueNudge } from '@/components/ui/RescueNudge';
import { Utensils } from 'lucide-react';

export function COGSTableEmptyState() {
  return (
    <div className="space-y-6">
      <RescueNudge pageKey="cogs" guideId="create-recipe" guideStepIndex={2} />
      <EmptyState
        title="Add ingredients to see your recipe cost"
        message="Use the search above to add ingredients from your database. Cost and COGS update as you go."
        icon={Utensils}
        actions={
          <InlineHint context="cogs">
            Start here—add ingredients above to see cost and COGS
          </InlineHint>
        }
        useLandingStyles={true}
        variant="landing"
        animated={true}
        className="rounded-2xl"
      />
    </div>
  );
}
