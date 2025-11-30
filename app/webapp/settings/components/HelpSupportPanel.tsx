'use client';

import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { HelpCircle, Mail, MessageSquare, FileText, Video, Bug } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

/**
 * Help and support panel component for settings page.
 * Provides links to support resources and contact options.
 *
 * @component
 * @returns {JSX.Element} Help and support panel
 */
export function HelpSupportPanel() {
  const { showSuccess, showError } = useNotification();
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    type: 'question' as 'bug' | 'feature' | 'question' | 'other',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/support/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to submit request');
      }

      showSuccess('Support request submitted successfully. We will respond within 48 hours.');
      setFormData({ subject: '', message: '', type: 'question' });
      setShowForm(false);
    } catch (error) {
      logger.error('Failed to submit support request:', error);
      showError(error instanceof Error ? error.message : 'Failed to submit support request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mb-6 space-y-4 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]/50 p-6">
      <div>
        <h2 className="text-xl font-semibold">Help & Support</h2>
        <p className="mt-1 text-sm text-gray-300">
          Get help, report issues, or request new features.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-3 desktop:grid-cols-2">
        <a
          href="mailto:hello@prepflow.org?subject=PrepFlow Support"
          className="flex items-center gap-3 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/20 p-4 transition-colors hover:bg-[#2a2a2a]/40"
        >
          <Icon icon={Mail} size="md" className="text-[#29E7CD]" aria-hidden={true} />
          <div>
            <p className="font-medium text-white">Email Support</p>
            <p className="text-xs text-gray-400">hello@prepflow.org</p>
          </div>
        </a>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-3 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/20 p-4 transition-colors hover:bg-[#2a2a2a]/40"
        >
          <Icon icon={MessageSquare} size="md" className="text-[#29E7CD]" aria-hidden={true} />
          <div>
            <p className="font-medium text-white">Contact Form</p>
            <p className="text-xs text-gray-400">Submit a support request</p>
          </div>
        </button>

        <Link
          href="/#faq"
          className="flex items-center gap-3 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/20 p-4 transition-colors hover:bg-[#2a2a2a]/40"
        >
          <Icon icon={HelpCircle} size="md" className="text-[#29E7CD]" aria-hidden={true} />
          <div>
            <p className="font-medium text-white">FAQ</p>
            <p className="text-xs text-gray-400">Frequently asked questions</p>
          </div>
        </Link>

        <Link
          href="/#resources"
          className="flex items-center gap-3 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/20 p-4 transition-colors hover:bg-[#2a2a2a]/40"
        >
          <Icon icon={FileText} size="md" className="text-[#29E7CD]" aria-hidden={true} />
          <div>
            <p className="font-medium text-white">Documentation</p>
            <p className="text-xs text-gray-400">User guides and tutorials</p>
          </div>
        </Link>
      </div>

      {/* Support Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 border-t border-[#2a2a2a] pt-4">
          <div>
            <label htmlFor="support-type" className="mb-2 block text-sm font-medium text-gray-300">
              Request Type
            </label>
            <select
              id="support-type"
              value={formData.type}
              onChange={e =>
                setFormData({ ...formData, type: e.target.value as typeof formData.type })
              }
              className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            >
              <option value="question">Question</option>
              <option value="bug">Report a Bug</option>
              <option value="feature">Feature Request</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="support-subject" className="mb-2 block text-sm font-medium text-gray-300">
              Subject
            </label>
            <input
              id="support-subject"
              type="text"
              value={formData.subject}
              onChange={e => setFormData({ ...formData, subject: e.target.value })}
              required
              maxLength={200}
              className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              placeholder="Brief description of your request"
            />
          </div>

          <div>
            <label htmlFor="support-message" className="mb-2 block text-sm font-medium text-gray-300">
              Message
            </label>
            <textarea
              id="support-message"
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              required
              minLength={10}
              maxLength={5000}
              rows={5}
              className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              placeholder="Please provide as much detail as possible..."
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setFormData({ subject: '', message: '', type: 'question' });
              }}
              className="rounded-2xl border border-[#2a2a2a] px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-[#2a2a2a]/40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

