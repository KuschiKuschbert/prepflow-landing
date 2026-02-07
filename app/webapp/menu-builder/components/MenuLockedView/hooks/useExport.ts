import { useNotification } from '@/contexts/NotificationContext';
import { getSavedExportTheme } from '@/lib/exports/utils/themeUtils';
import { logger } from '@/lib/logger';
import type { Menu } from '@/lib/types/menu-builder';
import { useState } from 'react';
import type { ExportContentType, ExportFormat } from '../components/ExportOptions';

export function useExport(menu: Menu) {
  const { showError, showSuccess, showInfo } = useNotification();
  const [exportLoading, setExportLoading] = useState<string | null>(null);

  const handleExport = async (contentType: ExportContentType, format: ExportFormat) => {
    const loadingKey = `${contentType}-${format}`;
    const theme = getSavedExportTheme();
    setExportLoading(loadingKey);
    showInfo('Preparing your export, chef. Please wait...');
    try {
      let endpoint = '';
      let filename = '';
      let successMessage = '';

      // Sanitise menu ID to remove any potential suffix (e.g. ",L")
      // This happens when checking a locked menu where the ID might be composite
      const cleanMenuId = menu.id.split(',')[0];

      // Map content types to endpoints
      switch (contentType) {
        case 'menu':
          endpoint = `/api/menus/${cleanMenuId}/menu-display/export?format=${format}&theme=${theme}`;
          filename = `${menu.menu_name}_menu_display.${format === 'csv' ? 'csv' : format === 'pdf' ? 'pdf' : 'html'}`;
          successMessage = `Menu display exported as ${format.toUpperCase()}`;
          break;

        case 'matrix':
        case 'matrix':
          endpoint = `/api/menus/${cleanMenuId}/allergen-matrix/export?format=${format}&theme=${theme}`;
          filename = `${menu.menu_name}_allergen_matrix.${format === 'csv' ? 'csv' : format === 'pdf' ? 'pdf' : 'html'}`;
          successMessage = `Allergen matrix exported as ${format.toUpperCase()}`;
          break;

        case 'recipe-cards':
        case 'recipe-cards':
          endpoint = `/api/menus/${cleanMenuId}/recipe-cards/export?format=${format}&theme=${theme}`;
          filename = `${menu.menu_name}_recipe_cards.${format === 'csv' ? 'csv' : format === 'pdf' ? 'pdf' : 'html'}`;
          successMessage = `Recipe cards exported as ${format.toUpperCase()}`;
          break;

        case 'menu-matrix':
          endpoint = `/api/menus/${cleanMenuId}/export-combined?format=${format}&theme=${theme}`;
          filename = `${menu.menu_name}_menu_matrix.${format === 'csv' ? 'csv' : format === 'pdf' ? 'pdf' : 'html'}`;
          successMessage = `Menu and allergen matrix exported as ${format.toUpperCase()}`;
          break;

        case 'menu-recipes':
          endpoint = `/api/menus/${cleanMenuId}/export-combined?format=${format}&include=menu,recipes&theme=${theme}`;
          filename = `${menu.menu_name}_menu_recipes.${format === 'csv' ? 'csv' : format === 'pdf' ? 'pdf' : 'html'}`;
          successMessage = `Menu and recipe cards exported as ${format.toUpperCase()}`;
          break;

        case 'matrix-recipes':
        case 'matrix-recipes':
          endpoint = `/api/menus/${cleanMenuId}/export-combined?format=${format}&include=matrix,recipes&theme=${theme}`;
          filename = `${menu.menu_name}_matrix_recipes.${format === 'csv' ? 'csv' : format === 'pdf' ? 'pdf' : 'html'}`;
          successMessage = `Allergen matrix and recipe cards exported as ${format.toUpperCase()}`;
          break;

        case 'all':
        case 'all':
          endpoint = `/api/menus/${cleanMenuId}/export-combined?format=${format}&include=all&theme=${theme}`;
          filename = `${menu.menu_name}_complete.${format === 'csv' ? 'csv' : format === 'pdf' ? 'pdf' : 'html'}`;
          successMessage = `Complete menu exported as ${format.toUpperCase()}`;
          break;

        default:
          throw new Error(`Unknown export content type: ${contentType}`);
      }

      const response = await fetch(endpoint, {
        method: 'GET',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || data.error || 'Failed to export');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showSuccess(successMessage);
    } catch (err) {
      logger.error('[MenuLockedView] Export error:', err);
      showError(err instanceof Error ? err.message : 'Failed to export');
    } finally {
      setExportLoading(null);
    }
  };

  return { handleExport, exportLoading };
}
