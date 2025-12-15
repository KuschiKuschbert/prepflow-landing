/**
 * Handle image generation logic.
 */
import { logger } from '@/lib/logger';
import type { PlatingMethodOption } from '../PlatingMethodSelectorPopup';

export async function handleGenerateHelper(
  endpoint: string,
  selectedMethods: PlatingMethodOption[],
  setIsGenerating: (generating: boolean) => void,
  setError: (error: string | null) => void,
  showError: (message: string) => void,
  showSuccess: (message: string) => void,
  setGeneratedClassic: (url: string | null) => void,
  setGeneratedModern: (url: string | null) => void,
  setGeneratedRustic: (url: string | null) => void,
  setGeneratedMinimalist: (url: string | null) => void,
  setGeneratedPlatingMethods: React.Dispatch<React.SetStateAction<Record<string, string | null>>>,
  onImagesGenerated?: (images: { classic: string | null; modern: string | null; rustic: string | null; minimalist: string | null }) => void,
  generatedClassic: string | null,
  generatedModern: string | null,
  generatedRustic: string | null,
  generatedMinimalist: string | null,
): Promise<void> {
  setIsGenerating(true);
  setError(null);
  try {
    const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ platingMethods: selectedMethods }), credentials: 'include' });
    const data = await response.json();
    if (!response.ok) {
      const errorMessage = data.error || data.message || `Failed to generate images: ${response.statusText}`;
      setError(errorMessage);
      showError(errorMessage);
      return;
    }
    if (data.success) {
      const updatedClassic = selectedMethods.includes('classic') ? data.classic || data.imageUrl || null : generatedClassic;
      const updatedModern = selectedMethods.includes('landscape') ? data.modern || null : generatedModern;
      const updatedRustic = selectedMethods.includes('stacking') ? data.rustic || data.imageUrlAlternative || null : generatedRustic;
      const updatedMinimalist = selectedMethods.includes('deconstructed') ? data.minimalist || null : generatedMinimalist;
      if (selectedMethods.includes('classic')) setGeneratedClassic(updatedClassic);
      if (selectedMethods.includes('landscape')) setGeneratedModern(updatedModern);
      if (selectedMethods.includes('stacking')) setGeneratedRustic(updatedRustic);
      if (selectedMethods.includes('deconstructed')) setGeneratedMinimalist(updatedMinimalist);
      setGeneratedPlatingMethods(prev => {
        const updated = { ...prev };
        const newMethods = ['landscape', 'stacking', 'deconstructed'] as const;
        for (const method of newMethods) {
          if (selectedMethods.includes(method)) updated[method] = data[method] || null;
        }
        return updated;
      });
      onImagesGenerated?.({ classic: updatedClassic, modern: updatedModern, rustic: updatedRustic, minimalist: updatedMinimalist });
      if (data.cached) showSuccess('Images loaded from cache');
      else showSuccess('Food images generated successfully!');
    } else {
      const errorMessage = data.error || data.message || 'Failed to generate images';
      setError(errorMessage);
      showError(errorMessage);
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred while generating images';
    setError(errorMessage);
    showError(errorMessage);
    logger.error('[FoodImageGenerator] Generation error:', err);
  } finally {
    setIsGenerating(false);
  }
}
