'use client';

import React from 'react';

interface SaveRecipeButtonProps {
  onSaveAsRecipe: () => void;
}

export const SaveRecipeButton: React.FC<SaveRecipeButtonProps> = ({ onSaveAsRecipe }) => {
  return (
    <div className="mt-4 border-t border-[#2a2a2a] pt-4">
      <button
        onClick={onSaveAsRecipe}
        className="w-full rounded-lg bg-gradient-to-r from-[#D925C7] to-[#29E7CD] px-4 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-[#D925C7]/80 hover:to-[#29E7CD]/80 hover:shadow-xl"
      >
        💾 Save as Recipe in Recipe Book
      </button>
      <p className="mt-2 text-center text-xs text-gray-400">
        This will save the current COGS calculation as a recipe in your Recipe Book
      </p>
    </div>
  );
};
