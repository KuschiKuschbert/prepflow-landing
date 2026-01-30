'use client';
import { Icon } from '@/components/ui/Icon';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useCountryFormatting } from '@/hooks/useCountryFormatting';
import { ArrowLeft, Thermometer } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useEquipmentData } from './hooks/useEquipmentData';
import { useTemperatureLogSubmit } from './hooks/useTemperatureLogSubmit';

export default function EquipmentPage() {
  const params = useParams();
  const { formatDate } = useCountryFormatting();
  const equipmentId = params.id as string;

  const [temperature, setTemperature] = useState('');
  const [notes, setNotes] = useState('');

  const { equipment, recentLogs, setRecentLogs, loading } = useEquipmentData(equipmentId);

  const { handleSubmitTemperature } = useTemperatureLogSubmit({
    equipment,
    recentLogs,
    setRecentLogs,
    temperature,
    setTemperature,
    notes,
    setNotes,
  });

  const getTemperatureStatus = (temp: number): { color: string; label: string } => {
    if (!equipment) return { color: 'gray', label: 'Unknown' };

    const { min_temp_celsius, max_temp_celsius } = equipment;
    if (min_temp_celsius !== null && max_temp_celsius !== null) {
      return temp >= min_temp_celsius && temp <= max_temp_celsius
        ? { color: 'green', label: 'In Range' }
        : { color: 'red', label: 'Out of Range' };
    }
    if (min_temp_celsius !== null) {
      return temp >= min_temp_celsius
        ? { color: 'green', label: 'In Range' }
        : { color: 'red', label: 'Out of Range' };
    }
    return { color: 'gray', label: 'No Threshold Set' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] p-4">
        <div className="mx-auto max-w-2xl">
          <LoadingSkeleton variant="card" className="h-64" />
        </div>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="min-h-screen bg-[var(--background)] p-4">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
            <h1 className="mb-4 text-2xl font-bold text-[var(--foreground)]">
              Equipment Not Found
            </h1>
            <Link
              href="/webapp/temperature"
              className="inline-block rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-3 font-semibold text-[var(--button-active-text)]"
            >
              Back to Temperature
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const status = recentLogs[0]
    ? getTemperatureStatus(recentLogs[0].temperature_celsius)
    : { color: 'gray', label: 'No Logs' };

  return (
    <div className="min-h-screen bg-[var(--background)] p-4">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/webapp/temperature"
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-[var(--foreground)] transition-colors hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/10"
          >
            <Icon icon={ArrowLeft} size="md" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[var(--foreground)]">{equipment.name}</h1>
            {equipment.location && (
              <p className="text-sm text-[var(--foreground-muted)]">{equipment.location}</p>
            )}
          </div>
        </div>
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10">
              <Icon icon={Thermometer} size="xl" className="text-[var(--primary)]" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[var(--foreground)]">
                {equipment.equipment_type}
              </h2>
              <p className="text-sm text-[var(--foreground-muted)]">Temperature Range</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm text-[var(--foreground-muted)]">Temperature Range</p>
              {equipment.min_temp_celsius !== null && equipment.max_temp_celsius !== null ? (
                <p className="text-lg font-semibold text-[var(--primary)]">
                  {equipment.min_temp_celsius}°C - {equipment.max_temp_celsius}°C
                </p>
              ) : equipment.min_temp_celsius !== null ? (
                <p className="text-lg font-semibold text-[var(--primary)]">
                  ≥{equipment.min_temp_celsius}°C
                </p>
              ) : (
                <p className="text-sm text-[var(--foreground-subtle)]">Not set</p>
              )}
            </div>

            <div>
              <p className="mb-2 text-sm text-[var(--foreground-muted)]">Status</p>
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${status.color === 'green' ? 'bg-[var(--color-success)]' : status.color === 'red' ? 'bg-[var(--color-error)]' : 'bg-gray-500'}`}
                />
                <p
                  className={`font-semibold ${status.color === 'green' ? 'text-[var(--color-success)]' : status.color === 'red' ? 'text-[var(--color-error)]' : 'text-[var(--foreground-muted)]'}`}
                >
                  {status.label}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="mb-4 text-xl font-bold text-[var(--foreground)]">Log Temperature</h2>
          <form onSubmit={handleSubmitTemperature} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
                Temperature (°C)
              </label>
              <input
                type="number"
                step="0.1"
                value={temperature}
                onChange={e => setTemperature(e.target.value)}
                required
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-lg text-[var(--foreground)] transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-none"
                placeholder="Enter temperature"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground-secondary)]">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-none"
                placeholder="Add any notes..."
              />
            </div>
            <button
              type="submit"
              disabled={!temperature}
              className="w-full rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-4 font-semibold text-[var(--button-active-text)] transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Log Temperature
            </button>
          </form>
        </div>
        {recentLogs.length > 0 && (
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <h2 className="mb-4 text-xl font-bold text-[var(--foreground)]">Recent Logs</h2>
            <div className="space-y-3">
              {recentLogs.map(log => {
                const logStatus = getTemperatureStatus(log.temperature_celsius);
                return (
                  <div
                    key={log.id}
                    className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold text-[var(--foreground)]">
                          {log.temperature_celsius.toFixed(1)}°C
                        </p>
                        <p className="text-sm text-[var(--foreground-muted)]">
                          {formatDate(new Date(`${log.log_date}T${log.log_time}`))}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${logStatus.color === 'green' ? 'bg-[var(--color-success)]' : logStatus.color === 'red' ? 'bg-[var(--color-error)]' : 'bg-gray-500'}`}
                        />
                        <span
                          className={`text-xs font-semibold ${logStatus.color === 'green' ? 'text-[var(--color-success)]' : logStatus.color === 'red' ? 'text-[var(--color-error)]' : 'text-[var(--foreground-muted)]'}`}
                        >
                          {logStatus.label}
                        </span>
                      </div>
                    </div>
                    {log.notes && (
                      <p className="mt-2 text-sm text-[var(--foreground-muted)]">{log.notes}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
