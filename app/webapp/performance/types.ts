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
  menuItemClass?: string[]; // Filter by menu item class
}

export type DateRangePreset = '7d' | '30d' | '90d' | 'all' | 'custom';

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
  preset: DateRangePreset;
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

export interface PerformanceInsight {
  id: string;
  type: 'hidden_gem' | 'bargain_bucket' | 'burnt_toast' | 'chefs_kiss';
  title: string;
  message: string;
  items: PerformanceItem[];
  priority: 'high' | 'medium' | 'low';
  potentialImpact?: {
    description: string;
    value: number;
  };
}
