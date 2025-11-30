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
  const [submitting, setSubmitting] = useState(false);
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

    try {
      setSubmitting(true);
      const response = await fetch('/api/temperature-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipment_id: equipment.id,
          temperature_celsius: parseFloat(temperature),
          notes: notes || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to log temperature');
      }

      // Trigger personality hook for temperature logging
      onTemperatureLogged();

      showSuccess('Temperature logged successfully');
      setTemperature('');
      setNotes('');
      const logsRes = await fetch(
        `/api/temperature-logs?equipment_id=${equipmentId}&limit=5&pageSize=5`,
      );
      const logsData = await logsRes.json();
      setRecentLogs(logsData.data?.items || logsData.data || []);
    } catch (error) {
      logger.error('Error logging temperature:', error);
      showError('Failed to log temperature');
    } finally {
      setSubmitting(false);
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
      <div className="min-h-screen bg-[#0a0a0a] p-4">
        <div className="mx-auto max-w-2xl">
          <LoadingSkeleton variant="card" className="h-64" />
        </div>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] p-4">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-8 text-center">
            <h1 className="mb-4 text-2xl font-bold text-white">Equipment Not Found</h1>
            <Link
              href="/webapp/temperature"
              className="inline-block rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-3 font-semibold text-black"
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
    <div className="min-h-screen bg-[#0a0a0a] p-4">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/webapp/temperature"
            className="rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] p-3 text-white transition-colors hover:border-[#29E7CD]/50 hover:bg-[#29E7CD]/10"
          >
            <Icon icon={ArrowLeft} size="md" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{equipment.name}</h1>
            {equipment.location && <p className="text-sm text-gray-400">{equipment.location}</p>}
          </div>
        </div>
        <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#29E7CD]/20 to-[#29E7CD]/10">
              <Icon icon={Thermometer} size="xl" className="text-[#29E7CD]" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{equipment.equipment_type}</h2>
              <p className="text-sm text-gray-400">Temperature Range</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm text-gray-400">Temperature Range</p>
              {equipment.min_temp_celsius !== null && equipment.max_temp_celsius !== null ? (
                <p className="text-lg font-semibold text-[#29E7CD]">
                  {equipment.min_temp_celsius}°C - {equipment.max_temp_celsius}°C
                </p>
              ) : equipment.min_temp_celsius !== null ? (
                <p className="text-lg font-semibold text-[#29E7CD]">
                  ≥{equipment.min_temp_celsius}°C
                </p>
              ) : (
                <p className="text-sm text-gray-500">Not set</p>
              )}
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-400">Status</p>
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${status.color === 'green' ? 'bg-green-500' : status.color === 'red' ? 'bg-red-500' : 'bg-gray-500'}`}
                />
                <p
                  className={`font-semibold ${status.color === 'green' ? 'text-green-400' : status.color === 'red' ? 'text-red-400' : 'text-gray-400'}`}
                >
                  {status.label}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
          <h2 className="mb-4 text-xl font-bold text-white">Log Temperature</h2>
          <form onSubmit={handleSubmitTemperature} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Temperature (°C)
              </label>
              <input
                type="number"
                step="0.1"
                value={temperature}
                onChange={e => setTemperature(e.target.value)}
                required
                className="w-full rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-lg text-white transition-all focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
                placeholder="Enter temperature"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-white transition-all focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]/20 focus:outline-none"
                placeholder="Add any notes..."
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !temperature}
              className="w-full rounded-xl bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-6 py-4 font-semibold text-black transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Logging...' : 'Log Temperature'}
            </button>
          </form>
        </div>
        {recentLogs.length > 0 && (
          <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
            <h2 className="mb-4 text-xl font-bold text-white">Recent Logs</h2>
            <div className="space-y-3">
              {recentLogs.map(log => {
                const logStatus = getTemperatureStatus(log.temperature_celsius);
                return (
                  <div key={log.id} className="rounded-xl border border-[#2a2a2a] bg-[#0a0a0a] p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold text-white">
                          {log.temperature_celsius.toFixed(1)}°C
                        </p>
                        <p className="text-sm text-gray-400">
                          {formatDate(new Date(`${log.log_date}T${log.log_time}`))}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${logStatus.color === 'green' ? 'bg-green-500' : logStatus.color === 'red' ? 'bg-red-500' : 'bg-gray-500'}`}
                        />
                        <span
                          className={`text-xs font-semibold ${logStatus.color === 'green' ? 'text-green-400' : logStatus.color === 'red' ? 'text-red-400' : 'text-gray-400'}`}
                        >
                          {logStatus.label}
                        </span>
                      </div>
                    </div>
                    {log.notes && <p className="mt-2 text-sm text-gray-400">{log.notes}</p>}
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
