'use client';
import { useTranslation } from '@/lib/useTranslation';

interface Recipe {
  recipe_name: string;
}

interface RecipeShare {
  id: string;
  share_type: 'pdf' | 'link' | 'email';
  recipient_email?: string;
  notes?: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  created_at: string;
  recipes: Recipe;
}

interface ShareCardProps {
  share: RecipeShare;
}

function getStatusColor(status: string) {
  switch (status) {
    case 'pending':
      return 'text-[var(--color-warning)] bg-[var(--color-warning)]/10';
    case 'sent':
      return 'text-[var(--color-info)] bg-[var(--color-info)]/10';
    case 'delivered':
      return 'text-[var(--color-success)] bg-[var(--color-success)]/10';
    case 'failed':
      return 'text-[var(--color-error)] bg-[var(--color-error)]/10';
    default:
      return 'text-[var(--foreground-muted)] bg-gray-400/10';
  }
}

function getShareTypeIcon(type: string) {
  switch (type) {
    case 'pdf':
      return '📄';
    case 'link':
      return '🔗';
    case 'email':
      return '📧';
    default:
      return '📤';
  }
}

export function ShareCard({ share }: ShareCardProps) {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-200 hover:border-[var(--primary)]/50 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="mb-3 flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20">
              <span className="text-lg">{getShareTypeIcon(share.share_type)}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--foreground)]">{share.recipes.recipe_name}</h3>
              <p className="text-sm text-[var(--foreground-muted)]">
                {share.share_type.toUpperCase()} • {share.recipient_email || 'No recipient'}
              </p>
            </div>
          </div>
          <div className="mb-4 flex items-center space-x-4">
            <div>
              <p className="mb-1 text-xs text-[var(--foreground-muted)]">{t('recipeSharing.status', 'Status')}</p>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(share.status)}`}
              >
                {share.status.charAt(0).toUpperCase() + share.status.slice(1)}
              </span>
            </div>
            <div>
              <p className="mb-1 text-xs text-[var(--foreground-muted)]">{t('recipeSharing.shared', 'Shared')}</p>
              <p className="font-semibold text-[var(--foreground)]">
                {new Date(share.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          {share.notes && <p className="text-sm text-[var(--foreground-secondary)]">{share.notes}</p>}
        </div>
      </div>
    </div>
  );
}
