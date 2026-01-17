import { supabaseAdmin } from '@/lib/supabase';
import { processBatchCreation } from './processBatch';

// Mock dependencies
jest.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
  },
}));

jest.mock('@/lib/logger', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('processBatchCreation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create prep lists and items successfully', async () => {
    const mockPrepList = { id: 'list-123', name: 'Morning Prep' };

    // Mock Supabase chain for list creation
    (supabaseAdmin!.from as jest.Mock).mockReturnValueOnce({
      // insert list
      insert: jest.fn().mockReturnValueOnce({
        select: jest.fn().mockReturnValueOnce({
          single: jest.fn().mockResolvedValue({ data: mockPrepList, error: null }),
        }),
      }),
    });

    // Mock Supabase chain for item creation (no failure)
    (supabaseAdmin!.from as jest.Mock).mockReturnValueOnce({
      // insert items
      insert: jest.fn().mockResolvedValue({ error: null }),
    });

    const prepLists = [
      {
        sectionId: null,
        name: 'Morning Prep',
        items: [{ ingredientId: 'ing-1', quantity: '10', unit: 'kg', notes: '' }],
      },
    ];

    const result = await processBatchCreation('user-123', prepLists);

    expect(result.createdIds).toHaveLength(1);
    expect(result.createdIds[0]).toBe('list-123');
    expect(result.errors).toHaveLength(0);
    expect(supabaseAdmin!.from).toHaveBeenCalledWith('prep_lists');
    expect(supabaseAdmin!.from).toHaveBeenCalledWith('prep_list_items');
  });

  it('should handle partial failures', async () => {
    // List 1: Success
    const mockPrepList1 = { id: 'list-1', name: 'Success List' };
    (supabaseAdmin!.from as jest.Mock).mockReturnValueOnce({
      // insert list 1
      insert: jest.fn().mockReturnValueOnce({
        select: jest.fn().mockReturnValueOnce({
          single: jest.fn().mockResolvedValue({ data: mockPrepList1, error: null }),
        }),
      }),
    });
    (supabaseAdmin!.from as jest.Mock).mockReturnValueOnce({
      // insert items 1
      insert: jest.fn().mockResolvedValue({ error: null }),
    });

    // List 2: Fails at DB level
    (supabaseAdmin!.from as jest.Mock).mockReturnValueOnce({
      // insert list 2
      insert: jest.fn().mockReturnValueOnce({
        select: jest.fn().mockReturnValueOnce({
          single: jest.fn().mockResolvedValue({ data: null, error: { message: 'DB Error' } }),
        }),
      }),
    });

    const prepLists = [
      {
        sectionId: null,
        name: 'Success List',
        items: [{ ingredientId: '1', quantity: '1', unit: 'g', notes: '' }],
      },
      {
        sectionId: null,
        name: 'Fail List',
        items: [{ ingredientId: '2', quantity: '1', unit: 'g', notes: '' }],
      },
    ];

    const result = await processBatchCreation('user-123', prepLists);

    expect(result.createdIds).toHaveLength(1);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].prepListName).toBe('Fail List');
  });
});
