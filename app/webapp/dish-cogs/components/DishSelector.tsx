'use client';

import { useState, useEffect } from 'react';
import { Dish } from '../types';
import { Icon } from '@/components/ui/Icon';
import { ChevronDown } from 'lucide-react';

interface DishSelectorProps {
  selectedDish: Dish | null;
  onDishSelect: (dish: Dish | null) => void;
}

export function DishSelector({ selectedDish, onDishSelect }: DishSelectorProps) {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch('/api/dishes?pageSize=1000')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setDishes(data.dishes || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative">
      <label className="mb-2 block text-sm font-medium text-gray-300">Select Dish</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] px-4 py-3 text-left text-white focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]"
        >
          <div className="flex items-center justify-between">
            <span className={selectedDish ? 'text-white' : 'text-gray-400'}>
              {selectedDish ? selectedDish.dish_name : 'Select a dish...'}
            </span>
            <Icon icon={ChevronDown} size="sm" className="text-gray-400" aria-hidden={true} />
          </div>
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] shadow-xl">
              {loading ? (
                <div className="p-4 text-center text-gray-400">Loading dishes...</div>
              ) : dishes.length === 0 ? (
                <div className="p-4 text-center text-gray-400">No dishes found</div>
              ) : (
                <div className="py-2">
                  {dishes.map(dish => (
                    <button
                      key={dish.id}
                      type="button"
                      onClick={() => {
                        onDishSelect(dish);
                        setIsOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-white transition-colors hover:bg-[#2a2a2a] ${
                        selectedDish?.id === dish.id ? 'bg-[#29E7CD]/20' : ''
                      }`}
                    >
                      {dish.dish_name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
