/**
 * Utilities for building recipe cards from existing instructions.
 */

import { createHash } from 'crypto';
import { logger } from '@/lib/logger';
import { MenuItemData } from './fetchMenuItemData';
import { NormalizedIngredient, normalizeToSingleServing } from './normalizeIngredients';
import { ParsedRecipeCard } from './parseRecipeCard';

/**
 * Build recipe card manually from existing instructions (without AI)
 * Converts existing instructions into structured recipe card format
 */
export function buildRecipeCardFromInstructions(
  menuItemData: MenuItemData,
  normalizedIngredients: NormalizedIngredient[],
  existingInstructions: string,
): ParsedRecipeCard {
  // Split instructions into steps
  // Handle both numbered steps (1., 2., etc.) and plain text
  const instructionLines = existingInstructions
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const methodSteps: string[] = [];
  let currentStep = '';

  for (const line of instructionLines) {
    // Skip markdown headers (##, **, etc.)
    if (line.match(/^#{1,6}\s/) || line.match(/^\*\*/)) {
      continue;
    }

    // Check for numbered steps (1., 2., 1), etc.)
    const stepMatch = line.match(/^\d+[\.\)]\s*(.+)$/);
    if (stepMatch) {
      // Save previous step if exists
      if (currentStep) {
        methodSteps.push(currentStep.trim());
      }
      currentStep = stepMatch[1].trim();
    } else if (line.startsWith('-') || line.startsWith('•') || line.startsWith('*')) {
      // Bullet point - treat as step
      if (currentStep) {
        methodSteps.push(currentStep.trim());
      }
      currentStep = line.replace(/^[-•*]\s*/, '').trim();
    } else if (line.length > 0) {
      // Continue current step or start new one
      if (currentStep) {
        currentStep += ' ' + line;
      } else {
        currentStep = line;
      }
    }
  }

  // Add final step
  if (currentStep) {
    methodSteps.push(currentStep.trim());
  }

  // If no steps extracted, use the full instructions as a single step
  if (methodSteps.length === 0 && existingInstructions.trim().length > 0) {
    // Remove markdown formatting
    const cleaned = existingInstructions
      .replace(/\*\*/g, '')
      .replace(/^#{1,6}\s/gm, '')
      .trim();
    if (cleaned.length > 0) {
      methodSteps.push(cleaned);
    }
  }

  return {
    title: menuItemData.name,
    baseYield: 1, // Always normalized to 1 serving
    ingredients: normalizedIngredients.map(ing => ({
      name: ing.name,
      quantity: ing.quantity,
      unit: ing.unit,
    })),
    methodSteps,
    notes: [], // No notes from existing instructions
  };
}

/**
 * Generate data hash for a menu item to detect changes
 * Hash includes: normalized ingredients, instructions, description, yield
 */
export function generateDataHash(
  menuItemData: MenuItemData,
  normalizedIngredients: NormalizedIngredient[],
): string {
  // Sort ingredients for consistent hashing
  const sortedIngredients = normalizedIngredients
    .map(ing => `${ing.name.toLowerCase()}|${ing.quantity}|${ing.unit.toLowerCase()}`)
    .sort()
    .join(';');

  // Include all relevant data in hash
  const hashData = {
    name: menuItemData.name,
    description: menuItemData.description || '',
    instructions: menuItemData.instructions || '',
    baseYield: menuItemData.baseYield,
    yieldUnit: menuItemData.yieldUnit,
    ingredients: sortedIngredients,
    subRecipes: menuItemData.subRecipes
      .map(sr => `${sr.name}|${sr.quantity}|${sr.yield}`)
      .sort()
      .join(';'),
  };

  const hashString = JSON.stringify(hashData);
  return createHash('sha256').update(hashString).digest('hex');
}
