'use client';

import { Icon } from '@/components/ui/Icon';
import { Check, Edit2, Filter, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { SortOption } from '../hooks/useCategorySort';

interface CategoryHeaderProps {
  category: string;
  canRename?: boolean;
  onRename: (oldName: string, newName: string) => Promise<void>;
  onError: (message: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  itemCount: number;
}

export function CategoryHeader({
  category,
  canRename = true,
  onRename,
  onError,
  sortBy,
  onSortChange,
  itemCount,
}: CategoryHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(category);
  const [isSaving, setIsSaving] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setShowSortDropdown(false);
      }
    };

    if (showSortDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSortDropdown]);

  const handleStartEdit = () => {
    setEditValue(category);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditValue(category);
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    const trimmedValue = editValue.trim();

    // Don't allow empty category names
    if (!trimmedValue) {
      setEditValue(category);
      setIsEditing(false);
      return;
    }

    // Don't save if unchanged
    if (trimmedValue === category) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onRename(category, trimmedValue);
      setIsEditing(false);
    } catch (error) {
      onError(
        `Failed to rename category: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      setEditValue(category);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className="mb-3 flex items-center gap-2">
      {isEditing ? (
        <div className="flex flex-1 items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSaving}
            className="flex-1 rounded-lg border border-[#29E7CD] bg-[#1f1f1f] px-3 py-1.5 text-lg font-semibold text-white focus:ring-2 focus:ring-[#29E7CD] focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={handleSaveEdit}
            disabled={isSaving}
            className="rounded-lg bg-[#29E7CD] p-1.5 text-black transition-colors hover:bg-[#29E7CD]/80 disabled:opacity-50"
            aria-label="Save category name"
          >
            <Icon icon={Check} size="sm" />
          </button>
          <button
            onClick={handleCancelEdit}
            disabled={isSaving}
            className="rounded-lg bg-[#2a2a2a] p-1.5 text-gray-400 transition-colors hover:bg-[#3a3a3a] hover:text-white disabled:opacity-50"
            aria-label="Cancel editing"
          >
            <Icon icon={X} size="sm" />
          </button>
        </div>
      ) : (
        <>
          <h3 className="flex-1 text-lg font-semibold text-white">{category}</h3>
          {/* Sort Dropdown */}
          {itemCount > 1 && (
            <div ref={sortDropdownRef} className="relative">
              <button
                onClick={e => {
                  e.stopPropagation();
                  setShowSortDropdown(!showSortDropdown);
                }}
                className={`rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-[#29E7CD] ${
                  sortBy !== 'position' ? 'text-[#29E7CD]' : ''
                }`}
                aria-label="Sort items"
                title="Sort items"
              >
                <Icon icon={Filter} size="sm" />
              </button>
              {showSortDropdown && (
                <div className="absolute top-full right-0 z-50 mt-1 min-w-[180px] rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] shadow-lg">
                  <div className="p-2 text-xs font-medium tracking-wider text-gray-400 uppercase">
                    Sort By
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onSortChange('position');
                        setShowSortDropdown(false);
                      }}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-[#2a2a2a] hover:text-[#29E7CD] ${
                        sortBy === 'position' ? 'bg-[#2a2a2a] text-[#29E7CD]' : 'text-white'
                      }`}
                    >
                      <Icon icon={Filter} size="sm" />
                      <span>Position</span>
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onSortChange('name-asc');
                        setShowSortDropdown(false);
                      }}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-[#2a2a2a] hover:text-[#29E7CD] ${
                        sortBy === 'name-asc' ? 'bg-[#2a2a2a] text-[#29E7CD]' : 'text-white'
                      }`}
                    >
                      <Icon icon={Filter} size="sm" />
                      <span>Name (A-Z)</span>
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onSortChange('name-desc');
                        setShowSortDropdown(false);
                      }}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-[#2a2a2a] hover:text-[#29E7CD] ${
                        sortBy === 'name-desc' ? 'bg-[#2a2a2a] text-[#29E7CD]' : 'text-white'
                      }`}
                    >
                      <Icon icon={Filter} size="sm" />
                      <span>Name (Z-A)</span>
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onSortChange('price-asc');
                        setShowSortDropdown(false);
                      }}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-[#2a2a2a] hover:text-[#29E7CD] ${
                        sortBy === 'price-asc' ? 'bg-[#2a2a2a] text-[#29E7CD]' : 'text-white'
                      }`}
                    >
                      <Icon icon={Filter} size="sm" />
                      <span>Price (Low-High)</span>
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onSortChange('price-desc');
                        setShowSortDropdown(false);
                      }}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-[#2a2a2a] hover:text-[#29E7CD] ${
                        sortBy === 'price-desc' ? 'bg-[#2a2a2a] text-[#29E7CD]' : 'text-white'
                      }`}
                    >
                      <Icon icon={Filter} size="sm" />
                      <span>Price (High-Low)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {canRename && (
            <button
              onClick={handleStartEdit}
              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-[#29E7CD]"
              aria-label={`Rename category "${category}"`}
              title="Click to rename category"
            >
              <Icon icon={Edit2} size="sm" />
            </button>
          )}
        </>
      )}
    </div>
  );
}
