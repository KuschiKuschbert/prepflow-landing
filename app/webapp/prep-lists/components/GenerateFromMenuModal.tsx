'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { Icon } from '@/components/ui/Icon';
import { X, ChefHat, Loader2 } from 'lucide-react';
import type { Menu, GeneratedPrepListData } from '../types';

import { logger } from '@/lib/logger';
interface GenerateFromMenuModalProps {
  onClose: () => void;
  onGenerate: (data: GeneratedPrepListData) => void;
}

export function GenerateFromMenuModal({ onClose, onGenerate }: GenerateFromMenuModalProps) {
  const { t } = useTranslation();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenuId, setSelectedMenuId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [fetchingMenus, setFetchingMenus] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      setFetchingMenus(true);
      const response = await fetch('/api/menus');
      const result = await response.json();

      if (result.success && result.menus) {
        setMenus(result.menus);
      } else {
        setError(result.message || 'Failed to fetch menus');
      }
    } catch (err) {
      setError('Failed to fetch menus');
      logger.error('Error fetching menus:', err);
    } finally {
      setFetchingMenus(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedMenuId) {
      setError('Please select a menu');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/prep-lists/generate-from-menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuId: selectedMenuId }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        onGenerate(result as GeneratedPrepListData);
        onClose();
      } else {
        setError((result as { message?: string }).message || 'Failed to generate prep list');
      }
    } catch (err) {
      setError('Failed to generate prep list');
      logger.error('Error generating prep list:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectedMenu = menus.find(m => m.id === selectedMenuId);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20">
              <Icon icon={ChefHat} size="md" className="text-[#29E7CD]" aria-hidden={true} />
            </div>
            <h2 className="text-xl font-semibold text-white">
              {t('prepLists.generateFromMenu', 'Generate Prep List from Menu')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 transition-colors hover:text-white"
            aria-label="Close"
          >
            <Icon icon={X} size="md" aria-hidden={true} />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              {t('prepLists.selectMenu', 'Select Menu')}
            </label>
            {fetchingMenus ? (
              <div className="flex items-center justify-center rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-8">
                <Loader2 className="h-5 w-5 animate-spin text-[#29E7CD]" />
                <span className="ml-2 text-sm text-gray-400">Loading menus...</span>
              </div>
            ) : menus.length === 0 ? (
              <div className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-8 text-center">
                <p className="text-sm text-gray-400">No menus found. Create a menu first.</p>
              </div>
            ) : (
              <select
                value={selectedMenuId}
                onChange={e => {
                  setSelectedMenuId(e.target.value);
                  setError(null);
                }}
                className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              >
                <option value="">{t('prepLists.selectMenuPlaceholder', 'Choose a menu...')}</option>
                {menus.map(menu => (
                  <option key={menu.id} value={menu.id}>
                    {menu.menu_name} {menu.items_count ? `(${menu.items_count} items)` : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          {selectedMenu && (
            <div className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-4">
              <p className="text-sm text-gray-400">
                {t(
                  'prepLists.menuInfo',
                  'This will generate prep lists for all recipes and dishes in the selected menu, grouped by kitchen section.',
                )}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl bg-[#2a2a2a] px-4 py-3 text-gray-300 transition-colors hover:bg-[#2a2a2a]/80"
          >
            {t('prepLists.cancel', 'Cancel')}
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!selectedMenuId || loading || fetchingMenus}
            className="flex-1 rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-3 font-semibold text-white transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('prepLists.generating', 'Generating...')}
              </span>
            ) : (
              t('prepLists.generate', 'Generate Prep List')
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
