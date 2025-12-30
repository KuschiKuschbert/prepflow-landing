/**
 * Date utility functions for compliance validation.
 */

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day; // Sunday = 0
  return new Date(d.setDate(diff));
}

export function getDayName(dayOfWeek: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayOfWeek] || 'Unknown';
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: false });
}


