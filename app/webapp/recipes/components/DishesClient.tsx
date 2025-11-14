'use client';

import { useCallback, useEffect, useState } from 'react';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { TablePagination } from '@/components/ui/TablePagination';
import { Dish, DishCostData } from '../types';
import { useDishFiltering } from '../hooks/useDishFiltering';
import DishCard from './DishCard';
import DishTable from './DishTable';
import { DishesActionButtons } from './DishesActionButtons';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import DishPreviewModal from './DishPreviewModal';
import DishForm from './DishForm';
import { SuccessMessage } from './SuccessMessage';

export default function DishesClient() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dishCosts, setDishCosts] = useState<Map<string, DishCostData>>(new Map());
  const [selectedDishes, setSelectedDishes] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [dishToDelete, setDishToDelete] = useState<Dish | null>(null);
  const [showDishForm, setShowDishForm] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewDish, setPreviewDish] = useState<Dish | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchDishes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/dishes', { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || 'Failed to fetch dishes');
        setLoading(false);
      } else {
        const dishesList = result.dishes || [];
        setDishes(dishesList);
        setLoading(false);

        // Fetch costs for all dishes
        const costPromises = dishesList.map(async (dish: Dish) => {
          try {
            const costResponse = await fetch(`/api/dishes/${dish.id}/cost`);
            const costResult = await costResponse.json();
            if (costResult.success && costResult.cost) {
              return { dishId: dish.id, cost: costResult.cost };
            }
          } catch (err) {
            console.error(`Failed to fetch cost for dish ${dish.id}:`, err);
          }
          return null;
        });

        const costs = await Promise.all(costPromises);
        const costMap = new Map<string, DishCostData>();
        costs.forEach(c => {
          if (c) costMap.set(c.dishId, c.cost);
        });
        setDishCosts(costMap);
      }
    } catch (err) {
      setError('Failed to fetch dishes');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  const handleAddDish = () => {
    setEditingDish(null);
    setShowDishForm(true);
  };

  const handleEditDish = (dish: Dish) => {
    setEditingDish(dish);
    setShowDishForm(true);
  };

  const handleDeleteDish = (dish: Dish) => {
    setDishToDelete(dish);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteDish = async () => {
    if (!dishToDelete) return;

    try {
      const response = await fetch(`/api/dishes/${dishToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        setError(result.error || 'Failed to delete dish');
        return;
      }

      setDishes(dishes.filter(d => d.id !== dishToDelete.id));
      setSuccessMessage('Dish deleted successfully');
      setShowDeleteConfirm(false);
      setDishToDelete(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Failed to delete dish');
    }
  };

  const cancelDeleteDish = () => {
    setShowDeleteConfirm(false);
    setDishToDelete(null);
  };

  const handleSelectDish = (dishId: string) => {
    const newSelected = new Set(selectedDishes);
    if (newSelected.has(dishId)) {
      newSelected.delete(dishId);
    } else {
      newSelected.add(dishId);
    }
    setSelectedDishes(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedDishes.size === dishes.length) {
      setSelectedDishes(new Set());
    } else {
      setSelectedDishes(new Set(dishes.map(d => d.id)));
    }
  };

  const handlePreviewDish = async (dish: Dish) => {
    setPreviewDish(dish);
    setShowPreview(true);
  };

  const handleDishSaved = () => {
    setShowDishForm(false);
    setEditingDish(null);
    fetchDishes();
    setSuccessMessage(editingDish ? 'Dish updated successfully' : 'Dish created successfully');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const {
    filters,
    updateFilters,
    paginatedDishes,
    totalPages,
  } = useDishFiltering(dishes, dishCosts);

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div>
      {successMessage && <SuccessMessage message={successMessage} />}
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}

      <DishesActionButtons onAddDish={handleAddDish} />

      <TablePagination
        page={filters.currentPage}
        totalPages={totalPages}
        total={dishes.length}
        itemsPerPage={filters.itemsPerPage}
        onPageChange={page => updateFilters({ currentPage: page })}
        onItemsPerPageChange={itemsPerPage => updateFilters({ itemsPerPage, currentPage: 1 })}
        className="mb-4"
      />

      {/* Mobile Card Layout */}
      <div className="block large-desktop:hidden">
        <div className="divide-y divide-[#2a2a2a]">
          {paginatedDishes.map(dish => (
            <DishCard
              key={dish.id}
              dish={dish}
              dishCost={dishCosts.get(dish.id)}
              selectedDishes={selectedDishes}
              onSelectDish={handleSelectDish}
              onPreviewDish={handlePreviewDish}
              onEditDish={handleEditDish}
              onDeleteDish={handleDeleteDish}
            />
          ))}
        </div>
      </div>

      {/* Desktop Table Layout */}
      <DishTable
        dishes={paginatedDishes}
        dishCosts={dishCosts}
        selectedDishes={selectedDishes}
        onSelectAll={handleSelectAll}
        onSelectDish={handleSelectDish}
        onPreviewDish={handlePreviewDish}
        onEditDish={handleEditDish}
        onDeleteDish={handleDeleteDish}
        sortField={filters.sortField}
        sortDirection={filters.sortDirection}
        onSortChange={(field, direction) => updateFilters({ sortField: field, sortDirection: direction })}
      />

      <TablePagination
        page={filters.currentPage}
        totalPages={totalPages}
        total={dishes.length}
        itemsPerPage={filters.itemsPerPage}
        onPageChange={page => updateFilters({ currentPage: page })}
        onItemsPerPageChange={itemsPerPage => updateFilters({ itemsPerPage, currentPage: 1 })}
        className="mt-4"
      />

      {/* Empty State */}
      {dishes.length === 0 && (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl text-gray-400">🍽️</div>
          <h3 className="mb-2 text-lg font-medium text-white">No dishes yet</h3>
          <p className="mb-4 text-gray-500">
            Create your first dish by combining recipes and ingredients.
          </p>
          <button
            onClick={handleAddDish}
            className="rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-4 py-2 text-white transition-colors hover:from-[#29E7CD]/80 hover:to-[#3B82F6]/80"
          >
            Create Your First Dish
          </button>
        </div>
      )}

      {/* Dish Form Modal */}
      {showDishForm && (
        <DishForm
          dish={editingDish}
          onClose={() => {
            setShowDishForm(false);
            setEditingDish(null);
          }}
          onSave={handleDishSaved}
        />
      )}

      {/* Dish Preview Modal */}
      {showPreview && previewDish && (
        <DishPreviewModal
          dish={previewDish}
          onClose={() => {
            setShowPreview(false);
            setPreviewDish(null);
          }}
          onEdit={() => {
            setShowPreview(false);
            handleEditDish(previewDish);
          }}
          onDelete={() => {
            setShowPreview(false);
            handleDeleteDish(previewDish);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && dishToDelete && (
        <DeleteConfirmationModal
          itemName={dishToDelete.dish_name}
          itemType="dish"
          onConfirm={confirmDeleteDish}
          onCancel={cancelDeleteDish}
        />
      )}
    </div>
  );
}
