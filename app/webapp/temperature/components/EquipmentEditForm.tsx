'use client';

import { useTranslation } from '@/lib/useTranslation';
import { TemperatureEquipment } from '../types';
import { getDefaultTemperatureRange } from '../utils/getDefaultTemperatureRange';

interface EquipmentEditFormProps {
  item: TemperatureEquipment;
  temperatureTypes: Array<{ value: string; label: string; icon: string }>;
  onUpdate: (id: string, updates: Partial<TemperatureEquipment>) => void;
  handleButtonClick: (e: React.MouseEvent) => void;
}

export function EquipmentEditForm({
  item,
  temperatureTypes,
  onUpdate,
  handleButtonClick,
}: EquipmentEditFormProps) {
  const { t } = useTranslation();

  return (
    <div className="mt-6 rounded-2xl border-t border-[#2a2a2a] bg-[#2a2a2a]/30 pt-6">
      <form
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
          const formData = new FormData(e.currentTarget);
          onUpdate(item.id, {
            name: formData.get('name') as string,
            equipment_type: formData.get('equipmentType') as string,
            location: (formData.get('location') as string) || null,
            min_temp_celsius: formData.get('minTemp')
              ? parseFloat(formData.get('minTemp') as string)
              : null,
            max_temp_celsius: formData.get('maxTemp')
              ? parseFloat(formData.get('maxTemp') as string)
              : null,
          });
        }}
        onClick={handleButtonClick}
        className="space-y-4"
      >
        <div className="desktop:grid-cols-2 grid grid-cols-1 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              {t('temperature.equipmentName', 'Equipment Name')}
            </label>
            <input
              type="text"
              name="name"
              defaultValue={item.name}
              className="w-full rounded-xl border border-[#3a3a3a] bg-[#1f1f1f] px-4 py-3 text-white transition-all focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              {t('temperature.equipmentType', 'Equipment Type')}
            </label>
            <select
              name="equipmentType"
              defaultValue={item.equipment_type}
              onChange={e => {
                const selectedType = e.target.value;
                const defaultRange = getDefaultTemperatureRange(selectedType, item.name);
                const minTempInput =
                  e.currentTarget.form?.querySelector<HTMLInputElement>('input[name="minTemp"]');
                const maxTempInput =
                  e.currentTarget.form?.querySelector<HTMLInputElement>('input[name="maxTemp"]');
                if (minTempInput) minTempInput.value = defaultRange.minTemp?.toString() || '';
                if (maxTempInput) maxTempInput.value = defaultRange.maxTemp?.toString() || '';
              }}
              className="w-full rounded-xl border border-[#3a3a3a] bg-[#1f1f1f] px-4 py-3 text-white transition-all focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
              required
            >
              {temperatureTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-400">
              Changing type will auto-set temperature range (Queensland standards)
            </p>
          </div>
        </div>
        <div className="desktop:grid-cols-3 grid grid-cols-1 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              {t('temperature.location', 'Location')}
            </label>
            <input
              type="text"
              name="location"
              defaultValue={item.location || ''}
              className="w-full rounded-xl border border-[#3a3a3a] bg-[#1f1f1f] px-4 py-3 text-white transition-all focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
              placeholder={String(t('common.optional', 'Optional'))}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              {t('temperature.minTemp', 'Min Temperature (°C)')}
            </label>
            <input
              type="number"
              step="0.1"
              name="minTemp"
              defaultValue={item.min_temp_celsius || ''}
              className="w-full rounded-xl border border-[#3a3a3a] bg-[#1f1f1f] px-4 py-3 text-white transition-all focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
              placeholder={String(t('common.optional', 'Optional'))}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              {t('temperature.maxTemp', 'Max Temperature (°C)')}
            </label>
            <input
              type="number"
              step="0.1"
              name="maxTemp"
              defaultValue={item.max_temp_celsius || ''}
              className="w-full rounded-xl border border-[#3a3a3a] bg-[#1f1f1f] px-4 py-3 text-white transition-all focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
              placeholder={String(t('common.optional', 'Optional'))}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            {t('temperature.updateEquipment', 'Update Equipment')}
          </button>
        </div>
      </form>
    </div>
  );
}
