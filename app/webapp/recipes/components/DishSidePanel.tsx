'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Dish } from '../types';
import { DishSidePanelHeader } from './DishSidePanelHeader';
import { DishSidePanelContent } from './DishSidePanelContent';
import { DishSidePanelActions } from './DishSidePanelActions';
import { useDishSidePanelData } from '../hooks/useDishSidePanelData';
import { useDishCOGSCalculations } from '../hooks/useDishCOGSCalculations';

import { logger } from '@/lib/logger';
export interface DishSidePanelProps {
  isOpen: boolean;
  dish: Dish | null;
  onClose: () => void;
  onEdit: (dish: Dish) => void;
  onDelete: (dish: Dish) => void;
}

export function DishSidePanel({ isOpen, dish, onClose, onEdit, onDelete }: DishSidePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({
    position: 'fixed',
    top: 'calc(var(--header-height-mobile) + var(--safe-area-inset-top))',
    height: 'calc(100vh - var(--header-height-mobile) - var(--safe-area-inset-top))',
    right: 0,
  });

  // Update panel position based on screen size
  useEffect(() => {
    const updatePanelStyle = () => {
      const isDesktop = window.innerWidth >= 1024;
      setPanelStyle({
        position: 'fixed',
        top: isDesktop
          ? 'calc(var(--header-height-desktop) + var(--safe-area-inset-top))'
          : 'calc(var(--header-height-mobile) + var(--safe-area-inset-top))',
        height: isDesktop
          ? 'calc(100vh - var(--header-height-desktop) - var(--safe-area-inset-top))'
          : 'calc(100vh - var(--header-height-mobile) - var(--safe-area-inset-top))',
        right: 0,
      });
    };

    updatePanelStyle();
    window.addEventListener('resize', updatePanelStyle);
    return () => window.removeEventListener('resize', updatePanelStyle);
  }, []);
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

  // Keyboard shortcuts and focus management
  useEffect(() => {
    if (!isOpen) return;

    // Store current scroll position
    const scrollY = window.scrollY;

    // Focus panel without scrolling
    if (panelRef.current) {
      panelRef.current.focus({ preventScroll: true });
      // Restore scroll position immediately in case focus caused any scroll
      window.scrollTo(0, scrollY);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'e' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          if (dish) {
            onEdit(dish);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onEdit, dish]);

  // Prevent body scroll when panel is open on mobile
  // Also prevent scroll restoration when panel opens
  useEffect(() => {
    if (isOpen) {
      // Store scroll position
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      // Prevent scroll restoration
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
      // Restore scroll position if it changed
      requestAnimationFrame(() => {
        if (window.scrollY !== scrollY) {
          window.scrollTo(0, scrollY);
        }
      });
    } else {
      document.body.style.overflow = '';
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    }
    return () => {
      document.body.style.overflow = '';
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    };
  }, [isOpen]);

  // Mount check for portal
  useEffect(() => {
    setMounted(true);
  }, []);

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
