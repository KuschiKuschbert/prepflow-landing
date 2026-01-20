'use client';

import { Icon } from '@/components/ui/Icon';
import { Save, X } from 'lucide-react';
import type { TierConfiguration } from '../types';

interface TierEditFormProps {
  editedTier: TierConfiguration;
  setEditedTier: (tier: TierConfiguration) => void;
  onSave: (tier: TierConfiguration) => void;
  onCancel: () => void;
}

export function TierEditForm({ editedTier, setEditedTier, onSave, onCancel }: TierEditFormProps) {
  return (
    <div className="space-y-4">
      <TierDisplayConfig editedTier={editedTier} setEditedTier={setEditedTier} />
      <TierPricingConfig editedTier={editedTier} setEditedTier={setEditedTier} />
      <TierLimitsConfig editedTier={editedTier} setEditedTier={setEditedTier} />
      <TierFeaturesConfig editedTier={editedTier} setEditedTier={setEditedTier} />

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
  );
}

function TierDisplayConfig({
  editedTier,
  setEditedTier,
}: Pick<TierEditFormProps, 'editedTier' | 'setEditedTier'>) {
  return (
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
  );
}

function TierPricingConfig({
  editedTier,
  setEditedTier,
}: Pick<TierEditFormProps, 'editedTier' | 'setEditedTier'>) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-400">Monthly Price (AUD)</label>
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
        <label className="mb-1 block text-sm font-medium text-gray-400">Yearly Price (AUD)</label>
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
  );
}

function TierLimitsConfig({
  editedTier,
  setEditedTier,
}: Pick<TierEditFormProps, 'editedTier' | 'setEditedTier'>) {
  return (
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
  );
}

function TierFeaturesConfig({
  editedTier,
  setEditedTier,
}: Pick<TierEditFormProps, 'editedTier' | 'setEditedTier'>) {
  return (
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
  );
}
