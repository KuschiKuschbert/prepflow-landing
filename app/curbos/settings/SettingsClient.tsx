'use client';

import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useUserProfile } from '@/hooks/useUserProfile';
import { ReleaseData } from '@/lib/github-release';
import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase-pos';
import { useEffect, useState } from 'react';
import { DataManagementSection } from './components/DataManagementSection';
import { PublicLinkSection } from './components/PublicLinkSection';
import { ReleaseInfoSection } from './components/ReleaseInfoSection';

interface SettingsClientProps {
  releaseData: ReleaseData | null;
}

/**
 * CurbOS settings client component
 * Manages public display link generation and displays server-fetched release info
 */
export default function SettingsClient({ releaseData }: SettingsClientProps) {
  const [posUserEmail, setPosUserEmail] = useState<string | null>(null);

  // PrepFlow Admin Bypass
  const { isAdmin } = useIsAdmin();
  const { profile } = useUserProfile();

  // Unified email for display/checks
  const userEmail = posUserEmail || (isAdmin ? profile?.email : null);
  const canGenerate = isAdmin || !!posUserEmail;

  useEffect(() => {
    // Get user email from Supabase session
    async function getPosUserEmail() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user?.email) {
          setPosUserEmail(session.user.email);
        }
      } catch (error) {
        logger.error('[CurbOS Settings] Error getting user email:', error);
      }
    }
    getPosUserEmail();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 tablet:px-6 py-8 tablet:py-12">
      <div className="mb-8">
        <h2 className="text-2xl tablet:text-3xl desktop:text-4xl font-bold text-white mb-2">
          Settings
        </h2>
        <p className="text-neutral-400 text-sm tablet:text-base">
          Manage your CurbOS configuration and public display link.
        </p>
      </div>

      <PublicLinkSection
        isAdmin={isAdmin}
        canGenerate={canGenerate}
        posUserEmail={posUserEmail}
        adminEmail={profile?.email}
      />

      <ReleaseInfoSection releaseData={releaseData} />

      <DataManagementSection />
    </div>
  );
}
