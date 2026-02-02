'use client';

import { AutosaveStatus } from '@/components/ui/AutosaveStatus';
import { useAutosave } from '@/hooks/useAutosave';
import { useTranslation } from '@/lib/useTranslation';
import React from 'react';

import {
  PrepListFormData as BasePrepListFormData,
  Ingredient,
  KitchenSection,
} from '@/lib/types/prep-lists';

interface PrepListFormData extends BasePrepListFormData {
  id?: string;
}

interface PrepListFormProps {
  sections: KitchenSection[];
  ingredients: Ingredient[];
  formData: PrepListFormData;
  setFormData: (d: PrepListFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isEditing: boolean;
}

export function PrepListForm({
  sections,
  ingredients,
  formData,
  setFormData,
  onSubmit,
  onClose,
  isEditing,
}: PrepListFormProps) {
  const { t } = useTranslation();

  // Autosave integration
  const entityId = formData.id || 'new';
  const canAutosave = entityId !== 'new' || Boolean(formData.kitchenSectionId && formData.name);

  const {
    status,
    error: autosaveError,
    saveNow,
  } = useAutosave({
    entityType: 'prep_lists',
    entityId: entityId,
    data: formData,
    enabled: canAutosave,
  });

  const addItem = () =>
    setFormData({
      ...formData,
      items: [...formData.items, { ingredientId: '', quantity: '', unit: '', notes: '' }],
    });
  const removeItem = (index: number) =>
    setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });
  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  return (
    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">
          {isEditing
            ? t('prepLists.editPrepList', 'Edit Prep List')
            : t('prepLists.createPrepList', 'Create Prep List')}
        </h2>
        <div className="flex items-center gap-3">
          <AutosaveStatus status={status} error={autosaveError} onRetry={saveNow} />
          <button
            onClick={onClose}
            className="p-2 text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="desktop:grid-cols-2 grid grid-cols-1 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
              {t('prepLists.kitchenSection', 'Kitchen Section')}
            </label>
            <select
              value={formData.kitchenSectionId}
              onChange={e => setFormData({ ...formData, kitchenSectionId: e.target.value })}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
              required
            >
              <option value="">{t('prepLists.selectSection', 'Select a kitchen section')}</option>
              {sections.map(section => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
              {t('prepLists.name', 'Prep List Name')}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="e.g., Morning Prep - Hot Kitchen"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
            {t('prepLists.notes', 'Notes')}
          </label>
          <textarea
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3 text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            rows={3}
            placeholder={String(
              t('prepLists.notesPlaceholder', 'Optional notes about this prep list'),
            )}
          />
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">
              {t('prepLists.items', 'Items')}
            </h3>
            <button
              type="button"
              onClick={addItem}
              className="rounded-xl bg-[var(--primary)]/10 px-4 py-2 text-sm font-semibold text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/20"
            >
              + {t('prepLists.addItem', 'Add Item')}
            </button>
          </div>
          <div className="space-y-3">
            {formData.items.map((item, index) => (
              <div key={index} className="rounded-xl bg-[var(--muted)]/30 p-4">
                <div className="tablet:grid-cols-3 desktop:grid-cols-4 mb-3 grid grid-cols-1 gap-3">
                  <div className="desktop:col-span-2">
                    <label className="mb-1 block text-xs text-[var(--foreground-muted)]">
                      {t('prepLists.ingredient', 'Ingredient')}
                    </label>
                    <select
                      value={item.ingredientId}
                      onChange={e => updateItem(index, 'ingredientId', e.target.value)}
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
                      required
                    >
                      <option value="">
                        {t('prepLists.selectIngredient', 'Select ingredient')}
                      </option>
                      {ingredients.map(ingredient => (
                        <option key={ingredient.id} value={ingredient.id}>
                          {ingredient.name} ({ingredient.unit})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-[var(--foreground-muted)]">
                      {t('prepLists.quantity', 'Quantity')}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={item.quantity}
                      onChange={e => updateItem(index, 'quantity', e.target.value)}
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
                      placeholder="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-[var(--foreground-muted)]">
                      {t('prepLists.unit', 'Unit')}
                    </label>
                    <input
                      type="text"
                      value={item.unit}
                      onChange={e => updateItem(index, 'unit', e.target.value)}
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
                      placeholder="kg"
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={item.notes}
                    onChange={e => updateItem(index, 'notes', e.target.value)}
                    className="mr-3 flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
                    placeholder={String(t('prepLists.itemNotes', 'Item notes (optional)'))}
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="rounded-lg p-2 text-[var(--color-error)] transition-colors hover:bg-[var(--color-error)]/10"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl bg-[var(--muted)] px-4 py-3 text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--muted)]/80"
          >
            {t('prepLists.cancel', 'Cancel')}
          </button>
          <button
            type="submit"
            className="flex-1 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-4 py-3 font-semibold text-[var(--button-active-text)] transition-all duration-200 hover:shadow-xl"
          >
            {isEditing ? t('prepLists.update', 'Update') : t('prepLists.create', 'Create')}
          </button>
        </div>
      </form>
    </div>
  );
}
