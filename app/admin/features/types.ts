/**
 * Feature Flags Types
 */

export interface FeatureFlag {
  id: string;
  flag_key: string;
  enabled: boolean;
  user_id: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface HiddenFeatureFlag {
  id: string;
  feature_key: string;
  description: string;
  is_unlocked: boolean;
  is_enabled: boolean;
  unlocked_by: string | null;
  unlocked_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DiscoveredFlag {
  flagKey: string;
  type: 'regular' | 'hidden';
  file: string;
  line: number;
}

export type TabType = 'regular' | 'hidden';

export interface DiscoveryResponse {
  success: boolean;
  total: number;
  message?: string;
  error?: string;
  regular?: DiscoveredFlag[];
  hidden?: DiscoveredFlag[];
}
