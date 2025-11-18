import { useEffect, useState } from 'react';
import {
  fetchTemperatureStatusData,
  calculateOutOfRange,
  extractLastCheckTime,
} from './helpers/fetchTemperatureData';

export function useTemperatureStatus() {
  const [temperatureChecksToday, setTemperatureChecksToday] = useState(0);
  const [activeEquipment, setActiveEquipment] = useState(0);
  const [outOfRangeAlerts, setOutOfRangeAlerts] = useState(0);
  const [lastCheckTime, setLastCheckTime] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { stats, logs, equipment } = await fetchTemperatureStatusData();

      if (stats) {
        setTemperatureChecksToday(stats.temperatureChecksToday || 0);
      }
      setActiveEquipment(equipment.length || 0);
      setOutOfRangeAlerts(calculateOutOfRange(logs, equipment));
      setLastCheckTime(extractLastCheckTime(logs));
      setLoading(false);
    };

    fetchData();
  }, []);

  return {
    temperatureChecksToday,
    activeEquipment,
    outOfRangeAlerts,
    lastCheckTime,
    loading,
  };
}
