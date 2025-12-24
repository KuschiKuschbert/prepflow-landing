'use client';

import { TemperatureEquipment } from '../types';
import { getTypeIconComponent, getTypeLabel } from '../utils/temperatureUtils';
import { EquipmentItemHeader } from './EquipmentItemHeader';
import { EquipmentTemperatureRange } from './EquipmentTemperatureRange';
import { EquipmentLastLogInfo } from './EquipmentLastLogInfo';
import { EquipmentActionButtons } from './EquipmentActionButtons';
import { EquipmentEditForm } from './EquipmentEditForm';

interface EquipmentItemProps {
  item: TemperatureEquipment;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  temperatureTypes: Array<{ value: string; label: string; icon: string }>;
  onQuickTempLog: (id: string, name: string, type: string) => Promise<void>;
  onToggleStatus: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<TemperatureEquipment>) => void;
  onEquipmentClick?: (equipment: TemperatureEquipment) => void;
  onShowQRCode?: (equipment: TemperatureEquipment) => void;
  getLastLogInfo?: (equipment: TemperatureEquipment) => {
    date: string;
    temperature: number;
    isInRange: boolean | null;
  } | null;
  formatDate?: (date: Date) => string;
}

export function EquipmentItem({
  item,
  editingId,
  setEditingId,
  temperatureTypes,
  onQuickTempLog,
  onToggleStatus,
  onDelete,
  onUpdate,
  onEquipmentClick,
  onShowQRCode,
  getLastLogInfo,
  formatDate,
}: EquipmentItemProps) {
  const handleCardClick = () => {
    if (onEquipmentClick && !editingId) {
      onEquipmentClick(item);
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const lastLogInfo = getLastLogInfo ? getLastLogInfo(item) : null;

  return (
    <div
      onClick={handleCardClick}
      className={`group relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg transition-all duration-300 ${
        onEquipmentClick && !editingId
          ? 'cursor-pointer hover:border-[var(--primary)]/30 hover:shadow-2xl'
          : 'hover:border-[var(--primary)]/30 hover:shadow-2xl'
      }`}
    >
      {/* Gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-[var(--accent)]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

      <div className="relative">
        <div className="tablet:flex-row tablet:items-start tablet:justify-between mb-6 flex flex-col gap-4">
          <EquipmentItemHeader
            name={item.name}
            equipmentType={item.equipment_type}
            location={item.location}
            typeIcon={getTypeIconComponent(item.equipment_type)}
            typeLabel={getTypeLabel(item.equipment_type)}
          />
          <EquipmentTemperatureRange
            equipmentType={item.equipment_type}
            equipmentName={item.name}
            minTemp={item.min_temp_celsius}
            maxTemp={item.max_temp_celsius}
            isActive={item.is_active}
          />
        </div>

        <EquipmentLastLogInfo lastLogInfo={lastLogInfo} formatDate={formatDate} />

        <EquipmentActionButtons
          item={item}
          editingId={editingId}
          onQuickTempLog={onQuickTempLog}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
          setEditingId={setEditingId}
          onShowQRCode={onShowQRCode}
          handleButtonClick={handleButtonClick}
        />
      </div>

      {editingId === item.id && (
        <EquipmentEditForm
          item={item}
          temperatureTypes={temperatureTypes}
          onUpdate={onUpdate}
          handleButtonClick={handleButtonClick}
        />
      )}
    </div>
  );
}
