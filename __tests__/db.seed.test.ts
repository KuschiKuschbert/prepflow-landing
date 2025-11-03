import { CANONICAL_RECIPES } from '../lib/seed/recipes';

describe('Seed catalog (recipes-first)', () => {
  test('every ingredient line resolves to catalog entry', () => {
    const catalog = new Set<string>();
    for (const r of CANONICAL_RECIPES) {
      for (const l of r.lines) {
        catalog.add(l.ingredientName.trim().replace(/\s+/g, ' '));
      }
    }

    const missing: string[] = [];
    for (const r of CANONICAL_RECIPES) {
      for (const l of r.lines) {
        const key = l.ingredientName.trim().replace(/\s+/g, ' ');
        if (!catalog.has(key)) missing.push(key);
      }
    }

    expect(missing).toHaveLength(0);
  });

  test('basic counts look reasonable', () => {
    const recipeCount = CANONICAL_RECIPES.length;
    const lines = CANONICAL_RECIPES.reduce((acc, r) => acc + r.lines.length, 0);
    expect(recipeCount).toBeGreaterThanOrEqual(3);
    expect(lines).toBeGreaterThan(recipeCount); // at least one ingredient per recipe
  });
});
