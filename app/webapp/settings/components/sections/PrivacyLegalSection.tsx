'use client';

import dynamic from 'next/dynamic';
import { SectionSkeleton } from '../SectionSkeleton';

// Lazy load panels for better performance
const PrivacyControlsPanel = dynamic(
  () => import('../PrivacyControlsPanel').then(mod => ({ default: mod.PrivacyControlsPanel })),
  {
    loading: () => <SectionSkeleton />,
    ssr: false,
  },
);

const LegalCompliancePanel = dynamic(
  () => import('../LegalCompliancePanel').then(mod => ({ default: mod.LegalCompliancePanel })),
  {
    loading: () => <SectionSkeleton />,
    ssr: false,
  },
);

/**
 * Privacy & Legal section component.
 * Combines privacy controls and legal compliance.
 *
 * @component
 * @returns {JSX.Element} Privacy & Legal section
 */
export function PrivacyLegalSection() {
  return (
    <div className="space-y-6">
      <PrivacyControlsPanel />
      <LegalCompliancePanel />
    </div>
  );
}
