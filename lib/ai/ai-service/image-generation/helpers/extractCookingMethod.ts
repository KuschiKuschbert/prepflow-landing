/**
 * Extract cooking method from recipe instructions.
 *
 * @param {string} instructions - Recipe instructions
 * @returns {string} Cooking method text or empty string
 */
export function extractCookingMethod(instructions: string): string {
  if (!instructions || instructions.trim().length === 0) {
    return '';
  }

  // Extract key cooking techniques from instructions (first 200 chars to keep it concise)
  const instructionPreview = instructions.trim().substring(0, 200);
  // Look for common cooking methods
  const cookingMethods = [
    'grilled',
    'roasted',
    'braised',
    'sautéed',
    'fried',
    'steamed',
    'baked',
    'seared',
    'poached',
    'simmered',
    'boiled',
    'stir-fried',
    'pan-fried',
    'deep-fried',
    'slow-cooked',
    'marinated',
    'smoked',
    'charred',
  ];
  const foundMethods = cookingMethods.filter(method =>
    instructionPreview.toLowerCase().includes(method.toLowerCase()),
  );

  if (foundMethods.length > 0) {
    return ` The dish is prepared using ${foundMethods.join(' and ')} techniques.`;
  } else {
    // Use a general description from instructions
    return ` Prepared according to recipe instructions: ${instructionPreview}...`;
  }
}
