'use client';
import { useTranslation } from '@/lib/useTranslation';
import { Bot } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

interface UploadFormProps {
  selectedFile: File | null;
  prompt: string;
  processing: boolean;
  onFileSelect: (file: File | null) => void;
  onPromptChange: (prompt: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function UploadForm({
  selectedFile,
  prompt,
  processing,
  onFileSelect,
  onPromptChange,
  onSubmit,
}: UploadFormProps) {
  const { t } = useTranslation();
  return (
    <form onSubmit={onSubmit} className="mb-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20">
          <Icon icon={Bot} size="lg" className="text-[var(--primary)]" aria-hidden={true} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[var(--foreground)]">
            {t('aiSpecials.uploadImage', 'Upload Image')}
          </h2>
          <p className="text-sm text-[var(--foreground-muted)]">
            {t(
              'aiSpecials.uploadDesc',
              'Upload an image of your ingredients to generate AI-powered specials',
            )}
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            {t('aiSpecials.selectImage', 'Select Image')}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={e => onFileSelect(e.target.files?.[0] || null)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--primary)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--primary-text)] file:hover:bg-[var(--primary)]/90"
          />
          {selectedFile && (
            <p className="mt-2 text-sm text-[var(--foreground-muted)]">
              {t('aiSpecials.selectedFile', 'Selected')}: {selectedFile.name}
            </p>
          )}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            {t('aiSpecials.prompt', 'Prompt (Optional)')}
          </label>
          <textarea
            value={prompt}
            onChange={e => onPromptChange(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            placeholder={String(
              t('aiSpecials.promptPlaceholder', 'Describe what you want the AI to focus on...'),
            )}
            rows={3}
          />
        </div>
        <button
          type="submit"
          disabled={!selectedFile || processing}
          className="w-full rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          {processing
            ? t('aiSpecials.processing', 'Processing...')
            : t('aiSpecials.generateSpecials', 'Generate Specials')}
        </button>
      </div>
    </form>
  );
}
