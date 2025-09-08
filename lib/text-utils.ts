/**
 * Text utility functions for consistent formatting across the webapp
 */

/**
 * Converts text to proper case with cooking-specific rules
 * Handles common cooking terms and maintains professional formatting
 * 
 * @param text - The text to format
 * @returns Properly formatted text
 * 
 * @example
 * toProperCase('fresh tomatoes and herbs') // 'Fresh Tomatoes and Herbs'
 * toProperCase('salt and pepper') // 'Salt and Pepper'
 * toProperCase('olive oil') // 'Olive Oil'
 */
export function toProperCase(text: string | null | undefined): string {
  if (!text) return '';
  
  // Split by spaces and capitalize each word
  return text
    .split(' ')
    .map(word => {
      // Handle special cases for common cooking terms
      const lowerWord = word.toLowerCase();
      if (lowerWord === 'and' || lowerWord === 'or' || lowerWord === 'the' || 
          lowerWord === 'of' || lowerWord === 'in' || lowerWord === 'with' ||
          lowerWord === 'for' || lowerWord === 'to' || lowerWord === 'from') {
        return lowerWord;
      }
      // Capitalize first letter of each word
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Converts text to title case (all words capitalized)
 * Useful for names, titles, and formal text
 * 
 * @param text - The text to format
 * @returns Title case formatted text
 * 
 * @example
 * toTitleCase('john smith') // 'John Smith'
 * toTitleCase('recipe book') // 'Recipe Book'
 */
export function toTitleCase(text: string | null | undefined): string {
  if (!text) return '';
  
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Converts text to sentence case (first word capitalized)
 * Useful for descriptions and general text
 * 
 * @param text - The text to format
 * @returns Sentence case formatted text
 * 
 * @example
 * toSentenceCase('this is a description') // 'This is a description'
 */
export function toSentenceCase(text: string | null | undefined): string {
  if (!text) return '';
  
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Formats ingredient names with proper casing
 * Specialized for cooking ingredients with common terms
 * 
 * @param ingredientName - The ingredient name to format
 * @returns Properly formatted ingredient name
 */
export function formatIngredientName(ingredientName: string | null | undefined): string {
  return toProperCase(ingredientName);
}

/**
 * Formats recipe names with proper casing
 * Specialized for recipe titles
 * 
 * @param recipeName - The recipe name to format
 * @returns Properly formatted recipe name
 */
export function formatRecipeName(recipeName: string | null | undefined): string {
  return toProperCase(recipeName);
}

/**
 * Formats brand names with proper casing
 * 
 * @param brandName - The brand name to format
 * @returns Properly formatted brand name
 */
export function formatBrandName(brandName: string | null | undefined): string {
  return toProperCase(brandName);
}

/**
 * Formats supplier names with proper casing
 * 
 * @param supplierName - The supplier name to format
 * @returns Properly formatted supplier name
 */
export function formatSupplierName(supplierName: string | null | undefined): string {
  return toProperCase(supplierName);
}

/**
 * Formats storage location names with proper casing
 * 
 * @param locationName - The storage location to format
 * @returns Properly formatted storage location
 */
export function formatStorageLocation(locationName: string | null | undefined): string {
  return toProperCase(locationName);
}

/**
 * Formats dish names with proper casing
 * 
 * @param dishName - The dish name to format
 * @returns Properly formatted dish name
 */
export function formatDishName(dishName: string | null | undefined): string {
  return toProperCase(dishName);
}

/**
 * Formats any general text input with proper casing
 * Default formatter for most text inputs
 * 
 * @param text - The text to format
 * @returns Properly formatted text
 */
export function formatTextInput(text: string | null | undefined): string {
  return toProperCase(text);
}
