/**
 * Normalize ingredient text to structured format. Extracted for filesize limit.
 */
import { UNICODE_FRACTIONS, UNITS } from './normalizeIngredientConstants';

export function normalizeIngredient(ingredientText: string): {
  name: string;
  quantity?: number;
  unit?: string;
  notes?: string;
  original_text: string;
} {
  const original = ingredientText.trim();
  const result: {
    name: string;
    quantity?: number;
    unit?: string;
    notes?: string;
    original_text: string;
  } = {
    name: '',
    original_text: original,
  };

  const unitPattern = UNITS.join('|');
  const mixedPattern = new RegExp(
    `^(\\d+)\\s*([\\u00BC-\\u00BE\\u2150-\\u215E]|\\d+\\/\\d+)?\\s*(${unitPattern})\\s+(.+)$`,
    'i',
  );
  const fractionPattern = new RegExp(
    `^([\\u00BC-\\u00BE\\u2150-\\u215E]|\\d+\\/\\d+)\\s*(${unitPattern})\\s+(.+)$`,
    'i',
  );
  const numberUnitPattern = new RegExp(`^([\\d.]+)\\s*(${unitPattern})\\.?\\s+(.+)$`, 'i');
  const numberOnlyPattern = /^([\d.]+)\s+(.+)$/;

  function parseFrac(s: string): number {
    return (
      UNICODE_FRACTIONS[s] ??
      (s.includes('/')
        ? (() => {
            const [n, d] = s.split('/').map(Number);
            return n / d;
          })()
        : 0)
    );
  }

  let matched = false;
  let text = original;

  const notesInParens = text.match(/\(([^)]+)\)\s*$/);
  if (notesInParens) {
    result.notes = notesInParens[1].trim();
    text = text.replace(/\([^)]+\)\s*$/, '').trim();
  }

  let match = text.match(mixedPattern);
  if (match) {
    result.quantity = (parseFloat(match[1]) || 0) + (match[2] ? parseFrac(match[2]) : 0);
    result.unit = match[3].toLowerCase().replace(/\.$/, '');
    result.name = match[4].trim();
    matched = true;
  }

  if (!matched && (match = text.match(fractionPattern))) {
    result.quantity = parseFrac(match[1]);
    result.unit = match[2].toLowerCase().replace(/\.$/, '');
    result.name = match[3].trim();
    matched = true;
  }

  if (!matched && (match = text.match(numberUnitPattern))) {
    result.quantity = parseFloat(match[1]) || 1;
    result.unit = match[2].toLowerCase().replace(/\.$/, '');
    result.name = match[3].trim();
    matched = true;
  }

  if (!matched && (match = text.match(numberOnlyPattern))) {
    result.quantity = parseFloat(match[1]) || 1;
    result.name = match[2].trim();
    matched = true;
  }

  if (!matched) result.name = text;

  const commaNote = result.name.match(/,\s*([^,]+)$/);
  if (commaNote && !result.notes) {
    result.notes = commaNote[1].trim();
    result.name = result.name.replace(/,\s*[^,]+$/, '').trim();
  }

  result.name = result.name
    .replace(/^,+\s*/, '')
    .replace(/,+\s*$/, '')
    .trim();
  if (!result.name) result.name = original;

  return result;
}
