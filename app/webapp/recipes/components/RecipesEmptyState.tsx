'use client';

import { EmptyState } from '@/components/ui/EmptyState';
import { InlineHint } from '@/components/ui/InlineHint';
import { RescueNudge } from '@/components/ui/RescueNudge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { ChefHat, Plus } from 'lucide-react';

export function RecipesEmptyState() {
  return (
    <div className="space-y-6">
      <RescueNudge pageKey="recipes" guideId="create-recipe" guideStepIndex={0} />
      <EmptyState
        title="Your first recipe is one click away"
        message="1 step to real-time cost calculations. Add a recipe to see ingredient costs and optimize your margins."
        icon={ChefHat}
        actions={
          <div className="flex flex-col items-center gap-3">
            <Button
              href="/webapp/recipes#dishes"
              variant="primary"
              landingStyle={true}
              className="flex items-center gap-2"
            >
              <Icon icon={Plus} size="sm" aria-hidden />
              Add your first recipe
            </Button>
            <InlineHint context="recipes">
              Start here—one click to unlock cost calculations
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
