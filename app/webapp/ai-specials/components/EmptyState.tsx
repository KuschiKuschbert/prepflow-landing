'use client';
import { useTranslation } from '@/lib/useTranslation';
import { Bot } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

interface EmptyStateProps {
  onUploadClick: () => void;
}

export function EmptyState({ onUploadClick }: EmptyStateProps) {
  const { t } = useTranslation();
  return (
    <div className="py-12 text-center">
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20">
        <Icon icon={Bot} size="xl" className="text-[#29E7CD]" aria-hidden={true} />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-white">
        {t('aiSpecials.noResults', 'No AI Specials')}
      </h3>
      <p className="mb-6 text-gray-400">
        {t(
          'aiSpecials.noResultsDesc',
          'Upload an image of your ingredients to generate AI-powered specials',
        )}
      </p>
      <button
        onClick={onUploadClick}
        className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-xl"
      >
        {t('aiSpecials.uploadFirst', 'Upload Your First Image')}
      </button>
    </div>
  );
}
