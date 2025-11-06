'use client';

import React from 'react';
import { Recipe } from '../types';

interface DeleteConfirmationModalProps {
  show: boolean;
  recipe: Recipe | null;
  capitalizeRecipeName: (name: string) => string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationModal({
  show,
  recipe,
  capitalizeRecipeName,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  if (!show || !recipe) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] shadow-2xl">
        <div className="border-b border-[#2a2a2a] p-6">
          <div className="flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#ef4444] to-[#dc2626]">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Delete Recipe</h3>
              <p className="text-sm text-gray-400">This action cannot be undone</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <p className="mb-6 text-gray-300">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-white">
              &quot;{capitalizeRecipeName(recipe.name)}&quot;
            </span>
            ? This will permanently remove the recipe and all its ingredients from your Recipe Book.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 rounded-xl bg-[#2a2a2a] px-4 py-3 font-medium text-gray-300 transition-all duration-200 hover:bg-[#3a3a3a]"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 rounded-xl bg-gradient-to-r from-[#ef4444] to-[#dc2626] px-4 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-[#ef4444]/80 hover:to-[#dc2626]/80 hover:shadow-xl"
            >
              Delete Recipe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
