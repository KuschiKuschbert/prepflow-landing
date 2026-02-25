/**
 * Effect logic for loading menu data when menuId changes.
 * Extracted from useMenuData to keep hook under 120 lines.
 */
import type { Dispatch, MutableRefObject, RefObject, SetStateAction } from 'react';
import { logger } from '@/lib/logger';

interface RunLoadEffectParams<TMenuItem, TStatistics> {
  menuId: string;
  initialState: { menuItems: TMenuItem[] };
  prevMenuIdRef: MutableRefObject<string | undefined>;
  isLoadingRef: MutableRefObject<boolean>;
  loadPromiseRef: MutableRefObject<Promise<void> | null>;
  loadMenuDataRef: RefObject<() => Promise<void>>;
  setMenuItems: Dispatch<SetStateAction<TMenuItem[]>>;
  setCategories: Dispatch<SetStateAction<string[]>>;
  setStatistics: Dispatch<SetStateAction<TStatistics | null>>;
  setLoading: (loading: boolean) => void;
}

export function runLoadEffect<TMenuItem, TStatistics>({
  menuId,
  initialState,
  prevMenuIdRef,
  isLoadingRef,
  loadPromiseRef,
  loadMenuDataRef,
  setMenuItems,
  setCategories,
  setStatistics,
  setLoading,
}: RunLoadEffectParams<TMenuItem, TStatistics>): void {
  const isInitialLoad = prevMenuIdRef.current === undefined;
  const menuIdChanged = !isInitialLoad && prevMenuIdRef.current !== menuId;

  if (!isInitialLoad && !menuIdChanged) return;
  if (
    isLoadingRef.current &&
    loadPromiseRef.current &&
    !menuIdChanged &&
    prevMenuIdRef.current === menuId
  ) {
    return;
  }

  const currentMenuId = menuId;
  prevMenuIdRef.current = menuId;

  if (menuIdChanged) {
    setMenuItems([]);
    setCategories(['Uncategorized']);
    setStatistics(null);
    setLoading(true);
  } else if (isInitialLoad && initialState.menuItems.length === 0) {
    setLoading(true);
  }

  isLoadingRef.current = true;
  const loadFn = loadMenuDataRef.current;
  const loadPromise = loadFn
    ? loadFn()
        .then(() =>
          logger.dev('[useMenuData] loadMenuData completed successfully', {
            menuId: currentMenuId,
          }),
        )
        .catch(err => {
          logger.error('[useMenuData] loadMenuData failed', {
            menuId: currentMenuId,
            error: err,
            errorMessage: err instanceof Error ? err.message : String(err),
          });
          setLoading(false);
        })
        .finally(() => {
          if (prevMenuIdRef.current === currentMenuId) {
            isLoadingRef.current = false;
            loadPromiseRef.current = null;
          }
        })
    : Promise.resolve();

  loadPromiseRef.current = loadPromise;
}
