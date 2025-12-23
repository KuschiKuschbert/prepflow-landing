import { useState, useEffect, useRef, useCallback } from 'react';
import { trackEvent, trackConversion, getSessionId } from '@/lib/analytics';
import { trackGTMEvent } from '@/components/GoogleTagManager';
import { logger } from '@/lib/logger';

interface UseExitIntentHandlersProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess?: (data: { name: string; email: string }) => void;
}

export function useExitIntentHandlers({ isVisible, onClose, onSuccess }: UseExitIntentHandlersProps) {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isVisible, onClose]);

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

  const validateForm = useCallback((): boolean => {
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
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;
      setIsSubmitting(true);
      try {
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
        const res = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, source: 'exit_intent_popup' }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.message || 'Failed to submit');
        }
        setIsSuccess(true);
        onSuccess?.(formData);
        trackGTMEvent('lead_submit_success', {
          event_category: 'conversion',
          event_label: 'exit_intent_popup',
          page_path: typeof window !== 'undefined' ? window.location.pathname : '/',
        });
        setTimeout(() => {
          onClose();
          setFormData({ name: '', email: '' });
          setIsSuccess(false);
        }, 3000);
      } catch (error) {
        logger.error('Exit intent form submission failed:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateForm, onSuccess, onClose],
  );

  const handleInputChange = useCallback((field: 'name' | 'email', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  return {
    formData,
    isSubmitting,
    errors,
    isSuccess,
    popupRef,
    handleSubmit,
    handleInputChange,
  };
}

