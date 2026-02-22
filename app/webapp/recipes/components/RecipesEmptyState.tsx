'use client';

import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { ChefHat, Plus } from 'lucide-react';

export function RecipesEmptyState() {
  return (
    <EmptyState
      title="No recipes yet"
      message="Start by adding your first recipe to begin managing your kitchen costs and optimizing profitability."
      icon={ChefHat}
      actions={
        <Button
          href="/webapp/recipes#dishes"
          variant="primary"
          landingStyle={true}
          className="flex items-center gap-2"
        >
          <Icon icon={Plus} size="sm" aria-hidden />
          Add Your First Recipe
        </Button>
      }
      useLandingStyles={true}
      variant="landing"
      animated={true}
    />
  );
}
