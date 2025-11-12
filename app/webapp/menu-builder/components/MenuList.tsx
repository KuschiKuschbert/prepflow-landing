'use client';

import { Menu } from '../types';
import { Edit, Trash2, FileText } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

interface MenuListProps {
  menus: Menu[];
  onSelectMenu: (menu: Menu) => void;
  onEditMenu: (menu: Menu) => void;
  onDeleteMenu: () => void;
}

export default function MenuList({ menus, onSelectMenu, onEditMenu, onDeleteMenu }: MenuListProps) {
  const handleDelete = async (menu: Menu) => {
    if (!confirm(`Are you sure you want to delete "${menu.menu_name}"?`)) return;

    try {
      const response = await fetch(`/api/menus/${menu.id}`, { method: 'DELETE' });
      if (response.ok) {
        onDeleteMenu();
      }
    } catch (err) {
      console.error('Failed to delete menu:', err);
    }
  };

  if (menus.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 flex justify-center">
          <Icon icon={FileText} size="xl" className="text-gray-400" aria-hidden={true} />
        </div>
        <h3 className="mb-2 text-lg font-medium text-white">No menus yet</h3>
        <p className="mb-4 text-gray-500">Create your first menu to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {menus.map(menu => (
        <div
          key={menu.id}
          className="group cursor-pointer rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 transition-all hover:border-[#29E7CD]/50 hover:shadow-lg"
          onClick={() => onSelectMenu(menu)}
        >
          <div className="mb-4 flex items-start justify-between">
            <h3 className="text-lg font-semibold text-white">{menu.menu_name}</h3>
            <div className="flex gap-2" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => onEditMenu(menu)}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-[#29E7CD]"
              >
                <Icon icon={Edit} size="sm" />
              </button>
              <button
                onClick={() => handleDelete(menu)}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-red-400"
              >
                <Icon icon={Trash2} size="sm" />
              </button>
            </div>
          </div>
          {menu.description && <p className="mb-4 text-sm text-gray-400">{menu.description}</p>}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{menu.items_count || 0} dishes</span>
            <span>{new Date(menu.updated_at).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
