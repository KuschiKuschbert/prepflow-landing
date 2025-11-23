'use client';

import { Plus, RefreshCw } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

interface RecipesActionButtonsProps {
  onRefresh: () => void;
  loading?: boolean;
}

export function RecipesActionButtons({ onRefresh, loading = false }: RecipesActionButtonsProps) {
  return (
    <div className="mb-8 flex flex-wrap gap-3">
      <a
        href="/webapp/recipes#dishes"
        className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-[#29E7CD]/80 hover:to-[#D925C7]/80 hover:shadow-xl"
      >
        <Icon icon={Plus} size="sm" className="text-white" aria-hidden={true} />
        Add Recipe
      </a>
      <button
        onClick={onRefresh}
        disabled={loading}
        className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#29E7CD] px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-[#3B82F6]/80 hover:to-[#29E7CD]/80 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Icon
          icon={RefreshCw}
          size="sm"
          className={`text-white ${loading ? 'animate-spin' : ''}`}
          aria-hidden={true}
        />
        Refresh Recipes
      </button>
    </div>
  );
}
