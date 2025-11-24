'use client';

import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Thermometer, Plus } from 'lucide-react';

interface EquipmentEmptyStateProps {
  onAddEquipment: () => void;
}

export function EquipmentEmptyState({ onAddEquipment }: EquipmentEmptyStateProps) {
  return (
    <EmptyState
      title="No Equipment Added"
      message="Add temperature monitoring equipment to start tracking temperatures and ensure food safety compliance"
      icon={Thermometer}
      actions={
        <Button
          onClick={onAddEquipment}
          variant="primary"
          landingStyle={true}
          magnetic={true}
          glow={true}
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          Add Your First Equipment
        </Button>
      }
      useLandingStyles={true}
      variant="landing"
      animated={true}
    />
  );
}
