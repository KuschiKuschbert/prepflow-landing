'use client';

import React from 'react';

interface SaveRecipeButtonProps {
  onSaveAsRecipe: () => void;
}

export const SaveRecipeButton: React.FC<SaveRecipeButtonProps> = ({
  onSaveAsRecipe,
}) => {
  return (
    <div className="mt-4 pt-4 border-t border-[#2a2a2a]">
      <button
        onClick={onSaveAsRecipe}
        className="w-full bg-gradient-to-r from-[#D925C7] to-[#29E7CD] text-white px-4 py-3 rounded-lg hover:from-[#D925C7]/80 hover:to-[#29E7CD]/80 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
      >
        💾 Save as Recipe in Recipe Book
      </button>
      <p className="text-xs text-gray-400 mt-2 text-center">
        This will save the current COGS calculation as a recipe in your Recipe Book
      </p>
    </div>
  );
};
