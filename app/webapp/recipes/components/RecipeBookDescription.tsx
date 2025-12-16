'use client';

export function RecipeBookDescription() {
  return (
    <div className="tablet:p-6 mb-6 rounded-xl border border-[var(--primary)]/30 bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/10 p-4">
      <h2 className="mb-2 text-lg font-semibold text-[var(--button-active-text)]">How Recipe Book Works</h2>
      <div className="desktop:grid-cols-2 grid gap-4 text-sm text-[var(--foreground-secondary)]">
        <div>
          <h3 className="mb-2 font-medium text-[var(--color-info)]">✍️ Manual Recipes</h3>
          <p>
            Add recipes manually with instructions and portion counts. Perfect for documenting
            cooking methods and procedures.
          </p>
        </div>
        <div>
          <h3 className="mb-2 font-medium text-[var(--primary)]">📦 Ingredients</h3>
          <p>
            Add ingredients with costs, suppliers, and storage locations. Build your ingredient
            library for recipes and dishes.
          </p>
        </div>
      </div>
    </div>
  );
}
