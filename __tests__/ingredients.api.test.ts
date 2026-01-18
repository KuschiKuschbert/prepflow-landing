import { NextRequest } from 'next/server';

jest.mock('next/server', () => {
  return {
    NextRequest: class {},
    NextResponse: {
      json: (body: unknown) => ({ json: async () => body }),
    },
  };
});

// Mock types
interface Ingredient {
  id: string;
  ingredient_name?: string;
  name?: string;
  cost_per_unit: number;
  unit: string;
}

interface RecipeIngredient {
  id: string;
  recipe_id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  ingredients: Ingredient | null;
}

jest.mock('@/lib/supabase', () => {
  const ingredients: Ingredient[] = [
    { id: 'i1', ingredient_name: 'Tomato', cost_per_unit: 1, unit: 'g' },
    { id: 'i2', name: 'Olive Oil', cost_per_unit: 2, unit: 'ml' }, // name fallback
  ];
  return {
    supabaseAdmin: {
      from: (_table: string) => ({
        select: () => ({
          eq: () => ({
            in: (_: string, __: string[]) => ({ data: ingredients, error: null }),
            then: undefined,
          }),
          in: (_: string, __: string[]) => ({ data: ingredients, error: null }),
        }),
      }),
    },
  };
});

describe('GET /api/recipes/[id]/ingredients (no demo)', () => {
  it('returns items with normalized ingredient_name and backfilled nested join', async () => {
    // Polyfill minimal Request to satisfy Next internals during import
    const globalAny = global as unknown as Record<string, unknown>;

    globalAny.Request = class {};
    globalAny.Response = class {
      static json(body: unknown, init?: unknown) {
        return { body, init };
      }
    };

    const route = await import('@/app/api/recipes/[id]/ingredients/route');

    // Arrange: mock supabaseAdmin calls inside the route via spies
    const req = {} as NextRequest;

    // Mock first query to recipe_ingredients

    const supabase = require('@/lib/supabase');
    const fromSpy = jest.spyOn(supabase.supabaseAdmin, 'from');

    fromSpy.mockImplementation((table: unknown) => {
      const tableName = table as string;
      if (tableName === 'recipe_ingredients') {
        const mockData: RecipeIngredient[] = [
          {
            id: 'ri1',
            recipe_id: 'r1',
            ingredient_id: 'i1',
            quantity: 1,
            unit: 'g',
            ingredients: null,
          },
          {
            id: 'ri2',
            recipe_id: 'r1',
            ingredient_id: 'i2',
            quantity: 2,
            unit: 'ml',
            ingredients: null,
          },
        ];

        return {
          select: () => ({
            eq: () => ({
              data: mockData,
              error: null,
            }),
          }),
        };
      }

      // ingredients backfill
      return {
        select: () => ({
          in: () => ({
            data: [
              { id: 'i1', ingredient_name: 'Tomato', cost_per_unit: 1, unit: 'g' },
              { id: 'i2', name: 'Olive Oil', cost_per_unit: 2, unit: 'ml' },
            ],
            error: null,
          }),
        }),
      };
    });

    // Act
    const res = await route.GET(req, { params: Promise.resolve({ id: 'r1' }) });
    const json = await res.json();

    // Assert
    expect(Array.isArray(json.items)).toBe(true);
    expect(json.items.length).toBe(2);
    expect(json.items[0].ingredients.ingredient_name).toBe('Tomato');
    expect(json.items[1].ingredients.ingredient_name).toBe('Olive Oil'); // fallback to name
  });
});
