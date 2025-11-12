'use client';

import React from 'react';
import { TemperatureEquipment } from '../types';
import { getEquipmentIcon, getEquipmentLabel } from './equipment-utils';
import { Icon } from '@/components/ui/Icon';
import { Thermometer, X, Trash2, Snowflake, Home, Flame, ChefHat, LucideIcon } from 'lucide-react';

// Map equipment types to Lucide icons
function getEquipmentLucideIcon(type: string): LucideIcon {
  const iconMap: Record<string, LucideIcon> = {
    fridge: Snowflake,
    freezer: Snowflake,
    walk_in_cooler: Home,
    walk_in_freezer: Home,
    reach_in_cooler: Snowflake,
    ice_machine: Snowflake,
    bain_marie: Flame,
    hot_holding_cabinet: Flame,
    steam_table: Flame,
    warming_drawer: Flame,
    soup_kettle: ChefHat,
    rice_cooker: ChefHat,
    combi_oven: ChefHat,
    sous_vide: ChefHat,
    proofing_cabinet: ChefHat,
    chocolate_tempering: ChefHat,
  };
  return iconMap[type] || Thermometer;
}

interface EquipmentListProps {
  equipment: TemperatureEquipment[];
  showAll: boolean;
  onToggleShowAll: () => void;
  onDelete: (id: number) => void;
  onDeleteAll?: () => void;
}

export function EquipmentList({
  equipment,
  showAll,
  onToggleShowAll,
  onDelete,
  onDeleteAll,
}: EquipmentListProps) {
  if (equipment.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 flex justify-center">
          <Icon icon={Thermometer} size="xl" className="text-[#29E7CD]" aria-hidden={true} />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-white">No Equipment Added Yet</h3>
        <p className="mb-6 text-gray-400">
          Add your first piece of temperature monitoring equipment to get started
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Your Equipment ({equipment.length})</h3>
        <div className="flex items-center gap-3">
          {equipment.length > 6 && (
            <button
              onClick={onToggleShowAll}
              className="font-medium text-[#29E7CD] hover:text-[#29E7CD]/80"
            >
              {showAll ? 'Show Less' : 'Show All'}
            </button>
          )}
          {onDeleteAll && equipment.length > 0 && (
            <button
              onClick={onDeleteAll}
              className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-500/20"
            >
              <Icon
                icon={Trash2}
                size="sm"
                className="mr-1 inline text-current"
                aria-hidden={true}
              />{' '}
              Delete All
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(showAll ? equipment : equipment.slice(0, 6)).map(eq => (
          <div key={eq.id} className="rounded-2xl border border-[#3a3a3a] bg-[#2a2a2a] p-4">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center">
                  <Icon
                    icon={getEquipmentLucideIcon(eq.equipment_type)}
                    size="lg"
                    className="text-[#29E7CD]"
                    aria-hidden={true}
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-white">{eq.name}</h4>
                  <p className="text-sm text-gray-400">{getEquipmentLabel(eq.equipment_type)}</p>
                </div>
              </div>
              <button
                onClick={() => onDelete(eq.id!)}
                className="text-sm text-red-400 hover:text-red-300"
                aria-label={`Delete ${eq.name}`}
              >
                <Icon icon={X} size="sm" className="text-red-400" aria-hidden={true} />
              </button>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-300">
                <span className="font-medium">Location:</span> {eq.location}
              </p>
              <p className="text-sm text-gray-300">
                <span className="font-medium">Range:</span> {eq.min_temp}°C - {eq.max_temp}°C
              </p>
              <p className="text-sm text-gray-300">
                <span className="font-medium">Status:</span>
                <span className={`ml-1 ${eq.is_active ? 'text-green-400' : 'text-red-400'}`}>
                  {eq.is_active ? 'Active' : 'Inactive'}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
