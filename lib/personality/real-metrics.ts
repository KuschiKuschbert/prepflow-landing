// PrepFlow Personality System - Real Metrics Message Generator

import { getRealMetrics } from './metrics-tracker';
import { type PersonalitySettings } from './schema';
import { content } from './content';

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

function getSettings(): PersonalitySettings {
  if (typeof window === 'undefined') {
    return { enabled: false } as PersonalitySettings;
  }
  try {
    const stored = localStorage.getItem('prepflow-personality');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed as PersonalitySettings;
    }
  } catch {
    // Ignore errors
  }
  return { enabled: false } as PersonalitySettings;
}

/**
 * Generate personality messages using real app metrics
 */
export function generateRealMetricsMessage(): string | null {
  const settings = getSettings();
  if (!settings.enabled) return null;

  const metrics = getRealMetrics();
  const spirit = settings.spirit;

  // Generate messages based on real data
  const messages: string[] = [];

  // Save count messages
  if (metrics.saveCountToday > 0) {
    if (spirit === 'zen') {
      messages.push(`You've saved ${metrics.saveCountToday} times today. That's commitment.`);
    } else if (spirit === 'spicy') {
      messages.push(`${metrics.saveCountToday} saves today? Someone's on a roll!`);
    } else if (spirit === 'wise') {
      messages.push(`${metrics.saveCountToday} saves today. Wisdom in persistence.`);
    } else if (spirit === 'passive') {
      messages.push(`${metrics.saveCountToday} saves. Moving on.`);
    } else {
      messages.push(`${metrics.saveCountToday} saves today. Probably. Maybe.`);
    }
  }

  if (metrics.saveCountAllTime >= 100) {
    if (spirit === 'zen') {
      messages.push(`Over ${metrics.saveCountAllTime} saves total. Like a well-oiled kitchen.`);
    } else if (spirit === 'spicy') {
      messages.push(`${metrics.saveCountAllTime}+ saves! You're crushing it!`);
    } else if (spirit === 'wise') {
      messages.push(`${metrics.saveCountAllTime} saves. Every save is progress.`);
    } else if (spirit === 'passive') {
      messages.push(`${metrics.saveCountAllTime} saves. Good job.`);
    } else {
      messages.push(`${metrics.saveCountAllTime} saves. Probably accurate.`);
    }
  }

  // Recipe count messages
  if (metrics.recipeCount > 0) {
    if (spirit === 'zen') {
      messages.push(`Your recipe book has ${metrics.recipeCount} recipes. Ready to cook.`);
    } else if (spirit === 'spicy') {
      messages.push(`${metrics.recipeCount} recipes? Time to add more!`);
    } else if (spirit === 'wise') {
      messages.push(`${metrics.recipeCount} recipes. Knowledge preserved.`);
    } else if (spirit === 'passive') {
      messages.push(`${metrics.recipeCount} recipes. Next.`);
    } else {
      messages.push(`${metrics.recipeCount} recipes. Probably.`);
    }
  }

  // Ingredient count messages
  if (metrics.ingredientCount >= 10) {
    if (spirit === 'zen') {
      messages.push(`${metrics.ingredientCount} ingredients in stock. Well organized.`);
    } else if (spirit === 'spicy') {
      messages.push(`${metrics.ingredientCount} ingredients! Your walk-in must be packed.`);
    } else if (spirit === 'wise') {
      messages.push(`${metrics.ingredientCount} ingredients. Every item matters.`);
    } else if (spirit === 'passive') {
      messages.push(`${metrics.ingredientCount} ingredients. Moving on.`);
    } else {
      messages.push(`${metrics.ingredientCount} ingredients. Probably counted correctly.`);
    }
  }

  // Dish count messages
  if (metrics.dishCount > 0) {
    if (spirit === 'zen') {
      messages.push(
        `Your menu has ${metrics.dishCount} dishes. Time to add a lucky ${metrics.dishCount + 1}th?`,
      );
    } else if (spirit === 'spicy') {
      messages.push(
        `${metrics.dishCount} dishes on the menu. Let's make it ${metrics.dishCount + 1}!`,
      );
    } else if (spirit === 'wise') {
      messages.push(`${metrics.dishCount} dishes. Every dish tells a story.`);
    } else if (spirit === 'passive') {
      messages.push(`${metrics.dishCount} dishes. Next.`);
    } else {
      messages.push(`${metrics.dishCount} dishes. Probably.`);
    }
  }

  // Streak messages
  if (metrics.streakDays >= 7) {
    if (spirit === 'zen') {
      messages.push(`${metrics.streakDays} day streak! Consistency is key.`);
    } else if (spirit === 'spicy') {
      messages.push(`${metrics.streakDays} days in a row! You're on fire!`);
    } else if (spirit === 'wise') {
      messages.push(`${metrics.streakDays} day streak. Dedication pays off.`);
    } else if (spirit === 'passive') {
      messages.push(`${metrics.streakDays} day streak. Good job.`);
    } else {
      messages.push(`${metrics.streakDays} days. Probably consecutive.`);
    }
  }

  if (messages.length === 0) return null;

  return pick(messages);
}




