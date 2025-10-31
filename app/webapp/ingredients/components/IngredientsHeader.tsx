import { useTranslation } from '@/lib/useTranslation';

interface IngredientsHeaderProps {
  displayUnit: string;
  setDisplayUnit: (unit: string) => void;
}

export function IngredientsHeader({ displayUnit, setDisplayUnit }: IngredientsHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-white">
            🥘 {t('ingredients.title', 'Ingredients Management')}
          </h1>
          <p className="text-gray-400">
            {t('ingredients.subtitle', 'Manage your kitchen ingredients and inventory')}
          </p>
        </div>

        {/* Unit Selector */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-300">Display costs in:</label>
          <select
            value={displayUnit}
            onChange={e => setDisplayUnit(e.target.value)}
            className="flex min-h-[44px] items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
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
          </select>
        </div>
      </div>
    </div>
  );
}
