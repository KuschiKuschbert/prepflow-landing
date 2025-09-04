'use client';

import React, { useState } from 'react';
import { trackEvent, trackConversion, getSessionId } from '../lib/analytics';

interface FormData {
  name: string;
  email: string;
  preference: 'sample';
}

interface LeadMagnetFormProps {
  onSuccess?: (data: FormData) => void;
  onError?: (error: string) => void;
}

export default function LeadMagnetForm({ onSuccess, onError }: LeadMagnetFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    preference: 'sample'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
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
      // Track the lead generation event
      trackEvent('lead_generation', 'conversion', formData.preference, 1);

      trackConversion({
        type: 'signup_start',
        element: 'lead_magnet_form',
        page: typeof window !== 'undefined' ? window.location.pathname : '/',
        timestamp: Date.now(),
        sessionId: getSessionId(),
        metadata: {
          conversion_type: 'lead_magnet',
          preference: formData.preference,
          user_name: formData.name
        }
      });

      // Simulate API call (replace with actual email service)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success handling
      setIsSuccess(true);
      onSuccess?.(formData);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({ name: '', email: '', preference: 'sample' });
        setIsSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Lead magnet submission failed:', error);
      onError?.('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🎉</div>
        <h4 className="text-2xl font-bold text-[#29E7CD] mb-2">
          Check your email!
        </h4>
        <p className="text-gray-300">
          We've sent you the sample dashboard.
          <br />
          It should arrive in the next few minutes.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
          Your name *
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Your name"
          className={`w-full px-4 py-3 rounded-xl border bg-[#1f1f1f]/80 text-white placeholder-gray-400 focus:outline-none transition-colors ${
            errors.name 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-gray-600 focus:border-[#29E7CD]'
          }`}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-400">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          Your email *
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="your@email.com"
          className={`w-full px-4 py-3 rounded-xl border bg-[#1f1f1f]/80 text-white placeholder-gray-400 focus:outline-none transition-colors ${
            errors.email 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-gray-600 focus:border-[#29E7CD]'
          }`}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-400">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Get your sample dashboard
        </label>
        <div className="p-3 rounded-xl border border-gray-600 bg-[#1f1f1f]/80">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full border-2 mr-3 border-[#29E7CD] bg-[#29E7CD]">
              <div className="w-2 h-2 rounded-full bg-white m-0.5" />
            </div>
            <span className="text-sm text-gray-300">Sample Dashboard</span>
          </div>
        </div>
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

      <p className="text-xs text-gray-400 text-center">
        No spam. No lock-in. Your data stays private.
        <br />
        We'll only email you about PrepFlow updates.
      </p>
    </form>
  );
}
