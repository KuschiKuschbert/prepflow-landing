import { Icon } from '@/components/ui/Icon';
import { BookOpen, Package, Sparkles, Thermometer, Truck } from 'lucide-react';
import React from 'react';

export interface NewItemOption {
  href: string;
  label: string;
  icon: React.ReactNode;
  category: string;
}

export const getCreatableItems = (): NewItemOption[] => [
  {
    href: '/webapp/temperature?action=new',
    label: 'Temp Log',
    icon: <Icon icon={Thermometer} size="sm" className="text-current" aria-hidden={true} />,
    category: 'Temperature',
  },
  {
    href: '/webapp/recipes#ingredients',
    label: 'Ingredient',
    icon: <Icon icon={Package} size="sm" className="text-current" aria-hidden={true} />,
    category: 'Ingredients',
  },
  {
    href: '/webapp/recipes?action=new',
    label: 'Recipe',
    icon: <Icon icon={BookOpen} size="sm" className="text-current" aria-hidden={true} />,
    category: 'Recipes',
  },
  {
    href: '/webapp/cleaning?action=new',
    label: 'Cleaning Task',
    icon: <Icon icon={Sparkles} size="sm" className="text-current" aria-hidden={true} />,
    category: 'Cleaning',
  },
  {
    href: '/webapp/suppliers?action=new',
    label: 'Supplier',
    icon: <Icon icon={Truck} size="sm" className="text-current" aria-hidden={true} />,
    category: 'Suppliers',
  },
];
