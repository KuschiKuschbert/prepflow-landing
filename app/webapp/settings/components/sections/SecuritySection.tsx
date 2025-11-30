'use client';

import { SecurityPanel } from '../SecurityPanel';

/**
 * Security section component.
 * Displays security settings and account security information.
 *
 * @component
 * @returns {JSX.Element} Security section
 */
export function SecuritySection() {
  return (
    <div className="space-y-6">
      <SecurityPanel />
    </div>
  );
}

