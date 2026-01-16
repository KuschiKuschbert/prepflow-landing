
import { parseRecipeCardResponse } from './parseRecipeCard';

// Mock logger to avoid console spam during tests
jest.mock('@/lib/logger', () => ({
  logger: {
    warn: jest.fn(),
    error: jest.fn(),
    dev: jest.fn(),
  },
}));

describe('parseRecipeCardResponse', () => {
  it('should parse a standard recipe card correctly', () => {
    const input = `
title: Spaghetti Carbonara
yield: 4
ingredients:
- Pasta | 400 | g
- Eggs | 4 | pcs
- Pecorino Cheese | 100 | g
- Guanciale | 150 | g
method:
1. Boil pasta.
2. Fry guanciale.
3. Mix eggs and cheese.
4. Combine all.
notes:
- Use fresh eggs.
    `;

    const result = parseRecipeCardResponse(input);

    expect(result).not.toBeNull();
    expect(result?.title).toBe('Spaghetti Carbonara');
    expect(result?.baseYield).toBe(1); // Current implementation hardcodes this to 1
    expect(result?.ingredients).toHaveLength(4);
    expect(result?.ingredients[0]).toEqual({ name: 'Pasta', quantity: 400, unit: 'g' });
    expect(result?.methodSteps).toHaveLength(4);
    expect(result?.methodSteps[0]).toBe('Boil pasta.');
    expect(result?.notes).toHaveLength(1);
    expect(result?.notes[0]).toBe('Use fresh eggs.');
  });

  it('should handle alternative ingredient formats', () => {
    const input = `
title: Simple Salad
ingredients:
- Lettuce: 1 head
- Tomatoes 2 pcs
    `;
    const result = parseRecipeCardResponse(input);

    expect(result?.ingredients).toHaveLength(2);
    expect(result?.ingredients[0]).toEqual({ name: 'Lettuce', quantity: 1, unit: 'head' }); // Fallback regex 1
    expect(result?.ingredients[1]).toEqual({ name: 'Tomatoes', quantity: 2, unit: 'pcs' }); // Fallback regex 2
  });

  it('should handle bulleted method steps', () => {
    const input = `
title: Toast
method:
- Put bread in toaster.
* Wait for pop.
• Butter it.
    `;
    const result = parseRecipeCardResponse(input);

    expect(result?.methodSteps).toHaveLength(3);
    expect(result?.methodSteps[0]).toBe('Put bread in toaster.');
    expect(result?.methodSteps[1]).toBe('Wait for pop.');
    expect(result?.methodSteps[2]).toBe('Butter it.');
  });

  it('should infer title if missing header', () => {
    const input = `
Delicious Burger
ingredients:
- Bun | 1 | pc
    `;
    const result = parseRecipeCardResponse(input);
    expect(result?.title).toBe('Delicious Burger');
  });

  it('should use first line as title fallback even if it looks like a header (quirk)', () => {
    const input = `
ingredients:
- Water | 1 | cup
    `;
    const result = parseRecipeCardResponse(input);
    // Current implementation quirk: takes first line if no title found
    expect(result?.title).toBe('ingredients:');
  });
});
