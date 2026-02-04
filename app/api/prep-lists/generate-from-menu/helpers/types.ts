/**
 * Types for analyzing prep details from recipes
 */

export interface CutShape {
  ingredient: string;
  shape: string;
  quantity?: string;
}

export interface Sauce {
  name: string;
  ingredients: string[];
  instructions: string;
}

export interface Marination {
  ingredient: string;
  method: string;
  duration?: string;
}

export interface PreCookingStep {
  ingredient: string;
  step: string;
}

export interface SpecialTechnique {
  description: string;
  details?: string;
}

export interface ParsedPrepDetails {
  cutShapes: CutShape[];
  sauces: Sauce[];
  marinations: Marination[];
  preCookingSteps: PreCookingStep[];
  specialTechniques: SpecialTechnique[];
}
