import { KitchenSection, FormData } from '../../types';

interface HandleEditParams {
  setEditingSection: (section: KitchenSection | null) => void;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
  setShowForm: (show: boolean) => void;
}

export function handleEdit(
  section: KitchenSection,
  { setEditingSection, setFormData, setShowForm }: HandleEditParams,
) {
  setEditingSection(section);
  setFormData({
    name: section.name,
    description: section.description || '',
    color: section.color,
  });
  setShowForm(true);
}

