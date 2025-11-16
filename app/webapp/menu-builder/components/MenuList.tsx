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
    if (
      !confirm(`Are you sure you want to delete "${menu.menu_name}"? This action cannot be undone.`)
    )
      return;

    try {
      const response = await fetch(`/api/menus/${menu.id}`, { method: 'DELETE' });
      const result = await response.json();

      if (response.ok) {
        onDeleteMenu();
      } else {
        alert(`Failed to delete menu: ${result.error || result.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Failed to delete menu:', err);
      alert('Failed to delete menu. Please try again.');
    }
  };

  if (menus.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-gradient-to-r from-[#29E7CD]/20 to-[#D925C7]/20 p-6">
            <Icon icon={FileText} size="xl" className="text-[#29E7CD]" aria-hidden={true} />
          </div>
        </div>
        <h3 className="mb-3 text-2xl font-semibold text-white">No menus yet</h3>
        <p className="mx-auto mb-6 max-w-md text-gray-400">
          Create your first menu to organize your dishes into categories. You can drag and drop
          dishes from your recipe collection into menu categories.
        </p>
        <div className="mx-auto max-w-md rounded-lg border border-[#2a2a2a] bg-[#1f1f1f]/50 p-4">
          <p className="mb-2 text-sm text-gray-300">
            💡 <strong>Tip:</strong> Before creating a menu, make sure you have:
          </p>
          <ul className="ml-6 list-disc space-y-1 text-left text-sm text-gray-400">
            <li>
              Created some dishes in the <strong>Dish Builder</strong>
            </li>
            <li>Or linked recipes to dishes</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="tablet:grid-cols-2 desktop:grid-cols-3 grid gap-4">
      {menus.map(menu => (
        <div
          key={menu.id}
          className="group cursor-pointer rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 transition-all hover:border-[#29E7CD]/50 hover:shadow-lg"
          onClick={() => onSelectMenu(menu)}
        >
          <div className="mb-4 flex items-start justify-between">
            <h3 className="text-fluid-lg font-semibold text-white">{menu.menu_name}</h3>
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
