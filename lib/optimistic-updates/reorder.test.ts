process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock-service-key';
process.env.NEXT_PUBLIC_AUTH0_DOMAIN = 'mock-domain.auth0.com';
process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID = 'mock-client-id';

import { createOptimisticReorder } from './reorder';

type Item = { id: string; name: string; position: number };

function mockResponse(body: object, ok: boolean): Response {
  return { ok, json: () => Promise.resolve(body) } as unknown as Response;
}

describe('createOptimisticReorder', () => {
  let items: Item[];
  let setItems: jest.Mock;

  beforeEach(() => {
    items = [
      { id: '1', name: 'First', position: 0 },
      { id: '2', name: 'Second', position: 1 },
      { id: '3', name: 'Third', position: 2 },
    ];
    setItems = jest.fn();
  });

  it('immediately reorders items and reassigns positions', async () => {
    await createOptimisticReorder(
      items,
      ['3', '1', '2'],
      () => Promise.resolve(mockResponse({}, true)),
      setItems,
    );
    const reordered = setItems.mock.calls[0][0] as Item[];
    expect(reordered.map(i => i.id)).toEqual(['3', '1', '2']);
    expect(reordered.map(i => i.position)).toEqual([0, 1, 2]);
  });

  it('calls onSuccess after a successful reorder', async () => {
    const onSuccess = jest.fn();
    await createOptimisticReorder(
      items,
      ['2', '1', '3'],
      () => Promise.resolve(mockResponse({}, true)),
      setItems,
      onSuccess,
    );
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('reverts and calls onError when the server returns a non-ok response', async () => {
    const onError = jest.fn();
    await createOptimisticReorder(
      items,
      ['3', '2', '1'],
      () => Promise.resolve(mockResponse({ error: 'reorder failed' }, false)),
      setItems,
      undefined,
      onError,
    );
    expect(setItems).toHaveBeenCalledWith(items);
    expect(onError).toHaveBeenCalledWith('reorder failed');
  });

  it('reverts and calls onError when the fetch itself throws', async () => {
    const onError = jest.fn();
    await createOptimisticReorder(
      items,
      ['2', '3', '1'],
      () => Promise.reject(new Error('connection reset')),
      setItems,
      undefined,
      onError,
    );
    expect(setItems).toHaveBeenCalledWith(items);
    expect(onError).toHaveBeenCalledWith('connection reset');
  });

  it('silently drops IDs that do not exist in the current list', async () => {
    await createOptimisticReorder(
      items,
      ['1', 'ghost', '2'],
      () => Promise.resolve(mockResponse({}, true)),
      setItems,
    );
    const reordered = setItems.mock.calls[0][0] as Item[];
    expect(reordered.map(i => i.id)).toEqual(['1', '2']); // 'ghost' filtered out
  });
});
