/**
 * Hook for fetching form data (areas, equipment, sections)
 */

import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';

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

export function useFormData(isOpen: boolean) {
  const [areas, setAreas] = useState<CleaningArea[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [sections, setSections] = useState<KitchenSection[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFetching(true);
      Promise.all([fetchAreas(), fetchEquipment(), fetchSections()]).finally(() => {
        setFetching(false);
      });
    }
  }, [isOpen]);

  const fetchAreas = async () => {
    try {
      const response = await fetch('/api/cleaning-areas');
      const data = await response.json();
      if (data.success && data.data) {
        setAreas(data.data);
      }
    } catch (error) {
      logger.error('Error fetching areas:', error);
    }
  };

  const fetchEquipment = async () => {
    try {
      const response = await fetch('/api/temperature-equipment');
      const data = await response.json();
      if (data.success && data.data) {
        setEquipment(data.data);
      }
    } catch (error) {
      logger.error('Error fetching equipment:', error);
    }
  };

  const fetchSections = async () => {
    try {
      const response = await fetch('/api/kitchen-sections');
      const data = await response.json();
      if (data.success && data.data) {
        setSections(data.data);
      }
    } catch (error) {
      logger.error('Error fetching sections:', error);
    }
  };

  return { areas, equipment, sections, fetching };
}
