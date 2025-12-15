/**
 * Component for displaying empty state when no recipe/dish is selected
 */
export function EmptyState() {
  return (
    <div className="flex h-full min-h-[400px] items-center justify-center text-gray-400">
      <div className="text-center">
        <p className="mb-2 text-lg">Select a recipe or dish</p>
        <p className="text-sm">Choose an item from the left to edit its ingredients</p>
      </div>
    </div>
  );
}

