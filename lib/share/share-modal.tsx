'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { X } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';
import { copyToClipboard, shareViaWebAPI, shareViaEmail } from './share-utils';
import { EmailForm } from './share-modal/EmailForm';
import { ShareOptions } from './share-modal/ShareOptions';

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

          {showEmailForm ? (
            <EmailForm
              emailAddress={emailAddress}
              emailSubject={emailSubject}
              displayTitle={displayTitle}
              onEmailChange={setEmailAddress}
              onSubjectChange={setEmailSubject}
              onSubmit={handleEmailSubmit}
              onCancel={() => setShowEmailForm(false)}
            />
          ) : (
            <ShareOptions
              copied={copied}
              pdfAvailable={pdfAvailable}
              onCopyLink={handleCopyLink}
              onWebShare={handleWebShare}
              onEmailClick={handleEmailClick}
              onPDFShare={handlePDFShare}
            />
          )}
        </div>
      </div>
    </div>
  );
}
