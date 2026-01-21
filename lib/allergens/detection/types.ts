export interface AIAllergenDetectionResult {
  allergens: string[];
  composition?: string;
  confidence: 'high' | 'medium' | 'low';
  cached: boolean;
}
