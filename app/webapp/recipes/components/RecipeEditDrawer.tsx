'use client';

import { AutosaveStatus } from '@/components/ui/AutosaveStatus';
import { EditDrawer } from '@/components/ui/EditDrawer';
import { useAutosave } from '@/hooks/useAutosave';
import { deriveAutosaveId } from '@/lib/autosave-id';
import { useNotification } from '@/contexts/NotificationContext';
import { Recipe } from '../types';
import { useCallback, useEffect, useState } from 'react';

import { logger } from '@/lib/logger';
interface RecipeEditDrawerProps {
  isOpen: boolean;
  recipe: Recipe | null;
  onClose: () => void;
  onRefresh?: () => Promise<void>;
}

export function RecipeEditDrawer({ isOpen, recipe, onClose, onRefresh }: RecipeEditDrawerProps) {
  const { showWarning } = useNotification();
  const [editedName, setEditedName] = useState('');
  const [editedYield, setEditedYield] = useState(1);
  const [editedInstructions, setEditedInstructions] = useState('');
  const [saving, setSaving] = useState(false);

  // Initialize edited values when recipe changes
  useEffect(() => {
    if (recipe) {
      setEditedName(recipe.recipe_name || '');
      setEditedYield(recipe.yield || 1);
      setEditedInstructions(recipe.instructions || '');
    }
  }, [recipe]);

  // Autosave integration
  const entityId = deriveAutosaveId('recipes', recipe?.id, [editedName]);
  const canAutosave = Boolean(editedName && recipe);

  const {
    status,
    error: autosaveError,
    saveNow,
  } = useAutosave({
    entityType: 'recipes',
    entityId: entityId,
    data: {
      id: recipe?.id,
      name: editedName,
      yield: editedYield,
      instructions: editedInstructions,
    },
    enabled: canAutosave && isOpen,
  });

  const handleSave = useCallback(async () => {
    if (!recipe || !editedName.trim()) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/recipes/${recipe.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editedName.trim(),
          yield: editedYield,
          instructions: editedInstructions,
        }),
      });
      if (response.ok) {
        if (onRefresh) {
          await onRefresh();
        }
        onClose();
      } else {
        const error = await response.json();
        showWarning(error.message || 'Failed to save recipe');
      }
    } catch (err) {
      logger.error('Failed to save recipe:', err);
      showWarning('Failed to save recipe');
    } finally {
      setSaving(false);
    }
  }, [recipe, editedName, editedYield, editedInstructions, onClose, onRefresh, showWarning]);

  if (!recipe) return null;

  const capitalizeRecipeName = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <EditDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit ${capitalizeRecipeName(recipe.recipe_name)}`}
      maxWidth="xl"
      onSave={handleSave}
      saving={saving || status === 'saving'}
      footer={
        <div className="flex items-center justify-between">
          <AutosaveStatus status={status} error={autosaveError} onRetry={saveNow} />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl bg-[#2a2a2a] px-4 py-2.5 font-semibold text-white transition-all duration-300 hover:bg-[#3a3a3a]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || status === 'saving' || !editedName.trim()}
              className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#3B82F6] px-4 py-2.5 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#29E7CD]/25 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving || status === 'saving' ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Recipe Name *</label>
          <input
            type="text"
            required
            value={editedName}
            onChange={e => setEditedName(e.target.value)}
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
            placeholder="e.g., Chicken Stir-fry"
            onBlur={async e => {
              const name = e.target.value.trim().toLowerCase();
              if (!name || name === recipe.recipe_name.toLowerCase()) return;
              try {
                const res = await fetch(`/api/recipes/exists?name=${encodeURIComponent(name)}`, {
                  cache: 'no-store',
                });
                const json = await res.json();
                if (json?.exists) {
                  showWarning('A recipe with this name already exists.');
                }
              } catch {}
            }}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Yield Portions</label>
          <input
            type="number"
            min="1"
            value={editedYield}
            onChange={e => setEditedYield(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">Instructions</label>
          <textarea
            value={editedInstructions}
            onChange={e => setEditedInstructions(e.target.value)}
            rows={8}
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
            placeholder="Step-by-step cooking instructions..."
          />
        </div>
      </div>
    </EditDrawer>
  );
}
