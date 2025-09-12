export interface PerformanceItem {
  id: number;
  name: string;
  number_sold: number;
  popularity_percentage: number;
  selling_price: number;
  food_cost: number;
  gross_profit: number;
  gross_profit_percentage: number;
  profit_category: 'High' | 'Low';
  popularity_category: 'High' | 'Low';
  menu_item_class: 'Chef\'s Kiss' | 'Hidden Gem' | 'Bargain Bucket' | 'Burnt Toast';
}

export interface PerformanceMetadata {
  methodology: string;
  averageProfitMargin: number;
  averagePopularity: number;
  popularityThreshold: number;
}

export interface PerformanceAlert {
  id: string;
  message: string;
  timestamp: Date;
}

export interface ChartData {
  name: string;
  profit: number;
  value: number;
  color: string;
}

export interface ImportCSVData {
  csvData: string;
  importing: boolean;
}

export interface PerformanceFilters {
  searchTerm: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  currentPage: number;
  itemsPerPage: number;
}

export interface PerformanceState {
  performanceItems: PerformanceItem[];
  metadata: PerformanceMetadata | null;
  performanceAlerts: PerformanceAlert[];
  performanceScore: number;
  realtimeEnabled: boolean;
  lastUpdate: Date | null;
  showCharts: boolean;
  showImportModal: boolean;
  csvData: string;
  importing: boolean;
}
