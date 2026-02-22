import { Icon } from '@/components/ui/Icon';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { generatePrintTemplate, type TemplateVariant } from '../print-template';
import { type ExportTheme } from '../themes';

interface ThemePreviewProps {
  theme: ExportTheme;
  variant?: TemplateVariant;
}

import { logger } from '@/lib/logger';
import { getPreviewData } from './preview-data';

export function ThemePreview({ theme, variant = 'customer' }: ThemePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generatePreview = async () => {
      setLoading(true);
      try {
        const data = getPreviewData(variant);
        const html = generatePrintTemplate({
          title: data.title,
          subtitle: data.subtitle,
          content: data.content,
          totalItems: data.totalItems,
          customMeta: data.customMeta,
          variant: variant,
          theme: theme,
        });

        if (iframeRef.current) {
          // Improve relative path resolution by injecting base tag
          const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
          const htmlWithBase = html.replace('<head>', `<head><base href="${baseUrl}/" />`);

          iframeRef.current.srcdoc = htmlWithBase;
        }
      } catch (error) {
        logger.error('[ThemePreview] Failed to generate preview:', error);
      } finally {
        // Add a small delay to simulate processing and prevent flicker
        setTimeout(() => setLoading(false), 300);
      }
    };

    generatePreview();
  }, [theme, variant]);

  return (
    <div className="relative flex aspect-[1/1.414] h-full min-h-[600px] w-full flex-col overflow-hidden rounded-lg border bg-gray-50 shadow-inner">
      <div className="flex items-center justify-between border-b bg-gray-100 p-2 text-xs text-gray-500">
        <span>Preview: {variant}</span>
        <span>A4 Portrait</span>
      </div>

      <div className="relative flex-1 overflow-hidden">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <Icon icon={Loader2} size="xl" className="text-primary animate-spin" aria-hidden />
          </div>
        )}
        <iframe
          ref={iframeRef}
          className="h-full w-full border-none"
          title="Theme Preview"
          sandbox="allow-same-origin" // Allow same origin to apply styles if needed
        />
      </div>
    </div>
  );
}
