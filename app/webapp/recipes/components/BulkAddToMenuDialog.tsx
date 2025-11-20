'use client';

import React from 'react';
import { Menu } from '@/app/webapp/menu-builder/types';
import { Icon } from '@/components/ui/Icon';
import { Loader2, Plus, X } from 'lucide-react';

interface BulkAddToMenuDialogProps {
  show: boolean;
  menus: Menu[];
  loadingMenus: boolean;
  onClose: () => void;
  onSelectMenu: (menuId: string) => void;
  onCreateNew: () => void;
}

export function BulkAddToMenuDialog({
  show,
  menus,
  loadingMenus,
  onClose,
  onSelectMenu,
  onCreateNew,
}: BulkAddToMenuDialogProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] shadow-2xl">
        <div className="border-b border-[#2a2a2a] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">Add to Menu</h3>
              <p className="text-sm text-gray-400">Select a menu to add selected items</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
              aria-label="Close dialog"
            >
              <Icon icon={X} size="sm" aria-hidden={true} />
            </button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto p-6">
          {loadingMenus ? (
            <div className="flex items-center justify-center py-8">
              <Icon
                icon={Loader2}
                size="lg"
                className="animate-spin text-[#29E7CD]"
                aria-hidden={true}
              />
              <span className="ml-3 text-gray-400">Loading menus...</span>
            </div>
          ) : menus.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-gray-400">No menus available</p>
              <button
                onClick={onCreateNew}
                className="mt-4 rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-2 font-medium text-white transition-all duration-200 hover:shadow-lg"
              >
                Create New Menu
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={onCreateNew}
                className="flex w-full items-center gap-3 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] p-4 text-left transition-colors hover:border-[#29E7CD]/50 hover:bg-[#2a2a2a]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#29E7CD] to-[#D925C7]">
                  <Icon icon={Plus} size="sm" className="text-white" aria-hidden={true} />
                </div>
                <div>
                  <div className="font-medium text-white">Create New Menu</div>
                  <div className="text-sm text-gray-400">Start a new menu from scratch</div>
                </div>
              </button>

              <div className="border-t border-[#2a2a2a] pt-2">
                <div className="mb-2 px-2 text-xs font-medium tracking-wider text-gray-400 uppercase">
                  Existing Menus
                </div>
                {menus.map(menu => (
                  <button
                    key={menu.id}
                    onClick={() => onSelectMenu(menu.id)}
                    className="flex w-full items-center justify-between rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] p-4 text-left transition-colors hover:border-[#29E7CD]/50 hover:bg-[#2a2a2a]"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-white">{menu.menu_name}</div>
                      {menu.description && (
                        <div className="mt-1 text-sm text-gray-400">{menu.description}</div>
                      )}
                      <div className="mt-1 text-xs text-gray-500">
                        {menu.items_count || 0} item{(menu.items_count || 0) !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="ml-4 text-[#29E7CD]">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
