'use client';

import { useDraggable } from '@dnd-kit/core';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { ChefHat, Utensils } from 'lucide-react';
import { Dish, Recipe } from '../types';

interface DishPaletteProps {
  dishes: Dish[];
  recipes: Recipe[];
}

function DraggableDish({ dish }: { dish: Dish }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: dish.id,
    data: {
      type: 'dish',
      dish,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`cursor-grab rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] p-3 transition-all hover:border-[#29E7CD]/50 hover:shadow-lg ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon icon={Utensils} size="sm" className="text-[#29E7CD]" />
        <div className="flex-1">
          <div className="font-medium text-white">{dish.dish_name}</div>
          <div className="text-sm text-gray-400">${dish.selling_price.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

function DraggableRecipe({ recipe }: { recipe: Recipe }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: recipe.id,
    data: {
      type: 'recipe',
      recipe,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`cursor-grab rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] p-3 transition-all hover:border-[#D925C7]/50 hover:shadow-lg ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon icon={ChefHat} size="sm" className="text-[#D925C7]" />
        <div className="flex-1">
          <div className="font-medium text-white">{recipe.name}</div>
          {recipe.yield && (
            <div className="text-sm text-gray-400">
              {recipe.yield} {recipe.yield_unit || 'servings'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DishPalette({ dishes, recipes }: DishPaletteProps) {
  const hasItems = dishes.length > 0 || recipes.length > 0;

  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] p-4">
      <h3 className="mb-4 text-lg font-semibold text-white">Available Items</h3>
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
        ) : (
          <>
            {/* Dishes Section */}
            {dishes.length > 0 && (
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Icon icon={Utensils} size="sm" className="text-[#29E7CD]" />
                  <div className="text-xs font-medium text-gray-400">Dishes ({dishes.length})</div>
                </div>
                <div className="space-y-2">
                  {dishes.map(dish => (
                    <DraggableDish key={dish.id} dish={dish} />
                  ))}
                </div>
              </div>
            )}

            {/* Recipes Section */}
            {recipes.length > 0 && (
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Icon icon={ChefHat} size="sm" className="text-[#D925C7]" />
                  <div className="text-xs font-medium text-gray-400">
                    Recipes ({recipes.length})
                  </div>
                </div>
                <div className="space-y-2">
                  {recipes.map(recipe => (
                    <DraggableRecipe key={recipe.id} recipe={recipe} />
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
