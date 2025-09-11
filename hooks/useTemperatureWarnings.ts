'use client';

import { useEffect } from 'react';
import { useGlobalWarning } from '@/contexts/GlobalWarningContext';

interface TemperatureLog {
  id: string;
  log_date: string;
  log_time: string;
  temperature_type: string;
  temperature_celsius: number;
  location: string | null;
  notes: string | null;
  photo_url: string | null;
  logged_by: string | null;
  created_at: string;
  updated_at: string;
}

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

interface UseTemperatureWarningsProps {
  allLogs: TemperatureLog[];
  equipment: TemperatureEquipment[];
}

export const useTemperatureWarnings = ({ allLogs, equipment }: UseTemperatureWarningsProps) => {
  const { addWarning } = useGlobalWarning();

  useEffect(() => {
    // Check for "no food items temped today" warning
    const checkFoodTemperatureWarning = () => {
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];
      
      // Filter logs for today
      const todayLogs = allLogs.filter(log => log.log_date === todayString);
      
      // Check if there are any food temperature logs for today
      const foodLogsToday = todayLogs.filter(log => 
        log.temperature_type === 'food' || log.temperature_type === 'Food'
      );

      // If no food items were temped today, show warning
      if (foodLogsToday.length === 0 && allLogs.length > 0) {
        addWarning({
          type: 'warning',
          title: 'Temperature Monitoring Alert',
          message: 'No food items have been temperature checked today. Ensure all food items are properly monitored for safety compliance.',
          action: {
            label: 'Go to Temperature Logs',
            onClick: () => {
              window.location.href = '/webapp/temperature';
            }
          },
          dismissible: true,
          autoHide: false,
        });
      }
    };

    // Check for equipment that hasn't been temperature checked in the last 8 hours
    const checkEquipmentTemperatureWarning = () => {
      const now = new Date();
      const eightHoursAgo = new Date(now.getTime() - (8 * 60 * 60 * 1000)); // 8 hours ago
      
      console.log('🔍 Equipment Temperature Warning Check:');
      console.log('Current time:', now.toISOString());
      console.log('8 hours ago:', eightHoursAgo.toISOString());
      console.log('Total logs available:', allLogs.length);
      
      // Filter logs from the last 8 hours
      const recentLogs = allLogs.filter(log => {
        const logDateTime = new Date(`${log.log_date}T${log.log_time}`);
        return logDateTime >= eightHoursAgo && logDateTime <= now;
      });

      console.log('Recent logs (last 8 hours):', recentLogs.length);

      // Get active equipment that should be monitored
      const activeEquipment = equipment.filter(eq => eq.is_active && eq.location);
      
      console.log('Active equipment:', activeEquipment.length);
      console.log('Active equipment names:', activeEquipment.map(eq => eq.name));
      
      if (activeEquipment.length === 0) {
        console.log('No active equipment found, skipping warning check');
        return;
      }

      // Check which equipment has been temperature checked in the last 8 hours
      const checkedEquipment = new Set();
      recentLogs.forEach(log => {
        if (log.location) {
          checkedEquipment.add(log.location);
        }
      });

      console.log('Checked equipment locations:', Array.from(checkedEquipment));

      // Find equipment that hasn't been checked in the last 8 hours
      const uncheckedEquipment = activeEquipment.filter(eq => 
        eq.location && !checkedEquipment.has(eq.location)
      );

      console.log('Unchecked equipment:', uncheckedEquipment.length);
      console.log('Unchecked equipment names:', uncheckedEquipment.map(eq => eq.name));

      if (uncheckedEquipment.length > 0) {
        const equipmentNames = uncheckedEquipment.map(eq => eq.name).join(', ');
        const isMultiple = uncheckedEquipment.length > 1;
        
        console.log('🚨 Adding equipment warning for:', equipmentNames);
        
        addWarning({
          type: 'warning',
          title: 'Equipment Temperature Check Required',
          message: `${isMultiple ? 'Equipment' : 'Equipment'} ${equipmentNames} ${isMultiple ? 'have' : 'has'} not been temperature checked in the last 8 hours. Ensure all active equipment is monitored for safety compliance.`,
          action: {
            label: 'Go to Temperature Logs',
            onClick: () => {
              window.location.href = '/webapp/temperature';
            }
          },
          dismissible: true,
          autoHide: false,
        });
      } else {
        console.log('✅ All equipment has been checked in the last 8 hours');
      }
    };

    // Check for equipment out of range warnings
    const checkEquipmentWarnings = () => {
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];
      const todayLogs = allLogs.filter(log => log.log_date === todayString);

      equipment.forEach(eq => {
        if (!eq.location || !eq.min_temp_celsius || !eq.max_temp_celsius) return;
        
        const equipmentLogs = todayLogs.filter(log => log.location === eq.location);
        
        if (equipmentLogs.length > 0) {
          const outOfRangeLogs = equipmentLogs.filter(log => 
            log.temperature_celsius < eq.min_temp_celsius! || 
            log.temperature_celsius > eq.max_temp_celsius!
          );

          if (outOfRangeLogs.length > 0) {
            addWarning({
              type: 'error',
              title: 'Temperature Out of Range',
              message: `${eq.name} has recorded ${outOfRangeLogs.length} temperature reading(s) outside the safe range (${eq.min_temp_celsius}°C - ${eq.max_temp_celsius}°C).`,
              action: {
                label: 'View Details',
                onClick: () => {
                  window.location.href = '/webapp/temperature';
                }
              },
              dismissible: true,
              autoHide: false,
            });
          }
        }
      });
    };

    // Only run checks if we have data
    if (allLogs.length > 0 && equipment.length > 0) {
      checkFoodTemperatureWarning();
      checkEquipmentTemperatureWarning();
      checkEquipmentWarnings();
    }
  }, [allLogs, equipment, addWarning]);
};
