'use client';

import { useState } from 'react';

interface Substitution {
  ingredient: string;
  substitutes: {
    name: string;
    ratio: string;
    notes?: string;
    allergenFriendly?: boolean;
  }[];
  category: string;
}

const substitutions: Substitution[] = [
  {
    ingredient: 'Eggs',
    category: 'dairy-eggs',
    substitutes: [
      {
        name: 'Flax egg',
        ratio: '1 tbsp ground flaxseed + 3 tbsp water = 1 egg',
        allergenFriendly: true,
      },
      {
        name: 'Chia egg',
        ratio: '1 tbsp chia seeds + 3 tbsp water = 1 egg',
        allergenFriendly: true,
      },
      { name: 'Applesauce', ratio: '1/4 cup = 1 egg', notes: 'Adds moisture, best for baking' },
      { name: 'Banana', ratio: '1/2 mashed banana = 1 egg', notes: 'Adds sweetness' },
      {
        name: 'Commercial egg replacer',
        ratio: 'Follow package instructions',
        allergenFriendly: true,
      },
    ],
  },
  {
    ingredient: 'Butter',
    category: 'fats',
    substitutes: [
      { name: 'Margarine', ratio: '1:1', notes: 'Similar texture and flavor' },
      { name: 'Coconut oil', ratio: '1:1', notes: 'Solid at room temp, slight coconut flavor' },
      {
        name: 'Olive oil',
        ratio: '3/4 cup oil = 1 cup butter',
        notes: 'For baking, reduce liquid',
      },
      { name: 'Vegetable shortening', ratio: '1:1', notes: 'No flavor, good for pastry' },
      { name: 'Applesauce', ratio: '1/2 cup = 1 cup butter', notes: 'Reduces fat, adds moisture' },
    ],
  },
  {
    ingredient: 'Milk',
    category: 'dairy-eggs',
    substitutes: [
      { name: 'Almond milk', ratio: '1:1', allergenFriendly: true },
      { name: 'Soy milk', ratio: '1:1', allergenFriendly: true },
      { name: 'Oat milk', ratio: '1:1', allergenFriendly: true },
      { name: 'Coconut milk', ratio: '1:1', notes: 'Slight coconut flavor' },
      {
        name: 'Water + butter',
        ratio: '1 cup water + 1 tbsp butter = 1 cup milk',
        notes: 'Emergency substitute',
      },
    ],
  },
  {
    ingredient: 'All-purpose flour',
    category: 'flour',
    substitutes: [
      { name: 'Whole wheat flour', ratio: '1:1', notes: 'Denser, nuttier flavor' },
      {
        name: 'Cake flour',
        ratio: '1 cup + 2 tbsp cake flour = 1 cup AP flour',
        notes: 'Lighter texture',
      },
      { name: 'Gluten-free flour blend', ratio: '1:1', allergenFriendly: true },
      { name: 'Almond flour', ratio: '1/4 cup = 1 cup AP flour', notes: 'High protein, low carb' },
      {
        name: 'Coconut flour',
        ratio: '1/4 cup = 1 cup AP flour',
        notes: 'Very absorbent, add more liquid',
      },
    ],
  },
  {
    ingredient: 'Sugar',
    category: 'sweeteners',
    substitutes: [
      { name: 'Honey', ratio: '3/4 cup honey = 1 cup sugar', notes: 'Reduce liquid by 1/4 cup' },
      { name: 'Maple syrup', ratio: '3/4 cup = 1 cup sugar', notes: 'Reduce liquid by 3 tbsp' },
      { name: 'Brown sugar', ratio: '1:1', notes: 'Adds moisture and flavor' },
      { name: 'Coconut sugar', ratio: '1:1', notes: 'Lower glycemic index' },
      { name: 'Stevia', ratio: '1 tsp = 1 cup sugar', notes: 'Very sweet, no calories' },
    ],
  },
  {
    ingredient: 'Sour cream',
    category: 'dairy-eggs',
    substitutes: [
      { name: 'Greek yogurt', ratio: '1:1', notes: 'Similar tang and texture' },
      { name: 'Buttermilk', ratio: '1:1', notes: 'Thinner, add more if needed' },
      {
        name: 'Cream cheese + milk',
        ratio: '1/2 cup cream cheese + 1/4 cup milk = 1 cup sour cream',
      },
      { name: 'Coconut cream', ratio: '1:1', allergenFriendly: true, notes: 'Dairy-free option' },
    ],
  },
  {
    ingredient: 'Heavy cream',
    category: 'dairy-eggs',
    substitutes: [
      {
        name: 'Half and half + butter',
        ratio: '3/4 cup half & half + 1/4 cup butter = 1 cup cream',
      },
      { name: 'Milk + butter', ratio: '2/3 cup milk + 1/3 cup butter = 1 cup cream' },
      { name: 'Coconut cream', ratio: '1:1', allergenFriendly: true },
      { name: 'Evaporated milk', ratio: '1:1', notes: 'Slightly thinner' },
    ],
  },
  {
    ingredient: 'Baking powder',
    category: 'leavening',
    substitutes: [
      {
        name: 'Baking soda + cream of tartar',
        ratio: '1/4 tsp baking soda + 1/2 tsp cream of tartar = 1 tsp baking powder',
      },
      {
        name: 'Baking soda + buttermilk',
        ratio: '1/4 tsp baking soda + 1/2 cup buttermilk = 1 tsp baking powder',
        notes: 'Reduce other liquid',
      },
    ],
  },
];

export function IngredientSubstitutionGuide() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showAllergenFriendly, setShowAllergenFriendly] = useState(false);

  const categories = Array.from(new Set(substitutions.map(s => s.category)));

  // Only show results if user has searched or selected a category
  const hasActiveFilter = searchQuery.trim() !== '' || selectedCategory !== '';

  const filteredSubstitutions = substitutions.filter(sub => {
    const matchesSearch =
      searchQuery.trim() === '' || sub.ingredient.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '' || sub.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const allergenFriendlySubs = showAllergenFriendly
    ? filteredSubstitutions.map(sub => ({
        ...sub,
        substitutes: sub.substitutes.filter(s => s.allergenFriendly),
      }))
    : filteredSubstitutions;

  return (
    <div className="flex min-h-[600px] w-full flex-col space-y-1.5 overflow-y-auto px-3 py-3 sm:space-y-2 sm:px-4 sm:py-4">
      <div className="hidden flex-shrink-0 sm:block">
        <h2 className="mb-1 text-base font-semibold text-white sm:mb-2 sm:text-lg">
          Ingredient Substitution Guide
        </h2>
        <p className="text-xs text-gray-400">Find alternatives for common ingredients</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-shrink-0 flex-col space-y-1.5 sm:space-y-2">
        <div>
          <label className="mb-0.5 block text-xs font-medium text-gray-300 sm:mb-1 sm:text-sm">
            Search Ingredient
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Type ingredient name..."
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/50 px-2 py-1.5 text-sm text-white placeholder-gray-500 focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none sm:rounded-xl sm:px-3 sm:py-2"
          />
        </div>

        <div className="flex w-full flex-wrap gap-2">
          <div className="min-w-[150px] flex-1 sm:min-w-[200px]">
            <label className="mb-0.5 block text-xs font-medium text-gray-300 sm:mb-1 sm:text-sm">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/50 px-2 py-1.5 text-sm text-white focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none sm:rounded-xl sm:px-3 sm:py-2"
            >
              <option value="">Select a category...</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-1 rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/50 px-2 py-1.5 text-xs sm:gap-2 sm:rounded-xl sm:px-3 sm:py-2 sm:text-sm">
              <input
                type="checkbox"
                checked={showAllergenFriendly}
                onChange={e => setShowAllergenFriendly(e.target.checked)}
                className="rounded border-[#2a2a2a] bg-[#2a2a2a] text-[#29E7CD] focus:ring-[#29E7CD]"
              />
              <span className="text-xs text-white sm:text-sm">Allergen-friendly</span>
            </label>
          </div>
        </div>
      </div>

      {/* Substitutions List - Only show when filter is active */}
      <div className="flex-1 space-y-1.5 overflow-y-auto sm:space-y-2">
        {!hasActiveFilter ? (
          <div className="flex h-full items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/30 p-4 text-center sm:rounded-xl sm:p-8">
            <div className="space-y-2">
              <div className="text-sm text-gray-400 sm:text-base">
                Search for an ingredient or select a category to see substitutions
              </div>
              <div className="text-xs text-gray-500 sm:text-sm">
                Try: "Eggs", "Butter", "Milk", or select a category above
              </div>
            </div>
          </div>
        ) : allergenFriendlySubs.length > 0 ? (
          allergenFriendlySubs.map(sub => (
            <div
              key={sub.ingredient}
              className="rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] p-2 sm:rounded-xl sm:p-4"
            >
              <h3 className="mb-1.5 text-sm font-semibold text-white sm:mb-2 sm:text-base">
                {sub.ingredient}
              </h3>
              <div className="space-y-1.5 sm:space-y-2">
                {sub.substitutes.map((substitute, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/30 p-1.5 sm:rounded-xl sm:p-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className="text-xs font-medium text-white sm:text-sm">
                            {substitute.name}
                          </span>
                          {substitute.allergenFriendly && (
                            <span className="rounded-full bg-[#29E7CD]/20 px-1.5 py-0.5 text-xs text-[#29E7CD]">
                              Allergen-friendly
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 text-xs text-[#29E7CD] sm:mt-1 sm:text-sm">
                          {substitute.ratio}
                        </div>
                        {substitute.notes && (
                          <div className="mt-0.5 text-xs text-gray-400">{substitute.notes}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-full items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/30 p-4 text-center text-xs text-gray-400 sm:rounded-xl sm:p-8 sm:text-sm">
            No substitutions found. Try a different search term or category.
          </div>
        )}
      </div>
    </div>
  );
}
