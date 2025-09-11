'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/useTranslation';

interface ComplianceType {
  id: number;
  name: string;
  description: string;
  renewal_frequency_days: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ComplianceRecord {
  id: number;
  compliance_type_id: number;
  document_name: string;
  issue_date: string | null;
  expiry_date: string | null;
  status: 'active' | 'expired' | 'pending_renewal';
  document_url: string | null;
  photo_url: string | null;
  notes: string | null;
  reminder_enabled: boolean;
  reminder_days_before: number;
  created_at: string;
  updated_at: string;
  compliance_types: ComplianceType;
}

export default function ComplianceTrackingPage() {
  const { t } = useTranslation();
  const [types, setTypes] = useState<ComplianceType[]>([]);
  const [records, setRecords] = useState<ComplianceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'records' | 'types'>('records');
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [showAddType, setShowAddType] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [newRecord, setNewRecord] = useState({
    compliance_type_id: '',
    document_name: '',
    issue_date: '',
    expiry_date: '',
    document_url: '',
    photo_url: '',
    notes: '',
    reminder_enabled: true,
    reminder_days_before: 30
  });
  const [newType, setNewType] = useState({
    name: '',
    description: '',
    renewal_frequency_days: ''
  });

  useEffect(() => {
    fetchTypes();
    fetchRecords();
  }, [selectedType, selectedStatus]);

  const fetchTypes = async () => {
    try {
      const response = await fetch('/api/compliance-types');
      const data = await response.json();
      if (data.success) {
        setTypes(data.data);
      }
    } catch (error) {
      console.error('Error fetching types:', error);
    }
  };

  const fetchRecords = async () => {
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
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/compliance-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newRecord,
          compliance_type_id: parseInt(newRecord.compliance_type_id),
          reminder_days_before: parseInt(newRecord.reminder_days_before.toString())
        })
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
          reminder_days_before: 30
        });
        setShowAddRecord(false);
      }
    } catch (error) {
      console.error('Error adding record:', error);
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
          renewal_frequency_days: newType.renewal_frequency_days ? parseInt(newType.renewal_frequency_days) : null
        })
      });
      const data = await response.json();
      if (data.success) {
        setTypes([...types, data.data]);
        setNewType({ name: '', description: '', renewal_frequency_days: '' });
        setShowAddType(false);
      }
    } catch (error) {
      console.error('Error adding type:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'expired': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'pending_renewal': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default: return 'text-green-400 bg-green-400/10 border-green-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'expired': return '❌';
      case 'pending_renewal': return '⚠️';
      default: return '✅';
    }
  };

  const getDaysUntilExpiry = (expiryDate: string | null) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTypeIcon = (typeName: string) => {
    const name = typeName.toLowerCase();
    if (name.includes('pest')) return '🐛';
    if (name.includes('council')) return '🏛️';
    if (name.includes('food') || name.includes('license')) return '🍽️';
    if (name.includes('fire')) return '🔥';
    if (name.includes('insurance')) return '🛡️';
    return '📋';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-[#2a2a2a] rounded-3xl w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]">
                  <div className="h-4 bg-[#2a2a2a] rounded-xl w-3/4 mb-3"></div>
                  <div className="h-20 bg-[#2a2a2a] rounded-xl"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            📋 {t('compliance.title', 'Compliance Tracking')}
          </h1>
          <p className="text-gray-400">{t('compliance.subtitle', 'Track pest control, council inspections, licenses, and other compliance documents with automated reminders')}</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-[#1f1f1f] p-1 rounded-2xl border border-[#2a2a2a]">
            <button
              onClick={() => setActiveTab('records')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'records'
                  ? 'bg-[#29E7CD] text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📄 {t('compliance.records', 'Compliance Records')}
            </button>
            <button
              onClick={() => setActiveTab('types')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'types'
                  ? 'bg-[#29E7CD] text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🏷️ {t('compliance.types', 'Compliance Types')}
            </button>
          </div>
        </div>

        {/* Records Tab */}
        {activeTab === 'records' && (
          <div className="space-y-6">
            {/* Filters and Add Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{t('compliance.filterType', 'Filter by Type')}</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-4 py-2 bg-[#2a2a2a] border border-[#2a2a2a] rounded-xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                  >
                    <option value="all">{t('compliance.allTypes', 'All Types')}</option>
                    {types.map((type) => (
                      <option key={type.id} value={type.id.toString()}>{getTypeIcon(type.name)} {type.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{t('compliance.filterStatus', 'Filter by Status')}</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2 bg-[#2a2a2a] border border-[#2a2a2a] rounded-xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                  >
                    <option value="all">{t('compliance.allStatuses', 'All Statuses')}</option>
                    <option value="active">✅ {t('compliance.active', 'Active')}</option>
                    <option value="pending_renewal">⚠️ {t('compliance.pendingRenewal', 'Pending Renewal')}</option>
                    <option value="expired">❌ {t('compliance.expired', 'Expired')}</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => setShowAddRecord(true)}
                className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black px-6 py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-200"
              >
                ➕ {t('compliance.addRecord', 'Add Compliance Record')}
              </button>
            </div>

            {/* Add Record Form */}
            {showAddRecord && (
              <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]">
                <h3 className="text-xl font-semibold text-white mb-4">{t('compliance.addNewRecord', 'Add New Compliance Record')}</h3>
                <form onSubmit={handleAddRecord} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('compliance.complianceType', 'Compliance Type')}</label>
                    <select
                      value={newRecord.compliance_type_id}
                      onChange={(e) => setNewRecord({ ...newRecord, compliance_type_id: e.target.value })}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                      required
                    >
                      <option value="">{t('compliance.selectType', 'Choose a compliance type')}</option>
                      {types.map((type) => (
                        <option key={type.id} value={type.id}>{getTypeIcon(type.name)} {type.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('compliance.documentName', 'Document Name')}</label>
                    <input
                      type="text"
                      value={newRecord.document_name}
                      onChange={(e) => setNewRecord({ ...newRecord, document_name: e.target.value })}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                       placeholder="e.g., Annual Pest Control Certificate"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('compliance.issueDate', 'Issue Date')}</label>
                    <input
                      type="date"
                      value={newRecord.issue_date}
                      onChange={(e) => setNewRecord({ ...newRecord, issue_date: e.target.value })}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('compliance.expiryDate', 'Expiry Date')}</label>
                    <input
                      type="date"
                      value={newRecord.expiry_date}
                      onChange={(e) => setNewRecord({ ...newRecord, expiry_date: e.target.value })}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('compliance.documentUrl', 'Document URL')}</label>
                    <input
                      type="url"
                      value={newRecord.document_url}
                      onChange={(e) => setNewRecord({ ...newRecord, document_url: e.target.value })}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                       placeholder="Link to digital document"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('compliance.reminderDays', 'Reminder Days Before')}</label>
                    <input
                      type="number"
                      value={newRecord.reminder_days_before}
                      onChange={(e) => setNewRecord({ ...newRecord, reminder_days_before: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                      min="1"
                      max="365"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('compliance.notes', 'Notes')}</label>
                    <textarea
                      value={newRecord.notes}
                      onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                       placeholder="Additional notes or observations"
                      rows={3}
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newRecord.reminder_enabled}
                        onChange={(e) => setNewRecord({ ...newRecord, reminder_enabled: e.target.checked })}
                        className="w-4 h-4 text-[#29E7CD] bg-[#2a2a2a] border-[#2a2a2a] rounded focus:ring-[#29E7CD]"
                      />
                      <span className="text-gray-300">{t('compliance.enableReminders', 'Enable automated reminders')}</span>
                    </label>
                  </div>
                  <div className="md:col-span-2 flex space-x-4">
                    <button
                      type="submit"
                      className="bg-[#29E7CD] text-black px-6 py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-200"
                    >
                      {t('compliance.save', 'Save Record')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddRecord(false)}
                      className="bg-[#2a2a2a] text-white px-6 py-3 rounded-2xl font-semibold hover:bg-[#3a3a3a] transition-all duration-200"
                    >
                      {t('compliance.cancel', 'Cancel')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Records List */}
            <div className="space-y-4">
              {records.length === 0 ? (
                <div className="bg-[#1f1f1f] p-8 rounded-3xl shadow-lg border border-[#2a2a2a] text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">📋</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{t('compliance.noRecords', 'No Compliance Records')}</h3>
                  <p className="text-gray-400">{t('compliance.noRecordsDesc', 'Start tracking your compliance documents and licenses')}</p>
                </div>
              ) : (
                records.map((record) => {
                  const daysUntilExpiry = getDaysUntilExpiry(record.expiry_date);
                  return (
                    <div key={record.id} className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a] hover:shadow-xl transition-all duration-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10 flex items-center justify-center">
                            <span className="text-2xl">{getTypeIcon(record.compliance_types.name)}</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-white">{record.document_name}</h3>
                            <p className="text-gray-400">{record.compliance_types.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                            {getStatusIcon(record.status)} {record.status.charAt(0).toUpperCase() + record.status.slice(1).replace('_', ' ')}
                          </span>
                          {daysUntilExpiry !== null && (
                            <span className={`text-sm font-semibold ${
                              daysUntilExpiry < 0 ? 'text-red-400' : 
                              daysUntilExpiry < 30 ? 'text-yellow-400' : 'text-green-400'
                            }`}>
                              {daysUntilExpiry < 0 ? `${Math.abs(daysUntilExpiry)} days overdue` : 
                               daysUntilExpiry === 0 ? 'Expires today' : 
                               `${daysUntilExpiry} days left`}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {record.issue_date && (
                          <div>
                            <span className="text-sm text-gray-400">{t('compliance.issueDate', 'Issue Date')}: </span>
                            <span className="text-white">{new Date(record.issue_date).toLocaleDateString()}</span>
                          </div>
                        )}
                        {record.expiry_date && (
                          <div>
                            <span className="text-sm text-gray-400">{t('compliance.expiryDate', 'Expiry Date')}: </span>
                            <span className="text-white">{new Date(record.expiry_date).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      
                      {record.notes && (
                        <p className="text-gray-300 mb-4">{record.notes}</p>
                      )}
                      
                      {(record.document_url || record.photo_url) && (
                        <div className="mb-4 flex space-x-4">
                          {record.document_url && (
                            <a 
                              href={record.document_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="bg-[#29E7CD] text-black px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                            >
                              📄 {t('compliance.viewDocument', 'View Document')}
                            </a>
                          )}
                          {record.photo_url && (
                            <img 
                              src={record.photo_url} 
                              alt="Compliance document" 
                              className="w-32 h-32 object-cover rounded-2xl border border-[#2a2a2a]"
                            />
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${
                            record.reminder_enabled ? 'bg-green-400' : 'bg-gray-400'
                          }`}></span>
                          <span className="text-sm text-gray-400">
                            {record.reminder_enabled ? t('compliance.remindersEnabled', 'Reminders enabled') : t('compliance.remindersDisabled', 'Reminders disabled')}
                          </span>
                        </div>
                        <div className="flex space-x-4">
                          <button className="bg-[#2a2a2a] text-white px-4 py-2 rounded-xl font-semibold hover:bg-[#3a3a3a] transition-all duration-200">
                            📷 {t('compliance.addPhoto', 'Add Photo')}
                          </button>
                          <button className="bg-[#2a2a2a] text-white px-4 py-2 rounded-xl font-semibold hover:bg-[#3a3a3a] transition-all duration-200">
                            ✏️ {t('compliance.edit', 'Edit')}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Types Tab */}
        {activeTab === 'types' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">{t('compliance.manageTypes', 'Manage Compliance Types')}</h2>
              <button
                onClick={() => setShowAddType(true)}
                className="bg-gradient-to-r from-[#29E7CD] to-[#D925C7] text-black px-6 py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-200"
              >
                ➕ {t('compliance.addType', 'Add Type')}
              </button>
            </div>

            {/* Add Type Form */}
            {showAddType && (
              <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]">
                <h3 className="text-xl font-semibold text-white mb-4">{t('compliance.addNewType', 'Add New Compliance Type')}</h3>
                <form onSubmit={handleAddType} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('compliance.typeName', 'Type Name')}</label>
                    <input
                      type="text"
                      value={newType.name}
                      onChange={(e) => setNewType({ ...newType, name: e.target.value })}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                       placeholder="e.g., Pest Control, Council Inspection"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('compliance.description', 'Description')}</label>
                    <textarea
                      value={newType.description}
                      onChange={(e) => setNewType({ ...newType, description: e.target.value })}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                       placeholder="Describe this compliance type"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{t('compliance.renewalFrequency', 'Renewal Frequency (days)')}</label>
                    <input
                      type="number"
                      value={newType.renewal_frequency_days}
                      onChange={(e) => setNewType({ ...newType, renewal_frequency_days: e.target.value })}
                      className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#2a2a2a] rounded-2xl text-white focus:ring-2 focus:ring-[#29E7CD] focus:border-transparent"
                       placeholder="e.g., 365 for annual"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-[#29E7CD] text-black px-6 py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-200"
                    >
                      {t('compliance.save', 'Save Type')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddType(false)}
                      className="bg-[#2a2a2a] text-white px-6 py-3 rounded-2xl font-semibold hover:bg-[#3a3a3a] transition-all duration-200"
                    >
                      {t('compliance.cancel', 'Cancel')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Types Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {types.map((type) => (
                <div key={type.id} className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a] hover:shadow-xl transition-all duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10 flex items-center justify-center">
                      <span className="text-2xl">{getTypeIcon(type.name)}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      type.is_active ? 'bg-green-400/10 text-green-400 border border-green-400/20' : 'bg-gray-400/10 text-gray-400 border border-gray-400/20'
                    }`}>
                      {type.is_active ? t('compliance.active', 'Active') : t('compliance.inactive', 'Inactive')}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{type.name}</h3>
                  <p className="text-gray-400 mb-4">{type.description || t('compliance.noDescription', 'No description provided')}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {type.renewal_frequency_days ? 
                        `${t('compliance.everyDays', 'Every')} ${type.renewal_frequency_days} ${t('compliance.days', 'days')}` : 
                        t('compliance.noFrequency', 'No renewal frequency set')
                      }
                    </span>
                    <button className="text-[#29E7CD] hover:text-[#29E7CD]/80 transition-colors">
                      {t('compliance.edit', 'Edit')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
