'use client';

import { Plus, X } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

interface CategoryManagerProps {
  categories: string[];
  newCategory: string;
  onNewCategoryChange: (value: string) => void;
  onAddCategory: () => void;
  onRemoveCategory: (category: string) => void;
}

export default function CategoryManager({
  categories,
  newCategory,
  onNewCategoryChange,
  onAddCategory,
  onRemoveCategory,
}: CategoryManagerProps) {
  return (
    <div className="mb-6 rounded-xl bg-[var(--muted)]/30 p-4">
      <div className="mb-3 flex items-center gap-2">
        <input
          type="text"
          value={newCategory}
          onChange={e => onNewCategoryChange(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && onAddCategory()}
          placeholder="Add category..."
          className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]"
        />
        <button
          onClick={onAddCategory}
          className="rounded-lg bg-[var(--primary)] px-4 py-2 text-[var(--primary-text)] transition-colors hover:bg-[var(--primary)]/80"
        >
          <Icon icon={Plus} size="sm" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <div
            key={category}
            className="flex items-center gap-2 rounded-lg bg-[var(--surface)] px-3 py-1.5"
          >
            <span className="text-sm text-[var(--foreground)]">{category}</span>
            {categories.length > 1 && (
              <button
                onClick={() => onRemoveCategory(category)}
                className="text-[var(--color-error)] transition-colors hover:text-red-300"
              >
                <Icon icon={X} size="xs" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
