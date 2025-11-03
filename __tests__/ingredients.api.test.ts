jest.mock('next/server', () => {
  return {
    NextRequest: class {},
    NextResponse: {
      json: (body: any) => ({ json: async () => body }),
    },
  };
});

jest.mock('@/lib/supabase', () => {
  const rows = [
    { id: 'ri1', recipe_id: 'r1', ingredient_id: 'i1', quantity: 1, unit: 'g', ingredients: null },
    { id: 'ri2', recipe_id: 'r1', ingredient_id: 'i2', quantity: 2, unit: 'ml', ingredients: null },
  ];
  const ingredients = [
    { id: 'i1', ingredient_name: 'Tomato', cost_per_unit: 1, unit: 'g' },
    { id: 'i2', name: 'Olive Oil', cost_per_unit: 2, unit: 'ml' }, // name fallback
  ];
  return {
    supabaseAdmin: {
      from: (table: string) => ({
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
    (global as any).Request = class {};
    (global as any).Response = class {
      static json(body: any, init?: any) {
        return { body, init };
      }
    };
    const route = await import('@/app/api/recipes/[id]/ingredients/route');
    // Arrange: mock supabaseAdmin calls inside the route via spies
    const req: any = {};

    // Mock first query to recipe_ingredients
    const supabase = require('@/lib/supabase');
    const fromSpy = jest.spyOn(supabase.supabaseAdmin, 'from');
    fromSpy.mockImplementation((table: string) => {
      if (table === 'recipe_ingredients') {
        return {
          select: () => ({
            eq: () => ({
              data: [
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
              ],
              error: null,
            }),
          }),
        } as any;
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
      } as any;
    });

    // Act
    const res = await route.GET(req as any, { params: Promise.resolve({ id: 'r1' }) } as any);
    const json = await res.json();

    // Assert
    expect(Array.isArray(json.items)).toBe(true);
    expect(json.items.length).toBe(2);
    expect(json.items[0].ingredients.ingredient_name).toBe('Tomato');
    expect(json.items[1].ingredients.ingredient_name).toBe('Olive Oil'); // fallback to name
  });
});
