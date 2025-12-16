'use client';

import { QRCodeModal } from '@/lib/qr-codes';
import { ChefHat } from 'lucide-react';
import React, { useState } from 'react';
import { RecipeCardHeader } from './RecipeCard/components/RecipeCardHeader';
import { RecipeCardPricing } from './RecipeCard/components/RecipeCardPricing';
import { RecipeCardAllergens } from './RecipeCard/components/RecipeCardAllergens';
import { RecipeCardActions } from './RecipeCard/components/RecipeCardActions';
import type { RecipeCardProps } from './RecipeCard/types';

const RecipeCard = React.memo(function RecipeCard({
  recipe,
  recipePrices,
  selectedRecipes,
  onSelectRecipe,
  onPreviewRecipe,
  onEditRecipe,
  onDeleteRecipe,
  capitalizeRecipeName,
}: RecipeCardProps) {
  const [showQRModal, setShowQRModal] = useState(false);

  return (
    <>
      <div
        className="cursor-pointer border-l-2 border-[var(--color-info)]/30 bg-[var(--color-info)]/2 p-4 transition-colors hover:bg-[var(--color-info)]/5"
        onClick={e => {
          // Don't trigger if clicking on buttons or checkbox
          if ((e.target as HTMLElement).closest('button')) return;
          onPreviewRecipe(recipe);
        }}
        title="Click to preview recipe details"
      >
        <RecipeCardHeader
          recipeName={recipe.recipe_name}
          createdAt={recipe.created_at}
          isSelected={selectedRecipes.has(recipe.id)}
          onSelect={() => onSelectRecipe(recipe.id)}
          capitalizeRecipeName={capitalizeRecipeName}
        />

        <RecipeCardPricing recipeId={recipe.id} recipePrices={recipePrices} yield={recipe.yield} />

        <RecipeCardAllergens recipe={recipe} />

        <RecipeCardActions
          recipeName={recipe.recipe_name}
          onPreview={() => onPreviewRecipe(recipe)}
          onShowQR={() => setShowQRModal(true)}
          onEdit={() => onEditRecipe(recipe)}
          onDelete={() => onDeleteRecipe(recipe)}
          capitalizeRecipeName={capitalizeRecipeName}
        />
      </div>

      {/* QR Code Modal - Links to actual recipe */}
      <QRCodeModal
        entity={{ id: recipe.id, name: capitalizeRecipeName(recipe.recipe_name) }}
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        entityTypeLabel="Recipe"
        urlPattern="/webapp/recipes/{id}"
        icon={ChefHat}
        instructions="Scan to view the full recipe with ingredients and instructions"
        hint="Perfect for kitchen stations and recipe cards!"
        printInstructions="Scan this QR code to view the recipe"
        permanentLinkNote="This QR code links directly to the recipe — great for printing on recipe cards!"
      />
    </>
  );
});

export default RecipeCard;
