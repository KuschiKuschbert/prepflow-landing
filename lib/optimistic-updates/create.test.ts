process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock-service-key';
process.env.NEXT_PUBLIC_AUTH0_DOMAIN = 'mock-domain.auth0.com';
process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID = 'mock-client-id';

import { createOptimisticCreate } from './create';

type Item = { id: string; name: string };

function mockResponse(body: object, ok: boolean): Response {
  return { ok, json: () => Promise.resolve(body) } as unknown as Response;
}

describe('createOptimisticCreate', () => {
  const serverItem: Item = { id: 'server-id', name: 'Tomato' };
  const tempItem: Item = { id: 'temp-123', name: 'Tomato' };
  let items: Item[];
  let setItems: jest.Mock;

  beforeEach(() => {
    items = [{ id: '1', name: 'Existing' }];
    setItems = jest.fn();
  });

  it('immediately adds the new item to the list', async () => {
    await createOptimisticCreate(
      items,
      tempItem,
      () => Promise.resolve(mockResponse({ success: true, item: serverItem }, true)),
      setItems,
    );
    const updater = setItems.mock.calls[0][0] as (prev: Item[]) => Item[];
    expect(updater(items)).toEqual([...items, tempItem]);
  });

  it('replaces the temp item with the server item on success', async () => {
    await createOptimisticCreate(
      items,
      tempItem,
      () => Promise.resolve(mockResponse({ success: true, item: serverItem }, true)),
      setItems,
    );
    const replacer = setItems.mock.calls[1][0] as (prev: Item[]) => Item[];
    const stateWithTemp = [...items, tempItem];
    expect(replacer(stateWithTemp)).toEqual([...items, serverItem]);
  });

  it('calls onSuccess with the server item', async () => {
    const onSuccess = jest.fn();
    await createOptimisticCreate(
      items,
      tempItem,
      () => Promise.resolve(mockResponse({ success: true, item: serverItem }, true)),
      setItems,
      onSuccess,
    );
    expect(onSuccess).toHaveBeenCalledWith(serverItem);
  });

  it('reverts and calls onError when the server returns a non-ok response', async () => {
    const onError = jest.fn();
    await createOptimisticCreate(
      items,
      tempItem,
      () => Promise.resolve(mockResponse({ error: 'create failed' }, false)),
      setItems,
      undefined,
      onError,
    );
    expect(setItems).toHaveBeenCalledWith(items);
    expect(onError).toHaveBeenCalledWith('create failed');
  });

  it('reverts and calls onError when the fetch itself throws', async () => {
    const onError = jest.fn();
    await createOptimisticCreate(
      items,
      tempItem,
      () => Promise.reject(new Error('timeout')),
      setItems,
      undefined,
      onError,
    );
    expect(setItems).toHaveBeenCalledWith(items);
    expect(onError).toHaveBeenCalledWith('timeout');
  });
});
