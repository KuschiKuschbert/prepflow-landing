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
    <div className="mb-6 rounded-xl bg-[#2a2a2a]/30 p-4">
      <div className="mb-3 flex items-center gap-2">
        <input
          type="text"
          value={newCategory}
          onChange={e => onNewCategoryChange(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && onAddCategory()}
          placeholder="Add category..."
          className="flex-1 rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] px-3 py-2 text-white focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]"
        />
        <button
          onClick={onAddCategory}
          className="rounded-lg bg-[#29E7CD] px-4 py-2 text-black transition-colors hover:bg-[#29E7CD]/80"
        >
          <Icon icon={Plus} size="sm" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <div
            key={category}
            className="flex items-center gap-2 rounded-lg bg-[#1f1f1f] px-3 py-1.5"
          >
            <span className="text-sm text-white">{category}</span>
            {categories.length > 1 && (
              <button
                onClick={() => onRemoveCategory(category)}
                className="text-red-400 transition-colors hover:text-red-300"
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
