export interface DashboardTopSeller {
  id: string;
  name: string;
  number_sold: number;
}

export interface PerformanceData {
  topSellers: DashboardTopSeller[];
  // Add other performance data fields here as needed
}

export interface DashboardTemperatureCheck {
  date: string;
  count: number;
}
