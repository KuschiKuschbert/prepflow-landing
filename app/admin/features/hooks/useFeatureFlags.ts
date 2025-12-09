/**
 * Hook for managing regular feature flags
 */

import { useFeatureFlagsFetch } from './useFeatureFlagsFetch';
import { useFeatureFlagsMutations } from './useFeatureFlagsMutations';

export function useFeatureFlags() {
  const fetchData = useFeatureFlagsFetch();
  const mutations = useFeatureFlagsMutations(fetchData.fetchFlags);

  return {
    ...fetchData,
    ...mutations,
  };
}
