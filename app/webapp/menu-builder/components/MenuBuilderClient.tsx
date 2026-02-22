'use client';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { logger } from '@/lib/logger';
import { Menu } from '@/lib/types/menu-builder';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DatabaseErrorBanner } from './MenuBuilderClient/components/DatabaseErrorBanner';
import { ErrorBanner } from './MenuBuilderClient/components/ErrorBanner';
import { useDatabaseCheck } from './MenuBuilderClient/hooks/useDatabaseCheck';
import { useMenuData } from './MenuBuilderClient/hooks/useMenuData';
import { useMenuHandlers } from './MenuBuilderClient/hooks/useMenuHandlers';
import MenuEditor from './MenuEditor';
import MenuForm from './MenuForm';
import MenuList from './MenuList';

interface MenuBuilderClientProps {
  selectedMenu: Menu | null;
  setSelectedMenu: (menu: Menu | null) => void;
  onBack: () => void;
}

type MenuTab = 'a_la_carte' | 'function';

export default function MenuBuilderClient({
  selectedMenu,
  setSelectedMenu,
  onBack,
}: MenuBuilderClientProps) {
  logger.dev('🟡 [MenuBuilderClient] COMPONENT EXECUTING - NEW CODE VERSION', {
    selectedMenuId: selectedMenu?.id,
    timestamp: new Date().toISOString(),
  });

  const {
    menus,
    setMenus,
    loading,
    error,
    setError: _setError,
    fetchMenus,
    cachedMenus,
  } = useMenuData();
  const [activeTab, setActiveTab] = useState<MenuTab>('a_la_carte');
  const { checkingDb, dbError, setDbError, checkDatabaseTables, cachedDbCheck } =
    useDatabaseCheck();
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;
  const hasInitializedRef = useRef(false);

  const {
    handleCreateMenu,
    handleEditMenu,
    handleSelectMenu,
    handleMenuSaved,
    handleMenuUpdated,
    handleDeleteMenu,
    handleBack,
  } = useMenuHandlers({
    menus,
    setMenus,
    selectedMenu,
    setSelectedMenu,
    fetchMenus,
  });

  // Handle fetchMenus result for updating selected menu
  const handleFetchMenusResult = useCallback(
    async (updateSelected: boolean | undefined, showLoading: boolean) => {
      try {
        const result = await fetchMenus(updateSelected, showLoading);
        if (result?.updateSelected && result?.menus && selectedMenu) {
          const updatedMenu = result.menus.find((m: Menu) => m.id === selectedMenu.id);
          if (updatedMenu) {
            logger.dev(`[MenuBuilderClient] fetchMenus - Updating selectedMenu`, {
              oldMenu: selectedMenu,
              newMenu: updatedMenu,
            });
            setSelectedMenu(updatedMenu);
          }
        }
      } catch (err) {
        logger.error('[MenuBuilderClient.tsx] Error in catch block:', {
          error: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
        });

        if (err instanceof Error && err.message === 'DB_ERROR') {
          setDbError('Menu builder tables are not set up. Please run the database migration.');
        }
      }
    },
    [fetchMenus, selectedMenu, setSelectedMenu, setDbError],
  );
  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    // If we have cached DB check result and it's still valid, use it
    if (cachedDbCheck && Date.now() - cachedDbCheck.timestamp <= 5 * 60 * 1000) {
      if (!cachedDbCheck.tablesExist) {
        setDbError('Menu builder tables are not set up. Please run the database migration.');
      }
      // Fetch menus in background if we have cached menus (instant display)
      if (cachedMenus && cachedMenus.length > 0) {
        handleFetchMenusResult(false, false); // Don't show loading, refresh in background
      } else {
        handleFetchMenusResult(false, true); // Show loading if no cached menus
      }
      return;
    }

    // Check database in background while showing cached menus
    const performCheck = async () => {
      const tablesExist = await checkDatabaseTables();
      if (tablesExist) {
        // Fetch menus in background if we have cached menus (instant display)
        if (cachedMenus && cachedMenus.length > 0) {
          handleFetchMenusResult(false, false); // Don't show loading, refresh in background
        } else {
          handleFetchMenusResult(false, true); // Show loading if no cached menus
        }
      }
    };

    performCheck();
  }, [cachedDbCheck, cachedMenus, checkDatabaseTables, handleFetchMenusResult, setDbError]);

  const handleRetryFetch = () => {
    handleFetchMenusResult(false, true);
  };

  const handleCheckAgain = async () => {
    hasInitializedRef.current = false;
    const tablesExist = await checkDatabaseTables();
    if (tablesExist) {
      hasInitializedRef.current = true;
      await handleFetchMenusResult(false, true);
    } else {
      hasInitializedRef.current = true;
    }
  };

  const handleCreateMenuClick = useCallback(() => {
    const result = handleCreateMenu();
    setEditingMenu(result.editingMenu);
    setShowMenuForm(result.showMenuForm);
  }, [handleCreateMenu]);

  const handleEditMenuClick = useCallback(
    (menu: Menu) => {
      const result = handleEditMenu(menu);
      setEditingMenu(result.editingMenu);
      setShowMenuForm(result.showMenuForm);
    },
    [handleEditMenu],
  );

  const handleMenuSavedClick = useCallback(
    (savedMenu: Menu) => {
      const result = handleMenuSaved(savedMenu);
      setShowMenuForm(result.showMenuForm);
      setEditingMenu(result.editingMenu);
    },
    [handleMenuSaved],
  );

  // Log when selectedMenu prop changes
  useEffect(() => {
    if (selectedMenu) {
      logger.dev('[MenuBuilderClient] Rendering MenuEditor with selectedMenu', {
        menuId: selectedMenu.id,
        menuName: selectedMenu.menu_name,
        isLocked: selectedMenu.is_locked,
        lockedAt: selectedMenu.locked_at,
      });
    }
  }, [selectedMenu]);

  // Only show skeleton if we have no cached data AND are checking/loading
  // If we have cached menus, show them immediately even while checking DB
  if ((checkingDb || loading) && (!cachedMenus || cachedMenus.length === 0)) {
    return <PageSkeleton />;
  }

  if (selectedMenu) {
    return <MenuEditor menu={selectedMenu} onBack={handleBack} onMenuUpdated={handleMenuUpdated} />;
  }

  return (
    <div>
      {dbError && <DatabaseErrorBanner dbError={dbError} onCheckAgain={handleCheckAgain} />}
      {error && !dbError && <ErrorBanner error={error} onRetry={handleRetryFetch} />}
      {!dbError && (
        <>
          {/* Tab Bar */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex gap-1 rounded-xl bg-[var(--background)] p-1">
              <button
                onClick={() => setActiveTab('a_la_carte')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === 'a_la_carte'
                    ? 'bg-[var(--muted)] text-[var(--foreground)] shadow-sm'
                    : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                }`}
              >
                A La Carte
              </button>
              <button
                onClick={() => setActiveTab('function')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === 'function'
                    ? 'bg-[var(--muted)] text-[var(--foreground)] shadow-sm'
                    : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
                }`}
              >
                Function Menus
              </button>
            </div>
            <button
              onClick={handleCreateMenuClick}
              className="rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-medium text-[var(--button-active-text)] shadow-lg transition-all duration-200 hover:from-[var(--primary)]/80 hover:to-[var(--accent)]/80 hover:shadow-xl"
            >
              Create New Menu
            </button>
          </div>

          <MenuList
            menus={menus.filter(m =>
              activeTab === 'a_la_carte'
                ? !m.menu_type || m.menu_type === 'a_la_carte'
                : m.menu_type === 'function' ||
                  (m.menu_type && m.menu_type.startsWith('function_')),
            )}
            onSelectMenu={handleSelectMenu}
            onEditMenu={handleEditMenuClick}
            onDeleteMenu={handleDeleteMenu}
            onMenuUpdated={handleMenuUpdated}
            setMenus={setMenus}
          />
        </>
      )}

      {showMenuForm && (
        <MenuForm
          menu={editingMenu}
          onClose={() => {
            setShowMenuForm(false);
            setEditingMenu(null);
          }}
          onSave={handleMenuSavedClick}
        />
      )}
    </div>
  );
}
