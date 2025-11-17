'use client';
import { useCallback } from 'react';
import { KitchenSection, MenuDish, FormData } from './types';
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
  kitchenSections,
  menuDishes,
  editingSection,
  formData,
  setKitchenSections,
  setMenuDishes,
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
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const url = '/api/kitchen-sections';
        const method = editingSection ? 'PUT' : 'POST';
        const body = editingSection
          ? {
              id: editingSection.id,
              name: formData.name,
              description: formData.description,
              color: formData.color,
            }
          : {
              userId,
              name: formData.name,
              description: formData.description,
              color: formData.color,
            };
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const result = await response.json();
        if (result.success) {
          await fetchKitchenSections();
          resetForm();
          setError(null);
        } else {
          setError(result.message || 'Failed to save kitchen section');
        }
      } catch (err) {
        setError('Failed to save kitchen section');
      }
    },
    [editingSection, formData, userId, fetchKitchenSections, resetForm, setError],
  );
  const handleEdit = useCallback(
    (section: KitchenSection) => {
      setEditingSection(section);
      setFormData({
        name: section.name,
        description: section.description || '',
        color: section.color,
      });
      setShowForm(true);
    },
    [setEditingSection, setFormData, setShowForm],
  );
  const handleDelete = useCallback(
    async (id: string) => {
      if (
        !confirm(
          'Are you sure you want to delete this kitchen section? All dishes will be unassigned.',
        )
      )
        return;
      try {
        const response = await fetch(`/api/kitchen-sections?id=${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) {
          await fetchKitchenSections();
          await fetchMenuDishes();
        } else {
          setError(result.message || 'Failed to delete kitchen section');
        }
      } catch (err) {
        setError('Failed to delete kitchen section');
      }
    },
    [fetchKitchenSections, fetchMenuDishes, setError],
  );
  const handleAssignDish = useCallback(
    async (dishId: string, sectionId: string | null) => {
      try {
        const response = await fetch('/api/assign-dish-section', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dishId, sectionId }),
        });
        const result = await response.json();
        if (result.success) {
          await fetchMenuDishes();
          await fetchKitchenSections();
        } else {
          setError(result.message || 'Failed to assign dish to section');
        }
      } catch (err) {
        setError('Failed to assign dish to section');
      }
    },
    [fetchMenuDishes, fetchKitchenSections, setError],
  );
  const getUnassignedDishes = useCallback(
    () => menuDishes.filter(dish => !dish.kitchen_section_id),
    [menuDishes],
  );
  return {
    handleSubmit,
    handleEdit,
    handleDelete,
    handleAssignDish,
    resetForm,
    getUnassignedDishes,
  };
}
