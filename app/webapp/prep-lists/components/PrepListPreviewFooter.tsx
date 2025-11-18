/**
 * Footer component for PrepListPreview.
 */

import { useTranslation } from '@/lib/useTranslation';
import { Icon } from '@/components/ui/Icon';
import { Save, Loader2 } from 'lucide-react';

interface PrepListPreviewFooterProps {
  saving: boolean;
  onCancel: () => void;
  onSave: () => void;
}

/**
 * Footer component for PrepListPreview.
 *
 * @param {PrepListPreviewFooterProps} props - Component props
 * @returns {JSX.Element} Footer component
 */
export function PrepListPreviewFooter({ saving, onCancel, onSave }: PrepListPreviewFooterProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between border-t border-[#2a2a2a] p-6">
      <button
        onClick={onCancel}
        className="rounded-xl bg-[#2a2a2a] px-6 py-3 text-gray-300 transition-colors hover:bg-[#2a2a2a]/80"
      >
        {t('prepLists.cancel', 'Cancel')}
      </button>
      <button
        onClick={onSave}
        disabled={saving}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-white transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t('prepLists.saving', 'Saving...')}
          </>
        ) : (
          <>
            <Icon icon={Save} size="sm" aria-hidden={true} />
            {t('prepLists.savePrepLists', 'Save Prep Lists')}
          </>
        )}
      </button>
    </div>
  );
}
