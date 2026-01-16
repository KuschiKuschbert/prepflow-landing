export interface CalculationDish {
  profit_margin: number | null | undefined;
  selling_price: number;
}

export interface DishWithSalesData extends CalculationDish {
  sales_data?: {
    id: string;
    number_sold: number;
    popularity_percentage: number;
    date: string;
  }[] | null;
}

export interface PerformanceDish extends DishWithSalesData {
  id: string;
  dish_name: string;
  [key: string]: unknown; // Allow additional fields from database view
}
