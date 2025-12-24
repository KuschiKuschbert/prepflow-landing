'use client';
import { Icon } from '@/components/ui/Icon';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useNotification } from '@/contexts/NotificationContext';
import { useCountryFormatting } from '@/hooks/useCountryFormatting';
import { ArrowLeft, Thermometer } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { logger } from '@/lib/logger';
import { useOnTemperatureLogged } from '@/lib/personality/hooks';
interface TemperatureEquipment {
  id: string;
  name: string;
  equipment_type: string;
  location: string | null;
  min_temp_celsius: number | null;
  max_temp_celsius: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface TemperatureLog {
  id: string;
  equipment_id: string | null;
  temperature_celsius: number;
  log_date: string;
  log_time: string;
  logged_by: string | null;
  notes: string | null;
  created_at: string;
}

export default function EquipmentPage() {
  const params = useParams();
  const router = useRouter();
  const { formatDate } = useCountryFormatting();
  const { showSuccess, showError } = useNotification();
  const onTemperatureLogged = useOnTemperatureLogged();
  const equipmentId = params.id as string;

  const [equipment, setEquipment] = useState<TemperatureEquipment | null>(null);
  const [recentLogs, setRecentLogs] = useState<TemperatureLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [temperature, setTemperature] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!equipmentId) return;

    const fetchEquipment = async () => {
      try {
        setLoading(true);
        const [equipmentRes, logsRes] = await Promise.all([
          fetch('/api/temperature-equipment'),
          fetch(`/api/temperature-logs?equipment_id=${equipmentId}&limit=5&pageSize=5`),
        ]);

        if (!equipmentRes.ok || !logsRes.ok) {
          throw new Error('Failed to fetch equipment data');
        }

        const equipmentData = await equipmentRes.json();
        const logsData = await logsRes.json();

        const foundEquipment = equipmentData.data?.find(
          (eq: TemperatureEquipment) => eq.id === equipmentId,
        );
        if (!foundEquipment) {
          showError('Equipment not found');
          router.push('/webapp/temperature');
          return;
        }

        setEquipment(foundEquipment);
        setRecentLogs(logsData.data?.items || logsData.data || []);
      } catch (error) {
        logger.error('Error fetching equipment:', error);
        showError('Failed to load equipment details');
        router.push('/webapp/temperature');
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [equipmentId, router, showError]);

  const handleSubmitTemperature = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!temperature || !equipment) return;

    // Store original state for rollback
    const originalLogs = [...recentLogs];
    const tempTemperature = parseFloat(temperature);
    const tempNotes = notes || null;
    const tempEquipmentId = equipment.id;

    // Create temporary log for optimistic update
    const tempId = `temp-${Date.now()}`;
    const tempLog: TemperatureLog = {
      id: tempId,
      equipment_id: tempEquipmentId,
      temperature_celsius: tempTemperature,
      log_date: new Date().toISOString().split('T')[0],
      log_time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      logged_by: null,
      notes: tempNotes,
      created_at: new Date().toISOString(),
    };

    // Optimistically add to UI immediately (at the top of the list)
    setRecentLogs(prev => [tempLog, ...prev.slice(0, 4)]); // Keep only top 5
    setTemperature('');
    setNotes('');

    // Trigger personality hook for temperature logging
    onTemperatureLogged();

    try {
      const response = await fetch('/api/temperature-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipment_id: tempEquipmentId,
          temperature_celsius: tempTemperature,
          notes: tempNotes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to log temperature');
      }

      const data = await response.json();
      if (data.success && data.data) {
        // Replace temp log with real one from server
        setRecentLogs(prev => prev.map(log => (log.id === tempId ? data.data : log)));
        showSuccess('Temperature logged successfully');
      } else {
        // Error - revert optimistic update
        setRecentLogs(originalLogs);
        showError(data.message || data.error || 'Failed to log temperature');
      }
    } catch (error) {
      // Error - revert optimistic update
      setRecentLogs(originalLogs);
      logger.error('Error logging temperature:', error);
      showError("Couldn't log that temperature, chef. Give it another shot.");
    }
  };

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
