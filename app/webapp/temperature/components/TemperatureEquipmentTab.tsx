'use client';

import { Icon } from '@/components/ui/Icon';
import { useCountryFormatting } from '@/hooks/useCountryFormatting';
import { useTranslation } from '@/lib/useTranslation';
import { Sparkles } from 'lucide-react';
import { TemperatureEquipment } from '../types';
import { CreateEquipmentForm } from './CreateEquipmentForm';
import { EquipmentDetailDrawer } from './EquipmentDetailDrawer';
import { EquipmentItem } from './EquipmentItem';
import { EquipmentListTable } from './EquipmentListTable';
import { EquipmentQRCodeModal } from './EquipmentQRCodeModal';
import { EquipmentViewToggle } from './EquipmentViewToggle';
import { EquipmentEmptyState } from './EquipmentEmptyState';
import { EquipmentCardsPagination } from './EquipmentCardsPagination';
import { useTemperatureEquipmentTabHandlers } from '../hooks/useTemperatureEquipmentTabHandlers';
import { useEquipmentLogInfo } from '../hooks/useEquipmentLogInfo';
import { temperatureTypes } from '../utils/temperatureUtils';

interface TemperatureEquipmentTabProps {
  equipment: TemperatureEquipment[];
  allLogs?: any[]; // Optional logs for last log date calculation
  quickTempLoading: Record<string, boolean>;
  onUpdateEquipment: (equipmentId: string, updates: Partial<TemperatureEquipment>) => Promise<void>;
  onCreateEquipment: (
    name: string,
    equipmentType: string,
    location: string | null,
    minTemp: number | null,
    maxTemp: number | null,
  ) => Promise<void>;
  onDeleteEquipment: (equipmentId: string) => Promise<void>;
  onQuickTempLog: (
    equipmentId: string,
    equipmentName: string,
    equipmentType: string,
  ) => Promise<void>;
  onRefreshLogs?: () => Promise<void>; // Callback to refresh logs without page reload
}

export default function TemperatureEquipmentTab({
  equipment,
  allLogs = [],
  quickTempLoading,
  onUpdateEquipment,
  onCreateEquipment,
  onDeleteEquipment,
  onQuickTempLog,
  onRefreshLogs,
}: TemperatureEquipmentTabProps) {
  const { t } = useTranslation();
  const { formatDate } = useCountryFormatting();
  const itemsPerPage = 20;

  const {
    editingEquipment,
    setEditingEquipment,
    selectedEquipment,
    isDrawerOpen,
    qrCodeEquipment,
    isQRCodeModalOpen,
    currentPage,
    setCurrentPage,
    viewMode,
    setViewMode,
    isGenerating,
    newEquipment,
    setNewEquipment,
    showCreateForm,
    setShowCreateForm,
    startIndex,
    endIndex,
    handleEquipmentClick,
    handleCloseDrawer,
    handleShowQRCode,
    handleCloseQRCodeModal,
    handleCreateEquipment,
    handleUpdateEquipment,
    handleDeleteEquipment,
    toggleEquipmentStatus,
    handleGenerateSampleData,
    ConfirmDialog,
  } = useTemperatureEquipmentTabHandlers({
    equipment,
    itemsPerPage,
    onUpdateEquipment,
    onCreateEquipment,
    onDeleteEquipment,
    onRefreshLogs,
  });

  const { getLastLogDate, getLastLogInfo } = useEquipmentLogInfo(allLogs);

  return (
    <div className="space-y-6">
      <div className="tablet:flex-row tablet:items-center tablet:justify-between flex flex-col gap-4">
        <div>
          <h2 className="tablet:text-3xl text-2xl font-bold text-white">
            {t('temperature.equipment', 'Temperature Equipment')}
          </h2>
          <p className="mt-2 text-base text-gray-400">
            {t('temperature.equipmentDesc', 'Manage your temperature monitoring equipment')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <EquipmentViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          {/* Generate Sample Data Button */}
          {equipment.length > 0 && (
            <button
              onClick={handleGenerateSampleData}
              disabled={isGenerating}
              className="group flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border border-[#29E7CD]/30 bg-[#29E7CD]/10 px-4 py-2.5 text-sm font-semibold text-[#29E7CD] shadow-lg transition-all duration-300 hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/20 hover:shadow-xl disabled:opacity-50 disabled:hover:bg-[#29E7CD]/10"
              title="Generate 5 sample logs per equipment (last 2 weeks)"
            >
              <Icon
                icon={Sparkles}
                size="sm"
                className="transition-transform duration-300 group-hover:rotate-12"
                aria-hidden={true}
              />
              <span className="tablet:inline hidden">
                {isGenerating ? 'Generating...' : 'Generate Sample Logs'}
              </span>
              <span className="tablet:hidden">{isGenerating ? '...' : '📊'}</span>
            </button>
          )}
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="group flex min-h-[44px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <span className="text-lg">➕</span>
            <span>{t('temperature.addEquipment', 'Add Equipment')}</span>
          </button>
        </div>
      </div>

      {/* Create New Equipment Form */}
      <CreateEquipmentForm
        show={showCreateForm}
        temperatureTypes={temperatureTypes}
        newEquipment={newEquipment}
        setNewEquipment={setNewEquipment}
        onSubmit={handleCreateEquipment}
        onCancel={() => setShowCreateForm(false)}
      />

      {equipment.length === 0 ? (
        <EquipmentEmptyState onAddEquipment={() => setShowCreateForm(true)} />
      ) : viewMode === 'table' ? (
        <EquipmentListTable
          equipment={equipment}
          editingId={editingEquipment}
          setEditingId={setEditingEquipment}
          temperatureTypes={temperatureTypes}
          quickTempLoading={quickTempLoading}
          onQuickTempLog={onQuickTempLog}
          onToggleStatus={toggleEquipmentStatus}
          onDelete={handleDeleteEquipment}
          onUpdate={(id, updates) => handleUpdateEquipment(id, updates)}
          onEquipmentClick={handleEquipmentClick}
          onShowQRCode={handleShowQRCode}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={equipment.length}
          onPageChange={setCurrentPage}
          getLastLogDate={getLastLogDate}
          getLastLogInfo={getLastLogInfo}
          formatDate={formatDate}
        />
      ) : (
        <div className="space-y-4">
          <EquipmentCardsPagination
            currentPage={currentPage}
            totalItems={equipment.length}
            itemsPerPage={itemsPerPage}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={setCurrentPage}
          />
          <div className="tablet:grid-cols-1 large-desktop:grid-cols-2 grid gap-4">
            {equipment.slice(startIndex, endIndex).map(item => (
              <EquipmentItem
                key={item.id}
                item={item as any}
                editingId={editingEquipment}
                setEditingId={setEditingEquipment}
                temperatureTypes={temperatureTypes}
                quickTempLoading={quickTempLoading}
                onQuickTempLog={onQuickTempLog}
                onToggleStatus={toggleEquipmentStatus}
                onDelete={handleDeleteEquipment}
                onUpdate={(id, updates) => handleUpdateEquipment(id, updates)}
                onEquipmentClick={handleEquipmentClick}
                onShowQRCode={handleShowQRCode}
                getLastLogInfo={getLastLogInfo}
                formatDate={formatDate}
              />
            ))}
          </div>
        </div>
      )}

      {/* Equipment Detail Drawer */}
      <EquipmentDetailDrawer
        equipment={selectedEquipment}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />

      {/* QR Code Modal */}
      {qrCodeEquipment && (
        <EquipmentQRCodeModal
          equipment={qrCodeEquipment}
          isOpen={isQRCodeModalOpen}
          onClose={handleCloseQRCodeModal}
          temperatureTypes={temperatureTypes}
        />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog />
    </div>
  );
}
