'use client';

import { useState } from 'react';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useTranslation } from '@/lib/useTranslation';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { ClipboardCheck } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { useComplianceData } from './hooks/useComplianceData';
import { useComplianceForms } from './hooks/useComplianceForms';
import { useEquipmentMaintenance } from './hooks/useEquipmentMaintenance';
import { ComplianceTabs } from './components/ComplianceTabs';
import { ComplianceFilters } from './components/ComplianceFilters';
import { ComplianceContent } from './components/ComplianceContent';

export default function ComplianceTrackingPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<
    'records' | 'types' | 'report' | 'allergens' | 'equipment'
  >('records');
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [showAddType, setShowAddType] = useState(false);
  const [showAddEquipment, setShowAddEquipment] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const { types, records, loading, setTypes, setRecords } = useComplianceData(
    selectedType,
    selectedStatus,
  );

  const { newRecord, setNewRecord, newType, setNewType, handleAddRecord, handleAddType } =
    useComplianceForms({
      types,
      records,
      selectedType,
      selectedStatus,
      setTypes,
      setRecords,
      setShowAddRecord,
      setShowAddType,
    });

  const {
    records: equipmentRecords,
    newEquipment,
    setNewEquipment,
    handleAddEquipment,
  } = useEquipmentMaintenance();

  if (loading) {
    return (
      <ResponsivePageContainer>
        <div className="tablet:py-6 min-h-screen bg-[#0a0a0a] py-4">
          <LoadingSkeleton variant="stats" height="64px" />
          <div className="adaptive-grid mt-8">
            <LoadingSkeleton variant="card" count={4} height="120px" />
          </div>
        </div>
      </ResponsivePageContainer>
    );
  }

  return (
    <ResponsivePageContainer>
      <div className="tablet:py-6 min-h-screen bg-transparent py-4">
        <div className="mb-8">
          <h1 className="mb-2 flex items-center gap-2 text-4xl font-bold text-white">
            <Icon icon={ClipboardCheck} size="lg" aria-hidden={true} />
            {t('compliance.title', 'Compliance Tracking')}
          </h1>
          <p className="text-gray-400">
            {t(
              'compliance.subtitle',
              'Track pest control, council inspections, licenses, and other compliance documents with automated reminders',
            )}
          </p>
        </div>

        <ComplianceTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'records' && (
          <div className="space-y-6">
            <ComplianceFilters
              types={types}
              selectedType={selectedType}
              selectedStatus={selectedStatus}
              onTypeChange={setSelectedType}
              onStatusChange={setSelectedStatus}
              onAddRecord={() => setShowAddRecord(true)}
              records={records}
            />
          </div>
        )}

        {activeTab === 'types' && (
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">
              {t('compliance.manageTypes', 'Manage Compliance Types')}
            </h2>
            <button
              onClick={() => setShowAddType(true)}
              className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
            >
              ➕ {t('compliance.addType', 'Add Type')}
            </button>
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Equipment Maintenance</h2>
            <button
              onClick={() => setShowAddEquipment(true)}
              className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
            >
              ➕ Add Maintenance Record
            </button>
          </div>
        )}

        <ComplianceContent
          activeTab={activeTab}
          types={types}
          records={records}
          showAddRecord={showAddRecord}
          showAddType={showAddType}
          showAddEquipment={showAddEquipment}
          newRecord={newRecord}
          newType={newType}
          newEquipment={newEquipment}
          equipmentRecords={equipmentRecords}
          onRecordFormChange={setNewRecord}
          onTypeFormChange={setNewType}
          onEquipmentFormChange={setNewEquipment}
          onRecordSubmit={handleAddRecord}
          onTypeSubmit={handleAddType}
          onEquipmentSubmit={async e => {
            const success = await handleAddEquipment(e);
            if (success) {
              setShowAddEquipment(false);
            }
          }}
          onRecordCancel={() => setShowAddRecord(false)}
          onTypeCancel={() => setShowAddType(false)}
          onEquipmentCancel={() => setShowAddEquipment(false)}
        />
      </div>
    </ResponsivePageContainer>
  );
}
