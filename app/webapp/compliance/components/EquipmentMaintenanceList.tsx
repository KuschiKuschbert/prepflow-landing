'use client';

import React from 'react';
import { Icon } from '@/components/ui/Icon';
import { Wrench, Calendar, DollarSign, AlertTriangle } from 'lucide-react';

export interface EquipmentMaintenanceRecord {
  id: string;
  equipment_name: string;
  equipment_type: string | null;
  maintenance_date: string;
  maintenance_type: string;
  service_provider: string | null;
  description: string;
  cost: number | null;
  next_maintenance_date: string | null;
  is_critical: boolean;
  performed_by: string | null;
  notes: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

interface EquipmentMaintenanceListProps {
  records: EquipmentMaintenanceRecord[];
}

export function EquipmentMaintenanceList({ records }: EquipmentMaintenanceListProps) {
  if (records.length === 0) {
    return (
      <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-12 text-center">
        <Icon icon={Wrench} size="xl" className="mx-auto mb-4 text-gray-500" aria-hidden={true} />
        <h3 className="mb-2 text-xl font-semibold text-white">No Maintenance Records</h3>
        <p className="text-gray-400">
          Get started by adding your first equipment maintenance record.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {records.map(record => (
        <div
          key={record.id}
          className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 transition-colors hover:border-[#29E7CD]/30"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-xl font-semibold text-white">{record.equipment_name}</h3>
                {record.is_critical && (
                  <span className="flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-1 text-xs text-red-400">
                    <Icon icon={AlertTriangle} size="xs" aria-hidden={true} />
                    Critical
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                {record.equipment_type && (
                  <span className="capitalize">Type: {record.equipment_type}</span>
                )}
                <span className="capitalize">Maintenance: {record.maintenance_type}</span>
                {record.service_provider && <span>Provider: {record.service_provider}</span>}
              </div>
            </div>
            <div className="text-right">
              <div className="mb-1 flex items-center gap-1 text-sm text-gray-400">
                <Icon icon={Calendar} size="sm" aria-hidden={true} />
                <span>{new Date(record.maintenance_date).toLocaleDateString()}</span>
              </div>
              {record.cost && (
                <div className="flex items-center gap-1 text-sm font-semibold text-[#29E7CD]">
                  <Icon icon={DollarSign} size="sm" aria-hidden={true} />
                  <span>${record.cost.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
          <p className="mb-2 text-sm text-gray-300">{record.description}</p>
          {record.performed_by && (
            <p className="text-xs text-gray-500">Performed by: {record.performed_by}</p>
          )}
          {record.next_maintenance_date && (
            <p className="mt-2 text-xs text-gray-500">
              Next maintenance: {new Date(record.next_maintenance_date).toLocaleDateString()}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}




