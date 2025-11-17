'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { Menu, MenuStatistics } from '../types';
import MenuList from './MenuList';
import MenuEditor from './MenuEditor';
import MenuForm from './MenuForm';
import { Icon } from '@/components/ui/Icon';
import { AlertCircle, Database, RefreshCw } from 'lucide-react';

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
          if (updateSelected && selectedMenu) {
            const updatedMenu = updatedMenus.find((m: Menu) => m.id === selectedMenu.id);
            if (updatedMenu) {
              setSelectedMenu(updatedMenu);
            }
          }

          setLoading(false);
        }
      } catch (err) {
        setError('Failed to fetch menus. Please check your connection and try again.');
        setLoading(false);
      }
    },
    [selectedMenu, setSelectedMenu],
  );

  const checkDatabaseTables = useCallback(async () => {
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
  }, [fetchMenus]);

  useEffect(() => {
    checkDatabaseTables();
  }, [checkDatabaseTables]);

  const handleCreateMenu = () => {
    setEditingMenu(null);
    setShowMenuForm(true);
  };

  const handleEditMenu = (menu: Menu) => {
    setEditingMenu(menu);
    setShowMenuForm(true);
  };

  const handleSelectMenu = (menu: Menu) => {
    setSelectedMenu(menu);
  };

  const handleMenuSaved = (savedMenu: Menu) => {
    setShowMenuForm(false);
    setEditingMenu(null);

    // Optimistically update menus list
    if (editingMenu) {
      // Update existing menu
      setMenus(prevMenus => prevMenus.map(m => (m.id === savedMenu.id ? savedMenu : m)));
      // Update selected menu if it's the one being edited
      if (selectedMenu?.id === savedMenu.id) {
        setSelectedMenu(savedMenu);
      }
    } else {
      // Add new menu
      setMenus(prevMenus => [...prevMenus, savedMenu]);
    }
  };

  const handleMenuUpdated = () => {
    // MenuEditor handles its own optimistic updates
    // We just need to update the selected menu if it exists
    // This is called from MenuEditor when menu data changes
    // We can refresh the selected menu optimistically if needed
    // For now, MenuEditor manages its own state, so we don't need to do anything
  };

  if (checkingDb || loading) {
    return <PageSkeleton />;
  }

  if (selectedMenu) {
    return <MenuEditor menu={selectedMenu} onBack={onBack} onMenuUpdated={handleMenuUpdated} />;
  }

  // Capture selectedMenu.id for use in callbacks (TypeScript type narrowing fix)
  // After early return, TypeScript narrows selectedMenu to null, so we use type assertion
  const selectedMenuId = (selectedMenu as Menu | null)?.id;

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
                onClick={checkDatabaseTables}
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
                onClick={() => fetchMenus()}
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
            onDeleteMenu={(deletedMenuId: string) => {
              // Optimistically remove menu (already done in MenuList)
              // If the deleted menu was selected, go back to list
              if (selectedMenuId === deletedMenuId) {
                setSelectedMenu(null);
              }
            }}
            onMenuUpdated={() => {
              // Menu updates are handled optimistically in MenuEditor
            }}
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
