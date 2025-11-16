'use client';

import { useState, useEffect } from 'react';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { Menu, MenuStatistics } from '../types';
import MenuList from './MenuList';
import MenuEditor from './MenuEditor';
import MenuForm from './MenuForm';
import { Icon } from '@/components/ui/Icon';
import { AlertCircle, Database, RefreshCw } from 'lucide-react';

export default function MenuBuilderClient() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingDb, setCheckingDb] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dbError, setDbError] = useState<string | null>(null);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);

  useEffect(() => {
    checkDatabaseTables();
  }, []);

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
      await fetchMenus();
    } catch (err) {
      setDbError('Failed to check database tables. Please try again.');
      setCheckingDb(false);
    }
  };

  const fetchMenus = async () => {
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
        setMenus(result.menus || []);
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to fetch menus. Please check your connection and try again.');
      setLoading(false);
    }
  };

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

  const handleMenuSaved = () => {
    setShowMenuForm(false);
    setEditingMenu(null);
    fetchMenus();
  };

  const handleBackToList = () => {
    setSelectedMenu(null);
    fetchMenus();
  };

  if (checkingDb || loading) {
    return <PageSkeleton />;
  }

  if (selectedMenu) {
    return <MenuEditor menu={selectedMenu} onBack={handleBackToList} onMenuUpdated={fetchMenus} />;
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
                  <li>Click "New query"</li>
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
                onClick={fetchMenus}
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
            onDeleteMenu={fetchMenus}
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
