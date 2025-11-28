'use client';
import { useCallback } from 'react';
import { KitchenSection, MenuDish, FormData } from './types';
import { handleSubmit as submitForm } from './useDishSectionActions/helpers/handleSubmit';
import { useHandleDelete } from './useDishSectionActions/helpers/handleDelete';
import { handleAssignDish as assignDish } from './useDishSectionActions/helpers/handleAssignDish';
import { handleEdit as editSection } from './useDishSectionActions/helpers/handleEdit';

interface UseDishSectionActionsProps {
  userId: string;
  kitchenSections: KitchenSection[];
  menuDishes: MenuDish[];
  editingSection: KitchenSection | null;
  formData: FormData;
  setKitchenSections: React.Dispatch<React.SetStateAction<KitchenSection[]>>;
  setMenuDishes: React.Dispatch<React.SetStateAction<MenuDish[]>>;
  setError: (error: string | null) => void;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
  setShowForm: (show: boolean) => void;
  setEditingSection: (section: KitchenSection | null) => void;
  fetchKitchenSections: () => Promise<void>;
  fetchMenuDishes: () => Promise<void>;
}

export function useDishSectionActions({
  userId,
  menuDishes,
  editingSection,
  formData,
  setError,
  setFormData,
  setShowForm,
  setEditingSection,
  fetchKitchenSections,
  fetchMenuDishes,
}: UseDishSectionActionsProps) {
  const resetForm = useCallback(() => {
    setFormData({ name: '', description: '', color: '#29E7CD' });
    setShowForm(false);
    setEditingSection(null);
  }, [setFormData, setShowForm, setEditingSection]);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await submitForm({
        editingSection,
        formData,
        userId,
        fetchKitchenSections,
        resetForm,
        setError,
      });
    },
    [editingSection, formData, userId, fetchKitchenSections, resetForm, setError],
  );

  const onEdit = useCallback(
    (section: KitchenSection) => {
      editSection(section, { setEditingSection, setFormData, setShowForm });
    },
    [setEditingSection, setFormData, setShowForm],
  );

  const { handleDelete, ConfirmDialog } = useHandleDelete({
    fetchKitchenSections,
    fetchMenuDishes,
    setError,
  });

  const onAssignDish = useCallback(
    async (dishId: string, sectionId: string | null) => {
      await assignDish(dishId, sectionId, {
        fetchMenuDishes,
        fetchKitchenSections,
        setError,
      });
    },
    [fetchMenuDishes, fetchKitchenSections, setError],
  );

  const getUnassignedDishes = useCallback(
    () => menuDishes.filter(dish => !dish.kitchen_section_id),
    [menuDishes],
  );

  return {
    handleSubmit: onSubmit,
    handleEdit: onEdit,
    handleDelete,
    handleAssignDish: onAssignDish,
    resetForm,
    getUnassignedDishes,
    ConfirmDialog,
  };
}
