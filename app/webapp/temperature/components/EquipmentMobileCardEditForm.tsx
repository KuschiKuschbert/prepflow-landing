'use client';
import { TemperatureEquipment } from '../types';

interface EquipmentMobileCardEditFormProps {
  item: TemperatureEquipment;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  temperatureTypes: Array<{ value: string; label: string; icon: string }>;
  onUpdate: (id: string, updates: Partial<TemperatureEquipment>) => void;
}

export function EquipmentMobileCardEditForm({
  item,
  editingId,
  setEditingId,
  temperatureTypes,
  onUpdate,
}: EquipmentMobileCardEditFormProps) {
  if (editingId !== item.id) return null;

  return (
    <div className="mt-4 rounded-2xl border-t border-[var(--border)] bg-[var(--muted)]/30 pt-4">
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
        onClick={e => e.stopPropagation()}
        className="space-y-4"
      >
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--foreground-secondary)]">
              Equipment Name
            </label>
            <input
              type="text"
              name="name"
              defaultValue={item.name}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--foreground-secondary)]">
              Type
            </label>
            <select
              name="equipmentType"
              defaultValue={item.equipment_type}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-none"
              required
            >
              {temperatureTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--foreground-secondary)]">
                Min Temp
              </label>
              <input
                type="number"
                step="0.1"
                name="minTemp"
                defaultValue={item.min_temp_celsius || ''}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-none"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--foreground-secondary)]">
                Max Temp
              </label>
              <input
                type="number"
                step="0.1"
                name="maxTemp"
                defaultValue={item.max_temp_celsius || ''}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-none"
                placeholder="Optional"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--button-active-text)] shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            Update Equipment
          </button>
          <button
            type="button"
            onClick={() => setEditingId(null)}
            className="rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-2 text-sm font-medium text-[var(--foreground-secondary)] transition-all duration-200 hover:bg-[var(--surface-variant)] hover:text-[var(--foreground)]"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
