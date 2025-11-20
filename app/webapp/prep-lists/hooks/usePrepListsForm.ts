/**
 * Hook for managing prep list form state and submission.
 */

import { useState, useCallback } from 'react';
import type { PrepList, PrepListFormData } from '../types';
import { submitPrepListForm as submitPrepListFormHelper } from './usePrepListsForm/formSubmission';

interface UsePrepListsFormProps {
  prepLists: PrepList[];
  setPrepLists: React.Dispatch<React.SetStateAction<PrepList[]>>;
  refetchPrepLists: () => Promise<unknown>;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  userId: string;
}

/**
 * Hook for managing prep list form state and submission.
 *
 * @param {UsePrepListsFormProps} props - Hook dependencies
 * @returns {Object} Form state and handlers
 */
export function usePrepListsForm({
  prepLists,
  setPrepLists,
  refetchPrepLists,
  showError,
  showSuccess,
  userId,
}: UsePrepListsFormProps) {
  const [formData, setFormData] = useState<PrepListFormData>({
    kitchenSectionId: '',
    name: '',
    notes: '',
    items: [],
  });
  const [editingPrepList, setEditingPrepList] = useState<PrepList | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setFormData({
      kitchenSectionId: '',
      name: '',
      notes: '',
      items: [],
    });
    setEditingPrepList(null);
    setError(null);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await submitPrepListFormHelper({
        formData,
        editingPrepList,
        userId,
        prepLists,
        setPrepLists,
        showError,
        showSuccess,
        resetForm,
        refetchPrepLists,
        setError,
      });
    },
    [
      formData,
      editingPrepList,
      userId,
      prepLists,
      setPrepLists,
      showError,
      showSuccess,
      resetForm,
      refetchPrepLists,
      setError,
    ],
  );

  const addItem = useCallback(() => {
    setFormData({
      ...formData,
      items: [...formData.items, { ingredientId: '', quantity: '', unit: '', notes: '' }],
    });
  }, [formData]);

  const removeItem = useCallback(
    (index: number) => {
      setFormData({
        ...formData,
        items: formData.items.filter((_, i) => i !== index),
      });
    },
    [formData],
  );

  const updateItem = useCallback(
    (index: number, field: string, value: string) => {
      const newItems = [...formData.items];
      newItems[index] = { ...newItems[index], [field]: value };
      setFormData({ ...formData, items: newItems });
    },
    [formData],
  );

  const handleEdit = useCallback((prepList: PrepList) => {
    setEditingPrepList(prepList);
    setFormData({
      kitchenSectionId: prepList.kitchen_section_id,
      name: prepList.name,
      notes: prepList.notes || '',
      items: prepList.prep_list_items.map(item => ({
        ingredientId: item.ingredient_id,
        quantity: item.quantity.toString(),
        unit: item.unit,
        notes: item.notes || '',
      })),
    });
  }, []);

  return {
    formData,
    setFormData,
    editingPrepList,
    error,
    handleSubmit,
    resetForm,
    addItem,
    removeItem,
    updateItem,
    handleEdit,
    setError,
  };
}
