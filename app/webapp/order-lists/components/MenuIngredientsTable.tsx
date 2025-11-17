'use client';

interface Ingredient {
  id: string;
  ingredient_name: string;
  brand?: string;
  pack_size?: string;
  pack_size_unit?: string;
  pack_price?: number;
  cost_per_unit: number;
  unit?: string;
  storage?: string;
  category?: string;
  par_level?: number;
  reorder_point?: number;
  par_unit?: string;
}

interface MenuIngredientsTableProps {
  menuName: string;
  groupedIngredients: Record<string, Ingredient[]>;
  sortBy: string;
}

export function MenuIngredientsTable({
  menuName,
  groupedIngredients,
  sortBy,
}: MenuIngredientsTableProps) {
  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return '-';
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(price);
  };

  const formatPackSize = (packSize?: string, packSizeUnit?: string) => {
    if (!packSize) return '-';
    const unit = packSizeUnit || '';
    return unit ? `${packSize} ${unit}` : packSize;
  };

  const formatParLevel = (parLevel?: number, unit?: string) => {
    if (parLevel === undefined || parLevel === null) return '-';
    return `${parLevel}${unit ? ` ${unit}` : ''}`;
  };

  const groupKeys = Object.keys(groupedIngredients).sort();

  return (
    <div className="order-list-print">
      {/* Header - visible in print */}
      <div className="mb-6 print:mb-4">
        <h2 className="text-2xl font-bold text-white print:text-xl print:text-black">{menuName}</h2>
        <p className="text-gray-400 print:text-sm print:text-gray-600">
          Order List -{' '}
          {new Date().toLocaleDateString('en-AU', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Table */}
      {groupKeys.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-400">No ingredients found for this menu.</p>
        </div>
      ) : (
        <div className="space-y-8 print:space-y-6">
          {groupKeys.map(groupKey => (
            <div key={groupKey} className="print:break-inside-avoid">
              {/* Group Header */}
              <h3 className="mb-4 text-lg font-semibold text-white print:mb-2 print:border-b print:border-gray-300 print:pb-1 print:text-base print:text-black">
                {groupKey}
              </h3>

              {/* Table */}
              <div className="overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] print:rounded-none print:border print:border-gray-300 print:bg-white">
                <table className="min-w-full divide-y divide-[#2a2a2a] print:divide-gray-300">
                  <thead className="sticky top-0 z-10 bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20 print:bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase print:px-4 print:py-2 print:text-gray-700">
                        Item Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase print:px-4 print:py-2 print:text-gray-700">
                        Brand
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase print:px-4 print:py-2 print:text-gray-700">
                        Pack Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase print:px-4 print:py-2 print:text-gray-700">
                        Price Per Pack
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase print:px-4 print:py-2 print:text-gray-700">
                        Par Level
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a2a2a] bg-[#1f1f1f] print:divide-gray-300 print:bg-white">
                    {groupedIngredients[groupKey].map(ingredient => (
                      <tr
                        key={ingredient.id}
                        className="transition-colors hover:bg-[#2a2a2a]/20 print:hover:bg-transparent"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-white print:px-4 print:py-2 print:text-black">
                          {ingredient.ingredient_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300 print:px-4 print:py-2 print:text-gray-700">
                          {ingredient.brand || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300 print:px-4 print:py-2 print:text-gray-700">
                          {formatPackSize(ingredient.pack_size, ingredient.pack_size_unit)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300 print:px-4 print:py-2 print:text-gray-700">
                          {formatPrice(ingredient.pack_price)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300 print:px-4 print:py-2 print:text-gray-700">
                          {formatParLevel(ingredient.par_level, ingredient.par_unit)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
