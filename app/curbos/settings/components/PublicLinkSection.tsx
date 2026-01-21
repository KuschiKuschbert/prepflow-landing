'use client';

import { logger } from '@/lib/logger';
import { Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface PublicLinkResponse {
  publicUrl?: string;
  message?: string;
  error?: string;
}

interface PublicLinkSectionProps {
  isAdmin: boolean;
  canGenerate: boolean;
  posUserEmail: string | null;
  adminEmail?: string | null;
}

export function PublicLinkSection({
  isAdmin,
  canGenerate,
  posUserEmail,
  adminEmail,
}: PublicLinkSectionProps) {
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function getPublicLink() {
    if (!canGenerate) {
      logger.warn('[CurbOS Settings] No authorized user available');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/curbos/public-token/curbos');
      const data = (await response.json()) as PublicLinkResponse;

      if (response.ok) {
        setPublicUrl(data.publicUrl || null);
      } else {
        logger.error('[CurbOS Settings] Failed to generate link:', {
          status: response.status,
          data,
        });
        const errorMsg =
          data.message ||
          data.error ||
          'Failed to generate link. Make sure you have Business tier access.';
        toast.error(errorMsg);
      }
    } catch (error) {
      logger.error('[CurbOS Settings] Error generating link:', error);
      toast.error('Failed to generate link. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function regenerateLink() {
    if (!canGenerate) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/curbos/public-token/curbos', { method: 'POST' });
      const data = (await response.json()) as PublicLinkResponse;
      if (response.ok) {
        setPublicUrl(data.publicUrl || null);
        toast.success('Link regenerated - old link is now invalid');
      } else {
        logger.error('[CurbOS Settings] Failed to regenerate link:', {
          status: response.status,
          data,
        });
        const errorMsg = data.message || data.error || 'Failed to regenerate link';
        toast.error(errorMsg);
      }
    } catch (error) {
      logger.error('[CurbOS Settings] Error regenerating link:', error);
      toast.error('Failed to regenerate link. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard() {
    if (publicUrl) {
      navigator.clipboard.writeText(publicUrl);
      toast.success('Link copied to clipboard!');
    }
  }

  return (
    <div className="bg-neutral-900 rounded-2xl p-6 tablet:p-8 border border-neutral-800">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">Public Display Link</h3>
        {isAdmin && (
          <span className="px-2 py-1 bg-[#C0FF02]/10 text-[#C0FF02] text-[10px] font-black uppercase tracking-widest border border-[#C0FF02]/20 rounded">
            Admin Bypass Active
          </span>
        )}
      </div>

      <p className="text-gray-400 mb-6 text-sm tablet:text-base">
        Share this link with your customers to show the order display. The link is read-only and does
        not require authentication. Only Business tier subscribers can generate public links.
      </p>

      {publicUrl ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 bg-black rounded-lg p-3 border border-neutral-800">
            <code className="flex-1 text-sm text-gray-300 break-all">{publicUrl}</code>
            <button
              onClick={copyToClipboard}
              className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
              aria-label="Copy link"
            >
              <Copy size={16} className="text-gray-400" />
            </button>
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
              aria-label="Open link in new tab"
            >
              <ExternalLink size={16} className="text-gray-400" />
            </a>
          </div>
          <button
            onClick={regenerateLink}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white font-semibold disabled:opacity-50 transition-colors"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Regenerate Link
          </button>
          <p className="text-xs text-gray-500">
            Regenerating will invalidate the current link. Share the new link with your customers.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <button
            onClick={getPublicLink}
            disabled={loading || !canGenerate}
            className="px-6 py-3 bg-[#C0FF02] text-black font-bold rounded-lg hover:bg-[#b0eb02] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Generating...' : 'Generate Public Link'}
          </button>
          {!canGenerate && (
            <p className="text-xs text-yellow-500">
              Note: You need to be logged into PrepFlow with Business tier access to generate a
              public link.
            </p>
          )}
          {isAdmin && !posUserEmail && (
            <p className="text-xs text-[#C0FF02]/60">
              Logged in as Admin: {adminEmail}. You can generate links without a CurbOS session.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
