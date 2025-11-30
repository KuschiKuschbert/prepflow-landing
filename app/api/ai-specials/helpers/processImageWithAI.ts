/**
 * Process image with AI (mock implementation).
 * In production, this would call Hugging Face Vision API.
 *
 * @param {string} imageData - Image data URL or public URL
 * @param {string} [prompt] - Optional prompt
 * @returns {Promise<Object>} AI response with ingredients and suggestions
 */
export async function processImageWithAI(imageData: string, prompt?: string) {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mock AI response - in real implementation, this would call Hugging Face Vision API
  const mockIngredients = [
    'Fresh tomatoes',
    'Basil leaves',
    'Mozzarella cheese',
    'Olive oil',
    'Garlic',
    'Red onions',
    'Bell peppers',
    'Fresh herbs',
  ];

  const mockSuggestions = [
    'Caprese Salad - Perfect for showcasing fresh tomatoes and mozzarella',
    'Mediterranean Bruschetta - Great use of tomatoes, basil, and garlic',
    'Grilled Vegetable Platter - Highlight the bell peppers and onions',
    'Herb-Infused Oil - Feature the fresh herbs and olive oil',
  ];

  return {
    ingredients: mockIngredients,
    suggestions: mockSuggestions,
    confidence: 0.85,
    processing_time: 2.1,
  };
}
