'use client';

import { Icon } from '@/components/ui/Icon';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { AlertCircle, Database, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Menu } from '../types';
import MenuEditor from './MenuEditor';
import MenuForm from './MenuForm';
import MenuList from './MenuList';

interface MenuBuilderClientProps {
  selectedMenu: Menu | null;
  setSelectedMenu: (menu: Menu | null) => void;
  onBack: () => void;
}

export default function MenuBuilderClient({
  selectedMenu,
  setSelectedMenu,
  onBack,
}: MenuBuilderClientProps) {
  // Initialize with cached data for instant display
  const cachedMenus = getCachedData<Menu[]>('menu_builder_menus');
  const [menus, setMenus] = useState<Menu[]>(cachedMenus || []);
  const [loading, setLoading] = useState(!cachedMenus);
  const [checkingDb, setCheckingDb] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dbError, setDbError] = useState<string | null>(null);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);

  // Use refs to access props without including them in dependencies
  // Update refs synchronously during render (safe - doesn't cause re-renders)
  const selectedMenuRef = useRef<Menu | null>(selectedMenu);
  const setSelectedMenuRef = useRef(setSelectedMenu);
  const onBackRef = useRef(onBack);

  // Update refs synchronously (this is safe and doesn't cause re-renders)
  selectedMenuRef.current = selectedMenu;
  setSelectedMenuRef.current = setSelectedMenu;
  onBackRef.current = onBack;

  // Use ref to track if we've initialized to prevent infinite loops
  const hasInitializedRef = useRef(false);

  const fetchMenus = useCallback(
    async (updateSelected?: boolean) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/menus', { cache: 'no-store' });
        const result = await response.json();
        if (!response.ok) {
          // Check if it's a table missing error
          if (result.error?.includes('relation') || result.error?.includes('does not exist')) {
            setDbError('Menu builder tables are not set up. Please run the database migration.');
          } else {
            setError(result.error || result.message || 'Failed to fetch menus');
          }
          setLoading(false);
        } else {
          const updatedMenus = result.menus || [];
          setMenus(updatedMenus);

          // Cache menus for instant display next time
          cacheData('menu_builder_menus', updatedMenus);

          // Update selectedMenu if it exists to reflect any changes (only when explicitly requested)
          if (updateSelected && selectedMenuRef.current) {
            const updatedMenu = updatedMenus.find((m: Menu) => m.id === selectedMenuRef.current?.id);
            if (updatedMenu) {
              setSelectedMenuRef.current(updatedMenu);
            }
          }

          setLoading(false);
        }
      } catch (err) {
        setError('Failed to fetch menus. Please check your connection and try again.');
        setLoading(false);
      }
    },
    [], // Empty deps - use refs for setSelectedMenu and selectedMenu
  );

  // Initialize on mount only - inline function to avoid dependency issues
  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    const checkDatabaseTables = async () => {
      setCheckingDb(true);
      setDbError(null);
      try {
        const response = await fetch('/api/setup-menu-builder', {
          method: 'POST',
          cache: 'no-store',
        });
        const result = await response.json();

        if (!result.success || !result.tablesExist) {
          setDbError(
            result.message ||
              'Menu builder tables are not set up. Please run the database migration.',
          );
          setCheckingDb(false);
          return;
        }

        // Tables exist, fetch menus
        setCheckingDb(false);
        await fetchMenus(false);
      } catch (err) {
        setDbError('Failed to check database tables. Please try again.');
        setCheckingDb(false);
      }
    };

    checkDatabaseTables();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount - fetchMenus uses refs internally

  const handleCreateMenu = useCallback(() => {
    setEditingMenu(null);
    setShowMenuForm(true);
  }, []);

  const handleEditMenu = useCallback((menu: Menu) => {
    setEditingMenu(menu);
    setShowMenuForm(true);
  }, []);

  const handleSelectMenu = useCallback((menu: Menu) => {
    // Only update if menu has actually changed to prevent unnecessary re-renders
    if (selectedMenuRef.current?.id !== menu.id) {
      setSelectedMenuRef.current(menu);
    }
  }, []);

  const handleMenuSaved = useCallback((savedMenu: Menu) => {
    setShowMenuForm(false);
    setEditingMenu(null);

    // Optimistically update menus list
    setMenus(prevMenus => {
      // Check if this is an update or new menu by looking for existing menu
      const existingIndex = prevMenus.findIndex(m => m.id === savedMenu.id);
      if (existingIndex >= 0) {
        // Update existing menu
        const updated = prevMenus.map(m => (m.id === savedMenu.id ? savedMenu : m));
        // Update selected menu if it's the one being edited and has actually changed
        if (selectedMenuRef.current?.id === savedMenu.id) {
          // Only update if the menu data has actually changed
          const currentMenu = selectedMenuRef.current;
          if (
            currentMenu.menu_name !== savedMenu.menu_name ||
            currentMenu.description !== savedMenu.description ||
            currentMenu.updated_at !== savedMenu.updated_at
          ) {
            setSelectedMenuRef.current(savedMenu);
          }
        }
        return updated;
      } else {
        // Add new menu
        return [...prevMenus, savedMenu];
      }
    });
  }, []);

  const handleMenuUpdated = useCallback(() => {
    // Refresh menu list to get updated lock status and other changes
    // This is called from MenuEditor when menu data changes (e.g., locking/unlocking)
    fetchMenus(false);
  }, [fetchMenus]);

  const handleDeleteMenu = useCallback((deletedMenuId: string) => {
    // Optimistically remove menu (already done in MenuList)
    // If the deleted menu was selected, go back to list
    if (selectedMenuRef.current?.id === deletedMenuId) {
      setSelectedMenuRef.current(null);
    }
  }, []);

  const handleRetryFetch = useCallback(() => {
    fetchMenus();
  }, [fetchMenus]);

  const handleCheckAgain = useCallback(() => {
    hasInitializedRef.current = false;
    const checkDatabaseTables = async () => {
      setCheckingDb(true);
      setDbError(null);
      try {
        const response = await fetch('/api/setup-menu-builder', {
          method: 'POST',
          cache: 'no-store',
        });
        const result = await response.json();

        if (!result.success || !result.tablesExist) {
          setDbError(
            result.message ||
              'Menu builder tables are not set up. Please run the database migration.',
          );
          setCheckingDb(false);
          hasInitializedRef.current = true;
          return;
        }

        // Tables exist, fetch menus
        setCheckingDb(false);
        hasInitializedRef.current = true;
        await fetchMenus(false);
      } catch (err) {
        setDbError('Failed to check database tables. Please try again.');
        setCheckingDb(false);
        hasInitializedRef.current = true;
      }
    };
    checkDatabaseTables();
  }, [fetchMenus]);

  // Stabilize onBack callback to prevent re-renders
  const handleBack = useCallback(() => {
    onBackRef.current();
    // Refresh menu list when navigating back to ensure lock status is up to date
    fetchMenus(false);
  }, [fetchMenus]);

  if (checkingDb || loading) {
    return <PageSkeleton />;
  }

  if (selectedMenu) {
    return (
      <MenuEditor
        menu={selectedMenu}
        onBack={handleBack}
        onMenuUpdated={handleMenuUpdated}
      />
    );
  }

  return (
    <div>
      {/* Database Setup Error */}
      {dbError && (
        <div className="mb-6 rounded-xl border border-yellow-500/30 bg-yellow-900/20 p-6">
          <div className="mb-4 flex items-start gap-3">
            <Icon icon={Database} size="lg" className="mt-0.5 text-yellow-400" />
            <div className="flex-1">
              <h3 className="mb-2 text-lg font-semibold text-yellow-400">
                Database Setup Required
              </h3>
              <p className="mb-4 text-sm text-yellow-300">{dbError}</p>
              <div className="mb-4 rounded-lg border border-yellow-500/20 bg-yellow-900/10 p-4">
                <p className="mb-2 text-sm font-medium text-yellow-200">
                  To set up the menu builder:
                </p>
                <ol className="ml-4 list-decimal space-y-1 text-sm text-yellow-300">
                  <li>Open your Supabase project dashboard</li>
                  <li>Go to SQL Editor (left sidebar)</li>
                  <li>Click &quot;New query&quot;</li>
                  <li>
                    Copy the SQL from{' '}
                    <code className="rounded bg-yellow-900/30 px-1.5 py-0.5 text-xs">
                      menu-builder-schema.sql
                    </code>{' '}
                    in the project root
                  </li>
                  <li>Paste and run the SQL in Supabase SQL Editor</li>
                  <li>Click the refresh button below to verify</li>
                </ol>
              </div>
              <button
                onClick={handleCheckAgain}
                className="flex items-center gap-2 rounded-lg border border-yellow-500/30 bg-yellow-900/20 px-4 py-2 text-sm font-medium text-yellow-300 transition-colors hover:bg-yellow-900/30"
              >
                <Icon icon={RefreshCw} size="sm" />
                Check Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* General Error */}
      {error && !dbError && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
          <div className="flex items-start gap-3">
            <Icon icon={AlertCircle} size="md" className="mt-0.5 text-red-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-400">{error}</p>
              <button
                onClick={handleRetryFetch}
                className="mt-3 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-900/20 px-3 py-1.5 text-xs font-medium text-red-300 transition-colors hover:bg-red-900/30"
              >
                <Icon icon={RefreshCw} size="xs" />
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!dbError && (
        <>
          <div className="mb-6 flex justify-end">
            <button
              onClick={handleCreateMenu}
              className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 hover:shadow-xl"
            >
              Create New Menu
            </button>
          </div>

          <MenuList
            menus={menus}
            onSelectMenu={handleSelectMenu}
            onEditMenu={handleEditMenu}
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
          onSave={handleMenuSaved}
        />
      )}
    </div>
  );
}
