import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export interface TemperatureEquipment {
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

export interface TemperatureLog {
  id: string;
  equipment_id: string | null;
  temperature_celsius: number;
  log_date: string;
  log_time: string;
  logged_by: string | null;
  notes: string | null;
  created_at: string;
}

export function useEquipmentData(equipmentId: string) {
  const router = useRouter();
  const { showError } = useNotification();
  const [equipment, setEquipment] = useState<TemperatureEquipment | null>(null);
  const [recentLogs, setRecentLogs] = useState<TemperatureLog[]>([]);
  const [loading, setLoading] = useState(true);

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

  return { equipment, setEquipment, recentLogs, setRecentLogs, loading };
}
