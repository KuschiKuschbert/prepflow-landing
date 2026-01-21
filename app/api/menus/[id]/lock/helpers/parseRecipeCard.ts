/**
 * Parse Recipe Card Response
 * Parses AI-generated recipe card text into structured format
 */

import { logger } from '@/lib/logger';
import {
    detectSection,
    isValidTitleCandidate,
    parseIngredient,
    parseMethodStep,
    parseNote,
    parseTitleFromHeader,
    parseYieldFromHeader,
    Section,
} from './recipe-parsing-utils';

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
    const ingredients: ParsedRecipeCard['ingredients'] = [];
    const methodSteps: string[] = [];
    const notes: string[] = [];
    let currentSection: Section | null = null;

    for (const line of lines) {
      const detected = detectSection(line);
      if (detected) {
        currentSection = detected;

        // Handle inline values for title and yield headers
        if (detected === 'title') {
          title = parseTitleFromHeader(line);
        } else if (detected === 'yield') {
          baseYield = parseYieldFromHeader(line) || baseYield;
        }
        continue;
      }

      // Process content based on current section
      switch (currentSection) {
        case 'ingredients':
          const ing = parseIngredient(line);
          if (ing) ingredients.push(ing);
          break;
        case 'method':
          const step = parseMethodStep(line);
          if (step) methodSteps.push(step);
          break;
        case 'notes':
          const note = parseNote(line);
          if (note) notes.push(note);
          break;
        default:
          // Fallback: try to find title if not set
          if (!title && isValidTitleCandidate(line)) {
            title = line;
          }
          break;
      }
    }

    // Final fallback for title
    if (!title && lines.length > 0) {
      title = parseTitleFromHeader(lines[0]);
    }

    if (!title) {
      logger.warn('Failed to parse recipe card: no title found');
      logger.dev('AI Response preview:', aiResponse.substring(0, 500));
      return null;
    }

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
