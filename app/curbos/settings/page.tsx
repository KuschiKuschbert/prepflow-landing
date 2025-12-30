'use client';

import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useUserProfile } from '@/hooks/useUserProfile';
import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase-pos';
import { Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * CurbOS settings page component
 * Manages public display link generation and regeneration
 *
 * @component
 * @returns {JSX.Element} Settings page with public link management
 */
export default function CurbOSSettings() {
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [posUserEmail, setPosUserEmail] = useState<string | null>(null);

  // PrepFlow Admin Bypass
  const { isAdmin } = useIsAdmin();
  const { profile } = useUserProfile();

  // Unified email for display/checks
  const userEmail = posUserEmail || (isAdmin ? profile?.email : null);
  const canGenerate = isAdmin || !!posUserEmail;

  useEffect(() => {
    // Get user email from Supabase session
    async function getPosUserEmail() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user?.email) {
          setPosUserEmail(session.user.email);
        }
      } catch (error) {
        logger.error('[CurbOS Settings] Error getting user email:', error);
      }
    }
    getPosUserEmail();
  }, []);

  async function getPublicLink() {
    if (!canGenerate) {
      logger.warn('[CurbOS Settings] No authorized user available');
      return;
    }

    setLoading(true);
    try {
      // Use CurbOS-specific endpoint that works with Supabase auth OR Admin bypass
      const response = await fetch('/api/curbos/public-token/curbos');
      const data = await response.json();

      if (response.ok) {
        setPublicUrl(data.publicUrl);
      } else {
        logger.error('[CurbOS Settings] Failed to generate link:', {
          status: response.status,
          data
        });
        const errorMsg = data.message || data.error || 'Failed to generate link. Make sure you have Business tier access.';
        alert(errorMsg);
      }
    } catch (error) {
      logger.error('[CurbOS Settings] Error generating link:', error);
      alert('Failed to generate link. Please try again.');
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
      // Use CurbOS-specific endpoint that works with Supabase auth OR Admin bypass
      const response = await fetch('/api/curbos/public-token/curbos', { method: 'POST' });
      const data = await response.json();
      if (response.ok) {
        setPublicUrl(data.publicUrl);
        alert('Link regenerated - old link is now invalid');
      } else {
        logger.error('[CurbOS Settings] Failed to regenerate link:', {
          status: response.status,
          data
        });
        const errorMsg = data.message || data.error || 'Failed to regenerate link';
        alert(errorMsg);
      }
    } catch (error) {
      logger.error('[CurbOS Settings] Error regenerating link:', error);
      alert('Failed to regenerate link. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard() {
    if (publicUrl) {
      navigator.clipboard.writeText(publicUrl);
      alert('Link copied to clipboard!');
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 tablet:px-6 py-8 tablet:py-12">
      <div className="mb-8">
        <h2 className="text-2xl tablet:text-3xl desktop:text-4xl font-bold text-white mb-2">
          Settings
        </h2>
        <p className="text-neutral-400 text-sm tablet:text-base">
          Manage your CurbOS configuration and public display link.
        </p>
      </div>

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
          Share this link with your customers to show the order display. The link is read-only and
          does not require authentication. Only Business tier subscribers can generate public links.
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
                Logged in as Admin: {profile?.email}. You can generate links without a CurbOS session.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="bg-neutral-900 rounded-2xl p-6 tablet:p-8 border border-neutral-800 mt-8">
          <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">Android POS App</h3>
              <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-[10px] font-black uppercase tracking-widest border border-yellow-500/20 rounded">
                  Pre-Alpha
              </span>
          </div>
          <p className="text-gray-400 mb-6 text-sm tablet:text-base">
              Download the latest pre-alpha version of the CurbOS Android POS application.
              Requires Android 8.0+.
          </p>

          <a
              href="https://github.com/KuschiKuschbert/CurbOS/releases/latest/download/app-release.apk"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
          >
              <ExternalLink size={16} />
              Download APK
          </a>
          <p className="text-xs text-gray-500 mt-2">
              Note: You may need to enable "Install unknown apps" permission on your Android device.
          </p>
      </div>
    </div>
  );
}
