import { useState } from 'react';
import type { TemperatureEquipment, TemperatureLog } from '../../../types';

/**
 * Hook for managing equipment detail drawer
 */
export function useEquipmentDrawer(equipment: TemperatureEquipment[]) {
  const [drawerEquipment, setDrawerEquipment] = useState<TemperatureEquipment | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleLogClick = (log: TemperatureLog) => {
    if (log.location) {
      // Find equipment by matching location with equipment name OR equipment location
      const matchingEquipment = equipment.find(
        (eq: TemperatureEquipment) => eq.name === log.location || eq.location === log.location,
      );
      if (matchingEquipment) {
        setDrawerEquipment(matchingEquipment);
        setIsDrawerOpen(true);
      }
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setDrawerEquipment(null);
  };

  return {
    drawerEquipment,
    isDrawerOpen,
    handleLogClick,
    handleCloseDrawer,
  };
}
