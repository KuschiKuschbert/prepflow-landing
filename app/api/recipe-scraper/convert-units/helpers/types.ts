export interface ConversionResult {
  quantity: number;
  unit: string;
  converted: boolean;
  reason?: string;
}
