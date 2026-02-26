process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock-service-key';
process.env.NEXT_PUBLIC_AUTH0_DOMAIN = 'mock-domain.auth0.com';
process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID = 'mock-client-id';

import { createOptimisticDelete } from './delete';

type Item = { id: string; name: string };

/** Build a minimal Response-shaped mock */
function mockResponse(body: object, ok: boolean): Response {
  return { ok, json: () => Promise.resolve(body) } as unknown as Response;
}

describe('createOptimisticDelete', () => {
  let items: Item[];
  let setItems: jest.Mock;

  beforeEach(() => {
    items = [
      { id: '1', name: 'Alpha' },
      { id: '2', name: 'Beta' },
    ];
    setItems = jest.fn();
  });

  it('immediately removes the item from the list', async () => {
    await createOptimisticDelete(
      items,
      '1',
      () => Promise.resolve(mockResponse({}, true)),
      setItems,
    );
    // First call is the optimistic removal — it's a function updater
    const updater = setItems.mock.calls[0][0] as (prev: Item[]) => Item[];
    expect(updater(items)).toEqual([{ id: '2', name: 'Beta' }]);
  });

  it('calls onSuccess after a successful delete', async () => {
    const onSuccess = jest.fn();
    await createOptimisticDelete(
      items,
      '1',
      () => Promise.resolve(mockResponse({}, true)),
      setItems,
      onSuccess,
    );
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('reverts and calls onError when the server returns a non-ok response', async () => {
    const onError = jest.fn();
    await createOptimisticDelete(
      items,
      '1',
      () => Promise.resolve(mockResponse({ error: 'not found' }, false)),
      setItems,
      undefined,
      onError,
    );
    expect(setItems).toHaveBeenCalledWith(items);
    expect(onError).toHaveBeenCalledWith('not found');
  });

  it('reverts and calls onError when the fetch itself throws', async () => {
    const onError = jest.fn();
    await createOptimisticDelete(
      items,
      '1',
      () => Promise.reject(new Error('network failure')),
      setItems,
      undefined,
      onError,
    );
    expect(setItems).toHaveBeenCalledWith(items);
    expect(onError).toHaveBeenCalledWith('network failure');
  });

  it('calls onError immediately when the item does not exist', async () => {
    const onError = jest.fn();
    const deleteFn = jest.fn();
    await createOptimisticDelete(items, 'ghost', deleteFn, setItems, undefined, onError);
    expect(deleteFn).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith('Item not found');
  });
});
