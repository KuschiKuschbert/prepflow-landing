/**
 * Performance API utilities
 */

export async function fetchPerformanceData() {
  const response = await fetch('/api/performance');
  if (!response.ok) throw new Error('Failed to fetch performance data');
  const data = await response.json();
  return {
    performanceItems: data.performanceItems || [],
    metadata: data.metadata || null,
    performanceAlerts: data.performanceAlerts || [],
    performanceScore: data.performanceScore || 0,
    lastUpdate: new Date(),
  };
}

export async function importPerformanceData(salesData: any[]) {
  const response = await fetch('/api/performance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ salesData }),
  });
  if (!response.ok) throw new Error('Failed to import sales data');
  return response.json();
}
