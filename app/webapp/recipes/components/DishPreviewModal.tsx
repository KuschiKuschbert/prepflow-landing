'use client';

import { useState, useEffect } from 'react';
import { X, Edit, Trash2 } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { Dish, DishWithDetails, DishCostData } from '../types';

interface DishPreviewModalProps {
  dish: Dish;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function DishPreviewModal({
  dish,
  onClose,
  onEdit,
  onDelete,
}: DishPreviewModalProps) {
  const [dishDetails, setDishDetails] = useState<DishWithDetails | null>(null);
  const [costData, setCostData] = useState<DishCostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/dishes/${dish.id}`).then(r => r.json()),
      fetch(`/api/dishes/${dish.id}/cost`).then(r => r.json()),
    ]).then(([dishData, costResponse]) => {
      if (dishData.success) setDishDetails(dishData.dish);
      if (costResponse.success) setCostData(costResponse.cost);
      setLoading(false);
    });
  }, [dish.id]);

  const capitalizeDishName = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-[#1f1f1f] shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 border-b border-[#2a2a2a] bg-[#1f1f1f] p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="mb-2 text-2xl font-bold text-white">
                {capitalizeDishName(dish.dish_name)}
              </h2>
              {dish.description && <p className="text-gray-400">{dish.description}</p>}
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
            >
              <Icon icon={X} size="md" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="py-12 text-center text-gray-400">Loading...</div>
          ) : (
            <>
              {/* Cost Information */}
              {costData && (
                <div className="mb-6 rounded-xl bg-[#2a2a2a]/30 p-4">
                  <h3 className="mb-4 text-lg font-semibold text-white">Cost Information</h3>
                  <div className="grid grid-cols-2 gap-4 desktop:grid-cols-4">
                    <div>
                      <div className="text-xs text-gray-400">Selling Price</div>
                      <div className="text-lg font-semibold text-white">
                        ${costData.selling_price.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Total Cost</div>
                      <div className="text-lg font-semibold text-white">
                        ${costData.total_cost.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Gross Profit</div>
                      <div className="text-lg font-semibold text-green-400">
                        ${costData.gross_profit.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Profit Margin</div>
                      <div
                        className={`text-lg font-semibold ${
                          costData.gross_profit_margin >= 30 ? 'text-green-400' : 'text-yellow-400'
                        }`}
                      >
                        {costData.gross_profit_margin.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recipes */}
              {dishDetails?.recipes && dishDetails.recipes.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 text-lg font-semibold text-white">Recipes</h3>
                  <div className="space-y-2">
                    {dishDetails.recipes.map((dr, index) => (
                      <div
                        key={index}
                        className="rounded-lg bg-[#2a2a2a]/30 p-3 text-sm text-gray-300"
                      >
                        <span className="font-medium text-white">
                          {dr.recipes?.name || 'Unknown Recipe'}
                        </span>
                        <span className="ml-2 text-gray-400">× {dr.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ingredients */}
              {dishDetails?.ingredients && dishDetails.ingredients.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 text-lg font-semibold text-white">Standalone Ingredients</h3>
                  <div className="space-y-2">
                    {dishDetails.ingredients.map((di, index) => (
                      <div
                        key={index}
                        className="rounded-lg bg-[#2a2a2a]/30 p-3 text-sm text-gray-300"
                      >
                        <span className="font-medium text-white">
                          {di.ingredients?.ingredient_name || 'Unknown Ingredient'}
                        </span>
                        <span className="ml-2 text-gray-400">
                          {di.quantity} {di.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 border-t border-[#2a2a2a] pt-6">
                <button
                  onClick={onEdit}
                  className="flex items-center gap-2 rounded-lg bg-[#2a2a2a] px-4 py-2 text-white transition-colors hover:bg-[#3a3a3a]"
                >
                  <Icon icon={Edit} size="sm" />
                  Edit
                </button>
                <button
                  onClick={onDelete}
                  className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-red-400 transition-colors hover:bg-red-500/20"
                >
                  <Icon icon={Trash2} size="sm" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
