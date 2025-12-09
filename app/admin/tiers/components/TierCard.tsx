'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { CheckCircle, Edit, Save, Trash2, X, XCircle } from 'lucide-react';
import type { TierSlug } from '@/lib/tier-config';
import type { TierConfiguration } from '../types';

interface TierCardProps {
  tier: TierConfiguration;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (tier: TierConfiguration) => void;
  onDisable: () => void;
}

const tierNames: Record<TierSlug, string> = {
  starter: 'Starter',
  pro: 'Pro',
  business: 'Business',
};

/**
 * Tier card component for admin dashboard.
 * Displays and allows editing of tier configuration (price, features, limits).
 *
 * @component
 * @param {TierCardProps} props - Component props
 * @param {TierConfiguration} props.tier - Tier configuration to display/edit
 * @param {boolean} props.isEditing - Whether tier is in edit mode
 * @param {Function} props.onEdit - Callback to enter edit mode
 * @param {Function} props.onCancel - Callback to cancel editing
 * @param {Function} props.onSave - Callback to save tier changes
 * @param {Function} props.onDisable - Callback to disable tier
 * @returns {JSX.Element} Tier card component
 */
export function TierCard({ tier, isEditing, onEdit, onCancel, onSave, onDisable }: TierCardProps) {
  const [editedTier, setEditedTier] = useState<TierConfiguration>(tier);

  useEffect(() => {
    setEditedTier(tier);
  }, [tier]);

  const featureCount = Object.values(editedTier.features).filter(Boolean).length;
  const totalFeatures = Object.keys(editedTier.features).length;

  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">{tierNames[tier.tier_slug]}</h3>
          <p className="mt-1 text-sm text-gray-400">Tier: {tier.tier_slug}</p>
        </div>
        <div className="flex items-center gap-2">
          {tier.is_active ? (
            <span className="flex items-center gap-1 text-sm text-green-400">
              <Icon icon={CheckCircle} size="sm" />
              Active
            </span>
          ) : (
            <span className="flex items-center gap-1 text-sm text-red-400">
              <Icon icon={XCircle} size="sm" />
              Disabled
            </span>
          )}
          {!isEditing && (
            <>
              <button
                onClick={onEdit}
                className="text-[#29E7CD] transition-colors hover:text-[#29E7CD]/80"
              >
                <Icon icon={Edit} size="sm" />
              </button>
              {tier.is_active && (
                <button
                  onClick={onDisable}
                  className="text-red-400 transition-colors hover:text-red-300"
                >
                  <Icon icon={Trash2} size="sm" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-400">Display Name</label>
              <input
                type="text"
                value={editedTier.name}
                onChange={e => setEditedTier({ ...editedTier, name: e.target.value })}
                className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white focus:border-[#29E7CD] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-400">Display Order</label>
              <input
                type="number"
                value={editedTier.display_order}
                onChange={e =>
                  setEditedTier({ ...editedTier, display_order: parseInt(e.target.value) || 0 })
                }
                className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white focus:border-[#29E7CD] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-400">
                Monthly Price (AUD)
              </label>
              <input
                type="number"
                step="0.01"
                value={editedTier.price_monthly || ''}
                onChange={e =>
                  setEditedTier({
                    ...editedTier,
                    price_monthly: e.target.value ? parseFloat(e.target.value) : null,
                  })
                }
                className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white focus:border-[#29E7CD] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-400">
                Yearly Price (AUD)
              </label>
              <input
                type="number"
                step="0.01"
                value={editedTier.price_yearly || ''}
                onChange={e =>
                  setEditedTier({
                    ...editedTier,
                    price_yearly: e.target.value ? parseFloat(e.target.value) : null,
                  })
                }
                className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white focus:border-[#29E7CD] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-400">Limits</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs text-gray-500">Recipes Limit</label>
                <input
                  type="number"
                  value={editedTier.limits.recipes || ''}
                  onChange={e =>
                    setEditedTier({
                      ...editedTier,
                      limits: {
                        ...editedTier.limits,
                        recipes: e.target.value ? parseInt(e.target.value) : undefined,
                      },
                    })
                  }
                  placeholder="Unlimited"
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white focus:border-[#29E7CD] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">Ingredients Limit</label>
                <input
                  type="number"
                  value={editedTier.limits.ingredients || ''}
                  onChange={e =>
                    setEditedTier({
                      ...editedTier,
                      limits: {
                        ...editedTier.limits,
                        ingredients: e.target.value ? parseInt(e.target.value) : undefined,
                      },
                    })
                  }
                  placeholder="Unlimited"
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white focus:border-[#29E7CD] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-400">Features</label>
            <div className="grid max-h-64 grid-cols-2 gap-2 overflow-y-auto">
              {Object.entries(editedTier.features).map(([key, value]) => (
                <label key={key} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={e =>
                      setEditedTier({
                        ...editedTier,
                        features: { ...editedTier.features, [key]: e.target.checked },
                      })
                    }
                    className="rounded border-[#2a2a2a] bg-[#0a0a0a] text-[#29E7CD] focus:ring-[#29E7CD]"
                  />
                  <span className="text-sm text-gray-300">{key}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onSave(editedTier)}
              className="flex items-center gap-2 rounded-lg bg-[#29E7CD]/10 px-4 py-2 text-[#29E7CD] transition-colors hover:bg-[#29E7CD]/20"
            >
              <Icon icon={Save} size="sm" />
              Save
            </button>
            <button
              onClick={onCancel}
              className="flex items-center gap-2 rounded-lg bg-[#2a2a2a] px-4 py-2 text-gray-300 transition-colors hover:bg-[#2a2a2a]/80"
            >
              <Icon icon={X} size="sm" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="mb-1 text-xs text-gray-500">Monthly Price</p>
              <p className="font-semibold text-white">
                {tier.price_monthly ? `$${tier.price_monthly.toFixed(2)}` : 'Not set'}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs text-gray-500">Yearly Price</p>
              <p className="font-semibold text-white">
                {tier.price_yearly ? `$${tier.price_yearly.toFixed(2)}` : 'Not set'}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs text-gray-500">Features</p>
              <p className="font-semibold text-white">
                {featureCount} / {totalFeatures}
              </p>
            </div>
          </div>

          {tier.limits.recipes !== undefined || tier.limits.ingredients !== undefined ? (
            <div>
              <p className="mb-1 text-xs text-gray-500">Limits</p>
              <div className="flex gap-4 text-sm text-gray-300">
                {tier.limits.recipes !== undefined && <span>Recipes: {tier.limits.recipes}</span>}
                {tier.limits.ingredients !== undefined && (
                  <span>Ingredients: {tier.limits.ingredients}</span>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400">Unlimited recipes and ingredients</p>
          )}
        </div>
      )}
    </div>
  );
}
