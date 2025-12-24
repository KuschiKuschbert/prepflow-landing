export interface DiscoveredFlag {
  flagKey: string;
  type: 'regular' | 'hidden';
  file: string;
  line?: number;
  description?: string | null;
}
