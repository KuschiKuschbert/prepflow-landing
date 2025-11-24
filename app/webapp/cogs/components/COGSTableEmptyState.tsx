'use client';

import { EmptyState } from '@/components/ui/EmptyState';
import { Utensils } from 'lucide-react';

export function COGSTableEmptyState() {
  return (
    <EmptyState
      title="No Ingredients Added Yet"
      message="Start by adding ingredients to your dish. Each ingredient you add will show its cost, and we'll calculate the total COGS (Cost of Goods Sold) for your recipe. Use the ingredient search above to add ingredients from your database, or add new ones on the fly."
      icon={Utensils}
      useLandingStyles={true}
      variant="landing"
      animated={true}
      className="rounded-2xl"
    />
  );
}
