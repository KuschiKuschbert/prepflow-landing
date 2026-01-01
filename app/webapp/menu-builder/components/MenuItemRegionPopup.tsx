'use client';

import { Icon } from '@/components/ui/Icon';
import { logger } from '@/lib/logger';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { MenuItem } from '../types';

interface MenuItemRegionPopupProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemId: string, region: string | null) => void;
}

const REGIONS = ['Baja', 'Oaxaca', 'Yucatan', 'CDMX', 'Pacific', 'Norte', 'Sur'];

export function MenuItemRegionPopup({ item, isOpen, onClose, onSave }: MenuItemRegionPopupProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && item) {
      logger.dev('[MenuItemRegionPopup] Popup opened', {
        itemId: item.id,
        currentRegion: item.region,
      });
      setSelectedRegion(item.region || '');
    }
  }, [isOpen, item]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const handleSave = () => {
    if (!item) return;

    const regionToSave = selectedRegion === '' ? null : selectedRegion;

    logger.dev('[MenuItemRegionPopup] Saving region', {
      itemId: item.id,
      newRegion: regionToSave,
    });

    onSave(item.id, regionToSave);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen || !item) return null;

  const itemName = item.dishes?.dish_name || item.recipes?.recipe_name || 'Unknown Item';

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 p-4">
      <div className="relative w-full max-w-sm rounded-2xl bg-gradient-to-r from-[var(--primary)]/20 via-[var(--accent)]/20 via-[var(--tertiary)]/20 to-[var(--primary)]/20 p-[1px] shadow-xl">
        <div
          ref={popupRef}
          className="rounded-2xl bg-[var(--surface)]/95 p-6"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={handleCancel}
            className="absolute top-4 right-4 rounded-lg p-1.5 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            aria-label="Close"
          >
            <Icon icon={X} size="sm" />
          </button>

          <h3 className="mb-4 text-lg font-semibold text-[var(--foreground)]">
            Edit Region: {itemName}
          </h3>

          <div className="mb-4">
            <label className="mb-2 block text-sm text-[var(--foreground-muted)]">
              Taco Passport Region
            </label>
            <select
              value={selectedRegion}
              onChange={e => setSelectedRegion(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
            >
              <option value="">-- No Region --</option>
              {REGIONS.map(region => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
              Assigning a region allows customers to unlock it in their Taco Passport.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-4 py-2 font-medium text-[var(--button-active-text)] transition-all hover:shadow-lg"
            >
              Save Region
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-4 py-2 font-medium text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--surface-variant)]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
