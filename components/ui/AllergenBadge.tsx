/**
 * Allergen Badge Component
 * Displays a single allergen with icon and optional AI detection indicator
 */

import { getAllergenDisplayName, getAllergen } from '@/lib/allergens/australian-allergens';
import { Icon } from './Icon';
import {
  Sparkles,
  Nut,
  Milk,
  Egg,
  Bean,
  Wheat,
  Fish,
  CircleDot,
  Flower,
  AlertTriangle,
  Circle,
  LucideIcon,
} from 'lucide-react';

// Icon mapping for allergens
const ALLERGEN_ICONS: Record<string, LucideIcon> = {
  nuts: Nut,
  milk: Milk,
  eggs: Egg,
  soy: Bean,
  gluten: Wheat,
  fish: Fish,
  shellfish: Fish, // Using Fish icon for shellfish
  sesame: CircleDot,
  lupin: Flower,
  sulphites: AlertTriangle,
  mustard: Circle,
};

interface AllergenBadgeProps {
  allergenCode: string;
  source?: 'manual' | 'ai';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AllergenBadge({
  allergenCode,
  source,
  className = '',
  size = 'md',
}: AllergenBadgeProps) {
  const allergen = getAllergen(allergenCode);
  const displayName = allergen?.displayName || getAllergenDisplayName(allergenCode);
  const IconComponent = allergen?.icon ? ALLERGEN_ICONS[allergen.icon] : undefined;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const iconSizes = {
    sm: 'xs' as const,
    md: 'sm' as const,
    lg: 'md' as const,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 text-[var(--primary)] ${sizeClasses[size]} ${className}`}
      title={allergen?.description || displayName}
    >
      {IconComponent && (
        <Icon
          icon={IconComponent}
          size={iconSizes[size]}
          className="text-[var(--primary)]"
          aria-hidden={true}
        />
      )}
      <span>{displayName}</span>
      {source === 'ai' && (
        <Icon
          icon={Sparkles}
          size="xs"
          className="text-[var(--primary)]"
          aria-label="AI detected"
        />
      )}
    </span>
  );
}
