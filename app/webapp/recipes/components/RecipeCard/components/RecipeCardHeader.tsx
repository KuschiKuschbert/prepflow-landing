import { Icon } from '@/components/ui/Icon';
import { Check } from 'lucide-react';
import { formatRecipeDate } from '../../../utils/formatDate';

interface RecipeCardHeaderProps {
  recipeName: string;
  createdAt: string;
  isSelected: boolean;
  onSelect: () => void;
  capitalizeRecipeName: (name: string) => string;
}

/**
 * Recipe card header component (checkbox, name, date)
 */
export function RecipeCardHeader({
  recipeName,
  createdAt,
  isSelected,
  onSelect,
  capitalizeRecipeName,
}: RecipeCardHeaderProps) {
  return (
    <div className="mb-2 flex items-start justify-between">
      <div className="flex items-center">
        <button
          onClick={e => {
            e.stopPropagation();
            onSelect();
          }}
          className="mr-3 flex items-center justify-center transition-colors hover:text-[#29E7CD]"
          aria-label={`${isSelected ? 'Deselect' : 'Select'} recipe ${capitalizeRecipeName(recipeName)}`}
          title={isSelected ? 'Deselect recipe' : 'Select recipe'}
        >
          {isSelected ? (
            <Icon icon={Check} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
          ) : (
            <div className="h-4 w-4 rounded border border-[#2a2a2a] bg-[#0a0a0a] transition-colors hover:border-[#29E7CD]/50" />
          )}
        </button>
        <h3 className="text-sm font-medium text-white">{capitalizeRecipeName(recipeName)}</h3>
      </div>
      <span className="text-xs text-gray-500" title={`Created on ${formatRecipeDate(createdAt)}`}>
        {formatRecipeDate(createdAt)}
      </span>
    </div>
  );
}
