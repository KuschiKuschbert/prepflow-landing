'use client';

import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Icon } from '@/components/ui/Icon';
import { useNotification } from '@/contexts/NotificationContext';
import { Check, Edit2, FileText, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Menu } from '../types';

import { logger } from '@/lib/logger';
interface MenuListProps {
  menus: Menu[];
  onSelectMenu: (menu: Menu) => void;
  onEditMenu: (menu: Menu) => void;
  onDeleteMenu: (deletedMenuId: string) => void;
  onMenuUpdated?: () => void;
  setMenus?: (menus: Menu[] | ((prev: Menu[]) => Menu[])) => void;
}

export default function MenuList({
  menus,
  onSelectMenu,
  onEditMenu,
  onDeleteMenu,
  onMenuUpdated,
  setMenus,
}: MenuListProps) {
  const { showError, showSuccess } = useNotification();
  const [menuToDelete, setMenuToDelete] = useState<Menu | null>(null);
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<'title' | 'description' | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  const handleDeleteClick = (menu: Menu) => {
    setMenuToDelete(menu);
  };

  // Focus inputs when editing starts
  useEffect(() => {
    if (editingField === 'title' && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [editingField]);

  useEffect(() => {
    if (editingField === 'description' && descriptionInputRef.current) {
      descriptionInputRef.current.focus();
      descriptionInputRef.current.select();
    }
  }, [editingField]);

  const handleStartEditTitle = (menu: Menu, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingMenuId(menu.id);
    setEditingField('title');
    setEditTitle(menu.menu_name);
  };

  const handleStartEditDescription = (menu: Menu, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingMenuId(menu.id);
    setEditingField('description');
    setEditDescription(menu.description || '');
  };

  const handleCancelEdit = () => {
    setEditingMenuId(null);
    setEditingField(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleSaveTitle = async (menu: Menu) => {
    const trimmedTitle = editTitle.trim();

    if (!trimmedTitle) {
      showError('Menu name cannot be empty');
      handleCancelEdit();
      return;
    }

    if (trimmedTitle === menu.menu_name) {
      handleCancelEdit();
      return;
    }

    // Store original state for rollback
    const originalMenu = { ...menu };

    // Optimistically update UI immediately
    if (setMenus) {
      setMenus(prevMenus =>
        prevMenus.map(m => (m.id === menu.id ? { ...m, menu_name: trimmedTitle } : m)),
      );
    }
    handleCancelEdit();

    setIsSaving(true);
    try {
      const response = await fetch(`/api/menus/${menu.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          menu_name: trimmedTitle,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showSuccess('Menu name updated');
        if (onMenuUpdated) onMenuUpdated();
      } else {
        // Revert optimistic update on error
        if (setMenus) {
          setMenus(prevMenus => prevMenus.map(m => (m.id === menu.id ? originalMenu : m)));
        }
        showError(
          `Failed to update menu name: ${result.error || result.message || 'Unknown error'}`,
        );
        setEditTitle(menu.menu_name);
      }
    } catch (err) {
      // Revert optimistic update on error
      if (setMenus) {
        setMenus(prevMenus => prevMenus.map(m => (m.id === menu.id ? originalMenu : m)));
      }
      logger.error('Failed to update menu name:', err);
      showError('Failed to update menu name. Please check your connection and try again.');
      setEditTitle(menu.menu_name);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDescription = async (menu: Menu) => {
    const trimmedDescription = editDescription.trim();
    const currentDescription = menu.description || '';

    if (trimmedDescription === currentDescription) {
      handleCancelEdit();
      return;
    }

    // Store original state for rollback
    const originalMenu = { ...menu };

    // Optimistically update UI immediately
    if (setMenus) {
      setMenus(prevMenus =>
        prevMenus.map(m =>
          m.id === menu.id ? { ...m, description: trimmedDescription || undefined } : m,
        ),
      );
    }
    handleCancelEdit();

    setIsSaving(true);
    try {
      const response = await fetch(`/api/menus/${menu.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: trimmedDescription || null,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showSuccess('Menu description updated');
        if (onMenuUpdated) onMenuUpdated();
      } else {
        // Revert optimistic update on error
        if (setMenus) {
          setMenus(prevMenus => prevMenus.map(m => (m.id === menu.id ? originalMenu : m)));
        }
        showError(
          `Failed to update description: ${result.error || result.message || 'Unknown error'}`,
        );
        setEditDescription(menu.description || '');
      }
    } catch (err) {
      // Revert optimistic update on error
      if (setMenus) {
        setMenus(prevMenus => prevMenus.map(m => (m.id === menu.id ? originalMenu : m)));
      }
      logger.error('Failed to update description:', err);
      showError('Failed to update description. Please check your connection and try again.');
      setEditDescription(menu.description || '');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, menu: Menu) => {
    if (e.key === 'Enter') {
      handleSaveTitle(menu);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      handleCancelEdit();
    }
    // Allow Enter for multi-line descriptions
  };

  const confirmDelete = async () => {
    if (!menuToDelete) return;

    // Store original state for rollback
    const originalMenus = [...menus];
    const menuIdToDelete = menuToDelete.id;

    // Optimistically remove from UI immediately
    if (setMenus) {
      setMenus(prevMenus => prevMenus.filter(m => m.id !== menuIdToDelete));
    }

    try {
      const response = await fetch(`/api/menus/${menuIdToDelete}`, { method: 'DELETE' });
      const result = await response.json();

      if (response.ok) {
        setMenuToDelete(null);
        showSuccess('Menu deleted successfully');
        // Call onDeleteMenu with the deleted menu ID for parent component cleanup
        onDeleteMenu(menuIdToDelete);
      } else {
        // Revert optimistic update on error
        if (setMenus) {
          setMenus(originalMenus);
        }
        const errorMsg = result.error || result.message || 'Unknown error';
        showError(`Failed to delete menu: ${errorMsg}`);
        setMenuToDelete(null);
      }
    } catch (err) {
      // Revert optimistic update on error
      if (setMenus) {
        setMenus(originalMenus);
      }
      logger.error('Failed to delete menu:', err);
      showError('Failed to delete menu. Something went wrong - please try again.');
      setMenuToDelete(null);
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
    <div className="tablet:grid-cols-2 desktop:grid-cols-3 grid gap-4 overflow-visible">
      {menus.map(menu => {
        const isEditingThisMenu = editingMenuId === menu.id;
        const isEditingTitle = isEditingThisMenu && editingField === 'title';
        const isEditingDescription = isEditingThisMenu && editingField === 'description';

        return (
          <div
            key={menu.id}
            className="group relative cursor-pointer overflow-visible rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 transition-all hover:border-[#29E7CD]/50 hover:shadow-lg"
            onClick={() => {
              if (!isEditingThisMenu) {
                onSelectMenu(menu);
              }
            }}
          >
            {/* Editable Title */}
            <div className="mb-4 flex items-start gap-2 overflow-visible">
              {isEditingTitle ? (
                <div className="flex w-full min-w-0 items-center gap-2">
                  <input
                    ref={titleInputRef}
                    type="text"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    onKeyDown={e => handleTitleKeyDown(e, menu)}
                    disabled={isSaving}
                    onClick={e => e.stopPropagation()}
                    className="min-w-0 flex-1 rounded-lg border border-[#29E7CD] bg-[#0a0a0a] px-3 py-1.5 text-base font-semibold text-white focus:ring-2 focus:ring-[#29E7CD] focus:outline-none disabled:opacity-50"
                    style={{ maxWidth: 'calc(100% - 80px)' }}
                  />
                  <div className="ml-auto flex shrink-0 gap-1.5">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleSaveTitle(menu);
                      }}
                      disabled={isSaving}
                      className="shrink-0 rounded-lg bg-[#29E7CD] p-1.5 text-black transition-colors hover:bg-[#29E7CD]/80 disabled:opacity-50"
                      aria-label="Save menu name"
                    >
                      <Icon icon={Check} size="sm" />
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleCancelEdit();
                      }}
                      disabled={isSaving}
                      className="shrink-0 rounded-lg bg-[#2a2a2a] p-1.5 text-gray-400 transition-colors hover:bg-[#3a3a3a] hover:text-white disabled:opacity-50"
                      aria-label="Cancel editing"
                    >
                      <Icon icon={X} size="sm" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3
                    className="text-fluid-lg flex-1 font-semibold text-white"
                    onDoubleClick={e => handleStartEditTitle(menu, e)}
                  >
                    {menu.menu_name}
                  </h3>
                  <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={e => handleStartEditTitle(menu, e)}
                      className="rounded-lg p-2 text-gray-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-[#2a2a2a] hover:text-[#29E7CD]"
                      aria-label={`Edit menu name "${menu.menu_name}"`}
                      title="Double-click or click edit to rename"
                    >
                      <Icon icon={Edit2} size="sm" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(menu)}
                      className="rounded-lg p-2 text-gray-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-[#2a2a2a] hover:text-red-400"
                    >
                      <Icon icon={Trash2} size="sm" />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Editable Description */}
            <div className="mb-4 overflow-visible">
              {isEditingDescription ? (
                <div className="flex min-w-0 items-start gap-2">
                  <textarea
                    ref={descriptionInputRef}
                    value={editDescription}
                    onChange={e => setEditDescription(e.target.value)}
                    onKeyDown={handleDescriptionKeyDown}
                    disabled={isSaving}
                    onClick={e => e.stopPropagation()}
                    rows={2}
                    placeholder="Add a description for this menu..."
                    className="min-w-0 flex-1 rounded-lg border border-[#29E7CD] bg-[#0a0a0a] px-3 py-2 text-sm text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-[#29E7CD] focus:outline-none disabled:opacity-50"
                  />
                  <div className="flex shrink-0 flex-col gap-2">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleSaveDescription(menu);
                      }}
                      disabled={isSaving}
                      className="shrink-0 rounded-lg bg-[#29E7CD] p-1.5 text-black transition-colors hover:bg-[#29E7CD]/80 disabled:opacity-50"
                      aria-label="Save description"
                    >
                      <Icon icon={Check} size="sm" />
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleCancelEdit();
                      }}
                      disabled={isSaving}
                      className="shrink-0 rounded-lg bg-[#2a2a2a] p-1.5 text-gray-400 transition-colors hover:bg-[#3a3a3a] hover:text-white disabled:opacity-50"
                      aria-label="Cancel editing"
                    >
                      <Icon icon={X} size="sm" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="flex items-start gap-2"
                  onDoubleClick={e => handleStartEditDescription(menu, e)}
                >
                  {menu.description ? (
                    <p className="flex-1 text-sm text-gray-400">{menu.description}</p>
                  ) : (
                    <p className="flex-1 text-sm text-gray-500 italic">
                      No description. Double-click to add one.
                    </p>
                  )}
                  <button
                    onClick={e => handleStartEditDescription(menu, e)}
                    className="rounded-lg p-1.5 text-gray-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-[#2a2a2a] hover:text-[#29E7CD]"
                    aria-label="Edit menu description"
                    title="Double-click or click edit to add/edit description"
                  >
                    <Icon icon={Edit2} size="sm" />
                  </button>
                </div>
              )}
            </div>

            {/* Menu Stats */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{menu.items_count || 0} dishes</span>
              <span>{new Date(menu.updated_at).toLocaleDateString()}</span>
            </div>
          </div>
        );
      })}
      <ConfirmDialog
        isOpen={!!menuToDelete}
        title="86 This Menu?"
        message={
          menuToDelete
            ? `Ready to 86 "${menuToDelete.menu_name}"? This menu's going in the bin - no ceremony needed. This can't be undone, chef!`
            : ''
        }
        confirmLabel="86 It"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setMenuToDelete(null)}
        variant="danger"
      />
    </div>
  );
}
