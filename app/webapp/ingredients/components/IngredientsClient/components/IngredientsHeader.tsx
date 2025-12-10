import { PageHeader } from '@/app/webapp/components/static/PageHeader';
import { useTranslation } from '@/lib/useTranslation';
import { Package } from 'lucide-react';

interface IngredientsHeaderProps {
  hideHeader: boolean;
}

/**
 * Component for the ingredients page header
 */
export function IngredientsHeader({ hideHeader }: IngredientsHeaderProps) {
  const { t } = useTranslation();

  if (hideHeader) return null;

  return (
    <PageHeader
      title={(() => {
        const title = t('ingredients.title', 'Ingredients Management');
        return Array.isArray(title) ? title.join('') : title;
      })()}
      subtitle={(() => {
        const subtitle = t('ingredients.subtitle', 'Manage your kitchen ingredients and inventory');
        return Array.isArray(subtitle) ? subtitle.join('') : subtitle;
      })()}
      icon={Package}
    />
  );
}



