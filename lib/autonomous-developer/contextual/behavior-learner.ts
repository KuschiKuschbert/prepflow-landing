/**
 * Contextual Learning System
 * Learns from user behavior and adapts suggestions
 */

import fs from 'fs/promises';
import path from 'path';

export interface UserBehavior {
  action: 'accepted' | 'rejected' | 'modified' | 'ignored';
  suggestion: string;
  context: {
    file?: string;
    timeOfDay?: string;
    dayOfWeek?: string;
    projectPhase?: 'development' | 'maintenance' | 'refactoring';
  };
  timestamp: string;
}

export interface LearnedPreference {
  pattern: string;
  preference: 'preferred' | 'avoid' | 'neutral';
  confidence: number; // 0-1
  context?: Record<string, string>;
  examples: string[];
}

const BEHAVIOR_FILE = path.join(process.cwd(), 'docs/autonomous-developer/user-behavior.json');
const PREFERENCES_FILE = path.join(process.cwd(), 'docs/autonomous-developer/learned-preferences.json');

/**
 * Record user behavior
 */
export async function recordBehavior(behavior: UserBehavior): Promise<void> {
  const allBehavior = await loadBehavior();
  allBehavior.push(behavior);

  const dir = path.dirname(BEHAVIOR_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(BEHAVIOR_FILE, JSON.stringify(allBehavior, null, 2));
}

/**
 * Load behavior history
 */
export async function loadBehavior(): Promise<UserBehavior[]> {
  try {
    const content = await fs.readFile(BEHAVIOR_FILE, 'utf8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

/**
 * Learn preferences from behavior
 */
export async function learnPreferences(): Promise<LearnedPreference[]> {
  const behavior = await loadBehavior();
  const preferences: LearnedPreference[] = [];

  // Group by suggestion pattern
  const byPattern = behavior.reduce((acc, b) => {
    const pattern = extractPattern(b.suggestion);
    if (!acc[pattern]) acc[pattern] = [];
    acc[pattern].push(b);
    return acc;
  }, {} as Record<string, UserBehavior[]>);

  for (const [pattern, behaviors] of Object.entries(byPattern)) {
    if (behaviors.length < 3) continue; // Need at least 3 examples

    const accepted = behaviors.filter(b => b.action === 'accepted').length;
    const rejected = behaviors.filter(b => b.action === 'rejected').length;
    const total = behaviors.length;

    const acceptanceRate = accepted / total;
    const rejectionRate = rejected / total;

    let preference: LearnedPreference['preference'] = 'neutral';
    let confidence = 0;

    if (acceptanceRate > 0.7) {
      preference = 'preferred';
      confidence = acceptanceRate;
    } else if (rejectionRate > 0.7) {
      preference = 'avoid';
      confidence = rejectionRate;
    } else {
      confidence = Math.abs(acceptanceRate - rejectionRate);
    }

    if (confidence > 0.5) {
      preferences.push({
        pattern,
        preference,
        confidence,
        examples: behaviors.map(b => b.suggestion).slice(0, 5),
      });
    }
  }

  // Save preferences
  await savePreferences(preferences);

  return preferences;
}

/**
 * Extract pattern from suggestion
 */
function extractPattern(suggestion: string): string {
  // Normalize suggestion to pattern
  return suggestion
    .toLowerCase()
    .replace(/\b(file|function|class|variable)\s+\w+/g, '$1 NAME')
    .replace(/\b\d+\b/g, 'NUMBER')
    .substring(0, 100);
}

/**
 * Save preferences
 */
async function savePreferences(preferences: LearnedPreference[]): Promise<void> {
  const dir = path.dirname(PREFERENCES_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(PREFERENCES_FILE, JSON.stringify(preferences, null, 2));
}

/**
 * Load preferences
 */
export async function loadPreferences(): Promise<LearnedPreference[]> {
  try {
    const content = await fs.readFile(PREFERENCES_FILE, 'utf8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

/**
 * Adapt suggestion based on preferences
 */
export async function adaptSuggestion(
  suggestion: string,
  context?: Record<string, string>,
): Promise<string> {
  const preferences = await loadPreferences();
  const pattern = extractPattern(suggestion);

  // Find matching preference
  const preference = preferences.find(p => pattern.includes(p.pattern) || p.pattern.includes(pattern));

  if (preference) {
    if (preference.preference === 'avoid') {
      // Suggest alternative
      return `Alternative approach (previous suggestion was often rejected): ${suggestion}`;
    } else if (preference.preference === 'preferred') {
      // Emphasize this suggestion
      return `Recommended (based on previous acceptances): ${suggestion}`;
    }
  }

  return suggestion;
}

/**
 * Learn from successful patterns
 */
export interface SuccessPattern {
  pattern: string;
  successRate: number;
  context: Record<string, string>;
  examples: string[];
}

export async function learnFromSuccesses(): Promise<SuccessPattern[]> {
  const behavior = await loadBehavior();
  const accepted = behavior.filter(b => b.action === 'accepted');

  // Group by pattern and context
  const byPattern = accepted.reduce((acc, b) => {
    const pattern = extractPattern(b.suggestion);
    const key = `${pattern}|${JSON.stringify(b.context)}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(b);
    return acc;
  }, {} as Record<string, UserBehavior[]>);

  const patterns: SuccessPattern[] = [];

  for (const [key, behaviors] of Object.entries(byPattern)) {
    if (behaviors.length < 3) continue;

    const [pattern, contextStr] = key.split('|');
    const context = JSON.parse(contextStr || '{}');
    const totalSimilar = behavior.filter(b => extractPattern(b.suggestion) === pattern).length;
    const successRate = behaviors.length / totalSimilar;

    if (successRate > 0.6) {
      patterns.push({
        pattern,
        successRate,
        context,
        examples: behaviors.map(b => b.suggestion).slice(0, 5),
      });
    }
  }

  return patterns;
}

/**
 * Get context-aware suggestions
 */
export interface ContextualSuggestion {
  suggestion: string;
  context: {
    timeOfDay: string;
    dayOfWeek: string;
    projectPhase: string;
  };
  confidence: number;
  adapted: boolean;
}

export async function getContextualSuggestions(
  baseSuggestion: string,
  currentContext: Record<string, string>,
): Promise<ContextualSuggestion[]> {
  const behavior = await loadBehavior();
  const timeOfDay = getTimeOfDay();
  const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  // Filter behavior by similar context
  const similarContext = behavior.filter(b => {
    return (
      b.context.timeOfDay === timeOfDay ||
      b.context.dayOfWeek === dayOfWeek ||
      b.context.projectPhase === currentContext.projectPhase
    );
  });

  const acceptedInContext = similarContext.filter(b => b.action === 'accepted').length;
  const confidence = similarContext.length > 0 ? acceptedInContext / similarContext.length : 0.5;

  // Adapt suggestion
  const adapted = await adaptSuggestion(baseSuggestion, currentContext);

  return [{
    suggestion: adapted,
    context: {
      timeOfDay,
      dayOfWeek,
      projectPhase: currentContext.projectPhase || 'development',
    },
    confidence,
    adapted: adapted !== baseSuggestion,
  }];
}

/**
 * Get time of day
 */
function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 6) return 'night';
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

/**
 * Learn team coding style
 */
export interface CodingStyle {
  pattern: string;
  frequency: number;
  examples: string[];
}

export async function learnCodingStyle(): Promise<CodingStyle[]> {
  const behavior = await loadBehavior();
  const accepted = behavior.filter(b => b.action === 'accepted');

  // Extract coding patterns from accepted suggestions
  const stylePatterns: Record<string, { count: number; examples: string[] }> = {};

  for (const b of accepted) {
    const patterns = extractCodingPatterns(b.suggestion);
    for (const pattern of patterns) {
      if (!stylePatterns[pattern]) {
        stylePatterns[pattern] = { count: 0, examples: [] };
      }
      stylePatterns[pattern].count++;
      if (stylePatterns[pattern].examples.length < 5) {
        stylePatterns[pattern].examples.push(b.suggestion);
      }
    }
  }

  return Object.entries(stylePatterns)
    .filter(([_, data]) => data.count >= 3)
    .map(([pattern, data]) => ({
      pattern,
      frequency: data.count,
      examples: data.examples,
    }));
}

/**
 * Extract coding patterns
 */
function extractCodingPatterns(suggestion: string): string[] {
  const patterns: string[] = [];

  // Extract common patterns
  if (suggestion.includes('useCallback')) patterns.push('prefer-useCallback');
  if (suggestion.includes('useMemo')) patterns.push('prefer-useMemo');
  if (suggestion.includes('React.memo')) patterns.push('prefer-React.memo');
  if (suggestion.includes('ApiErrorHandler')) patterns.push('prefer-ApiErrorHandler');
  if (suggestion.includes('logger.error')) patterns.push('prefer-logger');
  if (suggestion.includes('try-catch')) patterns.push('prefer-try-catch');

  return patterns;
}
