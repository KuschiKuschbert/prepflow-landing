/**
 * UI handlers for equipment interactions.
 */
import type { TemperatureEquipment } from '../../../types';

export function createUIHandlers(
  setSelectedEquipment: (equipment: TemperatureEquipment | null) => void,
  setIsDrawerOpen: (open: boolean) => void,
  setQrCodeEquipment: (equipment: TemperatureEquipment | null) => void,
  setIsQRCodeModalOpen: (open: boolean) => void,
) {
  return {
    handleEquipmentClick: (equipment: TemperatureEquipment) => {
      setSelectedEquipment(equipment);
      setIsDrawerOpen(true);
    },
    handleCloseDrawer: () => {
      setIsDrawerOpen(false);
      setSelectedEquipment(null);
    },
    handleShowQRCode: (equipment: TemperatureEquipment) => {
      setQrCodeEquipment(equipment);
      setIsQRCodeModalOpen(true);
    },
    handleCloseQRCodeModal: () => {
      setIsQRCodeModalOpen(false);
      setQrCodeEquipment(null);
    },
  };
}
