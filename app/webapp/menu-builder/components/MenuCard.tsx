'use client';

import { Icon } from '@/components/ui/Icon';
import { logger } from '@/lib/logger';
import { Check, Edit2, Lock, Printer, Trash2, X } from 'lucide-react';
import { Menu } from '../types';

interface MenuCardProps {
  menu: Menu;
  isEditingThisMenu: boolean;
  isEditingTitle: boolean;
  isEditingDescription: boolean;
  editTitle: string;
  editDescription: string;
  isSaving: boolean;
  titleInputRef: React.RefObject<HTMLInputElement | null>;
  descriptionInputRef: React.RefObject<HTMLTextAreaElement | null>;
  onSelectMenu: (menu: Menu) => void;
  onStartEditTitle: (menu: Menu, e: React.MouseEvent) => void;
  onStartEditDescription: (menu: Menu, e: React.MouseEvent) => void;
  onSaveTitle: (menu: Menu) => void;
  onSaveDescription: (menu: Menu) => void;
  onCancelEdit: () => void;
  onTitleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, menu: Menu) => void;
  onDescriptionKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onDeleteClick: (menu: Menu) => void;
  setEditTitle: (title: string) => void;
  setEditDescription: (description: string) => void;
  onPrintClick?: (menu: Menu) => void;
}

/**
 * Menu card component for displaying and editing menu information.
 *
 * @component
 * @param {MenuCardProps} props - Component props
 * @returns {JSX.Element} Menu card element
 */
export function MenuCard({
  menu,
  isEditingThisMenu,
  isEditingTitle,
  isEditingDescription,
  editTitle,
  editDescription,
  isSaving,
  titleInputRef,
  descriptionInputRef,
  onSelectMenu,
  onStartEditTitle,
  onStartEditDescription,
  onSaveTitle,
  onSaveDescription,
  onCancelEdit,
  onTitleKeyDown,
  onDescriptionKeyDown,
  onDeleteClick,
  setEditTitle,
  setEditDescription,
  onPrintClick,
}: MenuCardProps) {
  const isLocked = menu.is_locked || false;

  // Debug logging for print button visibility
  if (isLocked) {
    logger.dev('[MenuCard] Menu is locked, print button should be visible', {
      menuId: menu.id,
      menuName: menu.menu_name,
      hasOnPrintClick: !!onPrintClick,
    });
  }

  return (
    <div
      key={menu.id}
      className={`group relative cursor-pointer overflow-visible rounded-2xl border p-6 transition-all hover:shadow-lg ${
        isLocked
          ? 'border-yellow-500/50 bg-yellow-500/10 hover:border-yellow-500/70'
          : 'border-[#2a2a2a] bg-[#1f1f1f] hover:border-[#29E7CD]/50'
      }`}
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
              onKeyDown={e => onTitleKeyDown(e, menu)}
              disabled={isSaving}
              onClick={e => e.stopPropagation()}
              className="min-w-0 flex-1 rounded-lg border border-[#29E7CD] bg-[#0a0a0a] px-3 py-1.5 text-base font-semibold text-white focus:ring-2 focus:ring-[#29E7CD] focus:outline-none disabled:opacity-50"
              style={{ maxWidth: 'calc(100% - 80px)' }}
            />
            <div className="ml-auto flex shrink-0 gap-1.5">
              <button
                onClick={e => {
                  e.stopPropagation();
                  onSaveTitle(menu);
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
                  onCancelEdit();
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
            <div className="flex flex-1 items-center gap-2">
              <h3
                className="text-fluid-lg flex-1 font-semibold text-white"
                onDoubleClick={isLocked ? undefined : e => onStartEditTitle(menu, e)}
              >
                {menu.menu_name}
              </h3>
              {isLocked && (
                <Icon
                  icon={Lock}
                  size="sm"
                  className="text-yellow-400"
                  aria-label="Menu is locked"
                  title="This menu is locked and cannot be edited or deleted"
                />
              )}
            </div>
            {!isLocked && (
              <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                <button
                  onClick={e => onStartEditTitle(menu, e)}
                  className="rounded-lg p-2 text-gray-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-[#2a2a2a] hover:text-[#29E7CD]"
                  aria-label={`Edit menu name "${menu.menu_name}"`}
                  title="Double-click or click edit to rename"
                >
                  <Icon icon={Edit2} size="sm" />
                </button>
                <button
                  onClick={() => onDeleteClick(menu)}
                  className="rounded-lg p-2 text-gray-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-[#2a2a2a] hover:text-red-400"
                  aria-label={`Delete menu "${menu.menu_name}"`}
                >
                  <Icon icon={Trash2} size="sm" />
                </button>
              </div>
            )}
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
              onKeyDown={onDescriptionKeyDown}
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
                  onSaveDescription(menu);
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
                  onCancelEdit();
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
            onDoubleClick={isLocked ? undefined : e => onStartEditDescription(menu, e)}
          >
            {menu.description ? (
              <p className="flex-1 text-sm text-gray-400">{menu.description}</p>
            ) : (
              <p
                className={`flex-1 text-sm ${isLocked ? 'text-gray-500' : 'text-gray-500 italic'}`}
              >
                {isLocked ? 'No description.' : 'No description. Double-click to add one.'}
              </p>
            )}
            {!isLocked && (
              <button
                onClick={e => onStartEditDescription(menu, e)}
                className="rounded-lg p-1.5 text-gray-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-[#2a2a2a] hover:text-[#29E7CD]"
                aria-label="Edit menu description"
                title="Double-click or click edit to add/edit description"
              >
                <Icon icon={Edit2} size="sm" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Menu Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{menu.items_count || 0} dishes</span>
        <div className="flex items-center gap-3">
          {isLocked && (
            <button
              onClick={e => {
                e.stopPropagation();
                if (onPrintClick) {
                  onPrintClick(menu);
                } else {
                  logger.warn(
                    '[MenuCard] Print button clicked but onPrintClick handler not provided',
                    {
                      menuId: menu.id,
                      menuName: menu.menu_name,
                    },
                  );
                }
              }}
              className="flex items-center gap-1.5 rounded-lg border border-[#29E7CD]/30 bg-[#29E7CD]/10 px-3 py-1.5 text-xs font-medium text-[#29E7CD] transition-all hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/20"
              aria-label={`Print menu "${menu.menu_name}"`}
              title="Print menu"
            >
              <Icon icon={Printer} size="sm" aria-hidden={true} />
              <span>Print</span>
            </button>
          )}
          <span>{new Date(menu.updated_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
