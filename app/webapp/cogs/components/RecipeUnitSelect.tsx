// PrepFlow - Recipe Unit Select Component
// Extracted from IngredientManager to meet file size limits

'use client';

interface RecipeUnitSelectProps {
  value: string;
  onChange: (unit: string) => void;
}

export function RecipeUnitSelect({ value, onChange }: RecipeUnitSelectProps) {
  return (
    <div className="relative">
      <select
        value={value || 'kg'}
        onChange={e => onChange(e.target.value)}
        className="w-full cursor-pointer appearance-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] shadow-sm transition-all duration-200 hover:shadow-md focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
      >
        <optgroup label="Weight">
          <option value="g">Grams (g)</option>
          <option value="kg">Kilograms (kg)</option>
          <option value="oz">Ounces (oz)</option>
          <option value="lb">Pounds (lb)</option>
        </optgroup>
        <optgroup label="Volume">
          <option value="ml">Milliliters (ml)</option>
          <option value="l">Liters (L)</option>
          <option value="tsp">Teaspoons (tsp)</option>
          <option value="tbsp">Tablespoons (tbsp)</option>
          <option value="cup">Cups</option>
          <option value="fl oz">Fluid Ounces (fl oz)</option>
        </optgroup>
        <optgroup label="Piece">
          <option value="pc">Pieces (pc)</option>
          <option value="box">Box</option>
          <option value="pack">Pack</option>
          <option value="bag">Bag</option>
          <option value="bottle">Bottle</option>
          <option value="can">Can</option>
          <option value="bunch">Bunch</option>
        </optgroup>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <svg
          className="h-5 w-5 text-[var(--foreground-muted)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
