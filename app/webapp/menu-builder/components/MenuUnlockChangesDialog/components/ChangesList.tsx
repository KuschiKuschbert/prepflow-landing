import { MenuChangeTracking } from '@/lib/menu-lock/change-tracking';
import { formatChangeDetails } from '../utils/formatChangeDetails';
import { groupChangesByType } from '../utils/groupChangesByType';

interface ChangesListProps {
  changes: MenuChangeTracking[];
}

/**
 * Component for displaying grouped changes list
 */
export function ChangesList({ changes }: ChangesListProps) {
  const groupedChanges = groupChangesByType(changes);

  return (
    <div className="mb-6 max-h-96 space-y-4 overflow-y-auto">
      {/* Dishes */}
      {groupedChanges.dish.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold tracking-wider text-gray-400 uppercase">
            Dishes ({groupedChanges.dish.length})
          </h3>
          <div className="space-y-2">
            {groupedChanges.dish.map(change => (
              <div
                key={`dish-change-${change.id}`}
                className="rounded-lg border border-[#2a2a2a] bg-[#0a0a0a]/50 p-3"
              >
                <div className="font-medium text-white">{change.entity_name}</div>
                <div className="mt-1 text-sm text-gray-400">{formatChangeDetails(change)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recipes */}
      {groupedChanges.recipe.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold tracking-wider text-gray-400 uppercase">
            Recipes ({groupedChanges.recipe.length})
          </h3>
          <div className="space-y-2">
            {groupedChanges.recipe.map(change => (
              <div
                key={`recipe-change-${change.id}`}
                className="rounded-lg border border-[#2a2a2a] bg-[#0a0a0a]/50 p-3"
              >
                <div className="font-medium text-white">{change.entity_name}</div>
                <div className="mt-1 text-sm text-gray-400">{formatChangeDetails(change)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ingredients */}
      {groupedChanges.ingredient.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold tracking-wider text-gray-400 uppercase">
            Ingredients ({groupedChanges.ingredient.length})
          </h3>
          <div className="space-y-2">
            {groupedChanges.ingredient.map(change => (
              <div
                key={`ingredient-change-${change.id}`}
                className="rounded-lg border border-[#2a2a2a] bg-[#0a0a0a]/50 p-3"
              >
                <div className="font-medium text-white">{change.entity_name}</div>
                <div className="mt-1 text-sm text-gray-400">{formatChangeDetails(change)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
