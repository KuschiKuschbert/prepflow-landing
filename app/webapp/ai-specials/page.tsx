'use client';

import { Icon } from '@/components/ui/Icon';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { useNotification } from '@/contexts/NotificationContext';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useTranslation } from '@/lib/useTranslation';
import { Bot, Shield } from 'lucide-react';
import { useState } from 'react';
import { AiSpecialsHeader } from './components/AiSpecialsHeader';
import { RecipeScraper } from './components/RecipeScraper';
import { SpecialsGrid } from './components/SpecialsGrid';
import { UploadForm } from './components/UploadForm';
import { useAiSpecials } from './hooks/useAiSpecials';

export const dynamic = 'force-dynamic';

export default function AISpecialsPage() {
  const { t } = useTranslation();
  const { showError } = useNotification();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const { aiSpecials, loading, error, isAuthenticated, userLoading, submitSpecial } =
    useAiSpecials();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [showRecipeScraper, setShowRecipeScraper] = useState(false);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      showError('Please select an image file');
      return;
    }
    await submitSpecial(selectedFile, prompt);
    setSelectedFile(null);
    setPrompt('');
  };

  if (userLoading || adminLoading || loading) {
    return (
      <ResponsivePageContainer>
        <div className="tablet:py-6 min-h-screen bg-transparent py-4">
          <div className="mb-8">
            <LoadingSkeleton variant="stats" height="64px" />
          </div>
          <div className="mb-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
            <LoadingSkeleton variant="form" height="200px" />
          </div>
          <div className="space-y-4">
            <LoadingSkeleton variant="card" count={3} height="120px" />
          </div>
        </div>
      </ResponsivePageContainer>
    );
  }

  if (!isAuthenticated) {
    return (
      <ResponsivePageContainer>
        <div className="min-h-screen bg-transparent py-8 text-[var(--foreground)]">
          <div className="mb-8">
            <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold text-[var(--foreground)]">
              <Icon icon={Bot} size="lg" aria-hidden={true} />
              {t('aiSpecials.title', 'AI Specials Generator')}
            </h1>
            <p className="text-[var(--foreground-muted)]">
              {t('aiSpecials.subtitle', 'Generate specials from ingredient photos using AI')}
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--color-error)]/20 bg-[var(--color-error)]/10 p-6">
            <p className="text-[var(--color-error)]">
              Please log in to view and create AI specials.
            </p>
          </div>
        </div>
      </ResponsivePageContainer>
    );
  }

  if (!isAdmin) {
    return (
      <ResponsivePageContainer>
        <div className="min-h-screen bg-transparent py-8 text-[var(--foreground)]">
          <div className="mb-8">
            <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold text-[var(--foreground)]">
              <Icon icon={Bot} size="lg" aria-hidden={true} />
              {t('aiSpecials.title', 'AI Specials Generator')}
            </h1>
            <p className="text-[var(--foreground-muted)]">
              {t('aiSpecials.subtitle', 'Generate specials from ingredient photos using AI')}
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--color-error)]/20 bg-[var(--color-error)]/10 p-6">
            <div className="flex items-start gap-3">
              <Icon
                icon={Shield}
                size="lg"
                className="mt-0.5 flex-shrink-0 text-[var(--color-error)]"
                aria-hidden={true}
              />
              <div>
                <h2 className="mb-2 text-lg font-semibold text-[var(--color-error)]">
                  Admin Access Required
                </h2>
                <p className="text-[var(--color-error)]/80">
                  This feature is only available to administrators. Please contact an administrator
                  if you need access.
                </p>
              </div>
            </div>
          </div>
        </div>
      </ResponsivePageContainer>
    );
  }

  return (
    <ResponsivePageContainer>
      <div className="min-h-screen bg-transparent py-8 text-[var(--foreground)]">
        <AiSpecialsHeader
          title={t('aiSpecials.title', 'AI Specials Generator')}
          subtitle={t('aiSpecials.subtitle', 'Generate specials from ingredient photos using AI')}
          showRecipeScraper={showRecipeScraper}
          onToggleScraper={() => setShowRecipeScraper(!showRecipeScraper)}
        />
        {error && (
          <div className="mb-6 rounded-2xl border border-[var(--color-error)]/20 bg-[var(--color-error)]/10 p-4">
            <p className="text-[var(--color-error)]">{error}</p>
          </div>
        )}
        {showRecipeScraper && (
          <div className="mb-6">
            <RecipeScraper />
          </div>
        )}
        <UploadForm
          selectedFile={selectedFile}
          prompt={prompt}
          processing={false}
          onFileSelect={handleFileSelect}
          onPromptChange={setPrompt}
          onSubmit={handleSubmit}
        />
        <SpecialsGrid specials={aiSpecials} />
      </div>
    </ResponsivePageContainer>
  );
}
