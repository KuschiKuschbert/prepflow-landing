import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { useState } from 'react';

/**
 * Hook for managing database table existence check
 */
export function useDatabaseCheck() {
  const cachedDbCheck = getCachedData<{ tablesExist: boolean; timestamp: number }>(
    'menu_builder_db_check',
  );
  const shouldCheckDb = !cachedDbCheck || Date.now() - cachedDbCheck.timestamp > 5 * 60 * 1000;
  const [checkingDb, setCheckingDb] = useState(shouldCheckDb);
  const [dbError, setDbError] = useState<string | null>(null);

  const checkDatabaseTables = async (): Promise<boolean> => {
    setCheckingDb(true);
    setDbError(null);
    try {
      const response = await fetch('/api/setup-menu-builder', {
        method: 'POST',
        cache: 'no-store',
      });
      const result = await response.json();

      // Cache the DB check result
      cacheData('menu_builder_db_check', {
        tablesExist: result.success && result.tablesExist,
        timestamp: Date.now(),
      });

      if (!result.success || !result.tablesExist) {
        setDbError(
          result.message ||
            'Menu builder tables are not set up. Please run the database migration.',
        );
        setCheckingDb(false);
        return false;
      }
      setCheckingDb(false);
      return true;
    } catch {
      setDbError('Failed to check database tables. Please try again.');
      setCheckingDb(false);
      return false;
    }
  };

  return {
    checkingDb,
    dbError,
    setDbError,
    checkDatabaseTables,
    cachedDbCheck,
  };
}
