'use client';
import { useTranslation } from '@/lib/useTranslation';

interface EmptyStateProps {
  onShareClick: () => void;
}

export function EmptyState({ onShareClick }: EmptyStateProps) {
  const { t } = useTranslation();
  return (
    <div className="py-12 text-center">
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20">
        <span className="text-3xl">📤</span>
      </div>
      <h3 className="mb-2 text-xl font-semibold text-white">{t('recipeSharing.noShares', 'No Recipe Shares')}</h3>
      <p className="mb-6 text-gray-400">
        {t('recipeSharing.noSharesDesc', 'Share your recipes with others as PDFs or links')}
      </p>
      <button
        onClick={onShareClick}
        className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-xl"
      >
        {t('recipeSharing.shareFirstRecipe', 'Share Your First Recipe')}
      </button>
    </div>
  );
}

