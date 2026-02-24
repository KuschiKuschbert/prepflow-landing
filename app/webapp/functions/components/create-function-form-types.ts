/**
 * Shared types for CreateFunctionForm and its sub-components.
 * Extracted to avoid circular dependencies.
 */

export interface CreateFunctionData {
  name: string;
  type: 'Birthday' | 'Christmas Party' | 'Wedding' | 'Wake' | 'Kids Birthday' | 'Other';
  start_date: string;
  start_time: string | null;
  end_date: string | null;
  end_time: string | null;
  same_day: boolean;
  attendees: number;
  customer_id: string | null;
  location: string | null;
  notes: string | null;
}
