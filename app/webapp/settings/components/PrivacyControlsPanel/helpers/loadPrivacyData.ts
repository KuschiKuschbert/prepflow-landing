/**
 * Load privacy data (usage and activity).
 */
import { fetchInParallel } from '@/lib/api/batch-utils';
import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';

interface DataUsage {
  usage: {
    ingredients: { count: number; size_bytes: number };
    recipes: { count: number; size_bytes: number };
    dishes: { count: number; size_bytes: number };
    temperature_logs: { count: number; size_bytes: number };
    cleaning_tasks: { count: number; size_bytes: number };
    compliance_records: { count: number; size_bytes: number };
  };
  total_size_bytes: number;
}

interface AccountActivity {
  id: string;
  action_type: string;
  entity_type: string;
  created_at: string;
}

export async function loadPrivacyDataHelper(
  setDataUsage: (usage: DataUsage | null) => void,
  setRecentActivity: (activity: AccountActivity[]) => void,
  setLoading: (loading: boolean) => void,
): Promise<void> {
  try {
    const cachedUsage = getCachedData<DataUsage>('privacy_data_usage');
    const cachedActivity = getCachedData<AccountActivity[]>('privacy_recent_activity');
    if (cachedUsage) setDataUsage(cachedUsage);
    if (cachedActivity) setRecentActivity(cachedActivity);
    const [usageResult, activityResult] = await fetchInParallel(
      [
        async () => {
          const response = await fetch('/api/user/data-usage');
          if (!response.ok) throw new Error('Failed to fetch data usage');
          return await response.json();
        },
        async () => {
          const response = await fetch('/api/user/activity?limit=5');
          if (!response.ok) throw new Error('Failed to fetch activity');
          const data = await response.json();
          return data.activity || [];
        },
      ],
      {
        continueOnError: true,
        onError: (error, index) => {
          logger.error(`Failed to fetch privacy data (index ${index}):`, error);
        },
      },
    );
    if (usageResult) {
      setDataUsage(usageResult);
      cacheData('privacy_data_usage', usageResult, 5 * 60 * 1000);
    }
    if (activityResult) {
      setRecentActivity(activityResult);
      cacheData('privacy_recent_activity', activityResult, 2 * 60 * 1000);
    }
  } catch (error) {
    logger.error('Failed to load privacy data:', error);
  } finally {
    setLoading(false);
  }
}
