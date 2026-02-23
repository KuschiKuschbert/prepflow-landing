'use client';

import { EmptyState } from '@/components/ui/EmptyState';
import { InlineHint } from '@/components/ui/InlineHint';
import { RescueNudge } from '@/components/ui/RescueNudge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Thermometer, Plus } from 'lucide-react';

interface EquipmentEmptyStateProps {
  onAddEquipment: () => void;
}

export function EquipmentEmptyState({ onAddEquipment }: EquipmentEmptyStateProps) {
  return (
    <div className="space-y-6">
      <RescueNudge pageKey="temperature-equipment" guideId="compliance-safety" guideStepIndex={0} />
      <EmptyState
        title="Your first equipment is one click away"
        message="1 step to compliance-ready temperature logs. Add equipment to start tracking fridge and freezer temps."
        icon={Thermometer}
        actions={
          <div className="flex flex-col items-center gap-3">
            <Button
              onClick={onAddEquipment}
              variant="primary"
              landingStyle={true}
              magnetic={true}
              glow={true}
              className="flex items-center gap-2"
            >
              <Icon icon={Plus} size="md" aria-hidden />
              Add Your First Equipment
            </Button>
            <InlineHint context="temperature-equipment">
              Start here—add equipment to start temperature tracking
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
