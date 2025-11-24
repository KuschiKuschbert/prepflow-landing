'use client';

import { EmptyState } from '@/components/ui/EmptyState';
import { BarChart3 } from 'lucide-react';

export function COGSEmptyState() {
  return (
    <EmptyState
      title="Select a Recipe"
      message="Choose or create a recipe to see cost analysis and pricing calculations."
      icon={BarChart3}
      useLandingStyles={true}
      variant="landing"
      animated={true}
    />
  );
}
