/**
 * Parse Recipe Card Response
 * Parses AI-generated recipe card text into structured format
 */

import { logger } from '@/lib/logger';

export interface ParsedRecipeCard {
  title: string;
  baseYield: number; // Always 1 for single serving
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  methodSteps: string[];
  notes: string[];
}

/**
 * Parse AI-generated recipe card text into structured format
 */
export function parseRecipeCardResponse(aiResponse: string): ParsedRecipeCard | null {
  try {
    const lines = aiResponse
      .split('\n')
      .map(line => line.trim())
      .filter(line => line);

    let title = '';
    let baseYield = 1;
    const ingredients: Array<{ name: string; quantity: number; unit: string }> = [];
    const methodSteps: string[] = [];
    const notes: string[] = [];

    let currentSection: 'title' | 'yield' | 'ingredients' | 'method' | 'notes' | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Detect section headers
      if (line.match(/^title:\s*(.+)$/i)) {
        title = line.replace(/^title:\s*/i, '').trim();
        currentSection = 'title';
        continue;
      }

      if (line.match(/^yield\/portions?:\s*(.+)$/i)) {
        const yieldMatch = line.match(/^yield\/portions?:\s*(.+)$/i);
        if (yieldMatch) {
          const yieldStr = yieldMatch[1].trim();
          const yieldNum = parseInt(yieldStr, 10);
          if (!isNaN(yieldNum)) {
            baseYield = yieldNum;
          }
        }
        currentSection = 'yield';
        continue;
      }

      if (line.match(/^ingredients?:$/i)) {
        currentSection = 'ingredients';
        continue;
      }

      // More flexible method section detection
      if (line.match(/^method:?$/i) || line.match(/^method\s*:/i)) {
        currentSection = 'method';
        continue;
      }

      if (line.match(/^notes?:$/i)) {
        currentSection = 'notes';
        continue;
      }

      // Parse content based on current section
      if (currentSection === 'ingredients' && line.startsWith('-')) {
        // Format: - [Name] | [Quantity] | [Unit]
        const match = line.match(/^-\s*(.+?)\s*\|\s*([\d.]+)\s*\|\s*(.+)$/);
        if (match) {
          const [, name, quantityStr, unit] = match;
          const quantity = parseFloat(quantityStr);
          if (!isNaN(quantity) && quantity > 0) {
            ingredients.push({
              name: name.trim(),
              quantity,
              unit: unit.trim(),
            });
          }
        } else {
          // Fallback: try to parse without pipes (format: - Name: Quantity Unit)
          const fallbackMatch = line.match(/^-\s*(.+?):\s*([\d.]+)\s+(.+)$/);
          if (fallbackMatch) {
            const [, name, quantityStr, unit] = fallbackMatch;
            const quantity = parseFloat(quantityStr);
            if (!isNaN(quantity) && quantity > 0) {
              ingredients.push({
                name: name.trim(),
                quantity,
                unit: unit.trim(),
              });
            }
          } else {
            // Last resort: try to extract any number and unit
            const lastResortMatch = line.match(/^-\s*(.+?)\s+([\d.]+)\s+(.+)$/);
            if (lastResortMatch) {
              const [, name, quantityStr, unit] = lastResortMatch;
              const quantity = parseFloat(quantityStr);
              if (!isNaN(quantity) && quantity > 0) {
                ingredients.push({
                  name: name.trim(),
                  quantity,
                  unit: unit.trim(),
                });
              }
            }
          }
        }
      } else if (currentSection === 'method') {
        // Method steps: numbered (1. or 1) or bulleted
        const stepMatch = line.match(/^\d+[\.\)]\s*(.+)$/);
        if (stepMatch) {
          methodSteps.push(stepMatch[1].trim());
        } else if (line.startsWith('-') || line.startsWith('•') || line.startsWith('*')) {
          methodSteps.push(line.replace(/^[-•*]\s*/, '').trim());
        } else if (
          line.length > 0 &&
          !line.match(/^[A-Z][^:]+:$/i) &&
          !line.match(/^ingredients?:$/i) &&
          !line.match(/^notes?:$/i)
        ) {
          // Not a header, treat as step (but skip empty lines and section headers)
          const trimmed = line.trim();
          if (trimmed.length > 0) {
            methodSteps.push(trimmed);
          }
        }
      } else if (currentSection === 'notes') {
        if (line.startsWith('-') || line.startsWith('•')) {
          notes.push(line.replace(/^[-•]\s*/, '').trim());
        } else if (line.length > 0) {
          notes.push(line);
        }
      } else if (!title && line.length > 0 && !line.match(/^[A-Z][^:]+:$/)) {
        // If no title found yet and this doesn't look like a header, use as title
        title = line;
      }
    }

    // If title is still empty, try to extract from first line
    if (!title && lines.length > 0) {
      title = lines[0].replace(/^title:\s*/i, '').trim();
    }

    // Validate we have at least a title
    if (!title) {
      logger.warn('Failed to parse recipe card: no title found');
      logger.dev('AI Response preview:', aiResponse.substring(0, 500));
      return null;
    }

    // Log parsing results for debugging
    logger.dev(
      `Parsed recipe card: "${title}" - ${ingredients.length} ingredients, ${methodSteps.length} method steps, ${notes.length} notes`,
    );

    return {
      title,
      baseYield: 1, // Always normalize to 1 serving
      ingredients,
      methodSteps,
      notes,
    };
  } catch (error) {
    logger.error('Error parsing recipe card response:', error);
    return null;
  }
}
