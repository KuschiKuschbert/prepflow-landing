export interface ShiftCostCalculation {
  shiftId: string;
  employeeId: string;
  baseHours: number;
  breakHours: number;
  paidHours: number;
  baseRate: number;
  dayOfWeek: number;
  rateMultiplier: number;
  totalCost: number;
  breakCost: number;
  netCost: number;
}

export interface RosterBudget {
  totalShifts: number;
  totalHours: number;
  totalCost: number;
  forecastRevenue?: number | null;
  laborCostPercentage?: number | null;
  shiftsByDay: Record<string, ShiftCostCalculation[]>;
}
