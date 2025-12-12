import { FormData } from '../../types';
import { KitchenSection } from '../../types';

interface HandleSubmitParams {
  editingSection: KitchenSection | null;
  formData: FormData;
  userId: string;
  fetchKitchenSections: () => Promise<void>;
  resetForm: () => void;
  setError: (error: string | null) => void;
}

export async function handleSubmit({
  editingSection,
  formData,
  userId,
  fetchKitchenSections,
  resetForm,
  setError,
}: HandleSubmitParams) {
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
}




