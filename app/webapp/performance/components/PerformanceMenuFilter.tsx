'use client';

import { Icon } from '@/components/ui/Icon';
import { Loader2, LayoutGrid } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MenuOption {
  id: string;
  menu_name: string;
  is_locked?: boolean;
}

interface PerformanceMenuFilterProps {
  menuId: string | null;
  lockedMenuOnly: boolean;
  onMenuIdChange: (menuId: string | null) => void;
  onLockedMenuOnlyChange: (locked: boolean) => void;
}

/**
 * Menu filter for Performance analysis. Allows scoping to a specific menu or locked menus only.
 */
export default function PerformanceMenuFilter({
  menuId,
  lockedMenuOnly,
  onMenuIdChange,
  onLockedMenuOnlyChange,
}: PerformanceMenuFilterProps) {
  const [menus, setMenus] = useState<MenuOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/menus');
        const data = await res.json();
        if (data.success && Array.isArray(data.menus)) {
          setMenus(data.menus);
        }
      } catch {
        setMenus([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, []);

  if (loading) {
    return (
      <div className="tablet:mb-3 tablet:p-3 desktop:mb-4 desktop:p-4 mb-2 flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5">
        <Icon icon={Loader2} size="sm" className="animate-spin text-[var(--primary)]" />
        <span className="text-sm text-[var(--foreground-muted)]">Loading menus...</span>
      </div>
    );
  }

  const lockedMenus = menus.filter(m => m.is_locked);
  const hasLockedMenus = lockedMenus.length > 0;

  return (
    <div className="tablet:mb-3 tablet:p-3 desktop:mb-4 desktop:p-4 mb-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5">
      <div className="tablet:mb-2 mb-1.5 flex items-center gap-2">
        <Icon icon={LayoutGrid} size="sm" className="text-[var(--primary)]" />
        <h3 className="text-sm font-semibold text-[var(--foreground)]">Menu</h3>
      </div>

      <div className="space-y-2">
        <select
          value={menuId ?? ''}
          onChange={e => onMenuIdChange(e.target.value || null)}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
          aria-label="Select menu to analyze"
        >
          <option value="">All menus</option>
          {menus.map(m => (
            <option key={m.id} value={m.id}>
              {m.menu_name}
              {m.is_locked ? ' (locked)' : ''}
            </option>
          ))}
        </select>

        {hasLockedMenus && (
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={lockedMenuOnly}
              onChange={e => onLockedMenuOnlyChange(e.target.checked)}
              className="rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
            />
            <span className="text-sm text-[var(--foreground-secondary)]">Locked menu only</span>
          </label>
        )}
      </div>
    </div>
  );
}
