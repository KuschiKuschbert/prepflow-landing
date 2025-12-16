'use client';

/**
 * Reusable share modal component
 * Provides consistent sharing interface across all pages
 */

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Share2, Link2, Mail, FileText, X, Copy, Check } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';
import {
  copyToClipboard,
  shareViaWebAPI,
  shareViaEmail,
  isWebShareAPIAvailable,
  generateShareableUrl,
  type ShareOptions,
} from './share-utils';

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  shareUrl?: string;
  shareText?: string;
  shareTitle?: string;
  onEmailShare?: (email: string, subject: string, body: string) => void;
  onPDFShare?: () => void;
  pdfAvailable?: boolean;
}

export function ShareModal({
  isOpen,
  onClose,
  title,
  shareUrl,
  shareText,
  shareTitle,
  onEmailShare,
  onPDFShare,
  pdfAvailable = false,
}: ShareModalProps) {
  const { showSuccess, showError } = useNotification();
  const [copied, setCopied] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);

  if (!isOpen) return null;

  const currentUrl = shareUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const displayTitle = shareTitle || title;
  const displayText = shareText || `Check out ${title} on PrepFlow`;

  const handleCopyLink = async () => {
    const success = await copyToClipboard(currentUrl);
    if (success) {
      setCopied(true);
      showSuccess('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } else {
      showError('Failed to copy link. Please try again.');
    }
  };

  const handleWebShare = async () => {
    const success = await shareViaWebAPI({
      title: displayTitle,
      text: displayText,
      url: currentUrl,
    });

    if (success) {
      onClose();
    } else {
      // Fallback to copy link if Web Share API fails
      handleCopyLink();
    }
  };

  const handleEmailClick = () => {
    if (onEmailShare) {
      setShowEmailForm(true);
    } else {
      shareViaEmail('', displayTitle, `${displayText}\n\n${currentUrl}`);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailAddress.trim()) {
      showError('Please enter an email address');
      return;
    }

    const subject = emailSubject || displayTitle;
    const body = `${displayText}\n\n${currentUrl}`;

    if (onEmailShare) {
      onEmailShare(emailAddress, subject, body);
    } else {
      shareViaEmail(emailAddress, subject, body);
    }

    setShowEmailForm(false);
    setEmailAddress('');
    setEmailSubject('');
    onClose();
  };

  const handlePDFShare = () => {
    if (onPDFShare) {
      onPDFShare();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-gradient-to-r from-[#29E7CD]/20 via-[#D925C7]/20 via-[#FF6B00]/20 to-[#29E7CD]/20 p-[1px]">
        <div className="rounded-2xl bg-[#1f1f1f]/95 p-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Share {title}</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
              aria-label="Close share modal"
            >
              <Icon icon={X} size="md" aria-hidden={true} />
            </button>
          </div>

          {/* Email Form */}
          {showEmailForm ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={e => setEmailAddress(e.target.value)}
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-3 py-2 text-white focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                  placeholder="recipient@example.com"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Subject</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={e => setEmailSubject(e.target.value)}
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-3 py-2 text-white focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
                  placeholder={displayTitle}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  className="flex-1 rounded-lg border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3a3a3a]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-[#29E7CD]/30"
                >
                  Send Email
                </button>
              </div>
            </form>
          ) : (
            /* Share Options */
            <div className="space-y-3">
              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="flex w-full items-center gap-3 rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/40 px-4 py-3 text-left transition-colors hover:border-[#29E7CD]/30 hover:bg-[#3a3a3a]"
              >
                <Icon
                  icon={copied ? Check : Link2}
                  size="md"
                  className={copied ? 'text-[#29E7CD]' : 'text-gray-400'}
                  aria-hidden={true}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">
                    {copied ? 'Copied!' : 'Copy Link'}
                  </div>
                  <div className="text-xs text-gray-400">Copy URL to clipboard</div>
                </div>
              </button>

              {/* Web Share API (mobile) */}
              {isWebShareAPIAvailable() && (
                <button
                  onClick={handleWebShare}
                  className="flex w-full items-center gap-3 rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/40 px-4 py-3 text-left transition-colors hover:border-[#29E7CD]/30 hover:bg-[#3a3a3a]"
                >
                  <Icon icon={Share2} size="md" className="text-gray-400" aria-hidden={true} />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">Share</div>
                    <div className="text-xs text-gray-400">Use device share menu</div>
                  </div>
                </button>
              )}

              {/* Email */}
              <button
                onClick={handleEmailClick}
                className="flex w-full items-center gap-3 rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/40 px-4 py-3 text-left transition-colors hover:border-[#29E7CD]/30 hover:bg-[#3a3a3a]"
              >
                <Icon icon={Mail} size="md" className="text-gray-400" aria-hidden={true} />
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">Email</div>
                  <div className="text-xs text-gray-400">Send via email</div>
                </div>
              </button>

              {/* PDF */}
              {pdfAvailable && onPDFShare && (
                <button
                  onClick={handlePDFShare}
                  className="flex w-full items-center gap-3 rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/40 px-4 py-3 text-left transition-colors hover:border-[#29E7CD]/30 hover:bg-[#3a3a3a]"
                >
                  <Icon icon={FileText} size="md" className="text-gray-400" aria-hidden={true} />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">PDF</div>
                    <div className="text-xs text-gray-400">Share as PDF</div>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}




