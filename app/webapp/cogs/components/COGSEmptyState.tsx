'use client';

export function COGSEmptyState() {
  return (
    <div className="py-12 text-center">
      <div className="mb-4 text-6xl text-gray-400">📊</div>
      <h3 className="mb-2 text-lg font-medium text-white">Select a Recipe</h3>
      <p className="text-gray-500">
        Choose or create a recipe to see cost analysis and pricing calculations.
      </p>
    </div>
  );
}
