import { describe, expect, it } from '@jest/globals';
import {
  formatDateString,
  formatTime,
  getFoodSafetyStatus,
  getStatusColor,
  getTemperatureStatus,
  getTimePeriod,
  groupLogsByTimePeriod,
} from './utils';

describe('temperature utils', () => {
  it('formatTime returns HH:MM', () => {
    expect(formatTime('14:35:22')).toBe('14:35');
    expect(formatTime('')).toBe('');
  });

  it('formatDateString applies formatter', () => {
    const formatter = jest.fn((d: Date) => d.toISOString().slice(0, 10));
    expect(formatDateString('2025-01-15', formatter)).toBe('2025-01-15');
    expect(formatter).toHaveBeenCalled();
  });

  it('getTemperatureStatus respects thresholds', () => {
    const equipment = [
      {
        id: '1',
        name: 'Fridge A',
        min_temp_celsius: 0,
        max_temp_celsius: 5,
        is_active: true,
      } as unknown,
    ];
    expect(getTemperatureStatus(3, 'Fridge A', equipment)).toBe('normal');
    expect(getTemperatureStatus(-1, 'Fridge A', equipment)).toBe('low');
    expect(getTemperatureStatus(7, 'Fridge A', equipment)).toBe('high');
    expect(getTemperatureStatus(3, 'Unknown', equipment)).toBe('normal');
  });

  it('getFoodSafetyStatus applies 2/4 hour rule', () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
    const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000);

    // Format dates consistently as local time strings to match function expectations
    const fmt = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    const fmtT = (d: Date) => {
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    };

    // Inside danger zone (temp 25°C)
    const safe = getFoodSafetyStatus(25, fmtT(oneHourAgo), fmt(oneHourAgo), 'food_hot_holding');
    expect(safe?.status).toBe('safe');

    const warning = getFoodSafetyStatus(
      25,
      fmtT(threeHoursAgo),
      fmt(threeHoursAgo),
      'food_hot_holding',
    );
    expect(warning?.status).toBe('warning');

    const danger = getFoodSafetyStatus(
      25,
      fmtT(fiveHoursAgo),
      fmt(fiveHoursAgo),
      'food_hot_holding',
    );
    expect(danger?.status).toBe('danger');

    // Outside danger zone
    const outside = getFoodSafetyStatus(2, fmtT(oneHourAgo), fmt(oneHourAgo), 'food_cold_holding');
    expect(outside?.status).toBe('safe');

    // Irrelevant type
    expect(getFoodSafetyStatus(25, fmtT(oneHourAgo), fmt(oneHourAgo), 'equipment')).toBeNull();
  });

  it('getStatusColor returns class tokens', () => {
    expect(getStatusColor('high')).toContain('red');
    expect(getStatusColor('low')).toContain('blue');
    expect(getStatusColor('normal')).toContain('green');
  });

  it('getTimePeriod buckets hours', () => {
    expect(getTimePeriod('06:10').period).toBe('morning');
    expect(getTimePeriod('13:00').period).toBe('midday');
    expect(getTimePeriod('21:00').period).toBe('evening');
  });

  it('groupLogsByTimePeriod groups and sorts', () => {
    const logs = [
      { id: '1', log_time: '06:30', log_date: '2025-01-01' } as unknown,
      { id: '2', log_time: '06:05', log_date: '2025-01-01' } as unknown,
      { id: '3', log_time: '13:10', log_date: '2025-01-01' } as unknown,
    ];
    const grouped = groupLogsByTimePeriod(logs);
    expect(grouped[0].period).toBe('morning');
    expect(grouped[0].logs[0].log_time).toBe('06:05');
  });
});
