'use client';

import { EmptyState } from '@/components/ui/EmptyState';
import { InlineHint } from '@/components/ui/InlineHint';
import { RescueNudge } from '@/components/ui/RescueNudge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { UtensilsCrossed, Plus } from 'lucide-react';

interface DishesEmptyStateProps {
  onViewModeChange: (mode: 'builder') => void;
}

export function DishesEmptyState({ onViewModeChange }: DishesEmptyStateProps) {
  return (
    <div className="space-y-6">
      <RescueNudge pageKey="dishes" guideId="create-recipe" guideStepIndex={0} />
      <EmptyState
        title="Your first dish or recipe is one click away"
        message="1 step to real-time cost calculations. Create a recipe or dish to see ingredient costs and optimize your margins."
        icon={UtensilsCrossed}
        actions={
          <div className="flex flex-col items-center gap-3">
            <Button
              onClick={() => onViewModeChange('builder')}
              variant="primary"
              landingStyle={true}
              className="flex items-center gap-2"
            >
              <Icon icon={Plus} size="sm" aria-hidden />
              Create your first item
            </Button>
            <InlineHint context="dishes">
              Start here—create a recipe or dish to unlock cost calculations
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
