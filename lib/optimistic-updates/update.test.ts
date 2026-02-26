process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock-service-key';
process.env.NEXT_PUBLIC_AUTH0_DOMAIN = 'mock-domain.auth0.com';
process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID = 'mock-client-id';

import { createOptimisticUpdate } from './update';

type Item = { id: string; name: string; cost: number };

function mockResponse(body: object, ok: boolean): Response {
  return { ok, json: () => Promise.resolve(body) } as unknown as Response;
}

describe('createOptimisticUpdate', () => {
  let items: Item[];
  let setItems: jest.Mock;

  beforeEach(() => {
    items = [
      { id: '1', name: 'Alpha', cost: 10 },
      { id: '2', name: 'Beta', cost: 20 },
    ];
    setItems = jest.fn();
  });

  it('immediately applies the update to the correct item', async () => {
    await createOptimisticUpdate(
      items,
      '1',
      { cost: 99 },
      () => Promise.resolve(mockResponse({}, true)),
      setItems,
    );
    const updater = setItems.mock.calls[0][0] as (prev: Item[]) => Item[];
    const updated = updater(items);
    expect(updated.find(i => i.id === '1')?.cost).toBe(99);
    expect(updated.find(i => i.id === '2')?.cost).toBe(20);
  });

  it('calls onSuccess after a successful update', async () => {
    const onSuccess = jest.fn();
    await createOptimisticUpdate(
      items,
      '1',
      { name: 'Alpha Updated' },
      () => Promise.resolve(mockResponse({}, true)),
      setItems,
      onSuccess,
    );
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('reverts and calls onError when the server returns a non-ok response', async () => {
    const onError = jest.fn();
    await createOptimisticUpdate(
      items,
      '1',
      { cost: 99 },
      () => Promise.resolve(mockResponse({ error: 'update failed' }, false)),
      setItems,
      undefined,
      onError,
    );
    expect(setItems).toHaveBeenCalledWith(items);
    expect(onError).toHaveBeenCalledWith('update failed');
  });

  it('reverts and calls onError when the fetch itself throws', async () => {
    const onError = jest.fn();
    await createOptimisticUpdate(
      items,
      '1',
      { cost: 99 },
      () => Promise.reject(new Error('network error')),
      setItems,
      undefined,
      onError,
    );
    expect(setItems).toHaveBeenCalledWith(items);
    expect(onError).toHaveBeenCalledWith('network error');
  });

  it('calls onError immediately when the item does not exist', async () => {
    const onError = jest.fn();
    const updateFn = jest.fn();
    await createOptimisticUpdate(
      items,
      'ghost',
      { cost: 1 },
      updateFn,
      setItems,
      undefined,
      onError,
    );
    expect(updateFn).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith('Item not found');
  });
});
