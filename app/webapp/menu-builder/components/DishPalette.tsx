'use client';

import { useDraggable } from '@dnd-kit/core';
import { Dish } from '../types';

interface DishPaletteProps {
  dishes: Dish[];
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
      <div className="font-medium text-white">{dish.dish_name}</div>
      <div className="text-sm text-gray-400">${dish.selling_price.toFixed(2)}</div>
    </div>
  );
}

export default function DishPalette({ dishes }: DishPaletteProps) {
  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] p-4">
      <h3 className="mb-4 text-lg font-semibold text-white">Available Dishes</h3>
      <div className="max-h-[600px] space-y-2 overflow-y-auto">
        {dishes.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-400">
            No dishes available. Create dishes in the Recipe Book first.
          </div>
        ) : (
          dishes.map(dish => <DraggableDish key={dish.id} dish={dish} />)
        )}
      </div>
    </div>
  );
}
