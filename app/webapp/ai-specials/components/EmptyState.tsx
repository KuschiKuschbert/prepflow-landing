'use client';

import { EmptyState as EmptyStateComponent } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/lib/useTranslation';
import { Bot } from 'lucide-react';

interface EmptyStateProps {
  onUploadClick: () => void;
}

export function EmptyState({ onUploadClick }: EmptyStateProps) {
  const { t } = useTranslation();
  return (
    <EmptyStateComponent
      title={String(t('aiSpecials.noResults', 'No AI Specials'))}
      message={String(
        t(
          'aiSpecials.noResultsDesc',
          'Upload an image of your ingredients to generate AI-powered specials',
        ),
      )}
      icon={Bot}
      actions={
        <Button onClick={onUploadClick} variant="primary" landingStyle={true} glow={true}>
          {t('aiSpecials.uploadFirst', 'Upload Your First Image')}
        </Button>
      }
      useLandingStyles={true}
      variant="landing"
      animated={true}
    />
  );
}
