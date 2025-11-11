// PrepFlow - Ingredient Edit Modal
// Modern modal/card interface for editing ingredients

'use client';

import { useEffect, useRef } from 'react';
import IngredientForm from './IngredientForm';

interface Ingredient {
  id: string;
  ingredient_name: string;
  brand?: string;
  pack_size?: string;
  pack_size_unit?: string;
  pack_price?: number;
  unit?: string;
  cost_per_unit: number;
  cost_per_unit_as_purchased?: number;
  cost_per_unit_incl_trim?: number;
  trim_peel_waste_percentage?: number;
  yield_percentage?: number;
  supplier?: string;
  product_code?: string;
  storage_location?: string;
  min_stock_level?: number;
  current_stock?: number;
  created_at?: string;
  updated_at?: string;
}

interface Supplier {
  id: string;
  supplier_name?: string;
  name?: string;
  created_at?: string;
}

interface IngredientEditModalProps {
  isOpen: boolean;
  ingredient: Ingredient | null;
  suppliers: Supplier[];
  availableUnits: string[];
  onSave: (ingredient: Partial<Ingredient>) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

export default function IngredientEditModal({
  isOpen,
  ingredient,
  suppliers,
  availableUnits,
  onSave,
  onClose,
  loading = false,
}: IngredientEditModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTab);
    };
  }, [isOpen]);

  if (!isOpen || !ingredient) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      aria-modal="true"
      aria-labelledby="ingredient-edit-modal-title"
    >
      {/* Backdrop with blur */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" />

      {/* Modal Card - Responsive */}
      <div
        ref={modalRef}
        className="animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 relative z-10 max-h-[95vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] shadow-2xl transition-all duration-300 sm:max-h-[90vh]"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ingredient-edit-modal-title"
      >
        {/* Header with close button - Responsive */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#2a2a2a] bg-gradient-to-r from-[#1f1f1f] to-[#2a2a2a]/50 px-4 py-3 backdrop-blur-sm sm:px-6 sm:py-4">
          <h2 id="ingredient-edit-modal-title" className="text-xl font-bold text-white sm:text-2xl">
            Edit Ingredient
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition-all duration-200 hover:bg-[#2a2a2a] hover:text-white focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
            aria-label="Close modal"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable content - Responsive */}
        <div className="max-h-[calc(95vh-64px)] overflow-y-auto sm:max-h-[calc(90vh-80px)]">
          <div className="p-4 sm:p-6">
            <IngredientForm
              ingredient={ingredient}
              suppliers={suppliers}
              availableUnits={availableUnits}
              onSave={async (ingredientData: Partial<Ingredient>) => {
                await onSave(ingredientData);
                onClose();
              }}
              onCancel={onClose}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
