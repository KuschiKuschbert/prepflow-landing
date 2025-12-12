'use client';

import { useRouter } from 'next/navigation';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { Icon } from './Icon';
import { getTierComparison, getUpgradeMessage } from '@/lib/upgrade-utils';
import type { TierSlug } from '@/lib/tier-config';
import { Button } from './Button';

interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  featureKey: string;
  currentTier: TierSlug;
  requiredTier: TierSlug;
}

export function UpgradePrompt({
  isOpen,
  onClose,
  featureKey,
  currentTier,
  requiredTier,
}: UpgradePromptProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const comparison = getTierComparison(currentTier, requiredTier);
  const newFeatures = comparison.features.filter(f => !f.currentTierHas && f.targetTierHas);

  const tierNames: Record<TierSlug, string> = {
    starter: 'Starter',
    pro: 'Pro',
    business: 'Business',
  };

  const handleUpgrade = () => {
    router.push('/webapp/settings/billing');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="desktop:p-8 relative z-50 w-full max-w-lg rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 transition-colors hover:text-white"
          aria-label="Close"
        >
          <Icon icon={X} size="md" />
        </button>

        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-gradient-to-r from-[#29E7CD]/20 via-[#D925C7]/20 via-[#FF6B00]/20 to-[#29E7CD]/20 p-3">
            <Icon icon={Sparkles} size="lg" className="text-[#29E7CD]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Ready to level up?</h2>
            <p className="text-sm text-gray-400">Here&apos;s what you&apos;re missing</p>
          </div>
        </div>

        {/* Feature message */}
        <div className="mb-6 rounded-xl border border-[#29E7CD]/20 bg-[#2a2a2a]/50 p-4">
          <p className="text-white">{getUpgradeMessage(featureKey, currentTier, requiredTier)}</p>
        </div>

        {/* New features list */}
        {newFeatures.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-white">
              What you&apos;ll get with {tierNames[requiredTier]}:
            </h3>
            <ul className="space-y-2">
              {newFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-300">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#29E7CD]" />
                  <span>{feature.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={handleUpgrade}
            className="flex-1 bg-gradient-to-r from-[#29E7CD] via-[#FF6B00] to-[#D925C7] transition-all hover:shadow-lg"
          >
            Upgrade to {tierNames[requiredTier]}
            <Icon icon={ArrowRight} size="sm" className="ml-2" />
          </Button>
          <Button onClick={onClose} variant="secondary" className="px-6">
            Maybe Later
          </Button>
        </div>
      </div>
    </div>
  );
}




