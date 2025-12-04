'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { Menu } from '../types';

interface MenuFormProps {
  menu?: Menu | null;
  onClose: () => void;
  onSave: (savedMenu: Menu) => void;
}

export default function MenuForm({ menu, onClose, onSave }: MenuFormProps) {
  const [menuName, setMenuName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (menu) {
      setMenuName(menu.menu_name);
      setDescription(menu.description || '');
    }
  }, [menu]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!menuName) {
      setError('Menu name is required');
      setLoading(false);
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
        setError(result.error || result.message || 'Failed to save menu. Please try again.');
        setLoading(false);
        return;
      }

      if (result.success && result.menu) {
        onSave(result.menu);
      } else {
        setError('Failed to save menu. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to save menu. Please check your connection and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-gradient-to-r from-[#29E7CD]/20 via-[#D925C7]/20 via-[#FF6B00]/20 to-[#29E7CD]/20 p-[1px] shadow-2xl">
        <div className="rounded-2xl bg-[#1f1f1f]/95">
          <div className="border-b border-[#2a2a2a] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {menu ? 'Edit Menu' : 'Create Menu'}
              </h2>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
              >
                <Icon icon={X} size="md" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
                {error}
              </div>
            )}

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-300">Menu Name *</label>
              <input
                type="text"
                value={menuName}
                onChange={e => setMenuName(e.target.value)}
                className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]"
                required
              />
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-300">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] px-6 py-3 text-white transition-colors hover:bg-[#2a2a2a]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-medium text-white transition-all hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 disabled:opacity-50"
              >
                {loading ? 'Saving...' : menu ? 'Update Menu' : 'Create Menu'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
