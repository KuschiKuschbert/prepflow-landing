import { localizeIngredientName } from '../localization/australian-names';
import { normalizeUnit } from '../unit-conversion';

interface ParsedIngredient {
  quantity: number;
  unit: string;
  name: string;
}

// Helper to return localized result
function createResult(qty: number, unit: string, rawName: string): ParsedIngredient {
  return {
    quantity: qty,
    unit: unit,
    name: localizeIngredientName(rawName),
  };
}

/**
 * Parses an ingredient string to extract quantity and unit.
 * Examples:
 * - "(380 g) arborio rice" -> { quantity: 380, unit: "g", name: "arborio rice" }
 * - "1.2 l chicken broth" -> { quantity: 1.2, unit: "l", name: "chicken broth" }
 * - "2 cups flour" -> { quantity: 2, unit: "cup", name: "flour" }
 * - "salt" -> null (no quantity found)
 */
export function parseIngredientString(rawString: string): ParsedIngredient | null {
  if (!rawString) return null;
  const clean = rawString.trim();

  // Pre-process unicode fractions
  let processed = clean
    .replace(/¼/g, ' 1/4')
    .replace(/½/g, ' 1/2')
    .replace(/¾/g, ' 3/4')
    .replace(/⅓/g, ' 1/3')
    .replace(/⅔/g, ' 2/3')
    .replace(/⅕/g, ' 1/5')
    .replace(/⅖/g, ' 2/5')
    .replace(/⅗/g, ' 3/5')
    .replace(/⅘/g, ' 4/5')
    .replace(/⅙/g, ' 1/6')
    .replace(/⅚/g, ' 5/6')
    .replace(/⅛/g, ' 1/8')
    .replace(/⅜/g, ' 3/8')
    .replace(/⅝/g, ' 5/8')
    .replace(/⅞/g, ' 7/8');

  // Collapse multiple spaces
  processed = processed.replace(/\s+/g, ' ').trim();

  // Pattern A: Package "(10 oz) can"
  const packageMatch = processed.match(
    /^([\d.]+)\s*\(([\d.]+)\s*([a-zA-Z_\-.]+)\)\s*([a-zA-Z_]+)\s+(.+)$/,
  );
  if (packageMatch) {
    const qty = parseFloat(packageMatch[1]);
    const pkgUnit = normalizeUnit(packageMatch[4]);
    if (
      [
        'can',
        'bottle',
        'jar',
        'pack',
        'package',
        'bag',
        'container',
        'box',
        'head',
        'stick',
      ].includes(pkgUnit)
    ) {
      return createResult(qty, pkgUnit, packageMatch[5].trim());
    }
  }

  // Pattern 0: Mixed fraction "1 1/2 cups ..."
  const mixedFractionMatch = processed.match(/^(\d+)\s+(\d+)\/(\d+)\s+([a-zA-Z_]+)\s+(.+)$/);
  if (mixedFractionMatch) {
    const whole = parseFloat(mixedFractionMatch[1]);
    const num = parseFloat(mixedFractionMatch[2]);
    const den = parseFloat(mixedFractionMatch[3]);
    const qty = whole + num / den;
    const unit = normalizeUnit(mixedFractionMatch[4]);
    return createResult(qty, unit, mixedFractionMatch[5].trim());
  }

  // Pattern 0b: Simple fraction "1/2 cup ..."
  const fractionMatch = processed.match(/^(\d+)\/(\d+)\s+([a-zA-Z_]+)\s+(.+)$/);
  if (fractionMatch) {
    const num = parseFloat(fractionMatch[1]);
    const den = parseFloat(fractionMatch[2]);
    const qty = num / den;
    const unit = normalizeUnit(fractionMatch[3]);
    return createResult(qty, unit, fractionMatch[4].trim());
  }

  // Pattern 1: Parentheses at start "(380 g) ..."
  const parenMatch = processed.match(/^\(([\d.]+)\s*([a-zA-Z_]+)\)\s*(.+)$/);
  if (parenMatch) {
    const qty = parseFloat(parenMatch[1]);
    const unit = normalizeUnit(parenMatch[2]);
    return createResult(qty, unit, parenMatch[3].trim());
  }

  // Pattern 2: Start of string "1.2 l ..."
  const startMatch = processed.match(/^([\d.]+)\s*([a-zA-Z_\-.]*)\s+(.+)$/);
  if (startMatch) {
    const qty = parseFloat(startMatch[1]);
    const rawUnit = startMatch[2];
    const rest = startMatch[3];

    if (['small', 'medium', 'large'].includes(rawUnit.toLowerCase())) {
      const unit = normalizeUnit(rawUnit);
      return createResult(qty, unit, rest.trim());
    }

    const cleanUnit = rawUnit.replace(/^-/, '').replace(/^–/, '').replace('.', '');
    const unit = normalizeUnit(cleanUnit);

    return createResult(qty, unit, rest.trim());
  }

  return null;
}
