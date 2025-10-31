'use client';

import React from 'react';
import { useTranslation } from '@/lib/useTranslation';

interface KitchenSection {
  id: string;
  name: string;
}
interface Ingredient {
  id: string;
  name: string;
  unit: string;
}

interface PrepListFormData {
  kitchenSectionId: string;
  name: string;
  notes: string;
  items: Array<{ ingredientId: string; quantity: string; unit: string; notes: string }>;
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

  const addItem = () =>
    setFormData({
      ...formData,
      items: [...formData.items, { ingredientId: '', quantity: '', unit: '', notes: '' }],
    });
  const removeItem = (index: number) =>
    setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });
  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value } as any;
    setFormData({ ...formData, items: newItems });
  };

  return (
    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          {isEditing
            ? t('prepLists.editPrepList', 'Edit Prep List')
            : t('prepLists.createPrepList', 'Create Prep List')}
        </h2>
        <button onClick={onClose} className="p-2 text-gray-400 transition-colors hover:text-white">
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

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              {t('prepLists.kitchenSection', 'Kitchen Section')}
            </label>
            <select
              value={formData.kitchenSectionId}
              onChange={e => setFormData({ ...formData, kitchenSectionId: e.target.value })}
              className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
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
            <label className="mb-2 block text-sm font-medium text-gray-300">
              {t('prepLists.name', 'Prep List Name')}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              placeholder="e.g., Morning Prep - Hot Kitchen"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            {t('prepLists.notes', 'Notes')}
          </label>
          <textarea
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
            className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-3 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
            rows={3}
            placeholder={String(
              t('prepLists.notesPlaceholder', 'Optional notes about this prep list'),
            )}
          />
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">{t('prepLists.items', 'Items')}</h3>
            <button
              type="button"
              onClick={addItem}
              className="rounded-xl bg-[#29E7CD]/10 px-4 py-2 text-sm font-semibold text-[#29E7CD] transition-colors hover:bg-[#29E7CD]/20"
            >
              + {t('prepLists.addItem', 'Add Item')}
            </button>
          </div>
          <div className="space-y-3">
            {formData.items.map((item, index) => (
              <div key={index} className="rounded-xl bg-[#2a2a2a]/30 p-4">
                <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-4">
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs text-gray-400">
                      {t('prepLists.ingredient', 'Ingredient')}
                    </label>
                    <select
                      value={item.ingredientId}
                      onChange={e => updateItem(index, 'ingredientId', e.target.value)}
                      className="w-full rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] px-3 py-2 text-sm text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
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
                    <label className="mb-1 block text-xs text-gray-400">
                      {t('prepLists.quantity', 'Quantity')}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={item.quantity}
                      onChange={e => updateItem(index, 'quantity', e.target.value)}
                      className="w-full rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] px-3 py-2 text-sm text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                      placeholder="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-400">
                      {t('prepLists.unit', 'Unit')}
                    </label>
                    <input
                      type="text"
                      value={item.unit}
                      onChange={e => updateItem(index, 'unit', e.target.value)}
                      className="w-full rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] px-3 py-2 text-sm text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
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
                    className="mr-3 flex-1 rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] px-3 py-2 text-sm text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                    placeholder={String(t('prepLists.itemNotes', 'Item notes (optional)'))}
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-400/10"
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
            className="flex-1 rounded-xl bg-[#2a2a2a] px-4 py-3 text-gray-300 transition-colors hover:bg-[#2a2a2a]/80"
          >
            {t('prepLists.cancel', 'Cancel')}
          </button>
          <button
            type="submit"
            className="flex-1 rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-3 font-semibold text-white transition-all duration-200 hover:shadow-xl"
          >
            {isEditing ? t('prepLists.update', 'Update') : t('prepLists.create', 'Create')}
          </button>
        </div>
      </form>
    </div>
  );
}
