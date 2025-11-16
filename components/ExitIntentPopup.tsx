'use client';

import React, { useState, useEffect, useRef } from 'react';
import { trackEvent, trackConversion, getSessionId } from '../lib/analytics';
import { trackGTMEvent } from './GoogleTagManager';

interface ExitIntentPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess?: (data: { name: string; email: string }) => void;
}

export default function ExitIntentPopup({ isVisible, onClose, onSuccess }: ExitIntentPopupProps) {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when popup is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isVisible, onClose]);

  // Close popup on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible, onClose]);

  const validateForm = (): boolean => {
    const newErrors: { name?: string; email?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Track the exit-intent conversion
      trackEvent('exit_intent_conversion', 'conversion', 'lead_magnet', 1);

      trackConversion({
        type: 'signup_start',
        element: 'exit_intent_popup',
        page: typeof window !== 'undefined' ? window.location.pathname : '/',
        timestamp: Date.now(),
        sessionId: getSessionId(),
        metadata: {
          conversion_type: 'exit_intent_lead_magnet',
          user_name: formData.name,
        },
      });

      // Submit lead to API
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, source: 'exit_intent_popup' }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Failed to submit');
      }

      // Success handling
      setIsSuccess(true);
      onSuccess?.(formData);

      // Push success to GTM
      trackGTMEvent('lead_submit_success', {
        event_category: 'conversion',
        event_label: 'exit_intent_popup',
        page_path: typeof window !== 'undefined' ? window.location.pathname : '/',
      });

      // Auto-close after success
      setTimeout(() => {
        onClose();
        // Reset form for next time
        setFormData({ name: '', email: '' });
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Exit intent form submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: 'name' | 'email', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div
        ref={popupRef}
        className="animate-in slide-in-from-bottom-4 desktop:p-8 relative w-full max-w-md rounded-3xl border border-[#29E7CD]/30 bg-[#1f1f1f] p-6 shadow-2xl duration-300"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 transition-colors hover:text-white"
          aria-label="Close popup"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {isSuccess ? (
          <div className="text-center">
            <div className="text-fluid-4xl mb-4">🎉</div>
            <h3 className="text-fluid-2xl mb-2 font-bold text-[#29E7CD]">Don&apos;t go yet!</h3>
            <p className="mb-4 text-gray-300">
              We&apos;ve sent the sample dashboard to your email.
            </p>
            <p className="text-fluid-sm text-gray-500">Check your inbox in the next few minutes.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-6 text-center">
              <div className="text-fluid-4xl mb-3">🚨</div>
              <h3 className="text-fluid-2xl mb-2 font-bold text-white">Wait! Before you go...</h3>
              <p className="text-gray-300">
                Get your free sample dashboard and see exactly how PrepFlow can transform your menu
                profitability.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="popup-name"
                  className="text-fluid-sm mb-2 block font-medium text-gray-300"
                >
                  Your name *
                </label>
                <input
                  id="popup-name"
                  type="text"
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  placeholder="Your name"
                  className={`w-full rounded-xl border bg-[#2a2a2a] px-4 py-3 text-white placeholder-gray-400 transition-colors focus:outline-none ${
                    errors.name
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-600 focus:border-[#29E7CD]'
                  }`}
                  aria-describedby={errors.name ? 'popup-name-error' : undefined}
                />
                {errors.name && (
                  <p id="popup-name-error" className="text-fluid-sm mt-1 text-red-400">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="popup-email"
                  className="text-fluid-sm mb-2 block font-medium text-gray-300"
                >
                  Your email *
                </label>
                <input
                  id="popup-email"
                  type="email"
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                  className={`w-full rounded-xl border bg-[#2a2a2a] px-4 py-3 text-white placeholder-gray-400 transition-colors focus:outline-none ${
                    errors.email
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-600 focus:border-[#29E7CD]'
                  }`}
                  aria-describedby={errors.email ? 'popup-email-error' : undefined}
                />
                {errors.email && (
                  <p id="popup-email-error" className="text-fluid-sm mt-1 text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`text-fluid-base w-full rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 ${
                  isSubmitting
                    ? 'cursor-not-allowed opacity-50'
                    : 'hover:shadow-xl hover:shadow-[#29E7CD]/25'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send me the sample dashboard'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-fluid-xs text-gray-500">
                No spam. No lock-in. Your data stays private.
              </p>
              <button
                onClick={onClose}
                className="text-fluid-sm mt-3 text-gray-400 underline transition-colors hover:text-white"
              >
                No thanks, I&apos;ll continue browsing
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
