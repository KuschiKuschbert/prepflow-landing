/**
 * Daily aggregation row returned by the Supabase RPC.
 */
export interface DailyAggRow {
  log_date: string;
  avg_temp: number;
  min_temp: number;
  max_temp: number;
  reading_count: number;
  out_of_range_count: number;
}

/**
 * Chart data point sent to the frontend.
 * Keeps payload small – no raw readings sent for long periods.
 */
export interface ChartPoint {
  date: string;
  avg: number;
  min: number;
  max: number;
  count: number;
  outOfRange: number;
}

/**
 * Downsample an array of daily rows to at most maxPoints entries.
 *
 * For periods up to 7 days the rows are already daily and within budget.
 * For longer periods we bucket consecutive days and average within each bucket
 * so the chart never exceeds maxPoints data points.
 */
export function downsampleChartPoints(rows: DailyAggRow[], maxPoints = 200): ChartPoint[] {
  if (rows.length === 0) return [];
  if (rows.length <= maxPoints) {
    return rows.map(r => ({
      date: r.log_date,
      avg: Number(r.avg_temp),
      min: Number(r.min_temp),
      max: Number(r.max_temp),
      count: Number(r.reading_count),
      outOfRange: Number(r.out_of_range_count),
    }));
  }

  // Bucket into maxPoints groups
  const bucketSize = Math.ceil(rows.length / maxPoints);
  const result: ChartPoint[] = [];

  for (let i = 0; i < rows.length; i += bucketSize) {
    const bucket = rows.slice(i, i + bucketSize);
    const avgTemp = bucket.reduce((sum, r) => sum + Number(r.avg_temp), 0) / bucket.length;
    const minTemp = Math.min(...bucket.map(r => Number(r.min_temp)));
    const maxTemp = Math.max(...bucket.map(r => Number(r.max_temp)));
    const totalCount = bucket.reduce((sum, r) => sum + Number(r.reading_count), 0);
    const totalOutOfRange = bucket.reduce((sum, r) => sum + Number(r.out_of_range_count), 0);

    result.push({
      date: bucket[0].log_date,
      avg: Math.round(avgTemp * 100) / 100,
      min: minTemp,
      max: maxTemp,
      count: totalCount,
      outOfRange: totalOutOfRange,
    });
  }

  return result;
}
