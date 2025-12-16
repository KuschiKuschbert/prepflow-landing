// PrepFlow Personality System - Adaptive Personality Logic

import { getBehaviorProfile, type BehaviorProfile } from './behavior-tracker';
import { type PersonalitySettings } from './schema';

export interface AdaptiveSettings {
  messageFrequencyMultiplier: number; // Adjusts how often messages appear
  snarkLevel: 'low' | 'medium' | 'high'; // Adjusts message tone
  helpfulnessLevel: 'low' | 'medium' | 'high'; // Adjusts message helpfulness
  preferredMessageTypes: string[]; // Message types user responds to
}

/**
 * Generate adaptive settings based on user behavior
 */
export function getAdaptiveSettings(settings: PersonalitySettings): AdaptiveSettings {
  const profile = getBehaviorProfile();

  let messageFrequencyMultiplier = 1.0;
  let snarkLevel: 'low' | 'medium' | 'high' = 'medium';
  let helpfulnessLevel: 'low' | 'medium' | 'high' = 'medium';
  const preferredMessageTypes: string[] = [];

  // Adjust based on save frequency
  if (profile.saveFrequency === 'high') {
    // High-frequency savers: reduce save message frequency
    messageFrequencyMultiplier = 0.7;
    snarkLevel = 'low'; // Less snark for power users
  } else if (profile.saveFrequency === 'low') {
    // Low-frequency users: more engagement messages
    messageFrequencyMultiplier = 1.2;
    helpfulnessLevel = 'high'; // More helpful for casual users
  }

  // Adjust based on user experience
  if (profile.userExperience === 'new') {
    // New users: more helpful and encouraging
    helpfulnessLevel = 'high';
    snarkLevel = 'low';
    preferredMessageTypes.push('context', 'helpful');
  } else if (profile.userExperience === 'experienced') {
    // Experienced users: more playful and chef-focused
    snarkLevel = 'high';
    helpfulnessLevel = 'low';
    preferredMessageTypes.push('chefHabits', 'meta', 'chaos');
  }

  // Adjust based on session duration
  if (profile.sessionDuration === 'short') {
    // Short sessions: reduce message frequency
    messageFrequencyMultiplier *= 0.8;
  } else if (profile.sessionDuration === 'long') {
    // Long sessions: can handle more messages
    messageFrequencyMultiplier *= 1.1;
  }

  return {
    messageFrequencyMultiplier,
    snarkLevel,
    helpfulnessLevel,
    preferredMessageTypes,
  };
}

/**
 * Check if a message type should be shown based on adaptive settings
 */
export function shouldShowMessage(
  messageType: string,
  adaptiveSettings: AdaptiveSettings,
): boolean {
  // If user has preferred message types, prioritize those
  if (adaptiveSettings.preferredMessageTypes.length > 0) {
    const isPreferred = adaptiveSettings.preferredMessageTypes.includes(messageType);
    // 70% chance for preferred types, 30% for others
    return isPreferred ? Math.random() < 0.7 : Math.random() < 0.3;
  }

  return true;
}

/**
 * Adjust message probability based on adaptive settings
 */
export function adjustMessageProbability(
  baseProbability: number,
  adaptiveSettings: AdaptiveSettings,
): number {
  return baseProbability * adaptiveSettings.messageFrequencyMultiplier;
}



