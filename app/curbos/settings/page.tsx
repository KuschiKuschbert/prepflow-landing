'use client';

import { useState, useEffect } from 'react';
import { Copy, RefreshCw, ExternalLink } from 'lucide-react';
import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase-pos';

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
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Get user email from Supabase session
    async function getUserEmail() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user?.email) {
          setUserEmail(session.user.email);
        }
      } catch (error) {
        logger.error('[CurbOS Settings] Error getting user email:', error);
      }
    }
    getUserEmail();
  }, []);

  async function getPublicLink() {
    if (!userEmail) {
      logger.warn('[CurbOS Settings] No user email available');
      return;
    }

    setLoading(true);
    try {
      // Use CurbOS-specific endpoint that works with Supabase auth
      const response = await fetch('/api/curbos/public-token/curbos');
      const data = await response.json();
      if (response.ok) {
        setPublicUrl(data.publicUrl);
      } else {
        logger.error('[CurbOS Settings] Failed to generate link:', data);
        alert(data.error || 'Failed to generate link. Make sure you have Business tier access.');
      }
    } catch (error) {
      logger.error('[CurbOS Settings] Error generating link:', error);
      alert('Failed to generate link. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function regenerateLink() {
    if (!userEmail) {
      return;
    }

    setLoading(true);
    try {
      // Use CurbOS-specific endpoint that works with Supabase auth
      const response = await fetch('/api/curbos/public-token/curbos', { method: 'POST' });
      const data = await response.json();
      if (response.ok) {
        setPublicUrl(data.publicUrl);
        alert('Link regenerated - old link is now invalid');
      } else {
        logger.error('[CurbOS Settings] Failed to regenerate link:', data);
        alert(data.error || 'Failed to regenerate link');
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
        <h3 className="text-xl font-bold text-white mb-4">Public Display Link</h3>
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
              disabled={loading || !userEmail}
              className="px-6 py-3 bg-[#C0FF02] text-black font-bold rounded-lg hover:bg-[#b0eb02] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Generating...' : 'Generate Public Link'}
            </button>
            {!userEmail && (
              <p className="text-xs text-yellow-500">
                Note: You need to be logged into PrepFlow with Business tier access to generate a
                public link.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
