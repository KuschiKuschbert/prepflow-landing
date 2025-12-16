/**
 * Content rendering component for compliance page based on active tab.
 */

import dynamic from 'next/dynamic';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import type {
  ComplianceRecord,
  ComplianceRecordFormData,
  ComplianceType,
  ComplianceTypeFormData,
} from '../types';
import type { EquipmentMaintenanceFormData } from './EquipmentMaintenanceForm';

// Lazy load compliance components to reduce initial bundle size
const ComplianceRecordForm = dynamic(
  () => import('./ComplianceRecordForm').then(mod => ({ default: mod.ComplianceRecordForm })),
  {
    ssr: false,
    loading: () => null, // Forms handle their own loading states
  },
);

const ComplianceRecordsList = dynamic(
  () => import('./ComplianceRecordsList').then(mod => ({ default: mod.ComplianceRecordsList })),
  {
    ssr: false,
    loading: () => <PageSkeleton />,
  },
);

const ComplianceTypeForm = dynamic(
  () => import('./ComplianceTypeForm').then(mod => ({ default: mod.ComplianceTypeForm })),
  {
    ssr: false,
    loading: () => null, // Forms handle their own loading states
  },
);

const ComplianceTypesGrid = dynamic(
  () => import('./ComplianceTypesGrid').then(mod => ({ default: mod.ComplianceTypesGrid })),
  {
    ssr: false,
    loading: () => <PageSkeleton />,
  },
);

const HealthInspectorReport = dynamic(
  () => import('./HealthInspectorReport').then(mod => ({ default: mod.HealthInspectorReport })),
  {
    ssr: false,
    loading: () => <PageSkeleton />,
  },
);

const AllergenOverview = dynamic(
  () => import('./AllergenOverview').then(mod => ({ default: mod.AllergenOverview })),
  {
    ssr: false,
    loading: () => <PageSkeleton />,
  },
);

const EquipmentMaintenanceForm = dynamic(
  () =>
    import('./EquipmentMaintenanceForm').then(mod => ({ default: mod.EquipmentMaintenanceForm })),
  {
    ssr: false,
    loading: () => null,
  },
);

const EquipmentMaintenanceList = dynamic(
  () =>
    import('./EquipmentMaintenanceList').then(mod => ({ default: mod.EquipmentMaintenanceList })),
  {
    ssr: false,
    loading: () => <PageSkeleton />,
  },
);

interface ComplianceContentProps {
  activeTab: 'records' | 'types' | 'report' | 'allergens' | 'equipment';
  types: ComplianceType[];
  records: ComplianceRecord[];
  showAddRecord: boolean;
  showAddType: boolean;
  showAddEquipment: boolean;
  newRecord: ComplianceRecordFormData;
  newType: ComplianceTypeFormData;
  newEquipment: EquipmentMaintenanceFormData;
  equipmentRecords: any[];
  onRecordFormChange: (data: ComplianceRecordFormData) => void;
  onTypeFormChange: (data: ComplianceTypeFormData) => void;
  onEquipmentFormChange: (data: EquipmentMaintenanceFormData) => void;
  onRecordSubmit: (e: React.FormEvent) => void;
  onTypeSubmit: (e: React.FormEvent) => void;
  onEquipmentSubmit: (e: React.FormEvent) => void;
  onRecordCancel: () => void;
  onTypeCancel: () => void;
  onEquipmentCancel: () => void;
}

export function ComplianceContent({
  activeTab,
  types,
  records,
  showAddRecord,
  showAddType,
  showAddEquipment,
  newRecord,
  newType,
  newEquipment,
  equipmentRecords,
  onRecordFormChange,
  onTypeFormChange,
  onEquipmentFormChange,
  onRecordSubmit,
  onTypeSubmit,
  onEquipmentSubmit,
  onRecordCancel,
  onTypeCancel,
  onEquipmentCancel,
}: ComplianceContentProps) {
  if (activeTab === 'records') {
    return (
      <div className="space-y-6">
        {showAddRecord && (
          <ComplianceRecordForm
            formData={newRecord}
            types={types}
            onChange={onRecordFormChange}
            onSubmit={onRecordSubmit}
            onCancel={onRecordCancel}
          />
        )}
        <ComplianceRecordsList records={records} />
      </div>
    );
  }

  if (activeTab === 'types') {
    return (
      <div className="space-y-6">
        {showAddType && (
          <ComplianceTypeForm
            formData={newType}
            onChange={onTypeFormChange}
            onSubmit={onTypeSubmit}
            onCancel={onTypeCancel}
          />
        )}
        <ComplianceTypesGrid types={types} />
      </div>
    );
  }

  if (activeTab === 'report') {
    return <HealthInspectorReport />;
  }

  if (activeTab === 'allergens') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="mb-2 text-2xl font-semibold text-[var(--foreground)]">Allergen Overview</h2>
          <p className="text-[var(--foreground-muted)]">
            View all dishes and recipes with their allergen information for compliance tracking
          </p>
        </div>
        <AllergenOverview />
      </div>
    );
  }

  if (activeTab === 'equipment') {
    return (
      <div className="space-y-6">
        {showAddEquipment && (
          <EquipmentMaintenanceForm
            formData={newEquipment}
            onChange={onEquipmentFormChange}
            onSubmit={onEquipmentSubmit}
            onCancel={onEquipmentCancel}
          />
        )}
        <EquipmentMaintenanceList records={equipmentRecords} />
      </div>
    );
  }

  return null;
}
