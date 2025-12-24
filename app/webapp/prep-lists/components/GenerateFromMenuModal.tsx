'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/useTranslation';
import { Icon } from '@/components/ui/Icon';
import { X, ChefHat, Loader2 } from 'lucide-react';
import type { Menu, GeneratedPrepListData } from '../types';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
interface GenerateFromMenuModalProps {
  onClose: () => void;
  onGenerate: (data: GeneratedPrepListData) => void;
}

export function GenerateFromMenuModal({ onClose, onGenerate }: GenerateFromMenuModalProps) {
  const { t } = useTranslation();
  const { showError } = useNotification();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenuId, setSelectedMenuId] = useState<string>('');
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
      showError('Please select a menu');
      return;
    }

    // Store original state for rollback
    const menuIdToGenerate = selectedMenuId;
    const originalSelectedMenuId = selectedMenuId;

    // Optimistically close modal and clear selection (parent handles optimistic update)
    setSelectedMenuId('');
    setError(null);

    try {
      const response = await fetch('/api/prep-lists/generate-from-menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuId: menuIdToGenerate }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        onGenerate(result as GeneratedPrepListData);
        onClose();
      } else {
        // Error - restore selection and show error
        setSelectedMenuId(originalSelectedMenuId);
        const errorMessage =
          (result as { message?: string }).message || 'Failed to generate prep list';
        setError(errorMessage);
        showError(errorMessage);
      }
    } catch (err) {
      // Error - restore selection and show error
      setSelectedMenuId(originalSelectedMenuId);
      logger.error('Error generating prep list:', err);
      const errorMessage = 'Failed to generate prep list. Please try again.';
      setError(errorMessage);
      showError(errorMessage);
    }
  };

  const selectedMenu = menus.find(m => m.id === selectedMenuId);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 via-[var(--tertiary)]/20 to-[var(--primary)]/20 p-[1px]">
        <div className="rounded-3xl bg-[var(--surface)]/95 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20">
                <Icon
                  icon={ChefHat}
                  size="md"
                  className="text-[var(--primary)]"
                  aria-hidden={true}
                />
              </div>
              <h2 className="text-xl font-semibold text-[var(--button-active-text)]">
                {t('prepLists.generateFromMenu', 'Generate Prep List from Menu')}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
              aria-label="Close"
            >
              <Icon icon={X} size="md" aria-hidden={true} />
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-[var(--color-error)]/20 bg-[var(--color-error)]/10 p-3">
              <p className="text-sm text-[var(--color-error)]">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
                {t('prepLists.selectMenu', 'Select Menu')}
              </label>
              {fetchingMenus ? (
                <div className="flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-[var(--primary)]" />
                  <span className="ml-2 text-sm text-[var(--foreground-muted)]">
                    Loading menus...
                  </span>
                </div>
              ) : menus.length === 0 ? (
                <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-8 text-center">
                  <p className="text-sm text-[var(--foreground-muted)]">
                    No menus found. Create a menu first.
                  </p>
                </div>
              ) : (
                <select
                  value={selectedMenuId}
                  onChange={e => {
                    setSelectedMenuId(e.target.value);
                    setError(null);
                  }}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
                >
                  <option value="">
                    {t('prepLists.selectMenuPlaceholder', 'Choose a menu...')}
                  </option>
                  {menus.map(menu => (
                    <option key={menu.id} value={menu.id}>
                      {menu.menu_name} {menu.items_count ? `(${menu.items_count} items)` : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {selectedMenu && (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-4">
                <p className="text-sm text-[var(--foreground-muted)]">
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
              className="flex-1 rounded-xl bg-[var(--muted)] px-4 py-3 text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--muted)]/80"
            >
              {t('prepLists.cancel', 'Cancel')}
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!selectedMenuId || fetchingMenus}
              className="flex-1 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-4 py-3 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t('prepLists.generate', 'Generate Prep List')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
