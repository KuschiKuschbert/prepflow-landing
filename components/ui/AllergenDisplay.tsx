/**
 * Allergen Display Component
 * Displays an array of allergens as badges
 */

import { AllergenBadge } from './AllergenBadge';

interface AllergenDisplayProps {
  allergens: string[];
  allergenSource?: {
    manual?: boolean;
    ai?: boolean;
  };
  showEmpty?: boolean;
  emptyMessage?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  groupBySource?: boolean;
}

export function AllergenDisplay({
  allergens,
  allergenSource,
  showEmpty = true,
  emptyMessage = 'No allergens',
  className = '',
  size = 'md',
  groupBySource = false,
}: AllergenDisplayProps) {
  if (!allergens || allergens.length === 0) {
    if (!showEmpty) return null;
    return (
      <div className={`text-gray-400 text-sm ${className}`}>
        <span className="italic">{emptyMessage}</span>
      </div>
    );
  }

  // Group allergens by source if requested
  if (groupBySource && allergenSource) {
    const manualAllergens: string[] = [];
    const aiAllergens: string[] = [];

    // Note: We can't determine which specific allergens are AI-detected vs manual
    // So we'll show all with AI indicator if any were AI-detected
    const hasAIDetection = allergenSource.ai === true;

    allergens.forEach(allergen => {
      if (hasAIDetection) {
        aiAllergens.push(allergen);
      } else {
        manualAllergens.push(allergen);
      }
    });

    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {manualAllergens.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {manualAllergens.map(allergen => (
              <AllergenBadge
                key={allergen}
                allergenCode={allergen}
                source="manual"
                size={size}
              />
            ))}
          </div>
        )}
        {aiAllergens.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {aiAllergens.map(allergen => (
              <AllergenBadge
                key={allergen}
                allergenCode={allergen}
                source="ai"
                size={size}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default: show all allergens
  const source = allergenSource?.ai ? 'ai' : 'manual';

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {allergens.map(allergen => (
        <AllergenBadge
          key={allergen}
          allergenCode={allergen}
          source={source}
          size={size}
        />
      ))}
    </div>
  );
}

