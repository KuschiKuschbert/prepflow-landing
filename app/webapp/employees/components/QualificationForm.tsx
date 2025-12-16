'use client';

import React, { useState } from 'react';
import { QualificationType, QualificationFormData } from '../types';

interface QualificationFormProps {
  qualificationTypes: QualificationType[];
  onSubmit: (data: QualificationFormData) => void;
  onCancel: () => void;
}

export function QualificationForm({
  qualificationTypes,
  onSubmit,
  onCancel,
}: QualificationFormProps) {
  const [formData, setFormData] = useState<QualificationFormData>({
    qualification_type_id: '',
    certificate_number: '',
    issue_date: new Date().toISOString().split('T')[0],
    expiry_date: '',
    issuing_authority: '',
    document_url: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)]/50 p-4">
      <h4 className="mb-4 font-semibold text-[var(--foreground)]">Add Qualification</h4>
      <form onSubmit={handleSubmit} className="desktop:grid-cols-2 grid grid-cols-1 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            Qualification Type <span className="text-[var(--color-error)]">*</span>
          </label>
          <select
            value={formData.qualification_type_id}
            onChange={e => setFormData({ ...formData, qualification_type_id: e.target.value })}
            className="w-full rounded-xl border border-[#1f1f1f] bg-[var(--surface)] px-3 py-2 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            required
          >
            <option value="">Select qualification type</option>
            {qualificationTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.name} {type.is_required && '(Required)'}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">Certificate Number</label>
          <input
            type="text"
            value={formData.certificate_number}
            onChange={e => setFormData({ ...formData, certificate_number: e.target.value })}
            className="w-full rounded-xl border border-[#1f1f1f] bg-[var(--surface)] px-3 py-2 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            Issue Date <span className="text-[var(--color-error)]">*</span>
          </label>
          <input
            type="date"
            value={formData.issue_date}
            onChange={e => setFormData({ ...formData, issue_date: e.target.value })}
            className="w-full rounded-xl border border-[#1f1f1f] bg-[var(--surface)] px-3 py-2 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">Expiry Date</label>
          <input
            type="date"
            value={formData.expiry_date}
            onChange={e => setFormData({ ...formData, expiry_date: e.target.value })}
            className="w-full rounded-xl border border-[#1f1f1f] bg-[var(--surface)] px-3 py-2 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">Issuing Authority</label>
          <input
            type="text"
            value={formData.issuing_authority}
            onChange={e => setFormData({ ...formData, issuing_authority: e.target.value })}
            className="w-full rounded-xl border border-[#1f1f1f] bg-[var(--surface)] px-3 py-2 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="e.g., Food Standards Australia"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">Document URL</label>
          <input
            type="url"
            value={formData.document_url}
            onChange={e => setFormData({ ...formData, document_url: e.target.value })}
            className="w-full rounded-xl border border-[#1f1f1f] bg-[var(--surface)] px-3 py-2 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="Link to certificate document"
          />
        </div>
        <div className="desktop:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">Notes</label>
          <textarea
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
            className="w-full rounded-xl border border-[#1f1f1f] bg-[var(--surface)] px-3 py-2 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            rows={2}
          />
        </div>
        <div className="desktop:col-span-2 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-[#1f1f1f] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-lg"
          >
            Add Qualification
          </button>
        </div>
      </form>
    </div>
  );
}
