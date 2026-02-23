'use client';

import { Icon } from '@/components/ui/Icon';
import { logger } from '@/lib/logger';
import { Menu } from '@/lib/types/menu-builder';
import { Check, Edit2, Lock, PartyPopper, Printer, Trash2, X } from 'lucide-react';
import { memo } from 'react';

const FUNCTION_MENU_CONFIG = {
  icon: PartyPopper,
  label: 'Function Menu',
  accent: 'text-[var(--primary)]',
};

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
export const MenuCard = memo(function MenuCard({
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
  const isFunctionMenu =
    menu.menu_type === 'function' || (menu.menu_type && menu.menu_type.startsWith('function_'));
  const functionConfig = isFunctionMenu ? FUNCTION_MENU_CONFIG : null;

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
        isFunctionMenu
          ? 'border-l-4 border-t-[var(--border)] border-r-[var(--border)] border-b-[var(--border)] border-l-[var(--primary)] bg-gradient-to-br from-[var(--primary)]/5 via-[var(--surface)] to-[var(--accent)]/5 hover:border-l-[var(--accent)]'
          : isLocked
            ? 'border-[var(--color-warning)]/50 bg-[var(--color-warning)]/10 hover:border-[var(--color-warning)]/70'
            : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]/50'
      }`}
      onClick={() => {
        if (!isEditingThisMenu) {
          onSelectMenu(menu);
        }
      }}
    >
      {/* Function Menu Badge */}
      {functionConfig && (
        <div className="mb-3 flex items-center gap-2">
          <Icon
            icon={FUNCTION_MENU_CONFIG.icon}
            size="sm"
            className={FUNCTION_MENU_CONFIG.accent}
          />
          <span
            className={`text-xs font-semibold tracking-wider uppercase ${FUNCTION_MENU_CONFIG.accent}`}
          >
            {FUNCTION_MENU_CONFIG.label}
          </span>
        </div>
      )}

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
              className="min-w-0 flex-1 rounded-lg border border-[var(--primary)] bg-[var(--background)] px-3 py-1.5 text-base font-semibold text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none disabled:opacity-50"
              style={{ maxWidth: 'calc(100% - 80px)' }}
            />
            <div className="ml-auto flex shrink-0 gap-1.5">
              <button
                onClick={e => {
                  e.stopPropagation();
                  onSaveTitle(menu);
                }}
                disabled={isSaving}
                className="shrink-0 rounded-lg bg-[var(--primary)] p-1.5 text-[var(--primary-text)] transition-colors hover:bg-[var(--primary)]/80 disabled:opacity-50"
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
                className="shrink-0 rounded-lg bg-[var(--muted)] p-1.5 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--surface-variant)] hover:text-[var(--foreground)] disabled:opacity-50"
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
                className="text-fluid-lg flex-1 font-semibold text-[var(--foreground)]"
                onDoubleClick={isLocked ? undefined : e => onStartEditTitle(menu, e)}
              >
                {menu.menu_name}
              </h3>
              {isLocked && (
                <Icon
                  icon={Lock}
                  size="sm"
                  className="text-[var(--color-warning)]"
                  aria-label="Menu is locked"
                  title="This menu is locked and cannot be edited or deleted"
                />
              )}
            </div>
            {!isLocked && (
              <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                <button
                  onClick={e => onStartEditTitle(menu, e)}
                  className="rounded-lg p-2 text-[var(--foreground-muted)] opacity-0 transition-all group-hover:opacity-100 hover:bg-[var(--muted)] hover:text-[var(--primary)]"
                  aria-label={`Edit menu name "${menu.menu_name}"`}
                  title="Double-click or click edit to rename"
                >
                  <Icon icon={Edit2} size="sm" />
                </button>
                <button
                  onClick={() => onDeleteClick(menu)}
                  className="rounded-lg p-2 text-[var(--foreground-muted)] opacity-0 transition-all group-hover:opacity-100 hover:bg-[var(--muted)] hover:text-[var(--color-error)]"
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
              className="min-w-0 flex-1 rounded-lg border border-[var(--primary)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground-secondary)] placeholder-gray-500 focus:ring-2 focus:ring-[var(--primary)] focus:outline-none disabled:opacity-50"
            />
            <div className="flex shrink-0 flex-col gap-2">
              <button
                onClick={e => {
                  e.stopPropagation();
                  onSaveDescription(menu);
                }}
                disabled={isSaving}
                className="shrink-0 rounded-lg bg-[var(--primary)] p-1.5 text-[var(--primary-text)] transition-colors hover:bg-[var(--primary)]/80 disabled:opacity-50"
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
                className="shrink-0 rounded-lg bg-[var(--muted)] p-1.5 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--surface-variant)] hover:text-[var(--foreground)] disabled:opacity-50"
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
              <p className="flex-1 text-sm text-[var(--foreground-muted)]">{menu.description}</p>
            ) : (
              <p
                className={`flex-1 text-sm ${isLocked ? 'text-[var(--foreground-subtle)]' : 'text-[var(--foreground-subtle)] italic'}`}
              >
                {isLocked ? 'No description.' : 'No description. Double-click to add one.'}
              </p>
            )}
            {!isLocked && (
              <button
                onClick={e => onStartEditDescription(menu, e)}
                className="rounded-lg p-1.5 text-[var(--foreground-muted)] opacity-0 transition-all group-hover:opacity-100 hover:bg-[var(--muted)] hover:text-[var(--primary)]"
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
      <div className="flex items-center justify-between text-sm text-[var(--foreground-subtle)]">
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
              className="flex items-center gap-1.5 rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-3 py-1.5 text-xs font-medium text-[var(--primary)] transition-all hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/20"
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
});
