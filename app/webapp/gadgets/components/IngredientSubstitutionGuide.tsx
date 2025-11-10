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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAllergenFriendly, setShowAllergenFriendly] = useState(false);

  const categories = ['all', ...Array.from(new Set(substitutions.map(s => s.category)))];

  const filteredSubstitutions = substitutions.filter(sub => {
    const matchesSearch = sub.ingredient.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || sub.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const allergenFriendlySubs = showAllergenFriendly
    ? filteredSubstitutions.map(sub => ({
        ...sub,
        substitutes: sub.substitutes.filter(s => s.allergenFriendly),
      }))
    : filteredSubstitutions;

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <div>
        <h2 className="mb-2 text-lg font-semibold text-white sm:text-xl">
          Ingredient Substitution Guide
        </h2>
        <p className="text-xs text-gray-400 sm:text-sm">Find alternatives for common ingredients</p>
      </div>

      {/* Search and Filters */}
      <div className="w-full space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Search Ingredient</label>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Type ingredient name..."
            className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/50 px-4 py-3 text-white placeholder-gray-500 focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
          />
        </div>

        <div className="flex w-full flex-wrap gap-4">
          <div className="min-w-[200px] flex-1 sm:min-w-[250px]">
            <label className="mb-2 block text-sm font-medium text-gray-300">Category</label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/50 px-4 py-3 text-white focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories
                .filter(c => c !== 'all')
                .map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/50 px-4 py-3">
              <input
                type="checkbox"
                checked={showAllergenFriendly}
                onChange={e => setShowAllergenFriendly(e.target.checked)}
                className="rounded border-[#2a2a2a] bg-[#2a2a2a] text-[#29E7CD] focus:ring-[#29E7CD]"
              />
              <span className="text-sm text-white">Allergen-friendly only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Substitutions List */}
      <div className="w-full space-y-4">
        {allergenFriendlySubs.length > 0 ? (
          allergenFriendlySubs.map(sub => (
            <div
              key={sub.ingredient}
              className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6"
            >
              <h3 className="mb-4 text-lg font-semibold text-white">{sub.ingredient}</h3>
              <div className="space-y-3">
                {sub.substitutes.map((substitute, idx) => (
                  <div key={idx} className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{substitute.name}</span>
                          {substitute.allergenFriendly && (
                            <span className="rounded-full bg-[#29E7CD]/20 px-2 py-0.5 text-xs text-[#29E7CD]">
                              Allergen-friendly
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-sm text-[#29E7CD]">{substitute.ratio}</div>
                        {substitute.notes && (
                          <div className="mt-1 text-xs text-gray-400">{substitute.notes}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-8 text-center text-gray-400">
            No substitutions found. Try a different search term.
          </div>
        )}
      </div>
    </div>
  );
}
