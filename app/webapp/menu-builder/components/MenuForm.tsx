'use client';

import { Icon } from '@/components/ui/Icon';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Menu } from '@/lib/types/menu-builder';
import { logger } from '@/lib/logger';

interface MenuFormProps {
  menu?: Menu | null;
  onClose: () => void;
  onSave: (savedMenu: Menu) => void;
}

export default function MenuForm({ menu, onClose, onSave }: MenuFormProps) {
  const [menuName, setMenuName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (menu) {
      setMenuName(menu.menu_name);
      setDescription(menu.description || '');
    }
  }, [menu]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!menuName) {
      setError('Menu name is required');
      return;
    }

    try {
      const url = menu ? `/api/menus/${menu.id}` : '/api/menus';
      const method = menu ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          menu_name: menuName.trim(),
          description: description.trim() || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.error || result.message || 'Failed to save menu. Give it another go, chef.',
        );
        return;
      }

      if (result.success && result.menu) {
        onSave(result.menu);
      } else {
        setError('Failed to save menu. Give it another go, chef.');
      }
    } catch (err) {
      logger.error('[MenuForm.tsx] Error in catch block:', {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      });

      setError('Failed to save menu. Please check your connection and try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 via-[var(--tertiary)]/20 to-[var(--primary)]/20 p-[1px] shadow-2xl">
        <div className="rounded-2xl bg-[var(--surface)]/95">
          <div className="border-b border-[var(--border)] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[var(--foreground)]">
                {menu ? 'Edit Menu' : 'Create Menu'}
              </h2>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              >
                <Icon icon={X} size="md" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-4 rounded-lg border border-[var(--color-error)]/20 bg-[var(--color-error)]/10 p-4 text-[var(--color-error)]">
                {error}
              </div>
            )}

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
                Menu Name *
              </label>
              <input
                type="text"
                value={menuName}
                onChange={e => setMenuName(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]"
                required
              />
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
                Description
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-medium text-[var(--button-active-text)] transition-all hover:from-[var(--primary)]/80 hover:to-[var(--accent)]/80"
              >
                {menu ? 'Update Menu' : 'Create Menu'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
