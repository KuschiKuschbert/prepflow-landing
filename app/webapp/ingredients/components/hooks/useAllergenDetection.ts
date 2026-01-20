import { logger } from '@/lib/logger';
import { useEffect, useRef, useState } from 'react';
import { Ingredient } from '../types';

interface UseAllergenDetectionResult {
  lastDetectedRef: React.MutableRefObject<{ ingredientName: string; brand?: string } | null>;
  detectingAllergens: boolean;
  setDetectingAllergens: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useAllergenDetection(
  wizardStep: number,
  formData: Partial<Ingredient>,
  setFormData: React.Dispatch<React.SetStateAction<Partial<Ingredient>>>,
): UseAllergenDetectionResult {
  const [detectingAllergens, setDetectingAllergens] = useState(false);
  const lastDetectedRef = useRef<{ ingredientName: string; brand?: string } | null>(null);

  useEffect(() => {
    const detectAllergens = async () => {
      if (wizardStep !== 3) return;

      const ingredientName = formData.ingredient_name?.trim();
      if (!ingredientName || ingredientName.length < 2) return;

      const currentAllergens = (formData.allergens as string[]) || [];
      const allergenSource = (formData.allergen_source as { manual?: boolean; ai?: boolean }) || {
        manual: false,
        ai: false,
      };

      if (allergenSource.manual && currentAllergens.length > 0) {
        logger.dev('[Wizard] Skipping allergen detection - manual allergens already set');
        return;
      }

      const brand = formData.brand?.trim() || '';

      if (
        lastDetectedRef.current &&
        lastDetectedRef.current.ingredientName === ingredientName &&
        lastDetectedRef.current.brand === brand &&
        currentAllergens.length > 0
      ) {
        logger.dev('[Wizard] Skipping allergen detection - already detected for this ingredient');
        return;
      }

      setDetectingAllergens(true);

      try {
        const response = await fetch('/api/ingredients/ai-detect-allergens', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ingredient_name: ingredientName,
            brand: formData.brand?.trim() || undefined,
            force_ai: false,
          }),
        });

        if (!response.ok) throw new Error('Failed to detect allergens');

        const result = await response.json();

        if (result.success && result.data?.allergens) {
          const detectedAllergens = result.data.allergens as string[];
          logger.dev(
            `[Wizard] Detected ${detectedAllergens.length} allergens for ${ingredientName}: ${detectedAllergens.join(', ')}`,
          );

          if (detectedAllergens.length > 0) {
            setFormData(prev => ({
              ...prev,
              allergens: detectedAllergens,
              allergen_source: {
                manual: false,
                ai: result.data.method === 'ai' || result.data.method === 'hybrid',
              },
            }));
            lastDetectedRef.current = { ingredientName, brand: brand || undefined };
          }
        }
      } catch (error) {
        logger.error('[Wizard] Error detecting allergens:', error);
      } finally {
        setDetectingAllergens(false);
      }
    };

    detectAllergens();
  }, [
    wizardStep,
    formData.ingredient_name,
    formData.brand,
    formData.allergen_source,
    formData.allergens,
    setFormData,
  ]);

  return { lastDetectedRef, detectingAllergens, setDetectingAllergens };
}
