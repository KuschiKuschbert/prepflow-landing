'use client';

import { useAiSpecialsFetching } from './useAiSpecialsFetching';
import { useAiSpecialsSubmission } from './useAiSpecialsSubmission';

export function useAiSpecials() {
  const {
    aiSpecials,
    setAiSpecials,
    loading,
    error,
    setError,
    isAuthenticated,
    userLoading,
    userEmail,
  } = useAiSpecialsFetching();

  const { submitSpecial } = useAiSpecialsSubmission({
    isAuthenticated,
    userEmail,
    aiSpecials,
    setAiSpecials,
    setError,
  });

  return {
    aiSpecials,
    loading,
    error,
    isAuthenticated,
    userLoading,
    submitSpecial,
  };
}
