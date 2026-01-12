#!/usr/bin/env node

/**
 * Contextual Learning Script
 * Learns from user behavior and adapts suggestions
 */

const {
  recordBehavior,
  learnPreferences,
  loadPreferences,
  learnFromSuccesses,
  getContextualSuggestions,
  learnCodingStyle,
} = require('../../lib/autonomous-developer/contextual/behavior-learner');

/**
 * Record behavior
 */
async function record(action, suggestion, context) {
  await recordBehavior({
    action,
    suggestion,
    context: {
      ...context,
      timeOfDay: getTimeOfDay(),
      dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
    },
    timestamp: new Date().toISOString(),
  });

  console.log(`✅ Recorded behavior: ${action} - ${suggestion.substring(0, 50)}...`);
}

/**
 * Learn preferences
 */
async function learn() {
  console.log('\n🧠 Learning preferences from behavior...\n');

  const preferences = await learnPreferences();

  if (preferences.length === 0) {
    console.log('No preferences learned yet (need at least 3 examples per pattern)');
    return;
  }

  console.log(`Learned ${preferences.length} preference(s):\n`);

  preferences.forEach(pref => {
    console.log(`  - ${pref.pattern}`);
    console.log(`    Preference: ${pref.preference}`);
    console.log(`    Confidence: ${(pref.confidence * 100).toFixed(0)}%`);
    console.log(`    Examples: ${pref.examples.length}\n`);
  });
}

/**
 * Show learned preferences
 */
async function showPreferences() {
  const preferences = await loadPreferences();

  if (preferences.length === 0) {
    console.log('No preferences learned yet');
    return;
  }

  console.log(`\n📚 Learned Preferences (${preferences.length}):\n`);

  const byPreference = preferences.reduce((acc, p) => {
    if (!acc[p.preference]) acc[p.preference] = [];
    acc[p.preference].push(p);
    return acc;
  }, {} as Record<string, typeof preferences>);

  for (const [pref, items] of Object.entries(byPreference)) {
    console.log(`${pref.toUpperCase()}:`);
    items.forEach(item => {
      console.log(`  - ${item.pattern} (${(item.confidence * 100).toFixed(0)}% confidence)`);
    });
    console.log('');
  }
}

/**
 * Show success patterns
 */
async function showSuccesses() {
  const patterns = await learnFromSuccesses();

  if (patterns.length === 0) {
    console.log('No success patterns learned yet');
    return;
  }

  console.log(`\n✅ Success Patterns (${patterns.length}):\n`);

  patterns.forEach(pattern => {
    console.log(`  - ${pattern.pattern}`);
    console.log(`    Success Rate: ${(pattern.successRate * 100).toFixed(0)}%`);
    console.log(`    Context: ${JSON.stringify(pattern.context)}`);
    console.log(`    Examples: ${pattern.examples.length}\n`);
  });
}

/**
 * Show coding style
 */
async function showStyle() {
  const styles = await learnCodingStyle();

  if (styles.length === 0) {
    console.log('No coding style patterns learned yet');
    return;
  }

  console.log(`\n🎨 Coding Style Patterns (${styles.length}):\n`);

  styles.forEach(style => {
    console.log(`  - ${style.pattern}`);
    console.log(`    Frequency: ${style.frequency} times`);
    console.log(`    Examples: ${style.examples.length}\n`);
  });
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
 * Main CLI
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'record':
      const [action, suggestion, ...contextParts] = args.slice(1);
      if (!action || !suggestion) {
        console.error('Usage: learn-context.js record <action> <suggestion> [context...]');
        process.exit(1);
      }
      const context = contextParts.reduce((acc, part) => {
        const [key, value] = part.split('=');
        if (key && value) acc[key] = value;
        return acc;
      }, {} as Record<string, string>);
      await record(action, suggestion, context);
      break;

    case 'learn':
      await learn();
      break;

    case 'preferences':
      await showPreferences();
      break;

    case 'successes':
      await showSuccesses();
      break;

    case 'style':
      await showStyle();
      break;

    default:
      console.log(`
Contextual Learning Script

Usage:
  learn-context.js record <action> <suggestion> [key=value...]  Record behavior
  learn-context.js learn                                        Learn preferences
  learn-context.js preferences                                  Show learned preferences
  learn-context.js successes                                    Show success patterns
  learn-context.js style                                        Show coding style

Examples:
  learn-context.js record accepted "Use try-catch" file=route.ts
  learn-context.js learn
  learn-context.js preferences
      `);
      break;
  }
}

if (require.main === module) {
  main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
}

module.exports = { record, learn, showPreferences };
