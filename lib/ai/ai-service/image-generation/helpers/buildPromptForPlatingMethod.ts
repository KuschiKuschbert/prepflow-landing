import type { PlatingMethod } from '../types';

/**
 * Build prompt text for a specific plating method.
 *
 * @param {string} basePrompt - Base prompt with visual constraints
 * @param {string} qualitySuffix - Quality suffix text
 * @param {PlatingMethod | string} platingMethod - Plating method
 * @returns {string} Complete prompt for the plating method
 */
export function buildPromptForPlatingMethod(
  basePrompt: string,
  qualitySuffix: string,
  platingMethod: PlatingMethod | string,
): string {
  switch (platingMethod) {
    case 'classic':
      return `${basePrompt} It is beautifully plated on a white ceramic plate using the traditional clock method: the main protein is positioned at the center or between 3 and 9 o'clock, starches (rice, potatoes, or pasta) are placed at 10 o'clock, and vegetables are arranged at 2 o'clock. The presentation is balanced, symmetrical, and organized with professional garnishing and food styling. Traditional fine dining style with clean, formal presentation that emphasizes harmony and structure. ${qualitySuffix}`;

    case 'stacking':
      return `${basePrompt} It is presented using the stacking method, building a vertical tower with ingredients carefully layered on top of each other. The base layer typically consists of starches or vegetables, followed by the main protein, and topped with additional components or garnishes. This creates significant height and visual sophistication, with each layer visible and contributing to the overall composition. Sauces and glazes are drizzled vertically down the sides of the stack, enhancing the vertical presentation. The tower-like structure adds depth, helps retain heat, and ensures balanced flavors in each bite. Presented on a minimalist white or neutral plate to emphasize the vertical structure. ${qualitySuffix}`;

    case 'landscape':
      return `${basePrompt} It is arranged horizontally across the plate in a landscape plating style, creating visual flow that mimics natural scenes like gardens, rivers, or terrains. Ingredients are positioned to guide the eye from left to right across the plate. Sauces and purees flow like rivers or winding paths, creating depth and movement. Edible flowers, microgreens, and herbs are arranged like foliage to enhance the garden-like appearance. The main components are placed slightly off-center with garnishes radiating outward, creating a harmonious and organic presentation that evokes natural landscapes. ${qualitySuffix}`;

    case 'deconstructed':
      return `${basePrompt} It is presented using the deconstructed plating technique, where all components of the dish are separated and arranged individually on the plate, allowing each element to be seen and experienced distinctly. This modern gastronomy and molecular gastronomy style showcases creativity and technique, with each ingredient placed in its own section or area of the plate. The arrangement is artistic and cohesive, yet each component remains distinct, inviting diners to experience individual flavors and textures before combining them. The presentation emphasizes the individual qualities of each element while maintaining visual harmony across the plate. Modern, minimalist plate presentation that highlights the separation and artistry of each component. ${qualitySuffix}`;

    default:
      // Custom plating method: Use the provided description
      if (typeof platingMethod === 'string' && platingMethod.trim().length > 0) {
        return `${basePrompt} ${platingMethod}. ${qualitySuffix}`;
      }
      // Fallback to classic if invalid
      return `${basePrompt} It is beautifully plated on a white ceramic plate or elegant dish, with professional garnishing and food styling. ${qualitySuffix}`;
  }
}

