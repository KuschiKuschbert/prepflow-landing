'use client';

/**
 * Standardized share button component with dropdown
 * Supports Copy Link, Email, PDF, Web Share API
 * Uses Cyber Carrot styling and PrepFlow voice
 */

import { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';
import { Share2, Link2, Mail, FileText, ChevronDown, Loader2, Check } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';
import {
  copyToClipboard,
  isWebShareAPIAvailable,
  shareViaWebAPI,
  shareViaEmail,
} from '@/lib/share/share-utils';

export type ShareMethod = 'link' | 'email' | 'pdf' | 'web';

export interface ShareButtonProps {
  title: string;
  shareUrl?: string;
  shareText?: string;
  onEmailShare?: (email: string, subject: string, body: string) => void;
  onPDFShare?: () => void;
  loading?: ShareMethod | null;
  disabled?: boolean;
  label?: string;
  className?: string;
  availableMethods?: ShareMethod[];
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export function ShareButton({
  title,
  shareUrl,
  shareText,
  onEmailShare,
  onPDFShare,
  loading = null,
  disabled = false,
  label = 'Share',
  className = '',
  availableMethods = ['link', 'email', 'pdf', 'web'],
  variant = 'primary',
  size = 'md',
}: ShareButtonProps) {
  const { showSuccess, showError } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const currentUrl = shareUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const displayText = shareText || `Check out ${title} on PrepFlow`;

  const handleCopyLink = async () => {
    const success = await copyToClipboard(currentUrl);
    if (success) {
      setCopied(true);
      showSuccess('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
      setIsOpen(false);
    } else {
      showError('Failed to copy link. Please try again.');
    }
  };

  const handleWebShare = async () => {
    const success = await shareViaWebAPI({
      title,
      text: displayText,
      url: currentUrl,
    });

    if (success) {
      setIsOpen(false);
    } else {
      // Fallback to copy link
      handleCopyLink();
    }
  };

  const handleEmailClick = () => {
    if (onEmailShare) {
      // Trigger email share callback
      onEmailShare('', title, `${displayText}\n\n${currentUrl}`);
    } else {
      shareViaEmail('', title, `${displayText}\n\n${currentUrl}`);
    }
    setIsOpen(false);
  };

  const handlePDFShare = () => {
    if (onPDFShare) {
      onPDFShare();
      setIsOpen(false);
    }
  };

  // Filter available methods (remove 'web' if not supported)
  const methods = availableMethods.filter(method => {
    if (method === 'web' && !isWebShareAPIAvailable()) {
      return false;
    }
    if (method === 'pdf' && !onPDFShare) {
      return false;
    }
    return true;
  });

  const methodLabels: Record<ShareMethod, string> = {
    link: 'Copy Link',
    email: 'Email',
    pdf: 'PDF',
    web: 'Share',
  };

  const methodIcons: Record<ShareMethod, typeof Share2> = {
    link: Link2,
    email: Mail,
    pdf: FileText,
    web: Share2,
  };

  const baseClasses =
    'flex items-center gap-2 rounded-lg font-medium text-white transition-all duration-200';
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  const variantClasses = {
    primary:
      'bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#10B981]/80 hover:to-[#059669]/80 hover:shadow-lg hover:shadow-[#10B981]/30',
    secondary: 'bg-[#2a2a2a] border border-[#2a2a2a] hover:border-[#29E7CD]/30 hover:bg-[#3a3a3a]',
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className} ${
          disabled ? 'cursor-not-allowed opacity-50' : ''
        }`}
        aria-label={label}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Icon icon={Share2} size="sm" aria-hidden={true} />
        <span className="tablet:inline hidden">{label}</span>
        <Icon
          icon={ChevronDown}
          size="sm"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden={true}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] shadow-lg">
          <div className="py-1">
            {methods.map(method => {
              const IconComponent = methodIcons[method];
              const isLoading = loading === method;
              const isCopied = method === 'link' && copied;

              const handleClick = () => {
                switch (method) {
                  case 'link':
                    handleCopyLink();
                    break;
                  case 'email':
                    handleEmailClick();
                    break;
                  case 'pdf':
                    handlePDFShare();
                    break;
                  case 'web':
                    handleWebShare();
                    break;
                }
              };

              return (
                <button
                  key={method}
                  onClick={handleClick}
                  disabled={isLoading || disabled}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-white transition-colors hover:bg-[#2a2a2a] disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={`Share via ${methodLabels[method]}`}
                >
                  {isLoading ? (
                    <Icon
                      icon={Loader2}
                      size="sm"
                      className="animate-spin text-[#29E7CD]"
                      aria-hidden={true}
                    />
                  ) : isCopied ? (
                    <Icon icon={Check} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
                  ) : (
                    <Icon
                      icon={IconComponent}
                      size="sm"
                      className="text-gray-400"
                      aria-hidden={true}
                    />
                  )}
                  <span>
                    {isCopied ? 'Copied!' : isLoading ? 'Sharing...' : methodLabels[method]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

