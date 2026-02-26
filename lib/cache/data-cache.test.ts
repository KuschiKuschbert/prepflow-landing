// Environment stubs so module-level imports don't throw
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock-service-key';
process.env.NEXT_PUBLIC_AUTH0_DOMAIN = 'mock-domain.auth0.com';
process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID = 'mock-client-id';

import { cacheData, getCachedData, clearCache, clearAllCaches } from './data-cache';

describe('data-cache', () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.restoreAllMocks();
  });

  // ---------------------------------------------------------------------------
  // cacheData
  // ---------------------------------------------------------------------------
  describe('cacheData', () => {
    it('stores data under the prefixed key', () => {
      cacheData('test', { value: 42 });
      const raw = sessionStorage.getItem('prepflow_cache_test');
      expect(raw).not.toBeNull();
      const parsed = JSON.parse(raw!);
      expect(parsed.data).toEqual({ value: 42 });
    });

    it('writes a timestamp and expiry key', () => {
      cacheData('ts-test', 'hello', 1000);
      expect(sessionStorage.getItem('prepflow_cache_ts-test_timestamp')).not.toBeNull();
      expect(sessionStorage.getItem('prepflow_cache_ts-test_expiry')).toBe('1000');
    });

    it('uses the default 5-minute expiry when none is supplied', () => {
      cacheData('default-expiry', 'world');
      const expiry = sessionStorage.getItem('prepflow_cache_default-expiry_expiry');
      expect(expiry).toBe(String(5 * 60 * 1000));
    });

    it('does not throw when sessionStorage throws', () => {
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('QuotaExceededError');
      });
      expect(() => cacheData('error-key', { big: 'data' })).not.toThrow();
    });
  });

  // ---------------------------------------------------------------------------
  // getCachedData
  // ---------------------------------------------------------------------------
  describe('getCachedData', () => {
    it('returns null when nothing is cached', () => {
      expect(getCachedData('nonexistent')).toBeNull();
    });

    it('returns cached data that is still valid', () => {
      cacheData('valid', { name: 'Alice' });
      expect(getCachedData('valid')).toEqual({ name: 'Alice' });
    });

    it('returns null and clears the entry when data has expired', () => {
      jest.spyOn(Date, 'now').mockReturnValueOnce(0); // write at t=0
      cacheData('expired', 'stale', 100);

      jest.spyOn(Date, 'now').mockReturnValue(200); // read at t=200 (past TTL)
      expect(getCachedData('expired')).toBeNull();
      expect(sessionStorage.getItem('prepflow_cache_expired')).toBeNull();
    });

    it('returns null when the cached JSON is corrupt', () => {
      sessionStorage.setItem('prepflow_cache_bad', '{invalid json}');
      sessionStorage.setItem('prepflow_cache_bad_timestamp', String(Date.now()));
      expect(getCachedData('bad')).toBeNull();
    });

    it('survives objects stored with cacheData', () => {
      const arr = [1, 2, 3];
      cacheData('arr', arr);
      expect(getCachedData<number[]>('arr')).toEqual(arr);
    });
  });

  // ---------------------------------------------------------------------------
  // clearCache
  // ---------------------------------------------------------------------------
  describe('clearCache', () => {
    it('removes all three storage keys for the given cache entry', () => {
      cacheData('to-clear', { x: 1 });
      clearCache('to-clear');
      expect(sessionStorage.getItem('prepflow_cache_to-clear')).toBeNull();
      expect(sessionStorage.getItem('prepflow_cache_to-clear_timestamp')).toBeNull();
      expect(sessionStorage.getItem('prepflow_cache_to-clear_expiry')).toBeNull();
    });

    it('does not throw when the key does not exist', () => {
      expect(() => clearCache('ghost')).not.toThrow();
    });
  });

  // ---------------------------------------------------------------------------
  // clearAllCaches
  // ---------------------------------------------------------------------------
  describe('clearAllCaches', () => {
    it('removes all prepflow-prefixed keys and leaves unrelated keys alone', () => {
      cacheData('a', 1);
      cacheData('b', 2);
      sessionStorage.setItem('unrelated', 'keep-me');
      clearAllCaches();
      expect(sessionStorage.getItem('prepflow_cache_a')).toBeNull();
      expect(sessionStorage.getItem('prepflow_cache_b')).toBeNull();
      expect(sessionStorage.getItem('unrelated')).toBe('keep-me');
    });

    it('does not throw when sessionStorage is empty', () => {
      expect(() => clearAllCaches()).not.toThrow();
    });
  });
});
