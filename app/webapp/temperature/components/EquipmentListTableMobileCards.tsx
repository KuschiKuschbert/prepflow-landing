'use client';
import { LucideIcon } from 'lucide-react';
import { TemperatureEquipment } from '../types';
import { EquipmentMobileCard } from './EquipmentMobileCard';

interface EquipmentListTableMobileCardsProps {
  paginatedEquipment: TemperatureEquipment[];
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  temperatureTypes: Array<{ value: string; label: string; icon: string }>;
  onQuickTempLog: (id: string, name: string, type: string) => Promise<void>;
  onToggleStatus: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<TemperatureEquipment>) => void;
  onEquipmentClick?: (equipment: TemperatureEquipment) => void;
  onShowQRCode?: (equipment: TemperatureEquipment) => void;
  getTypeIcon: (type: string) => LucideIcon;
  getTypeLabel: (type: string) => string;
  getLastLogInfo?: (equipment: TemperatureEquipment) => {
    date: string;
    temperature: number;
    isInRange: boolean | null;
  } | null;
  formatDate?: (date: Date) => string;
}

export function EquipmentListTableMobileCards({
  paginatedEquipment,
  editingId,
  setEditingId,
  temperatureTypes,
  onQuickTempLog,
  onToggleStatus,
  onDelete,
  onUpdate,
  onEquipmentClick,
  onShowQRCode,
  getTypeIcon,
  getTypeLabel,
  getLastLogInfo,
  formatDate,
}: EquipmentListTableMobileCardsProps) {
  return (
    <div className="large-desktop:hidden block space-y-4">
      {paginatedEquipment.map(item => (
        <EquipmentMobileCard
          key={item.id}
          item={item}
          editingId={editingId}
          setEditingId={setEditingId}
          temperatureTypes={temperatureTypes}
          onQuickTempLog={onQuickTempLog}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onEquipmentClick={onEquipmentClick}
          onShowQRCode={onShowQRCode}
          getTypeIcon={getTypeIcon}
          getTypeLabel={getTypeLabel}
          getLastLogInfo={getLastLogInfo}
          formatDate={formatDate}
        />
      ))}
    </div>
  );
}
