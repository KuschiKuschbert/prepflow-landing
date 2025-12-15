/**
 * Hook for filtering equipment and sections based on selected area
 */

import { useMemo } from 'react';

interface Equipment {
  id: string;
  name: string;
  equipment_type: string;
  location?: string;
}

interface KitchenSection {
  id: string;
  name: string;
}

interface CleaningArea {
  id: string;
  area_name: string;
  description?: string;
}

export function useFilteredOptions(
  equipment: Equipment[],
  sections: KitchenSection[],
  areas: CleaningArea[],
  selectedAreaId: string,
) {
  const filteredEquipment = useMemo(() => {
    if (!selectedAreaId || equipment.length === 0) return equipment;
    const selectedArea = areas.find(a => a.id === selectedAreaId);
    if (!selectedArea) return equipment;

    const areaNameLower = selectedArea.area_name.toLowerCase();
    return equipment.filter(eq => {
      const eqLocationLower = (eq.location || '').toLowerCase();
      const eqNameLower = eq.name.toLowerCase();
      return (
        eqLocationLower.includes(areaNameLower) ||
        areaNameLower.includes(eqLocationLower) ||
        eqNameLower.includes(areaNameLower)
      );
    });
  }, [equipment, selectedAreaId, areas]);

  const filteredSections = useMemo(() => {
    if (!selectedAreaId || sections.length === 0) return sections;
    const selectedArea = areas.find(a => a.id === selectedAreaId);
    if (!selectedArea) return sections;

    const areaNameLower = selectedArea.area_name.toLowerCase();
    return sections.filter(section => {
      const sectionNameLower = section.name.toLowerCase();
      return sectionNameLower.includes(areaNameLower) || areaNameLower.includes(sectionNameLower);
    });
  }, [sections, selectedAreaId, areas]);

  return { filteredEquipment, filteredSections };
}

