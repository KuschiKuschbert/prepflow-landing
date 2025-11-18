'use client';

import { useCallback } from 'react';
import type { PrepList, SectionData } from '../types';
import { formatPrepListForPrint } from '../utils/formatPrepList';
import { formatGeneratedPrepListForPrint } from '../utils/formatGeneratedPrepList';
import { printPrepList, printGeneratedPrepList } from '../utils/printUtils';

interface ExportOptions {
  sections?: string[]; // Filter by section IDs
  includeInstructions?: boolean;
}

/**
 * Hook for exporting and printing prep lists
 */
export function usePrepListExport() {
  const printPrepListWrapper = useCallback(
    (prepList: PrepList) => {
      printPrepList(prepList);
    },
    [],
  );

  const printGeneratedPrepListWrapper = useCallback(
    (sections: SectionData[], menuName: string, options?: ExportOptions) => {
      printGeneratedPrepList(sections, menuName, options);
    },
    [],
  );

  return {
    printPrepList: printPrepListWrapper,
    printGeneratedPrepList: printGeneratedPrepListWrapper,
    formatPrepListForPrint,
    formatGeneratedPrepListForPrint,
  };
}
