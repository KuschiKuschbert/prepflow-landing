// Performance Types
export interface PerformanceItem {
  id: string;
  name: string;
  menu_item_class: string;
  gross_profit_margin: number;
  gross_profit_percentage: number;
  popularity_percentage: number;
  number_sold: number;
  selling_price: number;
  cost_per_serving: number;
  gross_profit: number;
  food_cost: number;
  profit_category: string;
  popularity_category: string;
}

export interface PerformanceMetadata {
  methodology: string;
  averageProfitMargin?: number;
  averagePopularity?: number;
  profitThreshold?: number;
  popularityThreshold?: number;
  totalItems?: number;
  analyzedItems?: number;
  lastUpdated?: string;
}

export interface ImportCSVData {
  csvData: string;
  importing: boolean;
}

export interface PerformanceAlert {
  id: string;
  message: string;
  type?: 'warning' | 'error' | 'info';
  timestamp?: Date;
}

export interface PerformanceFilters {
  searchTerm: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  currentPage: number;
  itemsPerPage: number;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
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
  filters: {
    profitCategory: string[];
    popularityCategory: string[];
    menuItemClass: string[];
  };
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  loading: boolean;
  error: string | null;
}
