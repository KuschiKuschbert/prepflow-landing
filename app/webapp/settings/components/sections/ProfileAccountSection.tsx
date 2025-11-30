'use client';

import dynamic from 'next/dynamic';
import { SectionSkeleton } from '../SectionSkeleton';
// Import ProfileInformationPanel directly - it's the first panel and should load immediately
import { ProfileInformationPanel } from '../ProfileInformationPanel';

// Lazy load AvatarSelectionPanel only (ProfileInformationPanel loads immediately)
const AvatarSelectionPanel = dynamic(
  () => import('../AvatarSelectionPanel').then(mod => ({ default: mod.AvatarSelectionPanel })),
  {
    loading: () => <SectionSkeleton />,
    ssr: false,
  },
);

/**
 * Profile & Account section component.
 * Combines profile information and avatar selection.
 * Region/units are handled by RegionSelector in the settings header.
 *
 * @component
 * @returns {JSX.Element} Profile & Account section
 */
export function ProfileAccountSection() {
  return (
    <div className="space-y-6">
      <ProfileInformationPanel />
      <AvatarSelectionPanel />
    </div>
  );
}
