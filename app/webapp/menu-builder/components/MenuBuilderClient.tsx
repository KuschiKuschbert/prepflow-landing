'use client';

import { useState, useEffect } from 'react';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import { Menu, MenuStatistics } from '../types';
import MenuList from './MenuList';
import MenuEditor from './MenuEditor';
import MenuForm from './MenuForm';

export default function MenuBuilderClient() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/menus', { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || 'Failed to fetch menus');
        setLoading(false);
      } else {
        setMenus(result.menus || []);
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to fetch menus');
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

  if (loading) {
    return <PageSkeleton />;
  }

  if (selectedMenu) {
    return <MenuEditor menu={selectedMenu} onBack={handleBackToList} onMenuUpdated={fetchMenus} />;
  }

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}

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
