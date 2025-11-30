'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useDishCOGSCalculations } from '../hooks/useDishCOGSCalculations';
import { useDishSidePanelData } from '../hooks/useDishSidePanelData';
import { useSidePanelCommon } from '../hooks/useSidePanelCommon';
import { Dish } from '../types';
import { DishSidePanelActions } from './DishSidePanelActions';
import { DishSidePanelContent } from './DishSidePanelContent';
import { DishSidePanelHeader } from './DishSidePanelHeader';

import { logger } from '@/lib/logger';
export interface DishSidePanelProps {
  isOpen: boolean;
  dish: Dish | null;
  onClose: () => void;
  onEdit: (dish: Dish) => void;
  onDelete: (dish: Dish) => void;
}

export function DishSidePanel({ isOpen, dish, onClose, onEdit, onDelete }: DishSidePanelProps) {
  // Use shared hook for common side panel functionality
  const { panelRef, mounted, panelStyle } = useSidePanelCommon({
    isOpen,
    onClose,
    onEdit: dish ? () => onEdit(dish) : undefined,
  });

  const [editingIngredient, setEditingIngredient] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);

  // Fetch dish details and recipe ingredients using hook
  const { dishDetails, costData, loading, recipeIngredientsMap } = useDishSidePanelData(
    isOpen,
    dish,
  );

  // Convert dish recipes and ingredients to COGS calculations using hook
  const { calculations, totalCOGS, costPerPortion } = useDishCOGSCalculations(
    dishDetails,
    recipeIngredientsMap,
    dish,
  );

  const handleEditIngredient = (ingredientId: string, currentQuantity: number) => {
    setEditingIngredient(ingredientId);
    setEditQuantity(currentQuantity);
  };

  const handleSaveEdit = () => {
    setEditingIngredient(null);
    setEditQuantity(0);
  };

  const handleCancelEdit = () => {
    setEditingIngredient(null);
    setEditQuantity(0);
  };

  const handleRemoveIngredient = async (ingredientId: string) => {
    logger.dev('Remove ingredient:', ingredientId);
  };

  const capitalizeDishName = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  if (!isOpen || !dish || !mounted) return null;

  // TypeScript guard: dish is guaranteed to be non-null after the check above
  const currentDish = dish;

  const panelContent = (
    <>
      {/* Backdrop - only on mobile */}
      <div
        className="desktop:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        style={{
          top: 'calc(var(--header-height-mobile) + var(--safe-area-inset-top))',
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Side Panel */}
      <div
        ref={panelRef}
        className={`desktop:max-w-lg fixed right-0 z-[65] w-full max-w-md bg-[#1f1f1f] shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={panelStyle}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dish-panel-title"
      >
        <div className="flex h-full flex-col overflow-hidden">
          <DishSidePanelHeader
            dish={currentDish}
            capitalizeDishName={capitalizeDishName}
            onClose={onClose}
          />

          <div
            className="flex-1 space-y-6 overflow-x-hidden overflow-y-auto p-6"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <DishSidePanelContent
              loading={loading}
              dishDetails={dishDetails}
              costData={costData}
              calculations={calculations}
              editingIngredient={editingIngredient}
              editQuantity={editQuantity}
              onEditIngredient={handleEditIngredient}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
              onRemoveIngredient={handleRemoveIngredient}
              onEditQuantityChange={setEditQuantity}
              totalCOGS={totalCOGS}
              costPerPortion={costPerPortion}
              dishId={currentDish.id}
              dishName={currentDish.dish_name}
            />
          </div>

          <DishSidePanelActions dish={currentDish} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>
    </>
  );

  // Render panel in a portal to ensure it's fixed to viewport
  return typeof window !== 'undefined' ? createPortal(panelContent, document.body) : null;
}
