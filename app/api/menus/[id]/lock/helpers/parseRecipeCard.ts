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

type Section = 'title' | 'yield' | 'ingredients' | 'method' | 'notes';

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

// --- Helper Functions ---

function detectSection(line: string): Section | null {
  if (line.match(/^title:\s*(.+)$/i)) return 'title';
  if (line.match(/^yield\/portions?:\s*(.+)$/i)) return 'yield';
  if (line.match(/^ingredients?:$/i)) return 'ingredients';
  if (line.match(/^method:?$/i) || line.match(/^method\s*:/i)) return 'method';
  if (line.match(/^notes?:$/i)) return 'notes';
  return null;
}

function parseTitleFromHeader(line: string): string {
  return line.replace(/^title:\s*/i, '').trim();
}

function parseYieldFromHeader(line: string): number | null {
  const match = line.match(/^yield\/portions?:\s*(.+)$/i);
  if (match) {
    const num = parseInt(match[1].trim(), 10);
    return isNaN(num) ? null : num;
  }
  return null;
}

function parseIngredient(line: string) {
  if (!line.startsWith('-')) return null;

  // Format: - [Name] | [Quantity] | [Unit]
  const pipeMatch = line.match(/^-\s*(.+?)\s*\|\s*([\d.]+)\s*\|\s*(.+)$/);
  if (pipeMatch) {
    const [, name, qty, unit] = pipeMatch;
    return createIngredient(name, qty, unit);
  }

  // Format: - Name: Quantity Unit
  const colonMatch = line.match(/^-\s*(.+?):\s*([\d.]+)\s+(.+)$/);
  if (colonMatch) {
    const [, name, qty, unit] = colonMatch;
    return createIngredient(name, qty, unit);
  }

  // Format: - Name Quantity Unit (last resort)
  const spaceMatch = line.match(/^-\s*(.+?)\s+([\d.]+)\s+(.+)$/);
  if (spaceMatch) {
    const [, name, qty, unit] = spaceMatch;
    return createIngredient(name, qty, unit);
  }

  return null;
}

function createIngredient(name: string, quantityStr: string, unit: string) {
  const quantity = parseFloat(quantityStr);
  if (!isNaN(quantity) && quantity > 0) {
    return {
      name: name.trim(),
      quantity,
      unit: unit.trim(),
    };
  }
  return null;
}

function parseMethodStep(line: string): string | null {
  // 1. Step or 1) Step
  const numberedMatch = line.match(/^\d+[\.\)]\s*(.+)$/);
  if (numberedMatch) return numberedMatch[1].trim();

  // - Step or * Step or • Step
  if (line.match(/^[-•*]\s/)) {
    return line.replace(/^[-•*]\s*/, '').trim();
  }

  // Plain text step, but ignore headers if they somehow slipped here (unlikely provided detection logic)
  // and ignore weird labels
  if (
    line.length > 0 &&
    !line.match(/^[A-Z][^:]+:$/i) && // Skip likely headers
    !detectSection(line) // Double check against headers
  ) {
    return line.trim();
  }

  return null;
}

function parseNote(line: string): string | null {
  if (line.match(/^[-•]\s/)) {
    return line.replace(/^[-•]\s*/, '').trim();
  }
  if (line.length > 0) return line;
  return null;
}

function isValidTitleCandidate(line: string): boolean {
  return line.length > 0 && !line.match(/^[A-Z][^:]+:$/);
}
