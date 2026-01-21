export interface IndexEntry {
  id: string;
  type: 'error' | 'pattern';
  keywords: string[];
  categories: string[];
  file?: string;
  score?: number;
}
