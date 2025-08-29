'use client';

import React, { useState, useEffect, useRef } from 'react';
import { trackEvent, trackConversion, getSessionId } from '../lib/analytics';

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
          user_name: formData.name
        }
      });

      // Simulate API call (replace with actual email service)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success handling
      setIsSuccess(true);
      onSuccess?.(formData);
      
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div 
        ref={popupRef}
        className="relative w-full max-w-md bg-[#1f1f1f] border border-[#29E7CD]/30 rounded-3xl p-8 shadow-2xl animate-in slide-in-from-bottom-4 duration-300"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close popup"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {isSuccess ? (
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-[#29E7CD] mb-2">
              Don't go yet!
            </h3>
            <p className="text-gray-300 mb-4">
              We've sent the sample dashboard to your email.
            </p>
            <p className="text-sm text-gray-500">
              Check your inbox in the next few minutes.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🚨</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Wait! Before you go...
              </h3>
              <p className="text-gray-300">
                Get your free sample dashboard and see exactly how PrepFlow can transform your menu profitability.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="popup-name" className="block text-sm font-medium text-gray-300 mb-2">
                  Your name *
                </label>
                <input
                  id="popup-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Your name"
                  className={`w-full px-4 py-3 rounded-xl border bg-[#2a2a2a] text-white placeholder-gray-400 focus:outline-none transition-colors ${
                    errors.name 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-600 focus:border-[#29E7CD]'
                  }`}
                  aria-describedby={errors.name ? 'popup-name-error' : undefined}
                />
                {errors.name && (
                  <p id="popup-name-error" className="mt-1 text-sm text-red-400">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="popup-email" className="block text-sm font-medium text-gray-300 mb-2">
                  Your email *
                </label>
                <input
                  id="popup-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                  className={`w-full px-4 py-3 rounded-xl border bg-[#2a2a2a] text-white placeholder-gray-400 focus:outline-none transition-colors ${
                    errors.email 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-600 focus:border-[#29E7CD]'
                  }`}
                  aria-describedby={errors.email ? 'popup-email-error' : undefined}
                />
                {errors.email && (
                  <p id="popup-email-error" className="mt-1 text-sm text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 ${
                  isSubmitting
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:shadow-xl hover:shadow-[#29E7CD]/25'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send me the sample dashboard'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="text-center mt-6">
              <p className="text-xs text-gray-500">
                No spam. No lock-in. Your data stays private.
              </p>
              <button
                onClick={onClose}
                className="mt-3 text-sm text-gray-400 hover:text-white transition-colors underline"
              >
                No thanks, I'll continue browsing
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
