export interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalIngredients: number;
  totalRecipes: number;
  totalDishes: number;
  userActivity: {
    date: string;
    activeUsers: number;
  }[];
  featureUsage: {
    feature: string;
    usage: number;
  }[];
}
