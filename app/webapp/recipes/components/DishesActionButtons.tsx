'use client';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { FileText } from 'lucide-react';

interface DishesActionButtonsProps {
  onAddDish: () => void;
}

export function DishesActionButtons({ onAddDish }: DishesActionButtonsProps) {
  return (
    <div className="mb-8 flex flex-wrap gap-3">
      <Button
        onClick={onAddDish}
        variant="primary"
        size="sm"
        className="shadow-lg hover:shadow-xl"
        landingStyle
      >
        Add Dish
      </Button>
      <Button
        href="/webapp/recipes#menu-builder"
        variant="outline"
        size="sm"
        className="hover:shadow-lg"
        landingStyle
      >
        <Icon icon={FileText} size="sm" className="mr-1.5" />
        <span>Menu Builder</span>
      </Button>
    </div>
  );
}
