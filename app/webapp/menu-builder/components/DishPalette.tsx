'use client';

import { Icon } from '@/components/ui/Icon';
import { ChefHat, Plus, Search, Utensils, X } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Dish, Recipe } from '../types';

interface DishPaletteProps {
  dishes: Dish[];
  recipes: Recipe[];
  onItemTap?: (
    item: { type: 'dish' | 'recipe'; id: string; name: string },
    element: HTMLElement,
  ) => void;
}

function TappableDish({
  dish,
  onTap,
}: {
  dish: Dish;
  onTap?: (
    item: { type: 'dish' | 'recipe'; id: string; name: string },
    element: HTMLElement,
  ) => void;
}) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onTap) {
      onTap(
        {
          type: 'dish',
          id: dish.id,
          name: dish.dish_name,
        },
        e.currentTarget,
      );
    }
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] p-3 transition-all hover:border-[#29E7CD]/50 hover:shadow-lg"
    >
      <div className="flex items-center gap-2">
        <Icon icon={Utensils} size="sm" className="text-[#29E7CD]" />
        <div className="flex-1">
          <div className="font-medium text-white">{dish.dish_name}</div>
          <div className="text-sm text-gray-400">${dish.selling_price.toFixed(2)}</div>
        </div>
        {onTap && <Icon icon={Plus} size="sm" className="text-[#29E7CD]" aria-hidden={true} />}
      </div>
    </div>
  );
}

function TappableRecipe({
  recipe,
  onTap,
}: {
  recipe: Recipe;
  onTap?: (
    item: { type: 'dish' | 'recipe'; id: string; name: string },
    element: HTMLElement,
  ) => void;
}) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onTap) {
      onTap(
        {
          type: 'recipe',
          id: recipe.id,
          name: recipe.recipe_name,
        },
        e.currentTarget,
      );
    }
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] p-3 transition-all hover:border-[#D925C7]/50 hover:shadow-lg"
    >
      <div className="flex items-center gap-2">
        <Icon icon={ChefHat} size="sm" className="text-[#D925C7]" />
        <div className="flex-1">
          <div className="font-medium text-white">{recipe.recipe_name}</div>
          {recipe.yield && (
            <div className="text-sm text-gray-400">
              {recipe.yield} {recipe.yield_unit || 'servings'}
            </div>
          )}
        </div>
        {onTap && <Icon icon={Plus} size="sm" className="text-[#D925C7]" aria-hidden={true} />}
      </div>
    </div>
  );
}

export default function DishPalette({ dishes, recipes, onItemTap }: DishPaletteProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter dishes and recipes based on search query
  const filteredDishes = useMemo(() => {
    if (!searchQuery.trim()) return dishes;
    const query = searchQuery.toLowerCase();
    return dishes.filter(
      dish =>
        dish.dish_name.toLowerCase().includes(query) ||
        dish.selling_price.toString().includes(query),
    );
  }, [dishes, searchQuery]);

  const filteredRecipes = useMemo(() => {
    if (!searchQuery.trim()) return recipes;
    const query = searchQuery.toLowerCase();
    return recipes.filter(
      recipe =>
        recipe.recipe_name.toLowerCase().includes(query) ||
        recipe.yield?.toString().includes(query) ||
        recipe.yield_unit?.toLowerCase().includes(query),
    );
  }, [recipes, searchQuery]);

  const hasItems = dishes.length > 0 || recipes.length > 0;
  const hasFilteredItems = filteredDishes.length > 0 || filteredRecipes.length > 0;

  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] p-4">
      <h3 className="mb-4 text-lg font-semibold text-white">Available Items</h3>

      {/* Search Bar */}
      {hasItems && (
        <div className="relative mb-4">
          <Icon
            icon={Search}
            size="sm"
            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
            aria-hidden={true}
          />
          <input
            type="text"
            placeholder="Search dishes or recipes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a]/80 px-10 py-2 pr-10 text-sm text-white placeholder-gray-500 transition-all duration-200 focus:border-[#29E7CD]/50 focus:bg-[#0a0a0a] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-white"
              aria-label="Clear search"
            >
              <Icon icon={X} size="sm" aria-hidden={true} />
            </button>
          )}
        </div>
      )}

      <div className="max-h-[600px] space-y-4 overflow-y-auto">
        {!hasItems ? (
          <div className="py-8 text-center">
            <div className="mb-3 text-sm text-gray-400">No dishes or recipes available yet.</div>
            <p className="mb-4 text-xs text-gray-500">
              Create dishes in the Dish Builder or recipes to add them to your menu.
            </p>
            <Link
              href="/webapp/recipes?builder=true#dishes"
              className="inline-flex items-center gap-2 rounded-lg border border-[#29E7CD]/30 bg-[#29E7CD]/10 px-4 py-2 text-sm font-medium text-[#29E7CD] transition-colors hover:bg-[#29E7CD]/20"
            >
              Go to Dish Builder
            </Link>
          </div>
        ) : !hasFilteredItems ? (
          <div className="py-8 text-center">
            <div className="mb-3 text-sm text-gray-400">No items match your search.</div>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-[#29E7CD] transition-colors hover:text-[#29E7CD]/80"
            >
              Clear search
            </button>
          </div>
        ) : (
          <>
            {/* Dishes Section */}
            {filteredDishes.length > 0 && (
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Icon icon={Utensils} size="sm" className="text-[#29E7CD]" />
                  <div className="text-xs font-medium text-gray-400">
                    Dishes ({filteredDishes.length}
                    {searchQuery &&
                      dishes.length !== filteredDishes.length &&
                      ` of ${dishes.length}`}
                    )
                  </div>
                </div>
                <div className="space-y-2">
                  {filteredDishes.map(dish => (
                    <TappableDish key={dish.id} dish={dish} onTap={onItemTap} />
                  ))}
                </div>
              </div>
            )}

            {/* Recipes Section */}
            {filteredRecipes.length > 0 && (
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Icon icon={ChefHat} size="sm" className="text-[#D925C7]" />
                  <div className="text-xs font-medium text-gray-400">
                    Recipes ({filteredRecipes.length}
                    {searchQuery &&
                      recipes.length !== filteredRecipes.length &&
                      ` of ${recipes.length}`}
                    )
                  </div>
                </div>
                <div className="space-y-2">
                  {filteredRecipes.map(recipe => (
                    <TappableRecipe key={recipe.id} recipe={recipe} onTap={onItemTap} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
