import type { TemperatureEquipment, TemperatureLog } from '../../types';

export interface TemperatureLogsTabProps {
  logs: TemperatureLog[];
  equipment: TemperatureEquipment[];
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
  selectedType: string;
  setSelectedType: React.Dispatch<React.SetStateAction<string>>;
  showAddLog: boolean;
  setShowAddLog: (show: boolean) => void;
  newLog: {
    log_date: string;
    log_time: string;
    temperature_type: string;
    temperature_celsius: string;
    location: string;
    notes: string;
    logged_by: string;
  };
  setNewLog: React.Dispatch<
    React.SetStateAction<{
      log_date: string;
      log_time: string;
      temperature_type: string;
      temperature_celsius: string;
      location: string;
      notes: string;
      logged_by: string;
    }>
  >;
  onAddLog: (e: React.FormEvent) => Promise<void>;
  onRefreshLogs: () => Promise<void>;
  isLoading?: boolean;
  allLogs?: TemperatureLog[]; // All logs for export (unfiltered)
}

export interface DateRange {
  start: string;
  end: string;
}
