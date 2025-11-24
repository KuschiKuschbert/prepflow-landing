'use client';

import { Icon } from '@/components/ui/Icon';
import { useTranslation } from '@/lib/useTranslation';
import { LANDING_COLORS } from '@/lib/landing-styles';
import { QrCode } from 'lucide-react';
import { TemperatureEquipment } from '../types';

interface EquipmentActionButtonsProps {
  item: TemperatureEquipment;
  editingId: string | null;
  quickTempLoading: Record<string, boolean>;
  onQuickTempLog: (id: string, name: string, type: string) => Promise<void>;
  onToggleStatus: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
  setEditingId: (id: string | null) => void;
  onShowQRCode?: (equipment: TemperatureEquipment) => void;
  handleButtonClick: (e: React.MouseEvent) => void;
}

export function EquipmentActionButtons({
  item,
  editingId,
  quickTempLoading,
  onQuickTempLog,
  onToggleStatus,
  onDelete,
  setEditingId,
  onShowQRCode,
  handleButtonClick,
}: EquipmentActionButtonsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={e => {
          handleButtonClick(e);
          onQuickTempLog(item.id, item.name, item.equipment_type);
        }}
        disabled={quickTempLoading[item.id] || !item.is_active}
        className="flex-1 rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-2.5 text-sm font-semibold text-black shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        style={{
          background: `linear-gradient(to right, ${LANDING_COLORS.primary}, ${LANDING_COLORS.accent})`,
        }}
      >
        {quickTempLoading[item.id]
          ? t('temperature.logging', 'Logging...')
          : t('temperature.quickLog', 'Quick Log')}
      </button>
      {onShowQRCode && (
        <button
          onClick={e => {
            handleButtonClick(e);
            onShowQRCode(item);
          }}
          className="group relative rounded-xl border-2 border-[#29E7CD]/60 bg-gradient-to-br from-[#29E7CD]/10 to-[#D925C7]/10 p-2.5 text-gray-300 transition-all duration-200 hover:border-[#29E7CD] hover:from-[#29E7CD]/20 hover:to-[#D925C7]/20 hover:text-white hover:shadow-lg hover:shadow-[#29E7CD]/20"
          title="Show QR Code"
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#29E7CD]/20 to-[#D925C7]/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          <Icon icon={QrCode} size="sm" className="relative z-10" aria-hidden={true} />
        </button>
      )}
      <button
        onClick={e => {
          handleButtonClick(e);
          onToggleStatus(item.id, item.is_active);
        }}
        className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
          item.is_active
            ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 hover:shadow-lg'
            : 'bg-green-500/20 text-green-400 hover:bg-green-500/30 hover:shadow-lg'
        }`}
      >
        {item.is_active ? t('common.deactivate', 'Deactivate') : t('common.activate', 'Activate')}
      </button>
      <button
        onClick={e => {
          handleButtonClick(e);
          setEditingId(editingId === item.id ? null : item.id);
        }}
        className="rounded-xl bg-[#2a2a2a] px-4 py-2.5 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-[#3a3a3a] hover:text-white hover:shadow-lg"
      >
        {editingId === item.id ? t('common.cancel', 'Cancel') : t('common.edit', 'Edit')}
      </button>
      <button
        onClick={e => {
          handleButtonClick(e);
          onDelete(item.id);
        }}
        className="rounded-xl bg-red-500/20 px-4 py-2.5 text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-500/30 hover:shadow-lg"
      >
        {t('common.delete', 'Delete')}
      </button>
    </div>
  );
}
