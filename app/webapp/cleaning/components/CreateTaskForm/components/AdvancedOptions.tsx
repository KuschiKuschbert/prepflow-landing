/**
 * Advanced options section component
 */

import { Icon } from '@/components/ui/Icon';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Equipment {
  id: string;
  name: string;
  equipment_type: string;
  location?: string;
}

interface KitchenSection {
  id: string;
  name: string;
}

interface AdvancedOptionsProps {
  showAdvanced: boolean;
  onToggle: () => void;
  equipment: Equipment[];
  filteredEquipment: Equipment[];
  sections: KitchenSection[];
  filteredSections: KitchenSection[];
  equipmentId: string;
  sectionId: string;
  description: string;
  areaId: string;
  onEquipmentChange: (id: string) => void;
  onSectionChange: (id: string) => void;
  onDescriptionChange: (desc: string) => void;
}

export function AdvancedOptions({
  showAdvanced,
  onToggle,
  equipment,
  filteredEquipment,
  sections,
  filteredSections,
  equipmentId,
  sectionId,
  description,
  areaId,
  onEquipmentChange,
  onSectionChange,
  onDescriptionChange,
}: AdvancedOptionsProps) {
  return (
    <div className="border-t border-[#2a2a2a] pt-3">
      <button
        type="button"
        onClick={onToggle}
        className="mb-3 flex w-full items-center justify-between text-sm font-medium text-gray-400 transition-colors hover:text-white"
      >
        <span>Advanced Options (Optional)</span>
        <Icon
          icon={showAdvanced ? ChevronUp : ChevronDown}
          size="sm"
          className="text-gray-400"
          aria-hidden={true}
        />
      </button>

      {showAdvanced && (
        <div className="animate-in fade-in slide-in-from-top-2 space-y-3 duration-200">
          <div className="desktop:grid-cols-2 grid grid-cols-1 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Equipment
                {filteredEquipment.length < equipment.length && (
                  <span className="ml-2 text-xs text-gray-500">
                    ({filteredEquipment.length} of {equipment.length} shown)
                  </span>
                )}
              </label>
              <select
                value={equipmentId}
                onChange={e => onEquipmentChange(e.target.value)}
                className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2.5 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              >
                <option value="">None</option>
                {(filteredEquipment.length > 0 ? filteredEquipment : equipment).map(eq => (
                  <option key={eq.id} value={eq.id}>
                    {eq.name} ({eq.equipment_type})
                  </option>
                ))}
              </select>
              {areaId && filteredEquipment.length < equipment.length && (
                <p className="mt-1 text-xs text-gray-500">
                  Showing equipment relevant to selected area
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Section
                {filteredSections.length < sections.length && (
                  <span className="ml-2 text-xs text-gray-500">
                    ({filteredSections.length} of {sections.length} shown)
                  </span>
                )}
              </label>
              <select
                value={sectionId}
                onChange={e => onSectionChange(e.target.value)}
                className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2.5 text-white focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              >
                <option value="">None</option>
                {(filteredSections.length > 0 ? filteredSections : sections).map(section => (
                  <option key={section.id} value={section.id}>
                    {section.name}
                  </option>
                ))}
              </select>
              {areaId && filteredSections.length < sections.length && (
                <p className="mt-1 text-xs text-gray-500">
                  Showing sections relevant to selected area
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Description</label>
            <textarea
              value={description}
              onChange={e => onDescriptionChange(e.target.value)}
              className="w-full rounded-2xl border border-[#2a2a2a] bg-[#2a2a2a] px-4 py-2.5 text-white placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-[#29E7CD]"
              placeholder="Additional details about this task"
              rows={2}
            />
          </div>
        </div>
      )}
    </div>
  );
}
