'use client';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useTranslation } from '@/lib/useTranslation';
import { useCallback, useEffect, useState } from 'react';
import { ComplianceRecordForm } from './components/ComplianceRecordForm';
import { ComplianceRecordsList } from './components/ComplianceRecordsList';
import { ComplianceTypeForm } from './components/ComplianceTypeForm';
import { ComplianceTypesGrid } from './components/ComplianceTypesGrid';
import { HealthInspectorReport } from './components/HealthInspectorReport';
import { AllergenOverview } from './components/AllergenOverview';
import { ResponsivePageContainer } from '@/components/ui/ResponsivePageContainer';
import { logger } from '@/lib/logger';
import {
  ComplianceRecord,
  ComplianceRecordFormData,
  ComplianceType,
  ComplianceTypeFormData,
} from './types';
import { getTypeIconEmoji } from './utils';
import { ClipboardCheck } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
export default function ComplianceTrackingPage() {
  const { t } = useTranslation();
  const [types, setTypes] = useState<ComplianceType[]>([]);
  const [records, setRecords] = useState<ComplianceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'records' | 'types' | 'report' | 'allergens'>(
    'records',
  );
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [showAddType, setShowAddType] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [newRecord, setNewRecord] = useState<ComplianceRecordFormData>({
    compliance_type_id: '',
    document_name: '',
    issue_date: '',
    expiry_date: '',
    document_url: '',
    photo_url: '',
    notes: '',
    reminder_enabled: true,
    reminder_days_before: 30,
  });
  const [newType, setNewType] = useState<ComplianceTypeFormData>({
    name: '',
    description: '',
    renewal_frequency_days: '',
  });

  const fetchTypes = useCallback(async () => {
    try {
      const response = await fetch('/api/compliance-types');
      const data = await response.json();
      if (data.success) {
        setTypes(data.data);
      }
    } catch (error) {
      logger.error('Error fetching types:', error);
    }
  }, []);

  const fetchRecords = useCallback(async () => {
    try {
      let url = '/api/compliance-records';
      const params = new URLSearchParams();
      if (selectedType !== 'all') params.append('type_id', selectedType);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setRecords(data.data);
      }
    } catch (error) {
      logger.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedType, selectedStatus]);

  useEffect(() => {
    fetchTypes();
    fetchRecords();
  }, [fetchTypes, fetchRecords]);

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/compliance-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newRecord,
          compliance_type_id: parseInt(newRecord.compliance_type_id),
          reminder_days_before: parseInt(newRecord.reminder_days_before.toString()),
        }),
      });
      const data = await response.json();
      if (data.success) {
        setRecords([data.data, ...records]);
        setNewRecord({
          compliance_type_id: '',
          document_name: '',
          issue_date: '',
          expiry_date: '',
          document_url: '',
          photo_url: '',
          notes: '',
          reminder_enabled: true,
          reminder_days_before: 30,
        });
        setShowAddRecord(false);
      }
    } catch (error) {
      logger.error('Error adding record:', error);
    }
  };

  const handleAddType = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/compliance-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newType,
          renewal_frequency_days: newType.renewal_frequency_days
            ? parseInt(newType.renewal_frequency_days)
            : null,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setTypes([...types, data.data]);
        setNewType({ name: '', description: '', renewal_frequency_days: '' });
        setShowAddType(false);
      }
    } catch (error) {
      logger.error('Error adding type:', error);
    }
  };

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
        <div className="mb-8">
          <div className="flex space-x-1 rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-1">
            {(['records', 'types', 'report', 'allergens'] as const).map(tab => {
              const labels: Record<typeof tab, string> = {
                records: `📄 ${t('compliance.records', 'Compliance Records')}`,
                types: `🏷️ ${t('compliance.types', 'Compliance Types')}`,
                report: '📊 Health Inspector Report',
                allergens: '🥜 Allergen Overview',
              };
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-xl px-6 py-3 font-medium transition-all duration-200 ${
                    activeTab === tab
                      ? 'bg-[#29E7CD] text-black shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {labels[tab]}
                </button>
              );
            })}
          </div>
        </div>
        {activeTab === 'records' && (
          <div className="space-y-6">
            <div className="tablet:flex-row tablet:items-center flex flex-col items-start justify-between gap-4">
              <div className="tablet:flex-row flex flex-col gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    {t('compliance.filterType', 'Filter by Type')}
                  </label>
                  <select
                    value={selectedType}
                    onChange={e => setSelectedType(e.target.value)}
                    className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                  >
                    <option value="all">{t('compliance.allTypes', 'All Types')}</option>
                    {types.map(type => (
                      <option key={type.id} value={type.id.toString()}>
                        {getTypeIconEmoji(type.name)} {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    {t('compliance.filterStatus', 'Filter by Status')}
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={e => setSelectedStatus(e.target.value)}
                    className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
                  >
                    <option value="all">{t('compliance.allStatuses', 'All Statuses')}</option>
                    <option value="active">✅ {t('compliance.active', 'Active')}</option>
                    <option value="pending_renewal">
                      ⚠️ {t('compliance.pendingRenewal', 'Pending Renewal')}
                    </option>
                    <option value="expired">❌ {t('compliance.expired', 'Expired')}</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => setShowAddRecord(true)}
                className="rounded-2xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black transition-all duration-200 hover:shadow-xl"
              >
                ➕ {t('compliance.addRecord', 'Add Compliance Record')}
              </button>
            </div>
            {showAddRecord && (
              <ComplianceRecordForm
                formData={newRecord}
                types={types}
                onChange={setNewRecord}
                onSubmit={handleAddRecord}
                onCancel={() => setShowAddRecord(false)}
              />
            )}
            <ComplianceRecordsList records={records} />
          </div>
        )}
        {activeTab === 'types' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
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
            {showAddType && (
              <ComplianceTypeForm
                formData={newType}
                onChange={setNewType}
                onSubmit={handleAddType}
                onCancel={() => setShowAddType(false)}
              />
            )}
            <ComplianceTypesGrid types={types} />
          </div>
        )}
        {activeTab === 'report' && <HealthInspectorReport />}
        {activeTab === 'allergens' && (
          <div className="space-y-6">
            <div>
              <h2 className="mb-2 text-2xl font-semibold text-white">Allergen Overview</h2>
              <p className="text-gray-400">
                View all dishes and recipes with their allergen information for compliance tracking
              </p>
            </div>
            <AllergenOverview />
          </div>
        )}
      </div>
    </ResponsivePageContainer>
  );
}
