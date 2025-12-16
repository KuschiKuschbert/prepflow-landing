'use client';

import { useState } from 'react';
import { useEntitlements } from '@/hooks/useEntitlements';
import { UpgradePrompt } from './UpgradePrompt';
import type { TierSlug } from '@/lib/tier-config';

interface FeatureGateProps {
  featureKey: string;
  requiredTier: TierSlug;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Wrapper component that gates features based on user tier.
 * Shows upgrade prompt if user doesn't have required tier.
 */
export function FeatureGate({ featureKey, requiredTier, children, fallback }: FeatureGateProps) {
  const { tier, hasFeature, loading } = useEntitlements();
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  if (loading) {
    return fallback || null;
  }

  // Check if user has the feature
  const hasAccess = hasFeature(featureKey);

  // Check tier hierarchy
  const tierOrder: TierSlug[] = ['starter', 'pro', 'business'];
  const currentTierIndex = tierOrder.indexOf(tier);
  const requiredTierIndex = tierOrder.indexOf(requiredTier);
  const tierAccess = currentTierIndex >= requiredTierIndex;

  if (hasAccess && tierAccess) {
    return <>{children}</>;
  }

  // Show fallback or upgrade CTA
  return (
    <>
      {fallback || (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <p className="mb-4 text-[var(--foreground-muted)]">This feature requires {requiredTier} tier</p>
          <button
            onClick={() => setShowUpgradePrompt(true)}
            className="text-[var(--primary)] underline transition-colors hover:text-[var(--primary)]/80"
          >
            Upgrade Now
          </button>
        </div>
      )}
      {showUpgradePrompt && (
        <UpgradePrompt
          isOpen={showUpgradePrompt}
          onClose={() => setShowUpgradePrompt(false)}
          featureKey={featureKey}
          currentTier={tier}
          requiredTier={requiredTier}
        />
      )}
    </>
  );
}
