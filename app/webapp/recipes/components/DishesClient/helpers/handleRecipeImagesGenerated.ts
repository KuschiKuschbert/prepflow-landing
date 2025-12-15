/**
 * Handle recipe images generated callback.
 */
import type { Recipe } from '../../../types';

export function createRecipeImagesGeneratedHandler(
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>,
  selectedRecipeForPreview: Recipe | null,
  setSelectedRecipeForPreview: React.Dispatch<React.SetStateAction<Recipe | null>>,
) {
  return (
    recipeId: string,
    images: {
      classic: string | null;
      modern: string | null;
      rustic: string | null;
      minimalist: string | null;
    },
  ) => {
    setRecipes(prevRecipes =>
      prevRecipes.map(recipe =>
        recipe.id === recipeId
          ? {
              ...recipe,
              image_url: images.classic,
              image_url_alternative: images.rustic,
              image_url_modern: images.modern,
              image_url_minimalist: images.minimalist,
            }
          : recipe,
      ),
    );
    if (selectedRecipeForPreview?.id === recipeId) {
      setSelectedRecipeForPreview({
        ...selectedRecipeForPreview,
        image_url: images.classic,
        image_url_alternative: images.rustic,
        image_url_modern: images.modern,
        image_url_minimalist: images.minimalist,
      });
    }
  };
}
