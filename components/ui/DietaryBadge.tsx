/**
 * Dietary Badge Component
 * Displays vegetarian/vegan badges with confidence indicators
 */

import { Icon } from './Icon';
import { Leaf, AlertCircle } from 'lucide-react';

interface DietaryBadgeProps {
  isVegetarian?: boolean | null;
  isVegan?: boolean | null;
  confidence?: 'high' | 'medium' | 'low' | string | null;
  showConfidence?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function DietaryBadge({
  isVegetarian,
  isVegan,
  confidence,
  showConfidence = false,
  className = '',
  size = 'md',
}: DietaryBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const badges: JSX.Element[] = [];

  if (isVegan === true) {
    badges.push(
      <span
        key="vegan"
        className={`inline-flex items-center gap-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 ${sizeClasses[size]}`}
        title="Vegan - Contains no animal products"
      >
        <Icon icon={Leaf} size="xs" className="text-green-400" aria-hidden="true" />
        <span>Vegan</span>
        {showConfidence && confidence === 'low' && (
          <Icon
            icon={AlertCircle}
            size="xs"
            className="text-yellow-400"
            aria-label="Low confidence"
            title="Low confidence - may need verification"
          />
        )}
      </span>,
    );
  } else if (isVegetarian === true) {
    badges.push(
      <span
        key="vegetarian"
        className={`inline-flex items-center gap-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 ${sizeClasses[size]}`}
        title="Vegetarian - Contains no meat or fish"
      >
        <Icon icon={Leaf} size="xs" className="text-green-400" aria-hidden="true" />
        <span>Vegetarian</span>
        {showConfidence && confidence === 'low' && (
          <Icon
            icon={AlertCircle}
            size="xs"
            className="text-yellow-400"
            aria-label="Low confidence"
            title="Low confidence - may need verification"
          />
        )}
      </span>,
    );
  }

  if (badges.length === 0) {
    return null;
  }

  return <div className={`flex flex-wrap gap-2 ${className}`}>{badges}</div>;
}

